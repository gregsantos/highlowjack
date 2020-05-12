/** @jsx jsx */
import { jsx, Flex, Button, Container, Text } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import Participant from '../components/Participant'

export const RoomMember = ({
  roomData,
  playerSeat,
  turn,
  positions,
  token,
  videoRoom,
  getParticipantComponent,
}) => {
  return (
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
  )
}
