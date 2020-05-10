/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { InfoBox } from './InfoBox'
import { ChatBox } from './ChatBox'
import { HandBox } from './HandBox'

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
      <HandBox
        user={user}
        roomData={roomData}
        gameData={gameData}
        playerSeat={playerSeat}
        startGame={startGame}
        playCard={playCard}
      />
      {gameData && <InfoBox gameData={gameData} getSuit={getSuit} />}
      <ChatBox />
    </Flex>
  )
}
