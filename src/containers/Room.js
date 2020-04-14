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
      .catch(function (err) {
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

  const renderTable = () => {
    const roomMember = roomData.members.includes(user.uid)
    if (roomMember) {
      if (gameData) {
        const playerTurn = gameData.turn === playerSeat
        if (gameData.trick === 0) {
          return (
            <div>
              <h1>Player {gameData.turn + 1} Bid</h1>
              <button disabled={!playerTurn}>2</button>
              <button disabled={!playerTurn}>3</button>
              <button disabled={!playerTurn}>4</button>
              <button disabled={!playerTurn}>Pass</button>
            </div>
          )
        } else {
          let lastCard = gameData.trickCards.pop()
          if (lastCard) {
            return (
              <div
                className={`card ${
                  lastCard.suit + lastCard.spot
                } shadow no-border`}
                sx={{
                  fontSize: [3, 5, 6],
                }}
              />
            )
          } else {
            return (
              <div className={`card outline`} sx={{ fontSize: [3, 5, 6] }} />
            )
          }
        }
      } else {
        return <button onClick={startGame}>Start Game</button>
      }
    } else {
      return <button onClick={joinRoom}>Join Room</button>
    }
  }

  const playCard = (i, card) => {
    const nextPlayer = gameData.turn === 3 ? 0 : gameData.turn + 1
    const lastPlayer = nextPlayer === gameData.leader
    const cardArr = [...card]
    const suit = cardArr.shift()
    const spot = cardArr.join()

    const cardData = {
      p: playerSeat,
      suit: suit,
      spot: spot,
    }
    const getUpdate = () => {
      if (!lastPlayer) {
        return {
          turn: nextPlayer,
          trickCards: firebase.firestore.FieldValue.arrayUnion(cardData),
        }
      } else {
        const tallyTrick = () => {
          const tallyRound =
            gameData.trick === 6 && nextPlayer === gameData.leader
          if (tallyRound) {
            // last trick in round
            // call tallyRound() & resetRound()
            // check points toward bid, count for game and score round
            const nextDealer = gameData.dealer === 3 ? 0 : gameData.dealer + 1
            return {
              turn: nextDealer + 1,
              leader: nextDealer + 1,
              dealer: nextDealer,
              trick: 0, // 7 for round results alert
              trickCards: [],
              t1RoundCards: [],
              t2RoundCards: [],
            }
          } else {
            // last card in trick
            // calculate new leader, add trick to winners
            // roundCards
            const trumped = gameData.trickCards.filter(
              (c) => c.suit === gameData.bid.trumpSuit
            )
            const highTrump = trumped.sort((a, b) => b.spot - a.spot)
            const suited = gameData.trickCards.filter(
              (c) => c.suit === gameData.trickCards[0].suit
            )
            const highSuited = suited.sort((a, b) => b.spot - a.spot)
            const winningCard = highTrump[0] || highSuited[0]
            const handWinner = winningCard.p
            const trickWinner = winningCard.p === 1 || 3 ? 0 : 1
            return {
              turn: handWinner,
              leader: handWinner,
              trick: gameData.trick + 1,
              trickCards: [],
              t1RoundCards:
                trickWinner === 0
                  ? firebase.firestore.FieldValue.arrayUnion(
                      ...[cardData, ...[gameData.trickCards]]
                    )
                  : [],
              t2RoundCards: [],
            }
          }
        }
        return tallyTrick()
      }
    }
    gameRef.update(getUpdate())
  }

  const renderCards = () => {
    if (gameData) {
      if (!playerSeat) {
        const cards = []
        for (let i = 0; i < 6; i++) {
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
        const playerHand = gameData.players[playerSeat].hand
        console.log(playerHand)
        return playerHand.map((card, i) => (
          <div
            key={i}
            sx={{
              backgroundColor: 'green',
              display: 'grid',
              justifyContent: 'center',
            }}
          >
            <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
            <button onClick={() => playCard(i, card)}>X</button>
          </div>
        ))
      }
    } else {
      return <h1>Start A Game</h1>
    }
  }

  const fetchGame = () => {
    let unsubscribe
    unsubscribe = gameRef.onSnapshot((snap) => {
      if (!snap.exists) {
        console.log('No such Game!')
      } else {
        const data = snap.data()
        setGameData(data)
        console.log('Game Data: ', data)
      }
    })
    const leaveGame = () => {
      unsubscribe()
      console.log('Unsubscribe from game')
    }
    return leaveGame
  }

  useEffect(() => {
    let unsubscribe
    let unsubscribeGame
    if (user) {
      unsubscribe = roomRef.onSnapshot((snap) => {
        const data = snap.data()
        // fetchGame
        unsubscribeGame = fetchGame()
        // set player seat
        let playerSeat = data.members.findIndex((m) => m === user.uid)
        setPlayerSeat(playerSeat)
        setRoomData({ ...data, id: snap.id })
        console.log(
          'Room data:',
          data,
          'User: ',
          user.uid,
          'Seat: ',
          playerSeat
        )
      })
      return () => {
        unsubscribe()
        unsubscribeGame()
        console.log(user.uid, 'left room')
      }
    } else {
      console.log('no logged in user')
    }
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
              '& :nth-of-type(even)': {
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
            {renderCards()}
          </div>

          <Box
            p={1}
            bg='white'
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
            bg='white'
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
