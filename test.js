const Player = require("./Player");

const state = {
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
      hole_cards: [
        {
          rank: "6",
          suit: "spades",
        },
        {
          rank: "K",
          suit: "spades",
        },
      ],
    },
    {
      stack: 0,
      bet: 0,
    },
  ],
  community_cards: [
    {
      rank: "4",
      suit: "spades",
    },
    {
      rank: "A",
      suit: "spades",
    },
    {
      rank: "6",
      suit: "spades",
    },
  ],
};

Player._betRequest(state);
Player._betRequest({ ...state, community_cards: [] });
