/** @jsx jsx */
import { jsx, Button, Select } from 'theme-ui'
import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret, FaDiscourse } from 'react-icons/fa'
import { P, H1, Input, Form, RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import '../css/cards.css'
import initGame from '../helpers/initGame'

const RoomPage = (props) => {
  const user = useSession()
  const [roomData, setRoomData] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [playerSeat, setPlayerSeat] = useState(-1)
  const [bidPoints, setBidPoints] = useState(0)
  const [bidSuit, setBidSuit] = useState('s')
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

  const handleSelectBid = (e) => {
    setBidPoints(e.target.id)
  }

  const handleSelectSuit = (e) => {
    setBidSuit(e.target.value)
  }

  const handleSubmitBid = (e) => {
    e.preventDefault()
    const nextPlayer = gameData.turn === 3 ? 0 : gameData.turn + 1
    const newBid = {
      bidder: playerSeat,
      bid: bidPoints,
      suit: bidSuit,
    }
    console.log(newBid)
    if (playerSeat === gameData.dealer) {
      if (bidPoints >= gameData.bid.bid) {
        gameRef.update({
          bid: newBid,
          turn: playerSeat,
          trick: 1,
        })
      } else {
        gameRef.update({
          turn: gameData.bid.bidder,
          trick: 1,
        })
      }
    } else {
      if (bidPoints > gameData.bid.bid) {
        gameRef.update({
          bid: newBid,
          turn: nextPlayer,
        })
      } else {
        gameRef.update({
          turn: nextPlayer,
        })
      }
    }
  }

  const renderTable = () => {
    const roomMember = roomData.members.includes(user.uid)
    if (roomMember) {
      if (gameData) {
        const playerTurn = gameData.turn === playerSeat
        const currentBid = gameData.bid.bid
        if (gameData.trick === 0) {
          if (playerTurn)
            return (
              <Container>
                <Box
                  sx={{
                    px: ['0px', null, '15px'],
                    pt: ['0px', '10px'],
                    pb: ['0px', '10px'],
                  }}
                >
                  <Container>
                    <h1
                      sx={{
                        color: 'indianred',
                        fontSize: ['1em', '1.5em', null],
                        mb: ['0px', '0px', '10px'],
                        mt: ['2px', null, '5px'],
                      }}
                    >
                      Please Bid Player {gameData.turn + 1}
                    </h1>
                  </Container>
                  <Container>
                    <Button
                      id={2}
                      disabled={currentBid >= 2 || bidPoints === 2}
                      onClick={(e) => handleSelectBid(e)}
                      variant='bidgroup'
                    >
                      2
                    </Button>
                    <Button
                      id={3}
                      disabled={currentBid >= 3 || bidPoints === 3}
                      onClick={(e) => handleSelectBid(e)}
                      variant='bidgroup'
                    >
                      3
                    </Button>
                    <Button
                      id={4}
                      disabled={currentBid >= 4 || bidPoints === 4}
                      onClick={(e) => handleSelectBid(e)}
                      variant='bidgroup'
                    >
                      4
                    </Button>
                  </Container>

                  <form onSubmit={handleSubmitBid}>
                    <Container>
                      <Select
                        id='suit'
                        value={bidSuit}
                        onChange={handleSelectSuit}
                        defaultValue='s'
                      >
                        <option value='s'>Spades</option>
                        <option value='c'>Clubs</option>
                        <option value='h'>Hearts</option>
                        <option value='d'>Diamonds</option>
                      </Select>
                    </Container>
                    <Container>
                      <Button type='submit' variant='bidgroup'>
                        Bid
                      </Button>
                      <Button
                        id={0}
                        disabled={
                          playerSeat === gameData.dealer && currentBid === 0
                        }
                        type='submit'
                        variant='bidgroup'
                      >
                        Pass
                      </Button>
                    </Container>
                  </form>
                </Box>
              </Container>
            )
          if (!playerTurn)
            return (
              <div
                sx={{
                  color: '#daa520',
                }}
              >
                <h1
                  sx={{
                    textAlign: 'center',
                    fontSize: ['1.5em', '2.5em', '3em'],
                  }}
                >
                  Waiting on Bid from
                </h1>
                <h2
                  sx={{
                    textAlign: 'center',
                    fontSize: ['1em', '1.5em', '2em'],
                  }}
                >
                  Player {gameData.turn}
                </h2>
              </div>
            )
        } else {
          let lastCard = gameData.trickCards.pop()
          console.log('Played last card', gameData.trickCards)
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
        return <div className={`card back-red`} sx={{ fontSize: [3, 5, 6] }} />
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
    const spot = cardArr.join('')
    const playerCards = gameData.players[playerSeat].hand
    const cardsLeft = playerCards.filter((c) => c !== card)
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
          [`players.${playerSeat}.hand`]: cardsLeft,
        }
      } else {
        // tallyTrick() import from helpers/gameHelpers
        return {
          turn: nextPlayer,
          trickCards: firebase.firestore.FieldValue.arrayUnion(cardData),
        }
      }
    }
    gameRef.update(getUpdate())
  }

  const renderCards = () => {
    //    if (gameData) {
    const renderBlanks = () => {
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
    }

    const renderHand = () => {
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

    return (
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
        {playerSeat ? renderHand() : renderBlanks()}
      </div>
    )
    /*     } else {
      return <button onClick={startGame}>Start Game</button>
    } */
  }

  const fetchGame = () => {
    let unsubscribe
    unsubscribe = gameRef.onSnapshot((snap) => {
      if (!snap.exists) {
        console.log('No such Game!')
        setGameData(null)
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
              /*               '& :nth-of-type(even)': {
                backgroundColor: 'white',
              }, */
            }}
          >
            <div sx={{ alignSelf: 'center' }}>
              <Container sx={{ height: 'auto' }}>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />

            <Container sx={{ backgroundColor: 'green' }}>
              {roomData && renderTable()}
            </Container>

            <div sx={{ backgroundColor: 'white' }} />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />
            <div sx={{ alignSelf: 'center' }}>
              <Container>
                <FaUserSecret size='8em' />
              </Container>
            </div>
          </div>
        </main>

        <aside
          sx={{
            backgroundColor: 'green',
            height: '100%',
            minWidth: '375px',
            gridArea: 'aside',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {gameData ? (
            renderCards()
          ) : (
            <Container sx={{ height: '20%' }}>
              <Button variant='green' onClick={startGame}>
                Start New Game
              </Button>
            </Container>
          )}

          <Box
            p={2}
            bg='darkseagreen'
            sx={{
              flex: '1 1 auto',
              border: 'solid',
              borderWidth: 'medium',
              borderColor: 'indianred',
            }}
          >
            <Flex
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                p={1}
                mb={2}
                bg='white'
                sx={{
                  flex: '75%',
                  height: '75px',
                  border: 'solid',
                  borderWidth: 'medium',
                  borderColor: 'indianred',
                }}
              ></Box>
              <Box
                p={1}
                bg='white'
                sx={{
                  height: '75px',
                  border: 'solid',
                  borderWidth: 'medium',
                  borderColor: 'indianred',
                }}
              >
                <Container></Container>
              </Box>
            </Flex>
          </Box>
        </aside>
      </div>
    </RoomWrapper>
  )
}

export default RoomPage
