/** @jsx jsx */
import { jsx, Button, Container } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'

export const Main = ({
  user,
  userData,
  roomData,
  turn,
  positions,
  playerSeat,
  renderTable,
  joinRoom,
  history,
}) => {
  return (
    <main
      sx={{
        flex: 1,
        backgroundColor: 'darkseagreen',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
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
              <Button
                variant='flatgreen'
                onClick={() => history.push('/dashboard')}
              >
                Join an Open Room
              </Button>
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
    </main>
  )
}
