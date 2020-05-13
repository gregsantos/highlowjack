/** @jsx jsx */
import { jsx, Flex, Button, Container, Text } from 'theme-ui'
import { FaUserSecret, FaVideo } from 'react-icons/fa'
import Participant from '../components/Participant'
import RoomMember from '../components/RoomMember'

export const Main = ({
  user,
  userData,
  roomData,
  token,
  turn,
  positions,
  playerSeat,
  renderTable,
  joinRoom,
  joinVideo,
  videoRoom,
  participants,
  history,
}) => {
  const remoteParticipants = participants.map((participant) => (
    <Participant
      key={participant.sid}
      participant={participant}
      username={participant.identity}
    />
  ))

  const getParticipantNameByPosition = (pos) => {
    const participantSeat = roomData.memberProfiles[positions[pos].seat] || null
    return (
      roomData &&
      positions &&
      participantSeat &&
      (participantSeat.username || '')
    )
  }

  const getParticipantComponent = (pos) => {
    const participantComponent =
      remoteParticipants.find(
        (p) => p.props.username === getParticipantNameByPosition(pos)
      ) || null

    return participantComponent
  }

  return (
    <main
      sx={{
        gridArea: 'main',
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gridTemplateRows: [
          'repeat(3, minmax(0, 128px))',
          'repeat(3, minmax(0, 180px))',
          'repeat(3, minmax(0, 1fr))',
        ],
      }}
    >
      <div sx={{ backgroundColor: 'darkseagreen' }} />

      <Container>
        {playerSeat !== null &&
        positions &&
        roomData.memberProfiles[positions[2].seat] ? (
          <RoomMember
            roomData={roomData}
            memberPositions={positions}
            memberPosition={2}
            username={roomData.memberProfiles[positions[2].seat].username}
            turn={positions[2].seat === turn}
            token={token}
            videoRoom={videoRoom}
            getParticipantComponent={getParticipantComponent}
          />
        ) : (
          <FaUserSecret size='6em' />
        )}
      </Container>
      <div sx={{ backgroundColor: 'darkseagreen' }} />

      <Container>
        {playerSeat !== null &&
        positions &&
        roomData.memberProfiles[positions[1].seat] ? (
          <RoomMember
            roomData={roomData}
            memberPositions={positions}
            memberPosition={1}
            username={roomData.memberProfiles[positions[1].seat].username}
            turn={positions[1].seat === turn}
            token={token}
            videoRoom={videoRoom}
            getParticipantComponent={getParticipantComponent}
          />
        ) : (
          <FaUserSecret size='6em' />
        )}
      </Container>

      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'green',
          color: 'antiquewhite',
        }}
      >
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
              <Button
                variant='flatgreen'
                onClick={() => history.push('/dashboard')}
              >
                Join an Open Room
              </Button>
            </Container>
          </div>
        )}
      </Flex>

      <Container>
        {playerSeat !== null &&
        positions &&
        roomData.memberProfiles[positions[3].seat] ? (
          <RoomMember
            roomData={roomData}
            memberPositions={positions}
            memberPosition={3}
            username={roomData.memberProfiles[positions[3].seat].username}
            turn={positions[3].seat === turn}
            token={token}
            videoRoom={videoRoom}
            getParticipantComponent={getParticipantComponent}
          />
        ) : (
          <FaUserSecret size='6em' />
        )}
      </Container>
      <div sx={{ backgroundColor: 'darkseagreen' }} />

      <Container>
        {playerSeat === null && (
          <FaUserSecret size='6em' sx={{ color: 'antiquewhite' }} />
        )}
        {playerSeat !== null && token && videoRoom && (
          <Participant
            participant={videoRoom.localParticipant}
            turn={turn === playerSeat}
          />
        )}

        {playerSeat !== null && !token && user.photoURL && (
          <img
            alt='userPhoto'
            src={user.photoURL}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: `${
                turn === (positions && positions[0].seat)
                  ? '0.4em dotted indianred'
                  : ''
              }`,
            }}
          />
        )}
      </Container>
      <Container sx={{ backgroundColor: 'darkseagreen' }}>
        <FaVideo
          size={`2em`}
          sx={{ color: 'antiquewhite' }}
          onClick={joinVideo}
        />
      </Container>
    </main>
  )
}
