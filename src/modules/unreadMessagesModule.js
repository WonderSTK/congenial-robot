import { ref, onUnmounted, inject } from 'vue'
import { listenRooms, listenMessages, roomsQuery } from '@/database/firestore'

export function useUnreadMessages() {
  const authStore = inject('authStore')
  if (!authStore.user) return { unread_messages: 0 }
  const unread_messages = ref(0)
  let processedMessageIds = new Set()
  const userId = authStore.user.userId

  const roomsListener = listenRooms(roomsQuery(userId), (rooms) => {
    unread_messages.value = 0
    processedMessageIds = new Set()
    rooms.forEach((room) => {
      const isArchived = (room.archiveUsers && room.archiveUsers.includes(userId)) || (room.blockedUsers && room.blockedUsers.includes(userId));
      if (isArchived) return
      listenMessages(room.id, null, null, (messages) => {
        messages.forEach((message) => {
          if (
            message.sender_id !== userId &&
            (!message.seen || !message.seen[userId]) &&
            !processedMessageIds.has(message.id)
          ) {
            unread_messages.value += 1
            processedMessageIds.add(message.id)
          }
        })

      })
    })
  })

  onUnmounted(() => {
    roomsListener()
  })

  return {
    unread_messages,
  }
}
