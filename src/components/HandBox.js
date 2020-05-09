/** @jsx jsx */
import { jsx, Flex, Container, Button } from 'theme-ui'

export const HandBox = ({
  user,
  roomData,
  gameData,
  playerSeat,
  playCard,
  startGame,
}) => {
  const getDisabled = (card) => {
    return (
      card === 'outline' || gameData.trick === 0 || gameData.turn !== playerSeat
    )
  }

  const renderCards = () => {
    const renderHand = () => {
      const playerHand = gameData.players[playerSeat].hand

      return playerSeat !== null
        ? [
            ...playerHand,
            ...Array.from({ length: 6 - playerHand.length }, () => 'outline'),
          ].map((card, i) => (
            <Container key={i}>
              <button
                className={`card ${card}`}
                sx={{ fontSize: [1, 3, 4] }}
                onClick={() => playCard(i, card)}
                disabled={getDisabled()}
              />
            </Container>
          ))
        : null
    }

    if (playerSeat !== null) {
      return (
        <div
          sx={{
            backgroundColor: 'green',
            width: '100%',
            paddingY: ['1px', '3px', '5px'],
            display: 'grid',
            justifyContent: 'center',
            gridTemplateColumns: [
              'repeat(6, minmax(0px, 1fr))',
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
    <Flex
      sx={{
        flex: ['1 1 80px', 1, 1],
        justifyContent: 'center',
        border: 'thin solid indianred',
        borderBottom: 'none',
      }}
    >
      {gameData && playerSeat !== null ? (
        renderCards()
      ) : (
        <Container>
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
    </Flex>
  )
}
