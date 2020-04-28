/** @jsx jsx */
import { jsx, Flex, Container } from 'theme-ui'

export const ScoreBox = ({ gameData }) => {
  return (
    <Flex sx={{ flex: 1, mr: ['0em', '.5em'], mb: [1, 0, 0] }}>
      <Container
        bg='darkseagreen'
        sx={{
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
          mr: '.25em',
        }}
      >
        <h1 sx={{ m: [0, '15px', '15px'] }}>{gameData && gameData.score[0]}</h1>
      </Container>
      <Container
        bg='darkseagreen'
        sx={{
          flex: 1,
          border: 'solid',
          borderWidth: 'medium',
          borderColor: 'indianred',
        }}
      >
        <h1 sx={{ m: [0, '15px', '15px'] }}>{gameData && gameData.score[1]}</h1>
      </Container>
    </Flex>
  )
}
