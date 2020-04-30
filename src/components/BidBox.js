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
          <h3 sx={{ color: 'antiquewhite', mb: [0, 0, 1] }}>Bid</h3>
        </Container>
        <Container sx={{ mb: ['14px', '0px', '8px'] }}>
          <h1 sx={{ margin: 0, mb: [0, '5px', 0] }}>
            {gameData && gameData.bid.bid}
          </h1>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite', mt: [0, 0, 1], mb: [0, 0, 1] }}>
            {gameData &&
            (gameData.bid.bidder === 0 || gameData.bid.bidder === 2)
              ? 'Team 1'
              : 'Team 2'}
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
          <h3 sx={{ color: 'antiquewhite', mb: [0, 0, 1] }}>Trump</h3>
        </Container>
        <Container sx={{ mb: ['14px', '0px', '8px'] }}>
          <h1 sx={{ margin: 0, mb: [0, '5px', 0] }}>
            {gameData && gameData.trick !== 0
              ? getSuit(gameData.bid.suit)
              : '-'}
          </h1>
        </Container>
        <Container>
          <div sx={{ color: 'antiquewhite', mt: [0, 0, 1], mb: [0, 0, 1] }}>
            Suit
          </div>
        </Container>
      </Box>
    </Flex>
  )
}
