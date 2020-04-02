/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Styled } from 'theme-ui'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'

const members = [
  { id: 1, title: 'Post 1', date: '010120', excerpt: 'Lorum Ips...' },
  { id: 1, title: 'Post 1', date: '010120', excerpt: 'Lorum Ips...' },
  { id: 1, title: 'Post 1', date: '010120', excerpt: 'Lorum Ips...' },
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
        backgroundColor: 'black',
        height: '100%',
        gridTemplateColumns: [
          'auto', // default to a stacked layout on small screens
          '3fr minmax(200px, 1fr)', // use columns for larger screens
        ],
      }}
    >
      <main
        sx={{
          height: '100%',
          backgroundColor: 'red',
        }}
      >
        <Container
          sx={{
            height: '100%',
          }}
        >
          <div
            sx={{
              height: 'inherit',
              display: 'grid',
              gridGap: 2, // theme.space[4]
              // use arrays for mobile-first responsive styles
              gridTemplateColumns: [
                'auto', // default to a stacked layout on small screens
                'minmax(50px, 300px) 2fr minmax(50px, 300px)', // use columns for larger screens
              ],
              gridTemplateRows: [
                '1fr 2fr 1fr', // use columns for larger screens
              ],
              '& :nth-child(odd)': {
                backgroundColor: '#63B3ED',
              },
            }}
          >
            <div
              sx={{
                p: 1,
              }}
            >
              1
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              2
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              3
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              4
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              5
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              6
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              7
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              8
            </div>
            <div
              sx={{
                p: 1,
              }}
            >
              9
            </div>
          </div>
        </Container>
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
        <Container sx={{ height: '100%' }}>
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
              '& :nth-child(odd)': {
                backgroundColor: '#63B3ED',
              },
            }}
          >
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
          </div>
        </Container>
      </aside>
    </div>
  </RoomWrapper>
)

export default RoomPage
