/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { RoomWrapper } from '../components'
import '../css/cards.css'

const GamePage = () => (
  <RoomWrapper>
    <div
      sx={{
        display: 'flex',
        flexDirection: ['column', 'column', 'row', 'row'],
        height: '100%',
        backgroundColor: 'black',
        border: 'solid',
        borderColor: 'dodgerblue',
      }}
    >
      <main
        sx={{
          backgroundColor: 'red',
          height: ['100vw', '100vw', '100%', '100%'],
          width: ['100%', '100%', '70%', '75%'],
        }}
      ></main>
      <aside
        sx={{
          backgroundColor: 'blue',
          height: ['100vw', '80vw', '100%', '100%'],
          flexGrow: '1',
        }}
      ></aside>
    </div>
  </RoomWrapper>
)

export default GamePage
