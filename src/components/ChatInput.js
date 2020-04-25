import React from 'react'
import { useSession } from '../App'
import firebase from '../firebase.js'

const ChatInput = ({ roomId, userData }) => {
  const user = useSession()
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(user.uid)
  const roomRef = db.collection('roomDetail').doc(roomId)
  console.log(userData)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const { value } = e.target.elements[0]
        roomRef.collection('messages').add({
          user: userData.username,
          text: value,
          createdAt: new Date(),
        })
        e.target.reset()
      }}
    >
      <input placeholder={`Table Talk`} />
    </form>
  )
}

export default ChatInput
