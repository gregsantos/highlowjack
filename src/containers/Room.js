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
        gridGap: 1, // theme.space[4]
        height: '100%',
        gridTemplateColumns: ['100%', 'repeat(4, 1fr)'],
        gridTemplateRows: ['repeat(4, 1fr)', 'repeat(3, 1fr)'],
      }}
    >
      <main
        sx={{
          backgroundColor: 'red',
          gridColumn: ['auto', '1 / span 3'],
          gridRow: ['1 / 3', '1 / span 4'],
        }}
      ></main>

      <aside
        sx={{
          backgroundColor: 'black',
          gridColumn: ['auto', '4 / 5'],
          gridRow: ['3 / 4', '1 / span 4'],
        }}
      ></aside>
    </div>
  </RoomWrapper>
)

export default RoomPage
