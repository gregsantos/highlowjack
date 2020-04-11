/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import '../css/cards.css'
import initGame from '../helpers/initGame'

const RoomPage = (props) => {
  const user = useSession()
  const [roomData, setRoomData] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [playerSeat, setPlayerSeat] = useState(-1)
  const id = props.match.params.id
  const db = firebase.firestore()
  const roomRef = db.collection('roomDetail').doc(id)
  const gamesRef = db.collection('games')
  const gameRef = db.collection('games').doc(id)
  const joinRoom = () => {
    db.runTransaction((transaction) => {
      return transaction.get(roomRef).then((roomDoc) => {
        if (!roomDoc.exists) {
          throw 'Room does not exist!'
        }
        const members = roomDoc.data().members
        if (members.length <= 3) {
          const getUpdate = () => {
            const newState = members.length === 3 ? 2 : 1
            return {
              members: firebase.firestore.FieldValue.arrayUnion(user.uid),
              state: newState,
            }
          }
          transaction.update(roomRef, getUpdate())
          return members
        } else {
          return Promise.reject('Sorry! Room is already full.')
        }
      })
    })
      .then((members) => {
        setPlayerSeat(members.length)
        console.log('User Joined Room ', members.length)
      })
      .catch(function(err) {
        // "room is already full" error.
        console.error(err)
      })
  }

  const startGame = () => {
    const gameData = initGame(roomData.members)
    const gameRef = gamesRef.doc(id)
    const batch = db.batch()
    batch.set(gameRef, gameData)
    batch.update(roomRef, {
      gameId: id,
    })
    batch
      .commit()
      .then(() => {
        console.log('Created new game')
      })
      .catch(() => {
        console.log('Error Creating new game')
      })
  }

  const fetchGame = async () => {
    let unsubscribe
    try {
      // const game = await gameRef.get()
      unsubscribe = await gameRef.onSnapshot((snap) => {
        if (!snap.exists) {
          console.log('No such Game!')
        } else {
          const data = snap.data()
          setGameData(data)
          console.log('Game data:', data)
        }
      })
    } catch (error) {
      console.log('Error getting Game', error)
    }
    return () => unsubscribe()
  }

  const fetchRoom = async () => {
    if (user) {
      let unsubscribe
      try {
        unsubscribe = await roomRef.onSnapshot((snap) => {
          const data = snap.data()
          // set player seat
          let playerSeat = data.members.findIndex((m) => m === user.uid)
          setPlayerSeat(playerSeat)
          setRoomData({ ...data, id: snap.id })
          console.log('Room data:', data, 'User: ', user.uid)
        })
      } catch (error) {
        console.log(error)
      }
      // return cleanup function
      return () => {
        unsubscribe()
        console.log(user.uid, 'Left room')
      }
    } else {
      console.log('no logged in user')
    }
  }

  const renderTable = () => {
    const roomMember = roomData.members.includes(user.uid)
    if (roomMember) {
      if (gameData) {
        if (gameData.trick.length === 0)
          return (
            <div
              className='card outline'
              sx={{
                fontSize: [3, 5, 6],
              }}
            />
          )
        if (gameData.trick.length === 0)
          return (
            <div
              className='card hA shadow no-border'
              sx={{
                fontSize: [3, 5, 6],
              }}
            />
          )
      } else {
        return <button onClick={startGame}>Start Game</button>
      }
    } else {
      return <button onClick={joinRoom}>Join Room</button>
    }
  }

  const renderCards = () => {
    console.log(playerSeat)
    if (gameData) {
      console.log(gameData.players)
      if (!playerSeat) {
        const cards = []
        for (let i = 0; i < 5; i++) {
          cards.push(
            <div
              key={i}
              sx={{
                backgroundColor: 'green',
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <div className={`card outline`} sx={{ fontSize: [1, 3, 4] }} />
            </div>
          )
        }
        return cards
      } else {
        return gameData.players[playerSeat].hand.map((card) => (
          <div
            sx={{
              backgroundColor: 'green',
              display: 'grid',
              justifyContent: 'center',
            }}
          >
            <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
          </div>
        ))
      }
    } else {
      return <h1>Start A Game</h1>
    }
  }

  useEffect(() => {
    fetchGame()
  }, [])

  useEffect(() => {
    fetchRoom()
  }, [user])

  return (
    <RoomWrapper>
      <div
        sx={{
          height: '100%',
          display: 'grid',
          gridGap: 0,
          gridTemplate: [
            `"main" 100vw
           "aside" auto
          / 100%`,
            `"main" 65%
           "aside" auto
          / 100%`,
            `"main aside" auto
          / minmax(60%, 1fr) minmax(410px, 555px)`,
          ],
        }}
      >
        <main
          sx={{
            backgroundColor: '#63B3ED',
            gridArea: 'main',
          }}
        >
          <div
            sx={{
              backgroundColor: 'darkseagreen',
              height: '100%',
              display: 'grid',
              gridGap: 0,
              gridTemplateColumns: [
                '1fr minmax(auto, 1.2fr) 1fr',
                'minmax(1fr, 249px) auto minmax(1fr, 249px)',
                'minmax(225px, 1fr) minmax(auto, 1.2fr) minmax(225px, 1fr)',
              ],
              gridTemplateRows: [
                '1fr minmax(auto, 1.2fr) 1fr',
                '1fr 170px 1fr',
                '1fr minmax(auto, 1.2fr) 1fr',
              ],
              '& :nth-child(even)': {
                backgroundColor: 'white',
              },
            }}
          >
            <div sx={{ alignSelf: 'center' }}>
              <Container sx={{ height: 'auto' }}>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div />

            <Container sx={{ backgroundColor: 'green' }}>
              {roomData && renderTable()}
            </Container>

            <div />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
          </div>
        </main>

        <aside
          sx={{
            backgroundColor: '#5C6AC4',
            minWidth: '375px',
            gridArea: 'aside',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            sx={{
              backgroundColor: 'green',
              padding: '10px 0px',
              display: 'grid',
              justifyContent: 'center',
              gridGap: '1',
              gridTemplateColumns: [
                'repeat(auto-fit, 55px)',
                'repeat(6, minmax(80px, 1fr))',
                'repeat(3, minmax(92px, 1fr))',
              ],
            }}
          >
            {gameData && renderCards()}
          </div>

          <Box
            p={1}
            bg='black'
            sx={{
              flex: '1 1 auto',
              border: 'solid',
              borderBottom: '0px',
              borderWidth: 'medium',
              borderColor: '#ff1744',
            }}
          ></Box>
          <Box
            p={2}
            bg='black'
            sx={{
              flex: '1 1 auto',
              border: 'solid',
              borderWidth: 'medium',
              borderColor: '#ff1744',
            }}
          ></Box>
        </aside>
      </div>
    </RoomWrapper>
  )
}

export default RoomPage
