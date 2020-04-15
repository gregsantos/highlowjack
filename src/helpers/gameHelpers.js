export const tallyTrick = ({ gameData, nextPlayer }) => {
  const lastRoundCard = gameData.trick === 6 && nextPlayer === gameData.leader
  /*     if (lastRoundCard) {
      // last trick in round
      // call tallyRound() & resetRound()
      // check points toward bid, count for game and score round
      const nextDealer = gameData.dealer === 3 ? 0 : gameData.dealer + 1
      return {
        turn: nextDealer + 1,
        leader: nextDealer + 1,
        dealer: nextDealer,
        trick: 0, // 7 for round results alert
        trickCards: [],
        t1RoundCards: [],
        t2RoundCards: [],
      }
    } else {
      // last card in trick
      // calculate new leader, add trick to winners
      // roundCards
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
      const trickWinner = winningCard.p === 0 || 2 ? 0 : 1
      return {
        turn: handWinner,
        leader: handWinner,
        trick: gameData.trick + 1,
        trickCards: [],
        t1RoundCards:
          trickWinner === 0
            ? firebase.firestore.FieldValue.arrayUnion(
                ...[cardData, ...[gameData.trickCards]]
              )
            : [],
        t2RoundCards: [],
      }
    } */
}
