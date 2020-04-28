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
        flex: ['0 0 200px', '0 0 200px', '0 1 400px'],
        flexDirection: 'column',
      }}
    >
      <HandBox
        roomData={roomData}
        gameData={gameData}
        playerSeat={playerSeat}
        startGame={startGame}
        playCard={playCard}
      />
      <Flex
        sx={{
          flex: 1,
          flexDirection: ['row', 'row', 'column'],
          m: 1,
        }}
      >
        <Databox gameData={gameData} getSuit={getSuit} />
        <ChatBox />
      </Flex>
    </Flex>
  )
}
