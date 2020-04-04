/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Container } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'
import '../css/cards.css'

const RoomPage = () => (
  <RoomWrapper>
    <div
      sx={{
        display: 'grid',
        gridGap: 2, // theme.space[4]
        // use arrays for mobile-first responsive styles
        height: '100%',
        gridTemplateColumns: [
          'auto',
          '1', // default to a stacked layout on small screens
          '3fr 1fr', // use columns for larger screens
        ],
      }}
    >
      <main
        sx={{
          display: 'grid',
          gridGap: 2, // theme.space[4]
          // use arrays for mobile-first responsive styles
          gridTemplateColumns: [
            // default to a stacked layout on small screens
            'repeat(3, 1fr)', // use columns for larger screens
          ],
          gridTemplateRows: [
            '2fr 220px 2fr', // use columns for larger screens
          ],
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
      </main>

      <aside
        sx={{
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container>
          <div>
            {['♠A', '♠K', '♦A', '♣J', '♣06', '♥09'].map((card) => (
              <div
                className={`card ${card}`}
                sx={{ fontSize: [2, null, 4] }}
              ></div>
            ))}
          </div>
        </Container>
      </aside>
    </div>
  </RoomWrapper>
)

export default RoomPage
