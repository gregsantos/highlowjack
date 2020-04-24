/** @jsx jsx */
import { jsx, Button, Select, Radio, Label } from 'theme-ui'
import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret, FaRegTimesCircle } from 'react-icons/fa'
import { RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import '../css/cards.css'
import initGame from '../helpers/initGame'
import { tallyTrick } from '../helpers/gameHelpers'
import { UserContext } from '../contexts/userContext'

const RoomPage = (props) => {
  // state session ish
  const user = useSession()
  const { userState, userDispatch } = useContext(UserContext)
  const { userData, userId } = userState
  const [roomData, setRoomData] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [playerSeat, setPlayerSeat] = useState(null)
  const [positions, setPositions] = useState(null)
  const [bidPoint, setBidPoint] = useState(0)
  const [bidSuit, setBidSuit] = useState('s')
  const isDealer = gameData && gameData.dealer === playerSeat
  const turn = gameData && gameData.turn
  const score = gameData && gameData.score
  // rout ish
  const { id } = useParams()
  const history = useHistory()
  // fb ish
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(user.uid)
  const roomRef = db.collection('roomDetail').doc(id)
  const gamesRef = db.collection('games')
  const gameRef = db.collection('games').doc(id)

  console.log('uid', userId, 'Seat: ', playerSeat, 'Turn', turn, 'Score', score)

  const joinRoom = () => {
    db.runTransaction((transaction) => {
      return transaction.get(roomRef).then((roomDoc) => {
        if (!roomDoc.exists) {
          throw new Error('Room does not exist!')
        }
        const members = roomDoc.data().members
        if (members.length <= 3) {
          const getUpdate = () => {
            const newState = members.length === 3 ? 'FULL' : 'OPEN'
            return {
              members: firebase.firestore.FieldValue.arrayUnion(user.uid),
              memberProfiles: firebase.firestore.FieldValue.arrayUnion({
                id: user.uid,
                username: userData.username,
                profilePic: user.photoURL ?? null,
              }),
              state: newState,
            }
          }
          transaction.update(roomRef, getUpdate())
          transaction.update(userRef, {
            userRooms: firebase.firestore.FieldValue.arrayUnion(roomDoc.id),
          })
          return members
        } else {
          return Promise.reject('Sorry! Room is already full.')
        }
      })
    })
      .then((members) => {
        console.log('User Joined Room with', members)
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
    console.log('Select Bid Point', parseInt(e.target.value))
    setBidPoint(parseInt(e.target.value))
  }

  const handleSelectSuit = (e) => {
    console.log('Select Bid Suit', e.target.value)
    setBidSuit(e.target.value)
  }

  const handlePass = () => {
    //const isDealer = playerSeat === gameData.dealer
    console.log('Is Dealer?', isDealer)
    const nextPlayer = gameData.turn === 3 ? 0 : gameData.turn + 1
    if (isDealer) {
      gameRef.update({
        leader: gameData.bid.bidder,
        turn: gameData.bid.bidder,
        trick: 1,
      })
    } else {
      gameRef.update({
        turn: nextPlayer,
      })
    }
  }

  const handleSubmitBid = (e) => {
    e.preventDefault()
    const nextPlayer = gameData.turn === 3 ? 0 : gameData.turn + 1
    const dealer = gameData.dealer
    const currentBid = gameData.bid.bid
    const currentBidder = gameData.bid.bidder

    const newBid = {
      bidder: playerSeat,
      bid: bidPoint,
      suit: bidSuit,
    }

    if (playerSeat === dealer) {
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
                      disabled={currentBid >= 2 && isDealer}
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
                  </Container>
                </form>
                <Container>
                  <Button
                    disabled={
                      playerSeat === gameData.dealer && currentBid === 0
                    }
                    onClick={handlePass}
                    variant='bidgroup'
                  >
                    Pass
                  </Button>
                </Container>
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
          return <div className={`card outline`} sx={{ fontSize: [3, 5, 6] }} />
        }
        if (!newTrick) {
          var randomN = Math.floor(Math.random() * 8) - 8
          return (
            <div
              className={`card ${
                lastCard.suit + lastCard.spot
              } shadow no-border`}
              sx={{
                fontSize: [3, 5, 6],
                transform: `rotateZ(${randomN}deg)`,
              }}
            />
          )
        }
      }
    } else {
      return <div className={`card back-red`} sx={{ fontSize: [3, 5, 6] }} />
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
          console.log('Last trick card played and updated!', newTrickCards)
          tallyTrick(roomData.members, gameRef)
        })
        .catch((error) => {
          console.error('Error updating Trick: ', error)
        })
    }
  }

  const renderCards = () => {
    const renderHand = () => {
      const seat = roomData.members.includes(user.uid) ? playerSeat : 0
      const playerHand = gameData.players[seat].hand
      return playerSeat !== null
        ? [
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
              {card !== 'outline' &&
                gameData.trick !== 0 &&
                gameData.turn === playerSeat && (
                  <Button variant='card' onClick={() => playCard(i, card)}>
                    <FaRegTimesCircle />
                  </Button>
                )}
            </div>
          ))
        : null
    }

    if (playerSeat !== null) {
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
    } else {
      return (
        <div
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h2 sx={{ color: 'muted' }}>Sorry, there are no seats available</h2>
        </div>
      )
    }
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

  // fetch room effect
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
          // set room state
          setRoomData({ ...data, id: snap.id })
          // set player seat
          const playerSeatIndex = data.members.findIndex((m) => m === user.uid)
          const playerSeat = playerSeatIndex !== -1 ? playerSeatIndex : null
          setPlayerSeat(playerSeat)
          // set playerPositions
          const membersBySeat = [
            ...data.members,
            ...Array.from({ length: 4 - data.members.length }, () => null),
          ]
          const getPositions = () => {
            if (playerSeat === 3) {
              return membersBySeat
            }
            if (playerSeat === null && data.members.length < 4) {
              const membersBySeatIfJoin = [user.uid, ...data.members]
              //membersBySeat.push(user.uid)
              let positionsIfJoin = [
                ...membersBySeatIfJoin,
                ...Array.from(
                  { length: 4 - membersBySeatIfJoin.length },
                  () => null
                ),
              ]
              return positionsIfJoin
            } else {
              const seatsAfter = membersBySeat.splice(playerSeat)
              return [...seatsAfter, ...membersBySeat]
            }
          }

          const positions = getPositions().map((p, i) => ({
            seat: data.members.findIndex((m) => m === p),
            uid: p,
          }))
          setPositions(positions)
          console.log('Position Map', positions, 'User', user) //mark
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
            }}
          >
            <div
              sx={{
                alignSelf: 'center',
                paddingTop: ['10px', '15px', null],
                backgroundColor: `${
                  turn === (positions && positions[1].seat) && '#daa520'
                }`,
              }}
            >
              <Container>
                {positions &&
                roomData.memberProfiles[positions[1].seat] &&
                roomData.memberProfiles[positions[1].seat].profilePic ? (
                  <img
                    alt='userPhoto'
                    src={roomData.memberProfiles[positions[1].seat].profilePic}
                    sx={{ width: ['65px', '100px', '125px'] }}
                  />
                ) : (
                  <FaUserSecret size='6em' />
                )}
              </Container>
              <Container>
                <h3 sx={{ mt: ['2px', '10px'] }}>
                  {(positions &&
                    roomData.memberProfiles[positions[1].seat] &&
                    roomData.memberProfiles[positions[1].seat].username) ||
                    'Position 1'}
                </h3>
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />
            <div
              sx={{
                alignSelf: 'center',
                paddingTop: ['10px', '15px', null],
                backgroundColor: `${
                  turn === (positions && positions[2].seat) && '#daa520'
                }`,
              }}
            >
              <Container>
                {positions &&
                roomData.memberProfiles[positions[2].seat] &&
                roomData.memberProfiles[positions[2].seat].profilePic ? (
                  <img
                    alt='userPhoto'
                    src={roomData.memberProfiles[positions[2].seat].profilePic}
                    sx={{ width: ['65px', '100px', '125px'] }}
                  />
                ) : (
                  <FaUserSecret size='6em' />
                )}
              </Container>
              <Container>
                <h3 sx={{ mt: ['2px', '10px'] }}>
                  {(positions &&
                    roomData.memberProfiles[positions[2].seat] &&
                    roomData.memberProfiles[positions[2].seat].username) ||
                    'Position 2'}
                </h3>
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />

            <Container sx={{ backgroundColor: 'green' }}>
              {roomData && playerSeat !== null && renderTable()}
              {roomData && roomData.state !== 'FULL' && playerSeat === null && (
                <div>
                  <Container>
                    <div
                      sx={{
                        fontSize: ['1em', '1.5em', null],
                        color: 'muted',
                      }}
                    >
                      There's an Open Seat!
                    </div>
                  </Container>

                  <Container>
                    <Button variant='flatgreen' onClick={joinRoom}>
                      Join Room
                    </Button>
                  </Container>
                </div>
              )}
              {roomData && roomData.state === 'FULL' && playerSeat === null && (
                <div>
                  <Container sx={{ color: 'muted' }}>
                    <h2>This Room is Full</h2>
                  </Container>

                  <Container>
                    <button onClick={() => history.push('/dashboard')}>
                      Join an Open Room
                    </button>
                  </Container>
                </div>
              )}
            </Container>

            <div sx={{ backgroundColor: 'white' }} />
            <div
              sx={{
                alignSelf: 'center',
                paddingTop: ['10px', '15px', null],
                backgroundColor: `${
                  turn === (positions && positions[0].seat) && '#daa520'
                }`,
              }}
            >
              <Container>
                {playerSeat === null && <FaUserSecret size='6em' />}
                {playerSeat !== null && user.photoURL && (
                  <img
                    alt='userPhoto'
                    src={user.photoURL}
                    sx={{ width: ['65px', '100px', '125px'] }}
                  />
                )}
              </Container>
              <Container>
                <h3 sx={{ mt: ['2px', '10px'] }}>
                  {playerSeat === null ? 'Open Seat' : userData.username}
                </h3>
              </Container>
            </div>
            <div sx={{ backgroundColor: 'white' }} />
            <div
              sx={{
                alignSelf: 'center',
                paddingTop: ['10px', '15px', null],
                backgroundColor: `${
                  turn === (positions && positions[3].seat) && '#daa520'
                }`,
              }}
            >
              <Container>
                {positions &&
                roomData.memberProfiles[positions[3].seat] &&
                roomData.memberProfiles[positions[3].seat].profilePic ? (
                  <img
                    alt='userPhoto'
                    src={roomData.memberProfiles[positions[3].seat].profilePic}
                    sx={{ width: ['65px', '100px', '125px'] }}
                  />
                ) : (
                  <FaUserSecret size='6em' />
                )}
              </Container>
              <Container>
                <h3 sx={{ mt: ['2px', '10px'] }}>
                  {(positions &&
                    roomData.memberProfiles[positions[3].seat] &&
                    roomData.memberProfiles[positions[3].seat].username) ||
                    'Position 3'}
                </h3>
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
          {gameData && playerSeat !== null ? (
            renderCards()
          ) : (
            <Container sx={{ height: '20%' }}>
              {roomData && roomData.state !== 'FULL' && playerSeat === null && (
                <div>
                  <Container>
                    <div
                      sx={{
                        fontSize: ['1em', '1.5em', null],
                        color: 'muted',
                      }}
                    >
                      There's an Open Seat!
                    </div>
                  </Container>
                </div>
              )}
              {roomData && roomData.state !== 'FULL' && playerSeat !== null && (
                <Button
                  variant='green'
                  onClick={() => console.log('Show Room Link')}
                >
                  Invite friends to start a game
                </Button>
              )}
              {roomData && roomData.state === 'FULL' && playerSeat === null && (
                <div
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <h2 sx={{ color: 'muted' }}>
                    Sorry, there are no seats available
                  </h2>
                </div>
              )}
              {roomData && roomData.state === 'FULL' && playerSeat !== null && (
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
