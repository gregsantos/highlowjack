/** @jsx jsx */
import { jsx, Flex, Box, Container } from 'theme-ui'

export const BidBox = ({ gameData, getSuit }) => {
  console.log(gameData && gameData.bid.suit)
  return (
    <Flex sx={{ flex: 1 }}>
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
          <h3 sx={{ color: 'antiquewhite', mt: 1 }}>
            Bid{' '}
            {gameData &&
            (gameData.bid.bidder === 0 || gameData.bid.bidder === 2)
              ? 'Team 1'
              : 'Team 2'}
          </h3>
        </Container>
        <Container>
          <h1 sx={{ mt: 0 }}>{gameData && gameData.bid.bid}</h1>
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
          <h3 sx={{ color: 'antiquewhite', mt: 1 }}>Trump</h3>
        </Container>
        <Container>
          <h1 sx={{ mt: 0 }}>
            {gameData && gameData.trick !== 0 && getSuit(gameData.bid.suit)}
          </h1>
        </Container>
      </Box>
    </Flex>
  )
}
