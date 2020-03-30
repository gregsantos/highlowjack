/** @jsx jsx */
import { useState, useContext, useEffect, Suspense } from 'react'
import 'firebase/firestore'
import { jsx } from 'theme-ui'
import { P, H1, Button, Input, Form, BodyWrapper } from '../components'
import { UserContext } from '../contexts/userContext'
import { ToastContext } from '../contexts/toastContext'
import firebase from '../firebase.js'
import ErrorBoundary from '../components/ErrorBoundary'

const ROOM_STATE = {
  OPEN: 1,
  FULL: 2,
  PRIVATE: 3,
}

const Dashboard = () => {
  const { userState, userDispatch } = useContext(UserContext)
  const { sendMessage } = useContext(ToastContext)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [moreInfoComplete, setMoreInfoComplete] = useState(false)
  const [openRooms, setOpenRooms] = useState([])

  const db = firebase.firestore()
  const roomsRef = db.collection('roomDetail')

  useEffect(() => {
    if (
      (moreInfoComplete || userState.userData.firstName) &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      requestNotifications()
    }
  }, [])

  const fetchRooms = async () => {
    try {
      const roomsArr = []
      const querySnapshot = await roomsRef.get()
      querySnapshot.forEach(doc => {
        roomsArr.push({ id: doc.id, ...doc.data() })
      })
      console.log(roomsArr)
      setOpenRooms(roomsArr)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchRooms()
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
    const handleJoinRoom = async () => {
      const currentRoom = {
        creator: userState.userId,
        state: ROOM_STATE.OPEN,
      }
      try {
        const newRoomRef = await roomsRef.add(currentRoom)
        console.log('Room created with ID: ', newRoomRef.id)
      } catch (error) {
        console.error('Error adding document: ', error)
      }
    }

    return (
      <BodyWrapper>
        <H1>Dashboard</H1>
        <P>
          Join an open room or create a private one <br />
          to play games, watch videos, and chat with your Cliq.
        </P>
        <Button
          onClick={e => {
            handleJoinRoom()
          }}
        >
          Join Room
        </Button>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <ul>
              {openRooms.map((room, i) => (
                <li key={i}>Room ID: {room.id}</li>
              ))}
            </ul>
          </Suspense>
        </ErrorBoundary>
      </BodyWrapper>
    )
  }
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo()
}

export default Dashboard
