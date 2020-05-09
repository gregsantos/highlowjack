/** @jsx jsx */
import { jsx, Flex, Container } from 'theme-ui'
import { ChatBox } from './ChatBox'

export const InfoBox = ({ gameData, getSuit }) => {
  return (
    <Flex
      sx={{
        gridArea: 'info',
        flexDirection: ['row', 'row', 'column'],
        p: 1,
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
        <Flex
          sx={{
            flex: 1,
            flexDirection: ['row', 'row', 'column'],
          }}
        >
          <Flex
            sx={{
              flexDirection: ['column', 'row', 'row'],
              justifyContent: 'center',
              flex: 1,
              mr: ['.25em', null, '0em'],
              maxHeight: 'fit-content',
            }}
          >
            <Flex
              bg='#41729F'
              sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                height: 'fit-content',
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
                height: 'fit-content',
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
              flexDirection: ['column', 'row', 'row'],
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Flex
              bg='#633037'
              sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                height: 'fit-content',
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
                    ? gameData.players[gameData.bid.bidder].username
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
                height: 'fit-content',
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
      <ChatBox />
    </Flex>
  )
}
