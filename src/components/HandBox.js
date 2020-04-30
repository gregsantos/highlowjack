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
            <Container key={i}>
              <div className={`card ${card}`} sx={{ fontSize: [1, 3, 4] }} />
              {card !== 'outline' &&
                gameData.trick !== 0 &&
                gameData.turn === playerSeat && (
                  <Button variant='card' onClick={() => playCard(i, card)}>
                    <FaRegTimesCircle />
                  </Button>
                )}
            </Container>
          ))
        : null
    }

    if (playerSeat !== null) {
      return (
        <div
          sx={{
            backgroundColor: 'green',
            paddingY: ['2px', '3px', '5px'],
            display: 'grid',
            justifyContent: 'center',
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
    <Box
      sx={{
        border: 'thin solid indianred',
        borderBottom: 'none',
      }}
    >
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
