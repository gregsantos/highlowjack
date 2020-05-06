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
  history,
}) => {
  return (
    <main
      sx={{
        flex: 1,
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
      }}
    >
      <div sx={{ backgroundColor: 'darkseagreen' }} />
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: ['10px', '15px', null],
        }}
      >
        <Container>
          {positions &&
          roomData.memberProfiles[positions[2].seat] &&
          roomData.memberProfiles[positions[2].seat].profilePic ? (
            <img
              alt='userPhoto'
              src={roomData.memberProfiles[positions[2].seat].profilePic}
              sx={{
                width: ['65px', '100px', '125px'],
                padding: ['0.25em', '0.5em'],
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
      </Flex>
      <div sx={{ backgroundColor: 'darkseagreen' }} />
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: ['10px', '15px', null],
          backgroundColor: 'antiquewhite',
        }}
      >
        <Container>
          {positions &&
          roomData.memberProfiles[positions[1].seat] &&
          roomData.memberProfiles[positions[1].seat].profilePic ? (
            <img
              alt='userPhoto'
              src={roomData.memberProfiles[positions[1].seat].profilePic}
              sx={{
                width: ['65px', '100px', '125px'],
                padding: ['0.25em', '0.5em'],
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
      </Flex>
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
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: ['10px', '15px', null],
          backgroundColor: 'antiquewhite',
        }}
      >
        <Container>
          {positions &&
          roomData.memberProfiles[positions[3].seat] &&
          roomData.memberProfiles[positions[3].seat].profilePic ? (
            <img
              alt='userPhoto'
              src={roomData.memberProfiles[positions[3].seat].profilePic}
              sx={{
                width: ['65px', '100px', '125px'],
                padding: ['0.25em', '0.5em'],
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
            <FaUserSecret size='6em' />
          )}
        </Container>
        <Container>
          <h3>
            {(positions &&
              roomData.memberProfiles[positions[3].seat] &&
              roomData.memberProfiles[positions[3].seat].username) ||
              'Position 3'}
          </h3>
        </Container>
      </Flex>
      <div sx={{ backgroundColor: 'darkseagreen' }} />
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: ['10px', '15px', null],
        }}
      >
        <Container>
          {playerSeat === null && <FaUserSecret size='6em' />}
          {playerSeat !== null && token && videoRoom && (
            <Container>
              <Participant participant={videoRoom.localParticipant} />
            </Container>
          )}

          {playerSeat !== null && !token && user.photoURL && (
            <img
              alt='userPhoto'
              src={user.photoURL}
              sx={{
                width: ['65px', '100px', '125px'],
                padding: ['0.25em', '0.5em'],
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
        <Container>
          <Text>{playerSeat === null ? 'Open Seat' : userData.username}</Text>
          <FaVideo sx={{ ml: 2, mb: 1 }} onClick={joinVideo} />
        </Container>
      </Flex>
      <div sx={{ backgroundColor: 'darkseagreen' }} />
    </main>
  )
}
