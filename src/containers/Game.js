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
        flexWrap: 'wrap',
        height: '100%',
        backgroundColor: 'black',
        border: 'solid',
        borderColor: 'dodgerblue',
      }}
    >
      <main
        sx={{
          backgroundColor: 'red',
          width: ['100%', '100%', '75%'],
        }}
      ></main>
      <aside
        sx={{
          backgroundColor: 'green',
          width: ['100%', '100%', '25%'],
        }}
      ></aside>
    </div>
  </RoomWrapper>
)

export default GamePage
