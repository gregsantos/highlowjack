/** @jsx jsx */
import { useState, useContext, useEffect, Suspense } from 'react'
import { Link, useHistory } from 'react-router-dom'
import 'firebase/firestore'
import { jsx } from 'theme-ui'
import { P, H1, Button, Input, Form, BodyWrapper } from '../components'
import { UserContext } from '../contexts/userContext'
import { ToastContext } from '../contexts/toastContext'
import firebase from '../firebase.js'
import ErrorBoundary from '../components/ErrorBoundary'
import Profile from './Profile'

const Dashboard = (props) => {
  const { userState, userDispatch } = useContext(UserContext)
  const { sendMessage } = useContext(ToastContext)
  const [firstName, setFirstName] = useState(null)
  const [lastName, setLastName] = useState(null)
  const [username, setUsername] = useState(null)
  const [moreInfoComplete, setMoreInfoComplete] = useState(false)
  const [openRooms, setOpenRooms] = useState([])
  const history = useHistory()

  const db = firebase.firestore()
  const roomsRef = db.collection('roomDetail')
  const queueRef = db.collection('queue')

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
      querySnapshot.forEach((doc) => {
        roomsArr.push({ id: doc.id, ...doc.data() })
      })
      setOpenRooms(roomsArr)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const requestNotifications = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const messaging = firebase.messaging()
        messaging
          .getToken()
          .then((currentToken) => {
            db.collection('users')
              .doc(firebase.auth().currentUser.uid)
              .set({ pushTokenWeb: currentToken }, { merge: true })
              .then(() => {
                sendMessage('Notifications activated!')
              })
              .catch((err) => console.log(err))
          })
          .catch((err) => {
            console.log('An error occurred while retrieving token.', err)
          })
      }
    })
  }

  const onClickSubmit = (e) => {
    e.preventDefault()
    if (username && firstName && lastName) {
      db.collection('users')
        .doc(firebase.auth().currentUser.uid)
        .set(
          {
            username: username,
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
              username: username,
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
        <H1>Welcome Playa</H1>
        <P>How do you want to be identified?</P>
        <Form>
          <div>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              name='username'
              placeholder='Username'
              autoComplete='username'
            />
          </div>
          <div>
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              name='firstName'
              placeholder='First name'
              autoComplete='given-name'
            />
          </div>
          <div>
            <Input
              onChange={(e) => setLastName(e.target.value)}
              name='lastName'
              placeholder='Last name'
              autoComplete='family-name'
            />
          </div>
          <Button onClick={(e) => onClickSubmit(e)}>Submit</Button>
        </Form>
      </BodyWrapper>
    )
  }

  const dashboard = () => {
    const handleJoinRoom = async () => {
      try {
        await queueRef.doc(userState.userId).set({
          userId: userState.userId,
        })
        console.log('Added user to queue')
      } catch (error) {
        console.error('Error adding document: ', error)
      }
    }

    const handleCreateNewRoom = () => {
      const newRoomRef = roomsRef.doc()
      newRoomRef
        .set({
          creator: userState.userId,
          members: firebase.firestore.FieldValue.arrayUnion(userState.userId),
          state: 'OPEN',
          private: false,
          lastMessage: {
            from: '',
            text: '',
            timestamp: '',
          },
        })
        .then(() => {
          console.log('New Room created: ', newRoomRef.id)
          return history.push(`/room/${newRoomRef.id}`)
        })
        .catch((e) => {
          console.log(e)
        })
    }

    return (
      <BodyWrapper>
        <H1>Dashboard</H1>
        <P>
          Join an open room or create a private one <br />
          to play games, watch videos, and chat with your Friends.
        </P>
        {false && (
          <div sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              onClick={(e) => {
                handleJoinRoom()
              }}
            >
              Join Room
            </Button>
            <Button
              onClick={(e) => {
                handleCreateNewRoom()
              }}
            >
              Create Room
            </Button>
          </div>
        )}
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <ul>
              {openRooms.map((room, i) => (
                <li key={i}>
                  <Link to={`room/${room.id}`}>Room ID: {room.id}</Link>
                </li>
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
