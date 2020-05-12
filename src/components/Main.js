/** @jsx jsx */
import { jsx, Flex, Button, Container, Text } from 'theme-ui'
import { FaUserSecret, FaVideo } from 'react-icons/fa'
import Participant from '../components/Participant'

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
    console.log('Participant Seat', participantSeat)
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
    console.log('Participant Component', participantComponent)

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
          token &&
          videoRoom &&
          getParticipantComponent(2)}
        {positions &&
        !getParticipantComponent(2) &&
        roomData.memberProfiles[positions[2].seat] &&
        roomData.memberProfiles[positions[2].seat].profilePic ? (
          <img
            alt='userPhoto'
            src={roomData.memberProfiles[positions[2].seat].profilePic}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: [
                `${
                  turn === (positions && positions[2].seat)
                    ? '0.30em dotted indianred'
                    : ''
                }`,
                `${
                  turn === (positions && positions[2].seat)
                    ? '0.5em dotted indianred'
                    : ''
                }`,
                null,
              ],
            }}
          />
        ) : (
          !getParticipantComponent(2) && <FaUserSecret size='6em' />
        )}
      </Container>
      <div sx={{ backgroundColor: 'darkseagreen' }} />

      <Container sx={{ backgroundColor: 'antiquewhite' }}>
        {playerSeat !== null &&
          positions &&
          token &&
          videoRoom &&
          getParticipantComponent(1)}
        {positions &&
        !getParticipantComponent(1) &&
        roomData.memberProfiles[positions[1].seat] &&
        roomData.memberProfiles[positions[1].seat].profilePic ? (
          <img
            alt='userPhoto'
            src={roomData.memberProfiles[positions[1].seat].profilePic}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: [
                `${
                  turn === (positions && positions[1].seat)
                    ? '0.30em dotted indianred'
                    : ''
                }`,
                `${
                  turn === (positions && positions[1].seat)
                    ? '0.5em dotted indianred'
                    : ''
                }`,
                null,
              ],
            }}
          />
        ) : (
          !getParticipantComponent(1) && <FaUserSecret size='6em' />
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

      <Container sx={{ backgroundColor: 'antiquewhite' }}>
        {playerSeat !== null &&
          positions &&
          token &&
          videoRoom &&
          getParticipantComponent(3)}
        {positions &&
        !getParticipantComponent(3) &&
        roomData.memberProfiles[positions[3].seat] &&
        roomData.memberProfiles[positions[3].seat].profilePic ? (
          <img
            alt='userPhoto'
            src={roomData.memberProfiles[positions[3].seat].profilePic}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: [
                `${
                  turn === (positions && positions[3].seat)
                    ? '0.30em dotted indianred'
                    : ''
                }`,
                `${
                  turn === (positions && positions[3].seat)
                    ? '0.5em dotted indianred'
                    : ''
                }`,
                null,
              ],
            }}
          />
        ) : (
          !getParticipantComponent(3) && <FaUserSecret size='6em' />
        )}
      </Container>
      <div sx={{ backgroundColor: 'darkseagreen' }} />

      <Container>
        {playerSeat === null && (
          <FaUserSecret size='6em' sx={{ color: 'antiquewhite' }} />
        )}
        {playerSeat !== null && token && videoRoom && (
          <Participant participant={videoRoom.localParticipant} />
        )}

        {playerSeat !== null && !token && user.photoURL && (
          <img
            alt='userPhoto'
            src={user.photoURL}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              border: [
                `${
                  turn === (positions && positions[0].seat)
                    ? '0.30em dotted indianred'
                    : ''
                }`,
                `${
                  turn === (positions && positions[0].seat)
                    ? '0.5em dotted indianred'
                    : ''
                }`,
                null,
              ],
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
