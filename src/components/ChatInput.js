import React from 'react'
import firebase from '../firebase.js'

const ChatInput = ({ roomId, userData }) => {
  const db = firebase.firestore()
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
