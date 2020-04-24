import { initDeal } from '../helpers/initGame'

export const getSuit = (suit) => {
  switch (suit) {
    case 's':
      return '♠'
    case 'c':
      return '♣'
    case 'h':
      return '♥'
    case 'd':
      return '♦'
    default:
      break
  }
}

export const tallyTrick = (members, gameRef) => {
  gameRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        const gameData = snapshot.data()
        const lastRoundCard = gameData.trick === 6
        const trickCards = gameData.trickCards
        console.log(trickCards)
        trickCards.map((c, i) => {
          if (c.spot === 'A') return (trickCards[i].spot = '14')
          if (c.spot === 'K') return (trickCards[i].spot = '13')
          if (c.spot === 'Q') return (trickCards[i].spot = '12')
          if (c.spot === 'J') return (trickCards[i].spot = '11')
          return null
        })
        console.log(trickCards)

        const trickTrumpCards = trickCards.filter(
          (c) => c.suit === gameData.bid.suit
        )

        const trickSuitedCards = trickCards.filter(
          (c) => c.suit === gameData.trickCards[0].suit
        )

        const trickSortedTrump = [...trickTrumpCards].sort(
          (a, b) => b.spot - a.spot
        )
        const trickSortedSuited = [...trickSuitedCards].sort(
          (a, b) => b.spot - a.spot
        )

        console.log(
          'Trick Cards Sorted',
          trickSortedTrump[0] || {},
          trickSortedSuited[0] || {}
        )

        const winningCard = trickSortedTrump[0] || trickSortedSuited[0]
        const handWinner = winningCard.p
        const trickWinner = handWinner === 0 || handWinner === 2 ? 't1' : 't2'

        const getRoundCards = () =>
          trickWinner === 't1'
            ? [...gameData.roundCards.t1, ...gameData.trickCards]
            : [...gameData.roundCards.t2, ...gameData.trickCards]

        console.log(
          'Winning card:',
          winningCard,
          'Trick Winner',
          trickWinner,
          'Player :',
          handWinner,
          'Trick Cards',
          trickCards
        )

        if (!lastRoundCard) {
          // tally trick and advance round
          console.log('Tally Trick', `roundCards.${trickWinner}`)
          const update = {
            turn: handWinner,
            leader: handWinner,
            trick: gameData.trick + 1,
            trickCards: [],
            lastCard: {},
            newTrick: true,
            [`roundCards.${trickWinner}`]: getRoundCards(),
          }
          gameRef.update(update)
        } else {
          // tally trick and tally round
          const t1RoundCards =
            trickWinner === 't1'
              ? [...gameData.roundCards.t1, ...gameData.trickCards]
              : [...gameData.roundCards.t1]

          const t2RoundCards =
            trickWinner === 't2'
              ? [...gameData.roundCards.t2, ...gameData.trickCards]
              : [...gameData.roundCards.t2]

          // Map and count for game point
          const mapPointCards = (cardArr, { spot }) => ({
            ...cardArr,
            [spot]: !cardArr[spot] ? 1 : cardArr[spot] + 1,
          })

          const mappedPointCards = t1RoundCards.reduce(mapPointCards, {})
          const mappedPointCards2 = t2RoundCards.reduce(mapPointCards, {})

          console.log('Tally Trick & Round')
          console.log('mapped round cards 1', mappedPointCards)
          console.log('mapped round cards 2', mappedPointCards2)

          const t1GamePoints =
            (mappedPointCards['10'] * 10 || 0) +
            (mappedPointCards['14'] * 4 || 0) +
            (mappedPointCards['13'] * 3 || 0) +
            (mappedPointCards['12'] * 2 || 0) +
            (mappedPointCards['11'] * 1 || 0)

          const t2GamePoints =
            (mappedPointCards2['10'] * 10 || 0) +
            (mappedPointCards2['14'] * 4 || 0) +
            (mappedPointCards2['13'] * 3 || 0) +
            (mappedPointCards2['12'] * 2 || 0) +
            (mappedPointCards2['11'] * 1 || 0)

          console.log('T1 Game Points:', t1GamePoints)
          console.log('T2 Game Points:', t2GamePoints)

          const gameWinner = t1GamePoints > t2GamePoints ? 0 : 1

          // Check for Bid Points
          // Team 1
          const t1TrumpCards = t1RoundCards.filter(
            (c) => c.suit === gameData.bid.suit
          )

          console.log('T1 round and trump cards', t1RoundCards, t1TrumpCards)

          t1TrumpCards.map((c, i) => {
            if (c.spot === 'A') return (t1TrumpCards[i].spot = '14')
            if (c.spot === 'K') return (t1TrumpCards[i].spot = '13')
            if (c.spot === 'Q') return (t1TrumpCards[i].spot = '12')
            if (c.spot === 'J') return (t1TrumpCards[i].spot = '11')
            return null
          })

          const t1SortedHigh = [...t1TrumpCards].sort((a, b) => b.spot - a.spot)
          const t1SortedLow = [...t1TrumpCards].sort((a, b) => a.spot - b.spot)

          // Team 2
          const t2TrumpCards = t2RoundCards.filter(
            (c) => c.suit === gameData.bid.suit
          )

          console.log('T2 round and trump cards', t2RoundCards, t2TrumpCards)

          t2TrumpCards.map((c, i) => {
            if (c.spot === 'A') return (t2TrumpCards[i].spot = '14')
            if (c.spot === 'K') return (t2TrumpCards[i].spot = '13')
            if (c.spot === 'Q') return (t2TrumpCards[i].spot = '12')
            if (c.spot === 'J') return (t2TrumpCards[i].spot = '11')
          })

          const t2SortedHigh = [...t2TrumpCards].sort((a, b) => b.spot - a.spot)
          const t2SortedLow = [...t2TrumpCards].sort((a, b) => a.spot - b.spot)

          // jackWinner
          const getJackWinner = () => {
            if (t1TrumpCards.find((c) => c.spot === '11') || false) {
              return 1
            }
            if (t2TrumpCards.find((c) => c.spot === '11') || false) {
              return 2
            }
            return 0
          }

          console.log('Jack Winner', getJackWinner())

          const t1High = t1SortedHigh[0] ? t1SortedHigh[0].spot : 0
          const t2High = t2SortedHigh[0] ? t2SortedHigh[0].spot : 0
          const t1Low = t1SortedLow[0] ? t1SortedLow[0].spot : 0
          const t2Low = t2SortedLow[0] ? t2SortedLow[0].spot : 0
          const highWinner = t1High > t2High ? 1 : 2
          const lowWinner = t1Low < t2Low ? 1 : 2

          const scoreRound = () => {
            let t1Score = 0
            let t2Score = 0
            highWinner === 0 ? t1Score++ : t2Score++
            lowWinner === 0 ? t1Score++ : t2Score++
            gameWinner === 0 ? t1Score++ : t2Score++
            let jackWinner = getJackWinner()
            if (jackWinner === 1) {
              t1Score++
            }
            if (jackWinner === 2) {
              t2Score++
            }
            return [t1Score, t2Score]
          }

          // Final Score
          const [t1RoundScore, t2RoundScore] = scoreRound()
          console.log(
            'T1 Round Score',
            t1RoundScore,
            'T2 Round Score',
            t2RoundScore
          )

          const t1FinalScore = () => {
            if (gameData.bid.bidder === 0 || gameData.bid.bidder === 2) {
              console.log('Team 1 Bid')
              return t1RoundScore >= gameData.bid.bid
                ? t1RoundScore
                : -Math.abs(gameData.bid.bid)
            } else {
              return t1RoundScore
            }
          }

          const t2FinalScore = () => {
            if (gameData.bid.bidder === 1 || gameData.bid.bidder === 3) {
              console.log('Team 2 Bid')
              return t2RoundScore >= gameData.bid.bid
                ? t2RoundScore
                : -Math.abs(gameData.bid.bid)
            } else {
              return t2RoundScore
            }
          }

          const nextDealer = gameData.dealer === 3 ? 0 : gameData.dealer + 1
          const nextTurn = nextDealer === 3 ? 0 : nextDealer + 1
          const nextTrick = gameData.trick === 6 ? 0 : gameData.trick + 1
          const deal = initDeal(members)

          const update = {
            bid: { bid: 0, bidder: null, suit: '' },
            players: {
              0: deal.players[0],
              1: deal.players[1],
              2: deal.players[2],
              3: deal.players[3],
            },
            dealtCards: deal.allHands,
            dealer: nextDealer,
            turn: nextTurn,
            leader: nextTurn,
            newTrick: true,
            trick: nextTrick,
            trickCards: [],
            lastCard: {},
            roundCards: { t1: [], t2: [] },
            score: [
              gameData.score[0] + t1FinalScore(),
              gameData.score[1] + t2FinalScore(),
            ],
            state: 'PLAYING',
          }
          gameRef.update(update)
        }
        return null
      } else {
        console.log('No Game Data.')
        return null
      }
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
}
