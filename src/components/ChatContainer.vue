<template>
  <Teleport v-if="authStore.action === 'users-to-remove'" to="#modal-container">
    <input type="checkbox" id="users-to-remove" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="users-to-remove" class="modal modal-open cursor-pointer">
      <label class="modal-box relative pt-0" for="">
        <label for="users-to-remove" class="btn btn-sm btn-circle sticky top-4 left-full z-20">✕</label>
        <UsersList title="Remove users" :users="usersRoom(true)" :action="{ off: 'Remove', on: 'Add' }" @action="deleteRoomUser" :checked="true" />
        <p v-if="!usersRoom(true).length" class="py-4">Nobody as added on this channel</p>
      </label>
    </label>
  </Teleport>

  <Teleport v-if="authStore.action === 'users-to-invite'" to="#modal-container">
    <input type="checkbox" id="users-to-invite" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="users-to-invite" class="modal modal-open cursor-pointer">
      <label class="modal-box relative pt-0" for="">
        <label for="users-to-invite" class="btn btn-sm btn-circle sticky top-4 left-full z-20">✕</label>
        <UsersList title="Invite your contact" :users="usersRoom(false)" :action="{ off: 'Remove', on: 'Add' }" @action="addRoomUser" :checked="false" />
        <p v-if="!usersRoom(false).length" class="py-4">All your contact as already added on this room or you don't have relationships yet</p>
      </label>
    </label>
  </Teleport>

  <vue-advanced-chat
    ref="chatWindow"
    :height="'100%'"
    :theme="theme"
    :styles="JSON.stringify(styles)"
    :current-user-id="currentUserId"
    :room-id="roomId"
    :rooms="JSON.stringify(loadedRooms)"
    :loading-rooms="loadingRooms"
    :rooms-loaded="roomsLoaded"
    :messages="JSON.stringify(messages)"
    :messages-loaded="messagesLoaded"
    :room-message="roomMessage"
    :room-actions="JSON.stringify(actions)"
    :menu-actions="JSON.stringify(actions)"
    :message-selection-actions="JSON.stringify(messageSelectionActions)"
    :show-files="false"
    :show-audio="false"
    @fetch-more-rooms="fetchMoreRooms"
    @fetch-messages="fetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
    @edit-message="editMessage($event.detail[0])"
    @delete-message="deleteMessage($event.detail[0])"
    @open-file="openFile($event.detail[0])"
    @open-user-tag="openUserTag($event.detail[0])"
    @add-room="createRoom"
    @room-action-handler="menuActionHandler($event.detail[0])"
    @menu-action-handler="menuActionHandler($event.detail[0])"
    @message-selection-action-handler="
      messageSelectionActionHandler($event.detail[0])
    "
    @send-message-reaction="sendMessageReaction($event.detail[0])"
    @typing-message="typingMessage($event.detail[0])"
  />
</template>

<script>
import { defineAsyncComponent, ref } from 'vue'

import * as firestoreService from '@/database/firestore'
import * as firebaseService from '@/database/firebase'
import * as storageService from '@/database/storage'

// import { useUsersStore } from "@/stores/usersStore"
import { useAuthStore } from "@/stores/authStore"
import { useThemeStore } from "@/stores/themeStore"

import { parseTimestamp, formatTimestamp } from '@/utils/dates'
import { mapUser } from '@/utils/chat'
// import { addData, resetData } from '@/utils/chat'
import logoAvatar from '/guest.png'

import { register } from 'vue-advanced-chat'
register()

import { supabase } from '@/utils/supabase'

