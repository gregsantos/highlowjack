/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container, Flex, Box } from 'theme-ui'
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
          flexGrow: 99999,
          flexBasis: 0,
          minWidth: 769,
          backgroundColor: 'red',
        }}
      ></main>
      <aside
        sx={{
          flexGrow: 1,
          flexBasis: 'sidebar',
          backgroundColor: 'green',
        }}
      >
        <Container>
          <div>
            {['♠A', '♠K', '♦A', '♣J', '♣06', '♥09'].map((card) => (
              <div
                className={`card ${card}`}
                sx={{ fontSize: [1, 2, 3, 4] }}
              ></div>
            ))}
          </div>
        </Container>
      </aside>
    </div>
  </RoomWrapper>
)

export default GamePage
