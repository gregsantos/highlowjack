/** @jsx jsx */
import { jsx, Flex, Box, Container, Text } from 'theme-ui'

export const ScoreBox = ({ gameData }) => {
  return (
    <Flex sx={{ flex: 1, mr: ['0em', '.5em'], mb: [1, 0, 0] }}>
      <Flex
        bg='darkseagreen'
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
          mr: '.25em',
        }}
      >
        <Container>
          <Text sx={{ color: 'antiquewhite', mb: 0 }}>
            {gameData.players[0].username}
          </Text>
        </Container>
        <Container>
          <h2 sx={{ margin: 0 }}>{gameData && gameData.score[0]}</h2>
        </Container>
        <Container>
          <Text sx={{ color: 'antiquewhite', mt: 0 }}>
            {gameData.players[2].username}
          </Text>
        </Container>
      </Flex>
      <Flex
        bg='darkseagreen'
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
        }}
      >
        <Container>
          <Text sx={{ color: 'antiquewhite', mb: 0 }}>
            {gameData.players[1].username}
          </Text>
        </Container>
        <Container>
          <h2 sx={{ margin: 0 }}>{gameData && gameData.score[1]}</h2>
        </Container>
        <Container>
          <Text sx={{ color: 'antiquewhite', mt: 0 }}>
            {gameData.players[3].username}
          </Text>
        </Container>
      </Flex>
    </Flex>
  )
}
