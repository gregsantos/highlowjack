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
        flex: [1, 1, '1 1 auto'],
        flexDirection: 'column',
        justifyContent: 'flex-end',
        ml: [0, 0, 0],
        mt: [0, 0, 2],
        maxHeight: ['225px', '112px', '300px'],
      }}
    >
      <Messages roomId={id} />
      <ChatInput roomId={id} />
    </Flex>
  )
}
