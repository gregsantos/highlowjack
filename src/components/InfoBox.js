/** @jsx jsx */
import { jsx, Flex, Container } from 'theme-ui'
import { Databox } from './DataBox'
import { ChatBox } from './ChatBox'

export const InfoBox = ({ gameData, getSuit }) => {
  return (
    <Flex
      sx={{
        flex: 1,
        flexDirection: ['row', 'row', 'column'],
        p: 2,
        border: 'thin solid indianred',
        borderBottom: 'none',
      }}
    >
      <Flex
        sx={{
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <Flex sx={{ flex: 1 }}>
          <Flex
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
              bg='#41729F'
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
                <h3 sx={{ color: 'antiquewhite' }}>
                  {gameData.players[0].username}
                </h3>
              </Container>
              <Container>
                <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
                  {gameData.score[0]}
                </h2>
              </Container>
              <Container>
                <h3 sx={{ color: 'antiquewhite' }}>
                  {gameData.players[2].username}
                </h3>
              </Container>
            </Flex>
            <Flex
              bg='#633037'
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
                <h3 sx={{ color: 'antiquewhite' }}>
                  {gameData.players[1].username}
                </h3>
              </Container>
              <Container>
                <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
                  {gameData.score[1]}
                </h2>
              </Container>
              <Container>
                <h3 sx={{ color: 'antiquewhite' }}>
                  {gameData.players[3].username}
                </h3>
              </Container>
            </Flex>
          </Flex>
          <Flex
            sx={{
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              border: 'solid',
              borderWidth: 'medium',
              borderColor: 'indianred',
            }}
          >
            <Flex
              bg='#633037'
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
                <h3 sx={{ color: 'antiquewhite' }}>Bid</h3>
              </Container>
              <Container>
                <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
                  {gameData && gameData.bid.bid}
                </h2>
              </Container>
              <Container>
                <h3 sx={{ color: 'antiquewhite' }}>
                  {gameData.bid.bidder
                    ? gameData.players[gameData.bid.bidder.username]
                    : '-'}
                </h3>
              </Container>
            </Flex>
            <Flex
              bg='#41729F'
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
                <h2 sx={{ margin: 0, color: 'antiquewhite' }}>
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
      </Flex>
    </Flex>
  )
}
