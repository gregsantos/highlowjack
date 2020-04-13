const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

const gameData = {
  players: getPlayers(),
  winner: null,
  score: [0, 0],
  dealer: 0,
  turn: 1,
  boss: null,
  roundCards: [],
  bid: { bid: 0, bidder: 0, trumpSuit: '' },
  trick: 0,
  trickCards: [],
  state: 'NEW',
  timeStarted: firebase.firestore.Timestamp.fromDate(new Date()),
}

function dealHands(
  deck = DECK,
  players = [
    { p: 1, hand: [] },
    { p: 2, hand: [] },
    { p: 3, hand: [] },
    { p: 4, hand: [] },
  ],
  numCards = 6
) {
  players.forEach((player) => {
    while (player.hand.length !== numCards) {
      player.hand.push(
        deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
      )
    }
    return players
  })
}

const DECK = [
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

exports.initGame = functions.firestore
  .document('games/{id}')
  .onCreate((snap, context) => {
    const newGame = snap.data()
    const gameType = newGame.gameType
    console.log(`New ${gameType} game started`)
    const playerHands = dealHands()
    console.log(snap.ref)
    // Return a promise of a set operation to update the game
    return snap.ref.set(
      {
        players: playerHands,
        winner: null,
        score: [0, 0],
        dealer: 0,
        turn: 1,
        boss: null,
        roundCards: [],
        bid: { bid: 0, bidder: 0, trumpSuit: '' },
        trick: 0,
        trickCards: [],
        state: 'NEW',
        timeStarted: firebase.firestore.Timestamp.fromDate(new Date()),
      },
      { merge: true }
    )

    // Get an object representing the current document
    // const newValue = change.after.data()
    // ...or the previous value before this update
    // const previousValue = change.before.data()

    // Fetch data using standard accessors
    // const age = snap.data().age
    // const name = snap.data()['name']

    // Fetch data using built in accessor
    // const experience = snap.get('experience')

    // update(), set(), and remove()
  })
