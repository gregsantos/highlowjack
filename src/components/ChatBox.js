/** @jsx jsx */
import { jsx, Flex, Box, Text } from 'theme-ui'
import { useParams } from 'react-router-dom'
import ChatInput from './ChatInput'
import Messages from './Messages'

export const ChatBox = () => {
  const { id } = useParams()

  return (
    <Flex
      sx={{
        gridArea: 'chat',
        flexDirection: 'column',
        p: 2,
        border: 'thin solid indianred',
        borderTop: 'none',
        maxHeight: '220px',
      }}
    >
      <Messages roomId={id} />
      <ChatInput roomId={id} />
    </Flex>
  )
}
