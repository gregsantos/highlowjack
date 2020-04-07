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
          `"main" 100vw
           "aside" auto
          / 100%`,
          `"main" 55%
           "aside" auto
          / 100%`,
          `"main aside" auto
          / minmax(60%, 1fr) minmax(410px, 525px)`,
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
          backgroundColor: '#5C6AC4',
          gridArea: 'aside',
          minWidth: '378px',
        }}
      >
        <div
          sx={{
            backgroundColor: 'green',
            padding: '10px 0px',
            display: 'grid',
            justifyContent: 'center',
            gridGap: '1',
            gridTemplateColumns: [
              'repeat(auto-fit, 59px)',
              'repeat(6, minmax(80px, 1fr))',
              'repeat(3, minmax(92px, 1fr))',
            ],
          }}
        >
          {['♠A', '♠K', '♦A', '♣J', '♣06', '♥09'].map((card) => (
            <div
              sx={{
                backgroundColor: 'green',
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
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
