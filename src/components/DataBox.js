/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { ScoreBox } from './ScoreBox'
import { BidBox } from './BidBox'

export const Databox = ({ gameData, getSuit }) => {
  return (
    <Flex
      sx={{
        flex: [1, null, 2],
        flexDirection: ['column', 'row', 'row'],
        mr: [1, 1, 0],
      }}
    >
      {gameData && <ScoreBox gameData={gameData} />}
      {gameData && <BidBox gameData={gameData} getSuit={getSuit} />}
    </Flex>
  )
}
