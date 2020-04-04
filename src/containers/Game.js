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
        flexDirection: ['column', 'column', 'column', 'row'],
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
          width: ['100%', '100%', '100%', '75%'],
        }}
      >
        <div
          sx={{
            display: 'grid',
            gridGap: 2,
            gridTemplateColumns: ['repeat(3, 1fr)'],
            gridTemplateRows: ['repeat(3, 1fr)'],
            height: '100%',
            '& :nth-child(even)': {
              backgroundColor: '#63B3ED',
            },
          }}
        >
          <div sx={{ justifySelf: 'start', alignSelf: 'start' }}>
            <Container>
              <FaUserSecret size='75%' />
            </Container>
          </div>
          <div />
          <div sx={{ justifySelf: 'end', alignSelf: 'start' }}>
            <Container>
              <FaUserSecret size='75%' />
            </Container>
          </div>
          <div />
          <Container>
            <div
              className='card hA  shadow no-border'
              sx={{
                fontSize: [2, 4, 6],
              }}
            />
          </Container>
          <div />
          <div sx={{ justifySelf: 'start', alignSelf: 'end' }}>
            <Container>
              <FaUserSecret size='75%' />
            </Container>
          </div>
          <div />
          <div sx={{ justifySelf: 'end', alignSelf: 'end' }}>
            <Container>
              <FaUserSecret size='75%' />
            </Container>
          </div>
        </div>
      </main>
      <aside
        sx={{
          backgroundColor: 'blue',
          height: ['100vw', '80vw', '100%', '100%'],
          flexGrow: '1',
        }}
      >
        <Flex sx={{ flexDirection: 'column', height: '100%' }}>
          <Box p={2} bg='green' sx={{ flex: '1 1 auto' }}>
            Cards
          </Box>
          <Box p={2} bg='primary' sx={{ flex: '1 1 auto' }}>
            Flex
          </Box>
          <Box p={2} bg='muted' sx={{ flex: '1 1 auto' }}>
            Box
          </Box>
        </Flex>
      </aside>
    </div>
  </RoomWrapper>
)

export default GamePage
