/** @jsx jsx */
import { jsx, Input } from 'theme-ui'
import { useContext } from 'react'
import firebase from '../firebase.js'
import { UserContext } from '../contexts/userContext'

const ChatInput = ({ roomId }) => {
  const { userState, userDispatch } = useContext(UserContext)
  const db = firebase.firestore()
  const roomRef = db.collection('roomDetail').doc(roomId)
  return (
    <div sx={{ flex: '0 0 30px', mt: 1, backgroundColor: 'antiquewhite' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const { value } = e.target.elements[0]
          roomRef.collection('messages').add({
            user: userState.userData.username,
            text: value,
            createdAt: new Date(),
          })
          e.target.reset()
        }}
      >
        <Input
          sx={{ border: 'thin solid indianred' }}
          autoFocus
          placeholder={`No Table Talk!`}
        />
      </form>
    </div>
  )
}

export default ChatInput
