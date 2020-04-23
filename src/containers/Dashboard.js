/** @jsx jsx */
import { useState, useContext, useEffect, Suspense } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { jsx, Button, Flex } from 'theme-ui'
import 'firebase/firestore'
import { P, H1, Input, Form, BodyWrapper } from '../components'
import { UserContext } from '../contexts/userContext'
import { ToastContext } from '../contexts/toastContext'
import firebase from '../firebase.js'
import ErrorBoundary from '../components/ErrorBoundary'
import { useSession } from '../App'

const Dashboard = (props) => {
  const user = useSession()
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
  const userRef = db.collection('users').doc(userState.userId)
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

  const fetchOpenRooms = async () => {
    try {
      const roomsArr = []
      const querySnapshot = await roomsRef.where('state', '==', 'OPEN').get()
      querySnapshot.forEach((doc) => {
        roomsArr.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setOpenRooms(roomsArr)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOpenRooms()
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
            profilePic: user.photoURL,
            userRooms: [],
          },
          { merge: true }
        )
        .then(() => {
          userDispatch({
            type: 'updateProfile',
            payload: {
              username: username,
              firstName: firstName,
              lastName: lastName,
              profilePic: user.photoURL,
              userRooms: [],
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
          <Button variant='flatgreen' onClick={(e) => onClickSubmit(e)}>
            Submit
          </Button>
        </Form>
      </BodyWrapper>
    )
  }

  const dashboard = () => {
    console.log(userState.userData, user.photoURL)
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
      const newRoomData = {
        creator: userState.userId,
        members: firebase.firestore.FieldValue.arrayUnion(userState.userId),
        state: 'OPEN',
        private: false,
        lastMessage: {
          from: 'Host',
          text: 'Welcome!',
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        },
      }
      const batch = db.batch()
      batch.set(newRoomRef, newRoomData)
      batch.update(userRef, {
        userRooms: firebase.firestore.FieldValue.arrayUnion(newRoomRef.id),
      })
      batch
        .commit()
        .then(() => {
          console.log('New Room created: ', newRoomRef.id)
          return history.push(`/room/${newRoomRef.id}`)
        })
        .catch(() => {
          console.log('Error Creating new game')
        })
    }

    return (
      <BodyWrapper>
        <H1>Dashboard</H1>
        <P>
          Join an open room or create a private one <br />
          to play games, watch videos, and chat with your Friends.
        </P>
        <div
          sx={{
            maxWidth: '500px',
            display: 'grid',
            gridGap: 4,
          }}
        >
          <div>
            <Button
              variant='flatgreen'
              onClick={(e) => {
                handleCreateNewRoom()
              }}
            >
              Create Room
            </Button>
          </div>
          <div>
            <Flex>
              <h2>My Rooms</h2>
            </Flex>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <ul>
                  {userState.userData.userRooms.map((room, i) => (
                    <li key={i}>
                      <Link to={`room/${room.id}`}>Room ID: {room.id}</Link>
                    </li>
                  ))}
                </ul>
              </Suspense>
            </ErrorBoundary>
          </div>
          <div>
            <h2>Open Rooms</h2>
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
          </div>
          {false && (
            <div sx={{ display: 'flex' }}>
              <Button
                variant='flatgreen'
                onClick={(e) => {
                  handleJoinRoom()
                }}
              >
                Join Queue
              </Button>
            </div>
          )}
        </div>
      </BodyWrapper>
    )
  }
  return moreInfoComplete || userState.userData.firstName
    ? dashboard()
    : moreInfo()
}

export default Dashboard
