/** @jsx jsx */
import { jsx, Flex, Container, Text } from 'theme-ui'

export const BidBox = ({ gameData, getSuit }) => {
  return (
    <Flex sx={{ flex: 1 }}>
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
          <Text sx={{ color: 'antiquewhite' }}>Bid</Text>
        </Container>
        <Container>
          <h2 sx={{ margin: 0 }}>{gameData && gameData.bid.bid}</h2>
        </Container>
        <Container>
          <Text sx={{ color: 'antiquewhite' }}>
            {gameData.bid.bidder
              ? gameData.players[gameData.bid.bidder.username]
              : '-'}
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
          <Text sx={{ color: 'antiquewhite' }}>Trump</Text>
        </Container>
        <Container>
          <h2 sx={{ margin: 0 }}>
            {gameData && gameData.trick !== 0
              ? getSuit(gameData.bid.suit)
              : '-'}
          </h2>
        </Container>
        <Container>
          <Text sx={{ color: 'antiquewhite' }}>Suit</Text>
        </Container>
      </Flex>
    </Flex>
  )
}
