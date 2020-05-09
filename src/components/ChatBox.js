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
        flex: [1, 1, '0 0 200px'],
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pl: [1, null, '0em'],
      }}
    >
      <Messages roomId={id} />
      <ChatInput roomId={id} />
    </Flex>
  )
}
