/** @jsx jsx */
import { jsx, Flex, Container } from 'theme-ui'

export const BidBox = ({ gameData, getSuit }) => {
  console.log(gameData && gameData.bid.suit)
  return (
    <Flex sx={{ flex: 1 }}>
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
        <h1 sx={{ m: [0, '15px', '15px'] }}>{gameData && gameData.bid.bid}</h1>
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
        <h1 sx={{ m: [0, '15px', '15px'] }}>
          {gameData && gameData.trick !== 0 && getSuit(gameData.bid.suit)}
        </h1>
      </Container>
    </Flex>
  )
}
