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
      return ''
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
        trickCards.map((c, i) => {
          if (c.spot === 'A') return (trickCards[i].spot = '14')
          if (c.spot === 'K') return (trickCards[i].spot = '13')
          if (c.spot === 'Q') return (trickCards[i].spot = '12')
          if (c.spot === 'J') return (trickCards[i].spot = '11')
          return null
        })

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

        const winningCard = trickSortedTrump[0] || trickSortedSuited[0]
        const handWinner = winningCard.p
        const trickWinner = handWinner === 0 || handWinner === 2 ? 't1' : 't2'

        const getRoundCards = () =>
          trickWinner === 't1'
            ? [...gameData.roundCards.t1, ...gameData.trickCards]
            : [...gameData.roundCards.t2, ...gameData.trickCards]

        if (!lastRoundCard) {
          // tally trick and advance round
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
          console.log('Taly Round and Score')

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

          const gameWinner = t1GamePoints > t2GamePoints ? 0 : 1

          // Check for Bid Points
          // Team 1
          const t1TrumpCards = t1RoundCards.filter(
            (c) => c.suit === gameData.bid.suit
          )

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

          const t1High = t1SortedHigh[0] ? t1SortedHigh[0].spot : 0
          const t2High = t2SortedHigh[0] ? t2SortedHigh[0].spot : 0
          const t1Low = t1SortedLow[0] ? t1SortedLow[0].spot : 0
          const t2Low = t2SortedLow[0] ? t2SortedLow[0].spot : 0
          const highWinner = t1High > t2High ? 1 : 2
          const lowWinner = t1Low < t2Low ? 1 : 2

          console.log(
            'Game Winner',
            gameWinner,
            'Jack Winner',
            getJackWinner(),
            'High Winner',
            highWinner,
            'Low Winner',
            lowWinner
          )

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

          const getT1FinalScore = () => {
            if (gameData.bid.bidder === 0 || gameData.bid.bidder === 2) {
              return t1RoundScore >= gameData.bid.bid
                ? t1RoundScore
                : -Math.abs(gameData.bid.bid)
            } else {
              return t1RoundScore
            }
          }

          const getT2FinalScore = () => {
            if (gameData.bid.bidder === 1 || gameData.bid.bidder === 3) {
              return t2RoundScore >= gameData.bid.bid
                ? t2RoundScore
                : -Math.abs(gameData.bid.bid)
            } else {
              return t2RoundScore
            }
          }

          const t1FinalScore = getT1FinalScore()
          const t1GameScore = t1FinalScore + gameData.score[0]
          const t2FinalScore = getT2FinalScore()
          const t2GameScore = t2FinalScore + gameData.score[1]

          console.log(
            'T1 RoundScore',
            t1FinalScore,
            'T1 Game Score',
            gameData.score[0],
            'T2 Round Score',
            t2FinalScore,
            'T2 Game Score',
            gameData.score[1]
          )

          const endGame = () => {
            const gameWinner = t1GameScore > t2GameScore ? '1' : '2'
            console.log('Winner! Team:', gameWinner)
          }

          if (t1GameScore >= 11 || t2GameScore >= 11) {
            endGame()
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
              gameData.score[0] + t1FinalScore,
              gameData.score[1] + t2FinalScore,
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
