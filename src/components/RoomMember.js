/** @jsx jsx */
import { jsx } from 'theme-ui'
// import Participant from '../components/Participant'

export default ({
  roomData,
  playerSeat,
  memberPositions,
  memberPosition,
  username,
  turn,
  token,
  videoRoom,
  getParticipantComponent,
}) => {
  console.log(turn, username)
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
          border: `${turn ? '0.4em dotted indianred' : ''}`,
        }}
      />
    )
  }
}
