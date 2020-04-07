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
        gridGap: 0,
        gridTemplate: [
          `"main" 100vw
           "aside" auto
          / 100%`,
          `"main" 65%
           "aside" auto
          / 100%`,
          `"main aside" auto
          / minmax(60%, 1fr) minmax(410px, 555px)`,
        ],
      }}
    >
      <main
        sx={{
          backgroundColor: '#63B3ED',
          gridArea: 'main',
        }}
      >
        <div
          sx={{
            backgroundColor: 'darkseagreen',
            height: '100%',
            display: 'grid',
            gridGap: 0,
            gridTemplateColumns: [
              '1fr minmax(auto, 1.2fr) 1fr',
              null,
              '1fr minmax(auto, 1.2fr) 1fr',
            ],
            gridTemplateRows: [
              '1fr 1fr 1fr',
              null,
              '1fr minmax(auto, 1.2fr) 1fr',
            ],
            '& :nth-child(even)': {
              backgroundColor: 'white',
            },
          }}
        >
          <div sx={{ alignSelf: 'center' }}>
            <Container sx={{ height: 'auto' }}>
              <FaUserSecret size='8em' />
            </Container>
          </div>
          <div />
          <div sx={{ alignSelf: 'center' }}>
            <Container>
              <FaUserSecret size='8em' />
            </Container>
          </div>
          <div />
          <Container sx={{ backgroundColor: 'green' }}>
            <div
              className='card hA shadow no-border'
              sx={{
                fontSize: [3, 5, 6],
              }}
            />
          </Container>
          <div />
          <div sx={{ alignSelf: 'center' }}>
            <Container>
              <FaUserSecret size='8em' />
            </Container>
          </div>
          <div />
          <div sx={{ alignSelf: 'center' }}>
            <Container>
              <FaUserSecret size='8em' />
            </Container>
          </div>
        </div>
      </main>

      <aside
        sx={{
          backgroundColor: '#5C6AC4',
          gridArea: 'aside',
          display: 'flex',
          flexDirection: 'column',
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
              'repeat(auto-fit, 55px)',
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

        <Box
          p={1}
          bg='black'
          sx={{
            flex: '1 1 auto',
            border: 'solid',
            borderBottom: '0px',
            borderWidth: 'medium',
            borderColor: '#ff1744',
          }}
        ></Box>
        <Box
          p={2}
          bg='black'
          sx={{
            flex: '1 1 auto',
            border: 'solid',
            borderWidth: 'medium',
            borderColor: '#ff1744',
          }}
        ></Box>
      </aside>
    </div>
  </RoomWrapper>
)

export default RoomPage
