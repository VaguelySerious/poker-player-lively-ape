const { assert, expect } = require('chai')
const Player = require('../Player')

function createState(holeCards, communityCards) {
  return {
    round: 0,
    bet_index: 0,
    current_buy_in: 320,
    pot: 400,
    minimum_raise: 240,
    in_action: 1,
    players: [
      {
        stack: 1010,
        bet: 320,
      },
      {
        stack: 1590,
        bet: 80,
        hole_cards: holeCards || [
          {
            rank: '6',
            suit: 'hearts',
          },
          {
            rank: 'K',
            suit: 'spades',
          },
        ],
      },
      {
        stack: 0,
        bet: 0,
      },
    ],
    community_cards: communityCards || [
      {
        rank: '4',
        suit: 'spades',
      },
      {
        rank: 'A',
        suit: 'hearts',
      },
      {
        rank: '6',
        suit: 'clubs',
      },
    ],
  }
}

describe('bet', function () {
  describe('bet1', function () {
    const state = createState()
    const result = Player._betRequest(createState())
    assert.isAtLeast(result, 400)
  })
  describe('bet1', function () {
    const holeCards = [
      {
        rank: '1',
        suit: 'hearts',
      },
      {
        rank: '2',
        suit: 'spades',
      },
    ]
    const state = createState(holeCards)
    const result = Player._betRequest(createState())
    assert.isAtLeast(result, 0)
  })

  describe('bet1', function () {
    const holeCards = [
      {
        rank: 'A',
        suit: 'hearts',
      },
      {
        rank: 'A',
        suit: 'spades',
      },
    ]
    const state = createState(holeCards)
    const result = Player._betRequest(createState())
    assert.isAtLeast(result, 500)
  })
})
