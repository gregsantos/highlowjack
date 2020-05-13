/** @jsx jsx */
import { jsx } from 'theme-ui'
import Participant from './Participant'

export default ({
  roomData,
  playerSeat,
  memberPositions,
  memberPosition,
  username,
  turn,
  token,
  videoRoom,
  participants,
}) => {
  const connectedMember = participants.find((p) => p.identity === username)
  if (connectedMember) {
    return (
      <Participant
        key={connectedMember.sid}
        participant={connectedMember}
        username={connectedMember.identity}
        turn={turn}
      />
    )
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
