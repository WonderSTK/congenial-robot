export const mapUser = (user) => ({
  _id: `${user.userId || user.user_id}`,
  username: user.username,
  avatar: getPdpLink(user),
  status: {
    state: 'offline'
  },
  _user: user
})

const getPdpLink = (user) => {
  return user && user.pdp ?
    `${import.meta.env.VITE_SUPAURL}/storage/v1/object/public/avatars/${user.pdp}`
    : '/guest.png'
}

import * as firestoreService from '@/database/firestore'
export const createRoom = async (user1, user2, router) => {  
  user1 = mapUser(user1)
  await firestoreService.addIdentifiedUser(user1._id, user1)
  
  user2 = mapUser(user2)
  await firestoreService.addIdentifiedUser(user2._id, user2)

  // Check if room with this 2 users already exist
  const roomExist = await firestoreService.getUserRooms(user1._id, user2._id)
  if (roomExist.data && roomExist.data.length) {
    if (router) router.push('/inbox')
    return
  }

  await firestoreService.addRoom({
    users: [user1._id, user2._id],
    lastUpdated: new Date()
  })
  if (router) router.push('/inbox')
}

/* Use these functions to initialize firebase cloud database structure */
export const addData = async(firestoreService, users) => {
  const user1 = users[0]
  await firestoreService.addIdentifiedUser(user1._id, user1)

  const user2 = users[1]
  await firestoreService.addIdentifiedUser(user2._id, user2)

  const user3 = users[2]
  await firestoreService.addIdentifiedUser(user3._id, user3)

  await firestoreService.addRoom({
    users: [user1._id, user2._id],
    lastUpdated: new Date()
  })
  await firestoreService.addRoom({
    users: [user1._id, user3._id],
    lastUpdated: new Date()
  })
  await firestoreService.addRoom({
    users: [user2._id, user3._id],
    lastUpdated: new Date()
  })
  await firestoreService.addRoom({
    users: [user1._id, user2._id, user3._id],
    lastUpdated: new Date()
  })
}

export const resetData = (firestoreService) => {
  firestoreService.getAllRooms().then(({ data }) => {
    data.forEach(async room => {
      await firestoreService.getMessages(room.id).then(({ data }) => {
        data.forEach(message => {
          firestoreService.deleteMessage(room.id, message.id)
          if (message.files) {
            message.files.forEach(file => {
              storageService.deleteFile(
                this.currentUserId,
                message.id,
                file
              )
            })
          }
        })
      })

      firestoreService.deleteRoom(room.id)
    })
  })

  firestoreService.getAllUsers().then(({ data }) => {
    data.forEach(user => {
      firestoreService.deleteUser(user.id)
    })
  })
}
