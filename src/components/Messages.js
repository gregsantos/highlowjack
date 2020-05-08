/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
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
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'white',
        overflowY: 'auto',
        mb: 1,
        border: 'thin solid indianred',
        maxHeight: ['257px', '105px', '220px'],
      }}
      ref={scroller}
    >
      {messages.map((message, index) => {
        return (
          <div
            key={message.id}
            sx={{ pl: 1, '&:nth-child(odd)': { background: 'antiquewhite' } }}
          >
            <div className='Message no-avatar'>
              <div className='MessageContent'>
                <b>{message.user}</b> : {message.text}
              </div>
            </div>
          </div>
        )
      })}
    </Box>
  )
}

export default Messages
