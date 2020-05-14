/** @jsx jsx */
import { jsx } from 'theme-ui'
import Participant from './Participant'

export default ({ profilePic, username, turn, participants }) => {
  const connectedMember = participants.find((p) => p.identity === username)

  console.log('Hi', participants, username, connectedMember)

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
        src={profilePic}
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
