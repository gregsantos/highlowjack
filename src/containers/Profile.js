/** @jsx jsx */
import { jsx, Button, useColorMode } from 'theme-ui'
import React, { useState, useContext } from 'react'
import { P, H1, Input, Form, BodyWrapper } from '../components'
import { ToastContext } from '../contexts/toastContext'
import { UserContext } from '../contexts/userContext'
import firebase from '../firebase.js'
import 'firebase/firestore'

const Profile = () => {
  const { userState, userDispatch } = useContext(UserContext)
  const [firstName, setFirstName] = useState(userState.userData.firstName)
  const [lastName, setLastName] = useState(userState.userData.lastName)
  const [username, setUsername] = useState(userState.userData.username)
  const [loadState, setloadState] = useState(false)
  const { sendMessage } = useContext(ToastContext)
  const db = firebase.firestore()

  const onClickSubmit = (e) => {
    e.preventDefault()
    if (firstName && lastName && username) {
      if (
        firstName !== userState.userData.firstName ||
        lastName !== userState.userData.lastName ||
        username !== userState.userData.username
      ) {
        setloadState(true)
        db.collection('users')
          .doc(firebase.auth().currentUser.uid)
          .update({
            firstName: firstName,
            lastName: lastName,
            username: username,
          })
          .then(() => {
            setloadState(false)
            userDispatch({
              type: 'updateProfile',
              payload: {
                firstName: firstName,
                lastName: lastName,
                username: username,
              },
            })
            sendMessage('Update successful!')
          })
          .catch((err) => {
            setloadState(false)
            sendMessage(err.message)
          })
      } else {
        sendMessage("You didn't enter any new information.")
      }
    } else {
      sendMessage("You can't leave any of your information blank.")
    }
  }

  return (
    <BodyWrapper>
      <H1>Profile</H1>
      <P>Update your personal information here.</P>
      <Form>
        <div>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            name='username'
            placeholder='Username'
            autoComplete='username'
            value={username}
          />
        </div>
        <div>
          <Input
            onChange={(e) => setFirstName(e.target.value)}
            name='firstName'
            placeholder='First name'
            autoComplete='given-name'
            value={firstName}
          />
        </div>
        <div>
          <Input
            onChange={(e) => setLastName(e.target.value)}
            name='lastName'
            placeholder='Last name'
            autoComplete='family-name'
            value={lastName}
          />
        </div>
        <div>
          <Button
            variant='flatgreen'
            loading={loadState}
            onClick={(e) => onClickSubmit(e)}
          >
            Submit
          </Button>
        </div>
      </Form>
    </BodyWrapper>
  )
}

export default Profile
