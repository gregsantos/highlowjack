/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useEffect, useRef } from 'react'
import { useCollection } from '../helpers/useCollection'

const Messages = ({ roomId }) => {
  const scroller = useRef()
  const messages = useCollection(`roomDetail/${roomId}/messages`, 'createdAt')

  useEffect(() => {
    const node = scroller.current
    node.scrollTop = node.scrollHeight
  })

  return (
    <div
      className='Messages'
      sx={{
        flex: [1],
        backgroundColor: 'white',
        overflowY: 'auto',
        padding: 2,
        mb: 1,
      }}
      ref={scroller}
    >
      {messages.map((message, index) => {
        return (
          <div
            key={message.id}
            sx={{ '&:nth-child(odd)': { background: 'antiquewhite' } }}
          >
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

export default Messages
