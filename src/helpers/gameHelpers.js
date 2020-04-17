export const tallyTrick = (gameRef) => {
  gameRef
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        const gameData = snapshot.data()
        const lastRoundCard = gameData.trick === 6
        const trumped = gameData.trickCards.filter(
          (c) => c.suit === gameData.bid.trumpSuit
        )
        const highTrump = trumped.sort((a, b) => b.spot - a.spot)
        const suited = gameData.trickCards.filter(
          (c) => c.suit === gameData.trickCards[0].suit
        )
        const highSuited = suited.sort((a, b) => b.spot - a.spot)
        const winningCard = highTrump[0] || highSuited[0]
        const handWinner = winningCard.p
        const trickWinner = handWinner === 1 || 3 ? 't2' : 't1'
        const getRoundCards = () =>
          trickWinner === 't1'
            ? [...gameData.roundCards.t1, ...gameData.trickCards]
            : [...gameData.roundCards.t2, ...gameData.trickCards]

        if (!lastRoundCard) {
          // tally trick and advance round
          console.log('Tally Trick')
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
          console.log('Tally Trick & Round')

          const t1RoundCards =
            trickWinner === 't1'
              ? [...gameData.roundCards.t1, ...gameData.trickCards]
              : [...gameData.roundCards.t1]

          const t2RoundCards =
            trickWinner === 't2'
              ? [...gameData.roundCards.t2, ...gameData.trickCards]
              : [...gameData.roundCards.t2]

          const mapPointCards = (cardArr, { spot }) => ({
            ...cardArr,
            [spot]: !cardArr[spot] ? 1 : cardArr[spot] + 1,
          })

          const mappedPointCards = t1RoundCards.reduce(mapPointCards, {})
          const mappedPointCards2 = t2RoundCards.reduce(mapPointCards, {})

          const t1GamePoints =
            (mappedPointCards['10'] * 10 || 0) +
            (mappedPointCards['A'] * 4 || 0) +
            (mappedPointCards['K'] * 3 || 0) +
            (mappedPointCards['Q'] * 2 || 0) +
            (mappedPointCards['J'] * 1 || 0)

          const t2GamePoints =
            (mappedPointCards2['10'] * 10 || 0) +
            (mappedPointCards2['A'] * 4 || 0) +
            (mappedPointCards2['K'] * 3 || 0) +
            (mappedPointCards2['Q'] * 2 || 0) +
            (mappedPointCards2['J'] * 1 || 0)

          console.log('T1 Game Points:', t1GamePoints)
          console.log('T2 Game Points:', t2GamePoints)

          const gameWinner = t1GamePoints > t2GamePoints ? 1 : 2

          // Check for Bid Points
          // Team 1
          const t1TrumpCards = t1RoundCards.filter(
            (c) => c.suit === 's' // gameData.bid.trumpSuit
          )

          t1TrumpCards.map((c, i) => {
            if (c.spot === 'A') return (t1TrumpCards[i].spot = '14')
            if (c.spot === 'K') return (t1TrumpCards[i].spot = '13')
            if (c.spot === 'Q') return (t1TrumpCards[i].spot = '12')
            if (c.spot === 'J') return (t1TrumpCards[i].spot = '11')
          })

          const t1SortedHigh = [...t1TrumpCards].sort((a, b) => b.spot - a.spot)
          const t1SortedLow = [...t1TrumpCards].sort((a, b) => a.spot - b.spot)

          // Team 2
          const t2TrumpCards = t2RoundCards.filter(
            (c) => c.suit === 's' // gameData.bid.trumpSuit
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

          console.log('Jack Winner', getJackWinner())

          console.log(
            'Team 1 High: ',
            t1SortedHigh[0].spot,
            'Team 1 Low: ',
            t1SortedLow[0].spot
          )
          console.log(
            'Team 2 High: ',
            t2SortedHigh[0].spot,
            'Team 2 Low: ',
            t2SortedLow[0].spot
          )

          const highWinner =
            parseInt(t1SortedHigh[0].spot) > parseInt(t2SortedHigh[0].spot)
              ? 1
              : 2
          const lowWinner =
            parseInt(t1SortedLow[0].spot) < parseInt(t2SortedLow[0].spot)
              ? 1
              : 2

          const scoreRound = () => {
            let t1Score = 0
            let t2Score = 0
            highWinner === 1 ? t1Score++ : t2Score++
            lowWinner === 1 ? t1Score++ : t2Score++
            gameWinner === 1 ? t1Score++ : t2Score++
            let jackWinner = getJackWinner()
            if (jackWinner === 1) {
              t1Score++
            }
            if (jackWinner === 2) {
              t2Score++
            }
            return { t1Score, t2Score }
          }

          console.log('Round Score', scoreRound())
          /* const update = {
            turn: handWinner,
            leader: handWinner,
            newTrick: true,
            trick: gameData.trick + 1,
            trickCards: [],
            [`roundCards.${trickWinner}`]: getRoundCards(),
          }
          gameRef.update(update) */
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
