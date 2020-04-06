/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'
import '../css/cards.css'

const RoomPage = () => (
  <RoomWrapper>
    <div
      sx={{
        height: '100%',
        display: 'grid',
        gridGap: 1,
        gridTemplate: [
          `"main" auto
           "aside" auto
          / 100%`,
          `"main aside" auto
          / 65% 35%`,
          `"main aside" auto
          / 70% 30%`,
        ],
        backgroundColor: 'black',
        border: 'solid',
        borderColor: 'dodgerblue',
      }}
    >
      <main
        sx={{
          backgroundColor: 'red',
          gridArea: 'main',
        }}
      ></main>

      <aside
        sx={{
          backgroundColor: 'green',
          gridArea: 'aside',
        }}
      >
        <div
          sx={{
            backgroundColor: 'green',
            display: 'grid',
            gridGap: '1',
            gridTemplateColumns: [
              'repeat(6, 1fr)',
              'repeat(3, 1fr)',
              'repeat(auto-fit, null, minmax(150px, 1fr))',
            ],
            // repeat(3, 1fr) repeat(auto-fit, 150px)
          }}
        >
          {['♠A', '♠K', '♦A', '♣J', '♣06', '♥09'].map((card) => (
            <div
              sx={{
                backgroundColor: '#5C6AC4',
                display: 'grid',
                justifyContent: 'center',
                padding: '2px',
              }}
            >
              <div className={`card ${card}`} sx={{ fontSize: [1, 2, 3, 4] }} />
            </div>
          ))}
        </div>
        <div sx={{ backgroundColor: 'violet', height: '25%' }}></div>
        <div sx={{ backgroundColor: '#66ccff', height: '25%' }}></div>
      </aside>
    </div>
  </RoomWrapper>
)

export default RoomPage