export default {
  components: {
    UsersList: defineAsyncComponent(() => import ("@/components/UsersList.vue")),
  },

	props: {
		currentUserId: { type: String, required: true },
		isDevice: { type: Boolean, required: true }
	},

  setup() {
    // 1. Fake datas used for initialize firebase structure
    // const usersStore = useUsersStore()
    // const fakeUsers = usersStore.users
    // addData(firestoreService, fakeUsers.map(u => mapUser(u)))

    // 2. Remove fake data
    // resetData(firestoreService)

    const themeStore = useThemeStore()
    const users = ref([])

    return {
      users,
      themeStore
    }
  },

	data() {
		return {
			roomsPerPage: 15,
			rooms: [],
			archivedRooms: [],
			roomId: '',
			startRooms: null,
			endRooms: null,
			roomsLoaded: false,
			loadingRooms: true,
			allUsers: [],
			loadingLastMessageByRoom: 0,
			roomsLoadedCount: 0,
			selectedRoom: null,
			messagesPerPage: 20,
			messages: [],
			messagesLoaded: false,
			roomMessage: '',
			lastLoadedMessage: null,
			previousLastLoadedMessage: null,
			roomsListeners: [],
			listeners: [],
			typingMessageCache: '',
      selectedRoomId: null,
			actions: [
				{ name: 'inviteUser', title: 'Invite User' },
				{ name: 'removeUser', title: 'Remove User' },
				{ name: 'deleteRoomUser', title: 'Leave Room' },
				{ name: 'archiveRoom', title: 'Archive' },
				{ name: 'blockedRoom', title: 'Block 🚫' },
				// { name: 'deleteRoom', title: 'Delete Room' }
			],
			messageSelectionActions: [{ name: 'deleteMessages', title: 'Delete' }],
			styles: {
        container: { borderRadius: 'var(--rounded-box, 1rem)' },
        general: {
          backgroundInput: 'hsl(var(--b3) / var(--tw-bg-opacity))',
        },
        footer: {
          background: 'hsl(var(--b2) / var(--tw-bg-opacity))',
          backgroundReply: 'red',
        },
        sidemenu: {
          background: 'hsl(var(--b1) / var(--tw-bg-opacity))',
          backgroundActive: 'hsl(var(--b2) / var(--tw-bg-opacity))',
          borderColorSearch: 'hsl(var(--n) / var(--tw-border-opacity))',
        },
        content: {
          background: 'hsl(var(--b2) / var(--tw-bg-opacity))'
        },
        header: {
			    background: 'hsl(var(--b2) / var(--tw-bg-opacity))'
        }
      },
		}
	},

	computed: {
		loadedRooms() {
			return this.rooms.slice(0, this.roomsLoadedCount)
		},
    theme() {
      return this.themeStore.currentTheme === 'cupcake' ? 'light' : 'dark'
    },
	},

	mounted() {
    this.fetchRooms()
    firebaseService.updateUserOnlineStatus(this.currentUserId)
    this.loadContact()
	},

  unmounted() {
    this.resetRooms()
  },

	methods: {
    async loadContact() {
      const authStore = useAuthStore()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', authStore.getFollowing().ids)
      this.users.value = data
    },

    usersRoom(hasIn) {
      if (this.selectedRoomId) {
        const usersIdInRoom = this.rooms.find(room => room.roomId === this.selectedRoomId).users.map(u => u._id)
        const users = this.users.value.filter(u => hasIn ? usersIdInRoom.includes(`${u.user_id}`) : !usersIdInRoom.includes(`${u.user_id}`))
        return users
      }
      return []
    },

		resetRooms() {
			this.loadingRooms = true
			this.loadingLastMessageByRoom = 0
			this.roomsLoadedCount = 0
			this.rooms = []
			this.roomsLoaded = true
			this.startRooms = null
			this.endRooms = null
			this.roomsListeners.forEach(listener => listener())
			this.roomsListeners = []
			this.resetMessages()
		},

		resetMessages() {
			this.messages = []
			this.messagesLoaded = false
			this.lastLoadedMessage = null
			this.previousLastLoadedMessage = null
			this.listeners.forEach(listener => listener())
			this.listeners = []
		},

		fetchRooms() {
			this.resetRooms()
			this.fetchMoreRooms()
		},

		async fetchMoreRooms() {
			if (this.endRooms && !this.startRooms) {
				this.roomsLoaded = true
				return
			}

			const query = firestoreService.roomsQuery(
				this.currentUserId,
				this.roomsPerPage,
				this.startRooms
			)

			let { data, docs } = await firestoreService.getRooms(query)

			this.roomsLoaded = data.length === 0 || data.length < this.roomsPerPage

			if (this.startRooms) this.endRooms = this.startRooms
			this.startRooms = docs[docs.length - 1]

			const roomUserIds = []
			data.forEach(room => {
				room.users.forEach(userId => {
					const foundUser = this.allUsers.find(user => user?._id === userId)
					if (!foundUser && roomUserIds.indexOf(userId) === -1) {
						roomUserIds.push(userId)
					}
				})
			})

			const rawUsers = []
			roomUserIds.forEach(userId => {
				const promise = firestoreService.getUser(userId)
				rawUsers.push(promise)
			})

			this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))]

			const roomList = {}
			data.forEach(room => {
				roomList[room.id] = { ...room, users: [] }

				room.users.forEach(userId => {
					const foundUser = this.allUsers.find(user => user?._id === userId)
					if (foundUser) roomList[room.id].users.push(foundUser)
				})
			})

			const formattedRooms = []

			Object.keys(roomList).forEach(key => {
				const room = roomList[key]

				const roomContacts = room.users.filter(
					user => user._id !== this.currentUserId
				)

        const me = room.users.find(u => u._id === this.currentUserId)

				room.roomName =
					roomContacts.map(user => user.username).join(', ') || 'Myself'

        let roomAvatar = logoAvatar
        if (roomContacts.length === 1 && roomContacts[0].avatar) {
          roomAvatar = roomContacts[0].avatar
        } else if (!roomContacts.length && me) {
          roomAvatar = me.avatar
        }

				formattedRooms.push({
					...room,
					roomId: key,
					avatar: roomAvatar,
					index: room.lastUpdated.seconds,
					lastMessage: {
						content: 'Room created',
						timestamp: formatTimestamp(
							new Date(room.lastUpdated.seconds),
							room.lastUpdated
						)
					}
				})
			})

			this.rooms = this.rooms.concat(formattedRooms)

      this.rooms = this.rooms.filter((r, index) => {
        const isArchived = (r.archiveUsers && r.archiveUsers.includes(this.currentUserId)) || (r.blockedUsers && r.blockedUsers.includes(this.currentUserId));

        if (isArchived) {
          this.archivedRooms.push(data[index])
          return false
        }
        return true
      })

			this.rooms.forEach(room => this.listenLastMessage(room))

			if (!this.rooms.length) {
				this.loadingRooms = false
				this.roomsLoadedCount = 0
			}

			this.listenUsersOnlineStatus(formattedRooms)
			this.listenRooms(query)
		},

		listenLastMessage(room) {
			const listener = firestoreService.listenLastMessage(
				room.roomId,
				messages => {
					messages.forEach(message => {
						const lastMessage = this.formatLastMessage(message, room)
						const roomIndex = this.rooms.findIndex(
							r => room.roomId === r.roomId
						)
						this.rooms[roomIndex].lastMessage = lastMessage
						this.rooms = [...this.rooms]
					})
					if (this.loadingLastMessageByRoom < this.rooms.length) {
						this.loadingLastMessageByRoom++

						if (this.loadingLastMessageByRoom === this.rooms.length) {
							this.loadingRooms = false
							this.roomsLoadedCount = this.rooms.length
						}
					}
				}
			)

			this.roomsListeners.push(listener)
		},

		formatLastMessage(message, room) {
			if (!message.timestamp) return

			let content = message.content
			if (message.files?.length) {
				const file = message.files[0]
				content = `${file.name}.${file.extension || file.type}`
			}

			const username =
				message.sender_id !== this.currentUserId
					? room.users.find(user => message.sender_id === user._id)?.username
					: ''

			return {
				...message,
				...{
					_id: message.id,
					content,
					senderId: message.sender_id,
					timestamp: formatTimestamp(
						new Date(message.timestamp.seconds * 1000),
						message.timestamp
					),
					username: username,
					distributed: true,
					new:
						message.sender_id !== this.currentUserId &&
						(!message.seen || !message.seen[this.currentUserId])
				}
			}
		},

		fetchMessages({ room, options = {} }) {
			if (options.reset) {
				this.resetMessages()
			}

			if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
				this.messagesLoaded = true
				return
			}

			this.selectedRoom = room.roomId

			firestoreService
				.getMessages(room.roomId, this.messagesPerPage, this.lastLoadedMessage)
				.then(({ data, docs }) => {
					if (this.selectedRoom !== room.roomId) return

					if (data.length === 0 || data.length < this.messagesPerPage) {
						setTimeout(() => {
							this.messagesLoaded = true
						}, 0)
					}

					if (options.reset) this.messages = []

					data.forEach(message => {
						const formattedMessage = this.formatMessage(room, message)
						this.messages.unshift(formattedMessage)
					})

					if (this.lastLoadedMessage) {
						this.previousLastLoadedMessage = this.lastLoadedMessage
					}
					this.lastLoadedMessage = docs[docs.length - 1]

					this.listenMessages(room)
				})
		},

		listenMessages(room) {
			const listener = firestoreService.listenMessages(
				room.roomId,
				this.lastLoadedMessage,
				this.previousLastLoadedMessage,
				messages => {
					messages.forEach(message => {
						const formattedMessage = this.formatMessage(room, message)
						const messageIndex = this.messages.findIndex(
							m => m._id === message.id
						)

						if (messageIndex === -1) {
							this.messages = this.messages.concat([formattedMessage])
						} else {
							this.messages[messageIndex] = formattedMessage
							this.messages = [...this.messages]
						}

						this.markMessagesSeen(room, message)
					})
				}
			)
			this.listeners.push(listener)
		},

		markMessagesSeen(room, message) {
			if (
				message.sender_id !== this.currentUserId &&
				(!message.seen || !message.seen[this.currentUserId])
			) {
				firestoreService.updateMessage(room.roomId, message.id, {
					[`seen.${this.currentUserId}`]: new Date()
				})
			}
		},

		formatMessage(room, message) {
			const senderUser = room.users.find(user => user._id === message.sender_id)
			const formattedMessage = {
				...message,
				...{
					senderId: message.sender_id,
					_id: message.id,
					seconds: message.timestamp.seconds,
					timestamp: parseTimestamp(message.timestamp, 'HH:mm'),
					date: parseTimestamp(message.timestamp, 'DD MMMM YYYY'),
					username: room.users.find(user => message.sender_id === user._id)?.username,
          seen: message.seen && message.seen[this.currentUserId],
					avatar: senderUser ? senderUser.avatar : logoAvatar,
					distributed: true
				}
			}

			if (message.replyMessage) {
				formattedMessage.replyMessage = {
					...message.replyMessage,
					...{
						senderId: message.replyMessage.sender_id
					}
				}
			}

			return formattedMessage
		},

		async sendMessage({ content, roomId, files, replyMessage }) {
			const message = {
				sender_id: this.currentUserId,
				content,
				timestamp: new Date()
			}

			if (files) {
				message.files = this.formattedFiles(files)
			}

			if (replyMessage) {
				message.replyMessage = {
					_id: replyMessage._id,
					content: replyMessage.content,
					sender_id: replyMessage.senderId
				}

				if (replyMessage.files) {
					message.replyMessage.files = replyMessage.files
				}
			}

			const { id } = await firestoreService.addMessage(roomId, message)

			if (files) {
				for (let index = 0; index < files.length; index++) {
					await this.uploadFile({ file: files[index], messageId: id, roomId })
				}
			}

			firestoreService.updateRoom(roomId, { lastUpdated: new Date(), archiveUsers: [] })
		},

		async editMessage({ messageId, newContent, roomId, files }) {
			const newMessage = { edited: new Date() }
			newMessage.content = newContent

			if (files) {
				newMessage.files = this.formattedFiles(files)
			} else {
				newMessage.files = firestoreService.deleteDbField
			}

			await firestoreService.updateMessage(roomId, messageId, newMessage)

			if (files) {
				for (let index = 0; index < files.length; index++) {
					if (files[index]?.blob) {
						await this.uploadFile({ file: files[index], messageId, roomId })
					}
				}
			}
		},

		async deleteMessage({ message, roomId }) {
			await firestoreService.updateMessage(roomId, message._id, {
				deleted: new Date()
			})

			const { files } = message

			if (files) {
				files.forEach(file => {
					storageService.deleteFile(this.currentUserId, message._id, file)
				})
			}
		},

		async uploadFile({ file, messageId, roomId }) {
			return new Promise(resolve => {
				let type = file.extension || file.type
				if (type === 'svg' || type === 'pdf') {
					type = file.type
				}

				storageService.listenUploadImageProgress(
					this.currentUserId,
					messageId,
					file,
					type,
					progress => {
						this.updateFileProgress(messageId, file.localUrl, progress)
					},
					_error => {
						resolve(false)
					},
					async url => {
						const message = await firestoreService.getMessage(roomId, messageId)

						message.files.forEach(f => {
							if (f.url === file.localUrl) {
								f.url = url
							}
						})

						await firestoreService.updateMessage(roomId, messageId, {
							files: message.files
						})
						resolve(true)
					}
				)
			})
		},

		updateFileProgress(messageId, fileUrl, progress) {
			const message = this.messages.find(message => message._id === messageId)

			if (!message || !message.files) return

			message.files.find(file => file.url === fileUrl).progress = progress
			this.messages = [...this.messages]
		},

		formattedFiles(files) {
			const formattedFiles = []

			files.forEach(file => {
				const messageFile = {
					name: file.name,
					size: file.size,
					type: file.type,
					extension: file.extension || file.type,
					url: file.url || file.localUrl
				}

				if (file.audio) {
					messageFile.audio = true
					messageFile.duration = file.duration
				}

				formattedFiles.push(messageFile)
			})

			return formattedFiles
		},

		openFile({ file }) {
			window.open(file.file.url, '_blank')
		},

		async openUserTag({ user }) {
			let roomId

			this.rooms.forEach(room => {
				if (room.users.length === 2) {
					const userId1 = room.users[0]._id
					const userId2 = room.users[1]._id
					if (
						(userId1 === user._id || userId1 === this.currentUserId) &&
						(userId2 === user._id || userId2 === this.currentUserId)
					) {
						roomId = room.roomId
					}
				}
			})

			if (roomId) {
				this.roomId = roomId
				return
			}

			const query1 = await firestoreService.getUserRooms(
				this.currentUserId,
				user._id
			)

			if (query1.data.length) {
				return this.loadRoom(query1)
			}

			const query2 = await firestoreService.getUserRooms(
				user._id,
				this.currentUserId
			)

			if (query2.data.length) {
				return this.loadRoom(query2)
			}

			const users =
				user._id === this.currentUserId
					? [this.currentUserId]
					: [user._id, this.currentUserId]

			const room = await firestoreService.addRoom({
				users: users,
				lastUpdated: new Date()
			})

			this.roomId = room.id
			this.fetchRooms()
		},

		async loadRoom(query) {
			query.forEach(async room => {
				if (this.loadingRooms) return
				await firestoreService.updateRoom(room.id, { lastUpdated: new Date() })
				this.roomId = room.id
				this.fetchRooms()
			})
		},

		messageSelectionActionHandler({ action, messages, roomId }) {
			switch (action.name) {
				case 'deleteMessages':
					messages.forEach(message => {
						this.deleteMessage({ message, roomId })
					})
			}
		},

		async sendMessageReaction({ reaction, remove, messageId, roomId }) {
			firestoreService.updateMessageReactions(
				roomId,
				messageId,
				this.currentUserId,
				reaction.unicode,
				remove ? 'remove' : 'add'
			)
		},

		typingMessage({ message, roomId }) {
			if (roomId) {
				if (message?.length > 1) {
					this.typingMessageCache = message
					return
				}

				if (message?.length === 1 && this.typingMessageCache) {
					this.typingMessageCache = message
					return
				}

				this.typingMessageCache = message

				firestoreService.updateRoomTypingUsers(
					roomId,
					this.currentUserId,
					message ? 'add' : 'remove'
				)
			}
		},

		async listenRooms(query) {
			const listener = firestoreService.listenRooms(query, rooms => {
				rooms.forEach(room => {
					const foundRoom = this.rooms.find(r => r.roomId === room.id)
					if (foundRoom) {
						foundRoom.typingUsers = room.typingUsers
						foundRoom.index = room.lastUpdated.seconds
					}
				})
			})
			this.roomsListeners.push(listener)
		},

		listenUsersOnlineStatus(rooms) {
			rooms.forEach(room => {
				room.users.forEach(user => {
					const listener = firebaseService.firebaseListener(
						firebaseService.userStatusRef(user._id),
						snapshot => {
							if (!snapshot || !snapshot.val()) return

							const lastChanged = formatTimestamp(
								new Date(snapshot.val().lastChanged),
								new Date(snapshot.val().lastChanged)
							)

							user.status = { ...snapshot.val(), lastChanged }

							const roomIndex = this.rooms.findIndex(
								r => room.roomId === r.roomId
							)

							this.rooms[roomIndex] = room
							this.rooms = [...this.rooms]
						}
					)
					this.roomsListeners.push(listener)
				})
			})
		},

		menuActionHandler({ action, roomId }) {
			switch (action.name) {
				case 'inviteUser':
					return this.openModal(roomId, 'users-to-invite')
				case 'removeUser':
					return this.openModal(roomId, 'users-to-remove')
				case 'archiveRoom':
          this.selectedRoomId = roomId
          return this.archiveRoom(roomId)
				case 'blockedRoom':
          if (this.rooms.find(room => room.roomId === this.selectedRoomId).users.length <= 1) return
					firestoreService.updateRoomBlockedUsers(roomId, this.currentUserId, 'add')
          this.fetchRooms()
          return
				case 'deleteRoomUser':
          this.selectedRoomId = roomId
          const hasUsers = this.rooms.find(room => room.roomId === this.selectedRoomId).users.filter(u => u._id !== this.currentUserId).length > 1
					return hasUsers ? this.deleteRoomUser(this.currentUserId) : this.archiveRoom(roomId)
			}
		},

		openModal(roomId, ref) {
      const authStore = useAuthStore()
			this.selectedRoomId = roomId
      authStore.action = ref
		},

		async createRoom() {
      const mySelfRoom = await firestoreService.getUserRooms(this.currentUserId)
      if (mySelfRoom.data && mySelfRoom.data.length) return
			await firestoreService.addRoom({
				users: [this.currentUserId],
				lastUpdated: new Date()
			})
			this.fetchRooms()
		},

		async addRoomUser(userId) {
      const user = mapUser(this.users.value.find(u => u.user_id === userId))
			await firestoreService.addIdentifiedUser(user._id, user)
			await firestoreService.addRoomUser(this.selectedRoomId, user._id)
			this.selectedRoomId = null
      const authStore = useAuthStore()
      authStore.action = null
			this.fetchRooms()
		},

		async deleteRoomUser(userId) {
			await firestoreService.removeRoomUser(
				this.selectedRoomId,
				`${userId}`
			)
			this.selectedRoomId = null
      const authStore = useAuthStore()
      authStore.action = null
			this.fetchRooms()
		},

    async archiveRoom(roomId) {
      if (this.rooms.find(room => room.roomId === this.selectedRoomId).users.length <= 1) return
      firestoreService.updateRoomArchiveUsers(roomId, this.currentUserId, 'add')
      this.fetchRooms()
    },

		async deleteRoom(roomId) {
			firestoreService.getMessages(roomId).then(({ data }) => {
				data.forEach(message => {
					firestoreService.deleteMessage(roomId, message.id)
					if (message.files) {
						message.files.forEach(file => {
							storageService.deleteFile(this.currentUserId, message.id, file)
						})
					}
				})
			})

			await firestoreService.deleteRoom(roomId)

			this.fetchRooms()
		},
	}
}
</script>
