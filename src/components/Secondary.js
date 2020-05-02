/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { Databox } from './DataBox'
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
        flex: ['0 0 200px', '0 0 200px', '0 0 400px'],
        flexDirection: 'column',
      }}
    >
      <HandBox
        sx={{ flex: 1 }}
        user={user}
        roomData={roomData}
        gameData={gameData}
        playerSeat={playerSeat}
        startGame={startGame}
        playCard={playCard}
      />
      <Flex
        sx={{
          flex: 2,
          height: '100%',
          flexDirection: ['row', 'row', 'column'],
          p: 2,
          border: 'thin solid indianred',
        }}
      >
        <Databox gameData={gameData} getSuit={getSuit} />
        <ChatBox />
      </Flex>
    </Flex>
  )
}
