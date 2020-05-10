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
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: 2,
        mt: [0, 0, 2],
      }}
    >
      <Messages roomId={id} />
      <ChatInput roomId={id} />
    </Flex>
  )
}
