/** @jsx jsx */
import { jsx, Flex, Box, Container, Text } from 'theme-ui'

export const ScoreBox = ({ gameData, getSuit }) => {
  return (
    <Flex sx={{ flex: 1, mb: 1 }}>
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
        <Flex
          bg='darkseagreen'
          sx={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            border: 'solid',
            borderWidth: 'medium',
            borderColor: 'indianred',
            backgroundColor: 'blue',
          }}
        >
          <Container>
            <Text sx={{ color: 'antiquewhite', mb: 0 }}>
              {gameData.players[0].username}
            </Text>
          </Container>
          <Container>
            <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
              {gameData && gameData.score[0]}
            </h2>
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
            backgroundColor: 'red',
          }}
        >
          <Container>
            <Text sx={{ color: 'antiquewhite', mb: 0 }}>
              {gameData.players[1].username}
            </Text>
          </Container>
          <Container>
            <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
              {gameData && gameData.score[1]}
            </h2>
          </Container>
          <Container>
            <Text sx={{ color: 'antiquewhite', mt: 0 }}>
              {gameData.players[3].username}
            </Text>
          </Container>
        </Flex>
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
          backgroundColor: 'blue',
        }}
      >
        <Flex
          bg='darkseagreen'
          sx={{
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            border: 'solid',
            borderWidth: 'medium',
            borderColor: 'indianred',
            backgroundColor: 'blue',
          }}
        >
          <Container>
            <h3 sx={{ color: 'antiquewhite' }}>Bid</h3>
          </Container>
          <Container>
            <h2 sx={{ margin: 0 }}>{gameData && gameData.bid.bid}</h2>
          </Container>
          <Container>
            <h3 sx={{ color: 'antiquewhite' }}>
              {gameData &&
              (gameData.bid.bidder === 0 || gameData.bid.bidder === 2)
                ? 'Team 1'
                : 'Team 2'}
            </h3>
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
            <h3 sx={{ color: 'antiquewhite' }}>Trump</h3>
          </Container>
          <Container>
            <h2 sx={{ margin: 0 }}>
              {gameData && gameData.trick !== 0
                ? getSuit(gameData.bid.suit)
                : '-'}
            </h2>
          </Container>
          <Container>
            <h3 sx={{ color: 'antiquewhite' }}>Suit</h3>
          </Container>
        </Flex>
      </Flex>
    </Flex>
  )
}
