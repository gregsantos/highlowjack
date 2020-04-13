const functions = require('firebase-functions')
const admin = require('firebase-admin')

const db = admin.firestore()

exports.addOrCreateRoom = functions.firestore
  .document('queue/{userId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data()

    // access a particular field as you would any JS property
    const uid = newValue.userId
    console.log('User Added to Queue: ', uid)

    const roomsRef = db.collection('roomDetail')

    const createNewRoom = () => {
      const newRoomRef = roomsRef.doc()
      newRoomRef
        .set({
          creator: uid,
          state: 1,
        })
        .then(() => {
          console.log('New Room created: ', newRoomRef)
          return
        })
        .catch((e) => {
          console.log(e)
        })
    }

    roomsRef
      .where('state', '==', 1)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log('Found an open room', snapshot.docs)
          return null
        } else {
          console.log('No open rooms.')
          return createNewRoom()
        }
      })
      .catch((err) => {
        console.log('Error getting documents', err)
      })
  })
