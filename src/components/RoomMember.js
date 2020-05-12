/** @jsx jsx */
import { jsx, Flex, Button, Container, Text } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import Participant from '../components/Participant'

export default ({
  roomData,
  playerSeat,
  memberPositions,
  memberPosition,
  turn,
  token,
  videoRoom,
  getParticipantComponent,
}) => {
  if (videoRoom && token && getParticipantComponent(memberPosition)) {
    return getParticipantComponent(memberPosition)
  } else {
    return (
      <img
        alt='userPhoto'
        src={
          roomData.memberProfiles[memberPositions[memberPosition].seat]
            .profilePic
        }
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          border: `${
            turn === (memberPositions && memberPositions[memberPosition].seat)
              ? '0.30em dotted indianred'
              : ''
          }`,
        }}
      />
    )
  }
}
