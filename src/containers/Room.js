/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import { Container, Flex, Box } from 'theme-ui'
import { FaUserSecret } from 'react-icons/fa'
import { P, H1, Button, Input, Form, RoomWrapper } from '../components'
import { useSession } from '../App'
import firebase from '../firebase.js'
import '../css/cards.css'

const RoomPage = (props) => {
  const user = useSession()
  const id = props.match.params.id
  const db = firebase.firestore()
  const roomRef = db.collection('roomDetail').doc(id)
  const gameRef = db.collection('games').doc('z4uzAmEhhm2xVO04RvnH')

  const fetchGame = async () => {
    try {
      const game = await gameRef.get()
      if (!game.exists) {
        console.log('No such Game!')
      } else {
        console.log('Game data:', game.data())
      }
    } catch (error) {
      console.log('Error getting Game', error)
    }
  }

  useEffect(() => {
    fetchGame()
  }, [])

  return (
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
                'minmax(1fr, 249px) auto minmax(1fr, 249px)',
                'minmax(225px, 1fr) minmax(auto, 1.2fr) minmax(225px, 1fr)',
              ],
              gridTemplateRows: [
                '1fr minmax(auto, 1.2fr) 1fr',
                '1fr 170px 1fr',
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
            minWidth: '375px',
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
}

export default RoomPage
