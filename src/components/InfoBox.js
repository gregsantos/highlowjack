/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { Databox } from './DataBox'
import { ChatBox } from './ChatBox'

export const InfoBox = ({ gameData, getSuit }) => {
  return (
    <Flex
      sx={{
        gridArea: 'info',
        flexDirection: ['row', 'row', 'column'],
        p: 2,
        border: 'thin solid indianred',
        borderBottom: 'none',
      }}
    >
      <Databox gameData={gameData} getSuit={getSuit} />
      <ChatBox />
    </Flex>
  )
}
