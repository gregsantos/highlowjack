import React from 'react'

function MessageWithAvatar({ message }) {
  return (
    <div key={message.id}>
      {true && (
        <div className='Day'>
          <div className='DayLine' />
          <div className='DayText'>
            {new Date(message.createdAt.seconds * 1000).toLocaleDateString()}
          </div>
          <div className='DayLine' />
        </div>
      )}
      <div className='Message with-avatar'>
        <div className='Avatar' />
        <div className='Author'>
          <div className='MessageContent'>
            {message.user}: {message.text}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageWithAvatar
