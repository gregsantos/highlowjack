/** @jsx jsx */
import { jsx, Flex, Box, Container } from 'theme-ui'

export const ScoreBox = ({ gameData }) => {
  return (
    <Flex sx={{ flex: 1, mr: ['0em', '.5em'], mb: [1, 0, 0] }}>
      <Box
        bg='darkseagreen'
        sx={{
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
          mr: '.25em',
        }}
      >
        <Container>
          <h3 sx={{ color: 'antiquewhite', mb: [0, 0, 1] }}>Team 1</h3>
        </Container>
        <Container>
          <h1 sx={{ margin: 0 }}>{gameData && gameData.score[0]}</h1>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite' }}>
            {gameData.players[0].username}
          </div>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite' }}>
            {gameData.players[1].username}
          </div>
        </Container>
      </Box>
      <Box
        bg='darkseagreen'
        sx={{
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
        }}
      >
        <Container>
          <h3 sx={{ color: 'antiquewhite', mb: [0, 0, 1] }}> Team 2</h3>
        </Container>
        <Container>
          <h1 sx={{ margin: 0 }}>{gameData && gameData.score[1]}</h1>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite' }}>
            {gameData.players[1].username}
          </div>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite' }}>
            {gameData.players[3].username}
          </div>
        </Container>
      </Box>
    </Flex>
  )
}
