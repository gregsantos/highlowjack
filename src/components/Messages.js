import React, { useEffect, useRef } from 'react'
import { useSession } from '../App'
import { useCollection } from '../helpers/useCollection'
import firebase from '../firebase.js'

import MessageWithAvatar from './MessageWithAvatar'

const Messages = ({ roomId }) => {
  const user = useSession()
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(user.uid)
  const roomRef = db.collection('roomDetail').doc(roomId)
  const scroller = useRef()
  const messages = useCollection(`roomDetail/${roomId}/messages`, 'createdAt')

  useEffect(() => {
    const node = scroller.current
    node.scrollTop = node.scrollHeight
  })

  return (
    <div className='Messages' ref={scroller}>
      <div className='EndOfMessages'>No Table Talk!</div>

      {messages.map((message, index) => {
        const previous = messages[index - 1]
        // const showAvatar = shouldShawAvatar(previous, message)

        return true ? (
          <MessageWithAvatar message={message} key={message.id} />
        ) : (
          <div key={message.id}>
            <div className='Message no-avatar'>
              <div className='MessageContent'>{message.text}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function shouldShawAvatar(previous, message) {
  const isFirst = !previous
  if (isFirst) return true

  const diffrentUser = message.user.id !== previous.user.id
  if (diffrentUser) return true

  const hasBeenaWhile =
    message.createdAt.seconds - previous.createdAt.seconds > 180
  return hasBeenaWhile
}

export default Messages
