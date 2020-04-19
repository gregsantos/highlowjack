const functions = require('firebase-functions')
const admin = require('firebase-admin')

const db = admin.firestore()

exports.addOrCreateRoom = functions.firestore
  .document('queue/{userId}')
  .onCreate((snap, context) => {
    const newValue = snap.data()
    const uid = newValue.userId
    const roomsRef = db.collection('roomDetail')

    const createNewRoom = () => {
      const newRoomRef = roomsRef.doc()
      newRoomRef
        .set({
          creator: uid,
          members: admin.firestore.FieldValue.arrayUnion(uid),
          state: 'OPEN',
        })
        .then(() => {
          console.log('New Room created: ', newRoomRef)
          return
        })
        .catch((e) => {
          console.log(e)
          return
        })
    }

    const joinRoom = (id) => {
      const roomRef = roomsRef.doc(id)
      db.runTransaction((transaction) => {
        return transaction.get(roomRef).then((roomDoc) => {
          if (!roomDoc.exists) {
            throw new Error('Room does not exist')
          }
          const roomData = roomDoc.data()
          if (roomData.members.length <= 3) {
            const getUpdate = () => {
              const newState = roomData.members.length === 3 ? 'FULL' : 'OPEN'
              return {
                members: admin.firestore.FieldValue.arrayUnion(uid),
                state: newState,
              }
            }
            return transaction.update(roomRef, getUpdate())
          } else {
            return Promise.reject(new Error('Room is already full'))
          }
        })
      })
        .then((t) => {
          console.log('User Joined Room ', t)
          return
        })
        .catch((err) => {
          console.error(err)
          return
        })
    }

    roomsRef
      .where('state', '==', 'OPEN')
      .limit(1)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log('Found an open room', snapshot.docs[0])
          const roomId = snapshot.docs[0].id
          joinRoom(roomId)
          return
        } else {
          console.log('No open rooms.')
          createNewRoom()
          return
        }
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        return
      })
    return
  })
