/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Styled } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'
import '../css/cards.css'

const members = [
  { id: 1, title: 'Score', date: '010120', excerpt: 'Lorum Ips...' },
  { id: 1, title: 'Bid', date: '010120', excerpt: 'Lorum Ips...' },
  { id: 1, title: 'Bidder', date: '010120', excerpt: 'Lorum Ips...' },
]

export const Container = props => (
  <div
    {...props}
    sx={{
      variant: 'layout.container',
    }}
  />
)

const RoomPage = () => (
  <RoomWrapper>
    <div
      sx={{
        display: 'grid',
        gridGap: 2, // theme.space[4]
        // use arrays for mobile-first responsive styles
        height: '100%',
        gridTemplateColumns: [
          'auto', // default to a stacked layout on small screens
          '3fr minmax(320px, 1fr)', // use columns for larger screens
        ],
      }}
    >
      <main
        sx={{
          height: '100%',
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
        <div>
          <Container>
            <FaUserSecret size='75%' />
          </Container>
        </div>
        <div />
        <div>
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

      <aside sx={{ display: 'flex', flexDirection: 'column' }}>
        <Container>
          <ul
            sx={{
              listStyle: 'none',
              m: 0,
              px: 3,
              py: 4,
            }}
          >
            {members.map(member => (
              <li
                key={member.id}
                sx={{
                  mb: 4,
                }}
              >
                <Styled.h2
                  sx={{
                    m: 0,
                  }}
                >
                  <a
                    href={member.slug}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      ':hover,:focus': {
                        color: 'muted',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {member.title}
                  </a>
                </Styled.h2>
                <small sx={{ fontWeight: 'bold' }}>{member.date}</small>
                <Styled.p>{member.excerpt}</Styled.p>
              </li>
            ))}
          </ul>
        </Container>
        <Container>
          <div
            sx={{
              height: 'inherit',
              display: 'grid',
              gridGap: 1, // theme.space[4]
              // use arrays for mobile-first responsive styles
              gridTemplateColumns: [
                'auto', // default to a stacked layout on small screens
                '1fr 1fr 1fr', // use columns for larger screens
              ],
              '& :nth-child(odd)': {},
            }}
          >
            {['♠A', '♠K', '♦A', '♣J', '♣06', '♥09'].map(card => (
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
