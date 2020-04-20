const GAMEDATA = {
  bid: { bid: 0, bidder: 0 },
  dealer: 0,
  lastCard: '',
  leader: '',
  players: [],
  scoreTeamOne: 0,
  scoreTeamTwo: 0,
  state: 'NEW',
  trick: [],
  trumpSuit: '',
  turn: 0,
  winner: '',
  // dateStarted: firebase.firestore.Timestamp.fromDate(new Date()),
}

export const dealHands = (
  deck = DECK,
  players = [
    { p: 1, hand: [] },
    { p: 2, hand: [] },
    { p: 3, hand: [] },
    { p: 4, hand: [] },
  ],
  numCards = 6
) => {
  players.forEach((player) => {
    while (player.hand.length !== numCards) {
      player.hand.push(
        deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
      )
    }
    return players
  })
}

export const DECK = [
  'dA',
  'dK',
  'dQ',
  'dJ',
  'd10',
  'd09',
  'd08',
  'd07',
  'd06',
  'd05',
  'd04',
  'd03',
  'd02',
  'hA',
  'hK',
  'hQ',
  'hJ',
  'h10',
  'h09',
  'h08',
  'h07',
  'h06',
  'h05',
  'h04',
  'h03',
  'h02',
  'sA',
  'sK',
  'sQ',
  'sJ',
  's10',
  's09',
  's08',
  's07',
  's06',
  's05',
  's04',
  's03',
  's02',
  'cA',
  'cK',
  'cQ',
  'cJ',
  'c10',
  'c09',
  'c08',
  'c07',
  'c06',
  'c05',
  'c04',
  'c03',
  'c02',
]
