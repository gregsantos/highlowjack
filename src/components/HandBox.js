/** @jsx jsx */
import { jsx, Box, Container, Button } from 'theme-ui'
import { FaRegTimesCircle } from 'react-icons/fa'

export const HandBox = ({
  user,
  roomData,
  gameData,
  playerSeat,
  playCard,
  startGame,
}) => {
  const renderCards = () => {
    const renderHand = () => {
      const seat = roomData.members.includes(user && user.uid) ? playerSeat : 0
      const playerHand = gameData.players[seat].hand
      return playerSeat !== null
        ? [
            ...playerHand,
            ...Array.from({ length: 6 - playerHand.length }, () => 'outline'),
          ].map((card, i) => (
            <div
              key={i}
              sx={{
                backgroundColor: 'green',
                display: 'grid',
                justifyContent: 'center',
              }}
            >
              <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
              {card !== 'outline' &&
                gameData.trick !== 0 &&
                gameData.turn === playerSeat && (
                  <Button variant='card' onClick={() => playCard(i, card)}>
                    <FaRegTimesCircle />
                  </Button>
                )}
            </div>
          ))
        : null
    }

    if (playerSeat !== null) {
      return (
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
          {renderHand()}
        </div>
      )
    } else {
      return (
        <div
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h2 sx={{ color: 'muted' }}>Sorry, there are no seats available</h2>
        </div>
      )
    }
  }
  return (
    <Box>
      {gameData && playerSeat !== null ? (
        renderCards()
      ) : (
        <Container sx={{ height: '20%' }}>
          {roomData && roomData.state !== 'FULL' && playerSeat === null && (
            <div>
              <Container>
                <div
                  sx={{
                    fontSize: ['1em', '1.5em', null],
                    color: 'muted',
                  }}
                >
                  There's an Open Seat!
                </div>
              </Container>
            </div>
          )}
          {roomData && roomData.state !== 'FULL' && playerSeat !== null && (
            <Button
              variant='green'
              onClick={() => console.log('Show Room Link')}
            >
              Invite friends to start a game
            </Button>
          )}
          {roomData && roomData.state === 'FULL' && playerSeat === null && (
            <div
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <h2 sx={{ color: 'muted' }}>
                Sorry, there are no seats available
              </h2>
            </div>
          )}
          {roomData && roomData.state === 'FULL' && playerSeat !== null && (
            <Button variant='green' onClick={startGame}>
              Start New Game
            </Button>
          )}
        </Container>
      )}
    </Box>
  )
}
