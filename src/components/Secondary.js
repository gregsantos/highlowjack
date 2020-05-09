/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { HandBox } from './HandBox'
import { InfoBox } from './InfoBox'

export const Secondary = ({
  user,
  roomData,
  gameData,
  playerSeat,
  startGame,
  playCard,
  getSuit,
}) => {
  return (
    <Flex
      sx={{
        flex: [1, 1, '0 0 400px'],
        flexDirection: 'column',
        maxHeight: '100%',
      }}
    >
      {gameData && <InfoBox gameData={gameData} getSuit={getSuit} />}

      <HandBox
        user={user}
        roomData={roomData}
        gameData={gameData}
        playerSeat={playerSeat}
        startGame={startGame}
        playCard={playCard}
      />
    </Flex>
  )
}
