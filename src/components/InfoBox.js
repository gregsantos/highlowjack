/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { ScoreBox } from './ScoreBox'
import { BidBox } from './BidBox'

export const InfoBox = ({ gameData, getSuit }) => {
  return (
    <Flex
      sx={{
        gridArea: 'info',
        flexDirection: ['row', 'row', 'column'],
        p: 2,
        pb: 0,
        border: 'thin solid indianred',
        borderBottom: 'none',
      }}
    >
      <ScoreBox gameData={gameData} />
      <BidBox gameData={gameData} getSuit={getSuit} />
    </Flex>
  )
}
