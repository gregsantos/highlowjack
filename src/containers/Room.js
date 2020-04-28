/** @jsx jsx */
import {
  jsx,
  Container,
  Flex,
  Box,
  Button,
  Select,
  Radio,
  Label,
} from 'theme-ui'
import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import initGame from '../helpers/initGame'
import { tallyTrick, getSuit } from '../helpers/gameHelpers'
import { UserContext } from '../contexts/userContext'
import { Main } from '../components/Main'
import { Secondary } from '../components/Secondary'
import '../css/cards.css'

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

  // rout ish
  const { id } = useParams()
  const history = useHistory()
  // fb ish
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(user.uid)
  const roomRef = db.collection('roomDetail').doc(id)
  const gamesRef = db.collection('games')
  const gameRef = db.collection('games').doc(id)

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
    setBidPoint(parseInt(e.target.value))
  }

  const handleSelectSuit = (e) => {
    setBidSuit(e.target.value)
  }

  const handlePass = () => {
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
          tallyTrick(roomData.members, gameRef)
        })
        .catch((error) => {
          console.error('Error updating Trick: ', error)
        })
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

  // fetch room
  useEffect(() => {
    let unsubscribe
    let unsubscribeGame = () => {}
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
      <Flex
        sx={{
          height: '100%',
          flexDirection: ['column', 'column', 'row'],
        }}
      >
        <Main
          user={user}
          userData={userData}
          roomData={roomData}
          turn={turn}
          positions={positions}
          playerSeat={playerSeat}
          renderTable={renderTable}
          joinRoom={joinRoom}
          history={history}
        />
        <Secondary
          user={user}
          roomData={roomData}
          gameData={gameData}
          playerSeat={playerSeat}
          startGame={startGame}
          playCard={playCard}
          getSuit={getSuit}
        />
      </Flex>
    </RoomWrapper>
  )
}

export default RoomPage
