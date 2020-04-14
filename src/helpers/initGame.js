import firebase from '../firebase.js'

export default (members) => {
  const getPlayers = () => {
    let players = []
    members.forEach((m, i) => {
      players.push({ seat: i, pid: m, hand: [] })
    })
    players.forEach((player) => {
      while (player.hand.length !== 6) {
        player.hand.push(
          DECK.splice(Math.floor(Math.random() * DECK.length), 1)[0]
        )
      }
    })
    return players
  }

  const playersArr = getPlayers()
  const gameData = {
    players: {
      0: playersArr[0],
      1: playersArr[1],
      2: playersArr[2],
      3: playersArr[3],
    },
    winner: null,
    score: [0, 0],
    dealer: 0,
    turn: 1, // dealer + 1
    bid: { bid: 0, bidder: 0, trumpSuit: '' },
    leader: 1,
    dealtCards: [], // set of all cards dealt for prescoring
    trick: 0,
    trickCards: [],
    t1RoundCards: [],
    t2RoundCards: [],
    state: 'NEW',
    timeStarted: firebase.firestore.Timestamp.fromDate(new Date()),
  }

  return gameData
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
