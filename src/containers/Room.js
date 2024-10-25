/** @jsx jsx */
import {
  jsx,
  Container,
  Flex,
  Grid,
  Button,
  Select,
  Radio,
  Label,
} from 'theme-ui'
import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Video from 'twilio-video'
import { RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import initGame from '../helpers/initGame'
import { tallyTrick, getSuit } from '../helpers/gameHelpers'
import { UserContext } from '../contexts/userContext'
import { Main } from '../components/Main'
import { InfoBox } from '../components/InfoBox'
import { ChatBox } from '../components/ChatBox'
import { HandBox } from '../components/HandBox'
import { getToken } from '../helpers/cloudFunctions'
import '../css/cards.css'
import '../css/button-group.css'
import { ButtonWrapper, RadioButton } from '../components/ButtonGroup'

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
  const [bidSuit, setBidSuit] = useState('')
  const isDealer = gameData && gameData.dealer === playerSeat
  const turn = gameData && gameData.turn
  // ui ish
  const [checked, setChecked] = useState('1')

  // video
  const [token, setToken] = useState(null)
  const [videoRoom, setVideoRoom] = useState(null)
  const [participants, setParticipants] = useState([])

  // rout ish
  const { id } = useParams()
  const history = useHistory()
  // fb ish
  const db = firebase.firestore()
  const userRef = db.collection('users').doc(user.uid)
  const roomRef = db.collection('roomDetail').doc(id)
  const gamesRef = db.collection('games')
  const gameRef = db.collection('games').doc(id)

  const joinVideo = async () => {
    const accessToken = await getToken({
      roomId: id,
      username: userData.username,
    })
    setToken(accessToken.data)

    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant])
    }
    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      )
    }
    Video.connect(accessToken.data, {
      name: id,
    }).then((room) => {
      setVideoRoom(room)
      room.on('participantConnected', participantConnected)
      room.on('participantDisconnected', participantDisconnected)
      room.participants.forEach(participantConnected)
    })
  }

  const disconnectVideo = () => {
    setVideoRoom((currentRoom) => {
      if (currentRoom && currentRoom.localParticipant.state === 'connected') {
        currentRoom.localParticipant.tracks.forEach(function (
          trackPublication
        ) {
          trackPublication.track.stop()
        })
        currentRoom.disconnect()
        return null
      } else {
        return currentRoom
      }
    })
  }

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
    const gameData = initGame(roomData.memberProfiles)
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
    console.log(e.target.value)
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
      // get the leaders position
      const positionIndex = positions.findIndex(
        (x) => x.seat === gameData.leader
      )

      if (gameData.trick === 0) {
        // Bid Round
        if (playerTurn)
          return (
            <Flex
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 1,
                fontSize: ['.7em', '1.25em', 2],
              }}
            >
              <div
                className='stvRadioButtonsWrapper'
                onChange={handleSelectBid}
                id='bidPointSelect'
                sx={{ mt: 2 }}
              >
                <input
                  type='radio'
                  id='button1'
                  value='2'
                  checked={bidPoint === 2}
                  disabled={currentBid >= 2 && !isDealer}
                  className='stvRadioButton'
                />
                <label for='button1'>2</label>
                <input
                  type='radio'
                  id='button2'
                  value='3'
                  checked={bidPoint === 3}
                  disabled={currentBid >= 3 && !isDealer}
                  className='stvRadioButton'
                />
                <label for='button2'>3</label>
                <input
                  type='radio'
                  id='button3'
                  value='4'
                  checked={bidPoint === 4}
                  disabled={currentBid === 4 && !isDealer}
                  className='stvRadioButton'
                />
                <label for='button3'>4</label>
              </div>
              <div
                className='stvRadioButtonsWrapper'
                id='bidSuitSelect'
                onChange={handleSelectSuit}
                sx={{ mt: [1, 3, 3], mb: [2, 4, 4] }}
              >
                <input
                  type='radio'
                  id='spadeButton'
                  value='s'
                  checked={bidSuit === 's'}
                  className='stvRadioButton black'
                />
                <label for='spadeButton'>♠</label>
                <input
                  type='radio'
                  id='clubButton'
                  value='c'
                  checked={bidSuit === 'c'}
                  className='stvRadioButton black'
                />
                <label for='clubButton'>♣</label>
                <input
                  type='radio'
                  id='heartButton'
                  value='h'
                  checked={bidSuit === 'h'}
                  className='stvRadioButton red'
                />
                <label for='heartButton'>♥</label>
                <input
                  type='radio'
                  id='diamondButton'
                  value='d'
                  checked={bidSuit === 'd'}
                  className='stvRadioButton red'
                />
                <label for='diamondButton'>♦</label>
              </div>

              <Container>
                <form onSubmit={handleSubmitBid}>
                  <Button type='submit' variant='bidgroup'>
                    Bid
                  </Button>
                </form>
                <Button
                  disabled={playerSeat === gameData.dealer && currentBid === 0}
                  onClick={handlePass}
                  variant='bidgroup'
                >
                  Pass
                </Button>
              </Container>
            </Flex>
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
                  p: 1,
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
                {gameData &&
                  (gameData.players[gameData.turn].username ??
                    `Player ${turn + 1}`)}
              </h2>
            </div>
          )
      } else {
        if (newTrick) {
          return <div className={`card outline`} sx={{ fontSize: [1, 4, 5] }} />
        }
        if (!newTrick) {
          // let randomN = Math.floor(Math.random() * 8) - 8
          const playedCards = gameData.trickCards.map((card, i) => {
            return (
              <div
                sx={{
                  transform: `rotateZ(${90 * (positionIndex + i)}deg) `,
                  gridColumn: '1 / span 8',
                  gridRow: 1, // must be on the same row as the other image
                  paddingTop: ['44px', '62px', '95px'], // this pushes the image down, and keeps it proportional as it resizes
                  zIndex: 1, // make this image render on top of the bottom
                }}
              >
                <div
                  className={`card ${card.suit + card.spot} shadow no-border`}
                  sx={{
                    fontSize: [1, 2, 5],
                  }}
                />
              </div>
            )
          })
          return (
            <Container sx={{ pl: ['24%', '38px', '62px'] }}>
              <div
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  position: 'relative',
                }}
              >
                {playedCards}
              </div>
            </Container>
          )
        }
      }
    } else {
      return <div className={`card back-red`} sx={{ fontSize: [3, 3, 6] }} />
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
          setTimeout(() => {
            tallyTrick(roomData.memberProfiles, gameRef)
          }, 3000)
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
            if (playerSeat === null && data.members.length < 4) {
              const membersBySeatIfJoin = [user.uid, ...data.members]
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
        disconnectVideo()
        console.log(user.uid, 'left room')
      }
    } else {
      console.log('no logged in user')
    }
  }, [user])

  return (
    <RoomWrapper>
      <Grid
        sx={{
          height: '100%',
          gridGap: 0,
          gridTemplate: [
            `
          "main" 1fr
          "hand" 1fr
          "info" 1fr
          "chat" 1fr
          / 100%;
          `,
            `
          "main" 1fr
          "hand" 1fr
          "info" 1fr
          "chat" 100px
          / 100%;
          `,
            `
          "main hand" 1fr
          "main info" 1fr
          "main chat" 1fr
          / 1fr 400px;
          `,
          ],
        }}
      >
        <Main
          user={user}
          userData={userData}
          roomData={roomData}
          token={token}
          turn={turn}
          positions={positions}
          playerSeat={playerSeat}
          renderTable={renderTable}
          joinRoom={joinRoom}
          joinVideo={joinVideo}
          videoRoom={videoRoom}
          participants={participants}
          history={history}
        />
        <HandBox
          user={user}
          roomData={roomData}
          gameData={gameData}
          playerSeat={playerSeat}
          startGame={startGame}
          playCard={playCard}
        />
        {!gameData && (
          <Flex
            sx={{
              gridArea: 'info',
              flexDirection: ['row', 'row', 'column'],
              p: 2,
              border: 'thin solid indianred',
              borderBottom: 'none',
            }}
          />
        )}

        {gameData && <InfoBox gameData={gameData} getSuit={getSuit} />}
        <ChatBox />
      </Grid>
    </RoomWrapper>
  )
}

export default RoomPage
