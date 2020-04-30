/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { useParams } from 'react-router-dom'
import ChatInput from './ChatInput'
import Messages from './Messages'

export const ChatBox = () => {
  const { id } = useParams()

  return (
    <Flex
      sx={{
        flex: [1, null, '1 1 30px'],
        flexDirection: 'column',
        ml: [1, 1, 0],
        mt: [0, 0, 2],
        maxHeight: ['225px', '100px', '300px'],
      }}
    >
      <Messages roomId={id} />
      <ChatInput roomId={id} />
    </Flex>
  )
}
