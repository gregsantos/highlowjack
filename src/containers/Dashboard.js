/** @jsx jsx */
import { useState, useContext, useEffect } from 'react'
import 'firebase/firestore'
import { jsx } from 'theme-ui'
import { P, H1, Button, Input, Form, BodyWrapper } from '../components'
import { UserContext } from '../contexts/userContext'
import { ToastContext } from '../contexts/toastContext'
import firebase from '../firebase.js'
import { useColorMode } from 'theme-ui'

const Dashboard = () => {
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [moreInfoComplete, setMoreInfoComplete] = useState(false)
  const { userState, userDispatch } = useContext(UserContext)
  const { sendMessage } = useContext(ToastContext)
  const [colorMode, setColorMode] = useColorMode()
  const db = firebase.firestore()

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      requestNotifications()
    }
  }, [])

  const requestNotifications = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        const messaging = firebase.messaging()
        messaging
          .getToken()
          .then(currentToken => {
            db.collection('users')
              .doc(firebase.auth().currentUser.uid)
              .set({ pushTokenWeb: currentToken }, { merge: true })
              .then(() => {
                sendMessage('Notifications activated!')
              })
              .catch(err => console.log(err))
          })
          .catch(err => {
            console.log('An error occurred while retrieving token.', err)
          })
      }
    })
  }

  const onClickSubmit = e => {
    e.preventDefault()
    if (firstName && lastName) {
      db.collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            firstName: firstName,
            lastName: lastName,
          },
          { merge: true }
        )
        .then(() => {
          userDispatch({
            type: 'updateProfile',
            payload: {
              firstName: firstName,
              lastName: lastName,
            },
          })
          setMoreInfoComplete(true)
          sendMessage('Welcome!')
          requestNotifications()
        })
    } else {
      sendMessage('Please complete the form.')
    }
  }

  const moreInfo = () => {
    return (
      <BodyWrapper>
        <H1>Onboarding</H1>
        <P>
          This is an introduction screen that shows up after the user
          successfully logs in for the first time. It's a good opportunity to
          collect additional information or provide them with important details
          about how your application works.
        </P>
        <Form>
          <div>
            <Input
              onChange={e => setFirstName(e.target.value)}
              name='firstName'
              placeholder='First name'
              autoComplete='given-name'
            />
          </div>
          <div>
            <Input
              onChange={e => setLastName(e.target.value)}
              name='lastName'
              placeholder='Last name'
              autoComplete='family-name'
            />
          </div>
          <Button onClick={e => onClickSubmit(e)}>Submit</Button>
        </Form>
      </BodyWrapper>
    )
  }

  const dashboard = () => {
    return (
      <BodyWrapper>
        <H1>Dashboard</H1>
        <P>
          So this is your dashboard. Maybe you'll put a few graphs here, you've
          always wanted to try out D3. Maybe a news feed, or updates on new
          features.
        </P>
        <Button
          onClick={e => {
            setColorMode(colorMode === 'main' ? 'dark' : 'main')
          }}
        >
          Toggle {colorMode === 'main' ? 'Dark' : 'Light'}
        </Button>
        <P>
          So this is your dashboard. Maybe you'll put a few graphs here, you've
          always wanted to try out D3. Maybe a news feed, or updates on new
          features.
        </P>
        <footer
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            p: 2,
            variant: 'layout.footer',
          }}
        >
          FOOTER
        </footer>
      </BodyWrapper>
    )
  }
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo()
}

export default Dashboard
