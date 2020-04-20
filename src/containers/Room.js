/** @jsx jsx */
import { jsx, Button, Select, Radio, Label } from 'theme-ui'
import React, { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret, FaDiscourse } from 'react-icons/fa'
import { P, H1, Input, Form, RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import '../css/cards.css'
import initGame from '../helpers/initGame'
import { tallyTrick } from '../helpers/gameHelpers'

const RoomPage = (props) => {
  const user = useSession()
  const [roomData, setRoomData] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [playerSeat, setPlayerSeat] = useState(-1)
  const [bidPoint, setBidPoint] = useState(0)
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
            const newState = members.length === 3 ? 'FULL' : 'OPEN'
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
    setBidPoint(e.target.value)
  }

  const handleSelectSuit = (e) => {
    setBidSuit(e.target.value)
  }

  const handleSubmitBid = (e) => {
    e.preventDefault()
    const nextPlayer = gameData.turn === 3 ? 0 : gameData.turn + 1
    const dealer = gameData.dealer
    const playerTurn = gameData.turn
    const currentBid = gameData.bid.bid
    const currentBidder = gameData.bid.bidder
    const newBid = {
      bidder: playerTurn,
      bid: bidPoint,
      suit: bidSuit,
    }
    if (playerTurn === dealer) {
      if (bidPoint >= currentBid) {
        gameRef.update({
          bid: newBid,
          leader: dealer,
          turn: dealer,
          trick: 1,
        })
      } else {
        gameRef.update({
          leader: currentBidder,
          turn: currentBidder,
          trick: 1,
        })
      }
    } else {
      if (bidPoint > currentBid) {
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
    const roomMember = roomData
      ? roomData.members.includes(user.uid) || false
      : false

    if (roomMember) {
      if (gameData) {
        const playerTurn = gameData.turn === playerSeat
        const currentBid = gameData.bid.bid
        const newTrick = gameData.newTrick
        const lastCard = gameData.lastCard

        if (gameData.trick === 0) {
          // Bid Round
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
                    <Label>
                      <Radio
                        type='radio'
                        value={2}
                        checked={bidPoint === 2}
                        onChange={handleSelectBid}
                        defaultChecked={currentBid === 0}
                      />
                      2
                    </Label>
                    <Label>
                      <Radio
                        type='radio'
                        value={3}
                        checked={bidPoint === 3}
                        onChange={handleSelectBid}
                        defaultChecked={currentBid === 2}
                      />
                      3
                    </Label>
                    <Label>
                      <Radio
                        type='radio'
                        value={4}
                        checked={bidPoint === 4}
                        onChange={handleSelectBid}
                        defaultChecked={currentBid === 3}
                      />
                      4
                    </Label>
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
                  Player {gameData.turn + 1}
                </h2>
              </div>
            )
        } else {
          if (newTrick) {
            return (
              <div className={`card outline`} sx={{ fontSize: [3, 5, 6] }} />
            )
          }
          if (!newTrick) {
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
          }
        }
      } else {
        return <div className={`card back-red`} sx={{ fontSize: [3, 5, 6] }} />
      }
    } else {
      return (
        roomData.state !== 'FULL' && (
          <button onClick={joinRoom}>Join Room</button>
        )
      )
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
    const newTrickCards = [...gameData.trickCards, cardData]
    if (!lastPlayer) {
      // remove played card from hand, add to trick & advance turn
      const update = {
        turn: nextPlayer,
        lastCard: cardData,
        newTrick: false,
        trickCards: newTrickCards,
        [`players.${playerSeat}.hand`]: cardsLeft,
      }
      gameRef.update(update)
    } else {
      // remove played card from hand, add to trick & tally trick
      gameRef
        .update({
          lastCard: cardData,
          trickCards: newTrickCards,
          [`players.${playerSeat}.hand`]: cardsLeft,
        })
        .then(() => {
          console.log('Last Trick Played and updated!')
          tallyTrick(roomData.members, gameRef)
        })
        .catch((error) => {
          console.error('Error updating Trick: ', error)
        })
    }
  }

  const renderCards = () => {
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
      return [
        ...playerHand,
        ...Array.from({ length: 6 - playerHand.length }, () => 'outline'),
      ].map((card, i) => (
        <div
          key={i}
          sx={{
            backgroundColor: 'green',
            display: 'grid',
            justifyContent: 'center',
          }}
        >
          <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
          {gameData.trick !== 0 && gameData.turn === playerSeat && (
            <button onClick={() => playCard(i, card)}>X</button>
          )}
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
        {renderHand()}
      </div>
    )
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
        console.log('Game Data Updated: ', data)
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
        if (!snap.exists) {
          console.log('No such Room!')
        } else {
          const data = snap.data()
          // fetchGame
          unsubscribeGame = fetchGame()
          // set player seat
          let playerSeat = data.members
            ? data.members.findIndex((m) => m === user.uid)
            : -1
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
        }
      })
      return () => {
        unsubscribe()
        unsubscribeGame()
        console.log(user.uid, 'left room')
      }
    } else {
      console.log('no logged in user')
    }
  }, [])

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
              {roomData && roomData.members.length === 4 && (
                <Button variant='green' onClick={startGame}>
                  Start New Game
                </Button>
              )}
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
