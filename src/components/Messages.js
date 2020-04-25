/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useRef } from 'react'
import { useCollection } from '../helpers/useCollection'

import MessageWithAvatar from './MessageWithAvatar'

const Messages = ({ roomId }) => {
  const scroller = useRef()
  const messages = useCollection(`roomDetail/${roomId}/messages`, 'createdAt')

  useEffect(() => {
    const node = scroller.current
    node.scrollTop = node.scrollHeight
  })

  return (
    <div
      sx={{
        flex: '1',
        padding: '10px 20px 10px 20px',
        lineHeight: '1.3',
        overflow: 'auto',
      }}
      ref={scroller}
    >
      <div sx={{ textAlign: 'center', fontWeight: 'bold' }}>No Table Talk!</div>

      {messages.map((message, index) => {
        // const previous = messages[index - 1]
        // const showAvatar = shouldShawAvatar(previous, message)

        return false ? (
          <MessageWithAvatar message={message} key={message.id} />
        ) : (
          <div key={message.id}>
            <div className='Message no-avatar'>
              <div className='MessageContent'>
                <b>{message.user}</b> : {message.text}
              </div>
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
