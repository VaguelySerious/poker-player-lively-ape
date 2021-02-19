const getScore = require("./scoring");

// {
//   gs: {
//     tournament_id: '550d1d68cd7bd10003000003',
//     game_id: '550da1cb2d909006e90004b1',
//     round: 0,
//     bet_index: 0,
//     small_blind: 10,
//     current_buy_in: 320,
//     pot: 400,
//     minimum_raise: 240,
//     dealer: 1,
//     orbits: 7,
//     in_action: 1,
//     players: [ [Object], [Object], [Object] ],
//     community_cards: [ [Object], [Object], [Object] ]
//   }
// }
// {
//   us: {
//     id: 1,
//     name: 'Bob',
//     status: 'active',
//     version: 'Default random player',
//     stack: 1590,
//     bet: 80,
//     hole_cards: [ [Object], [Object] ]
//   }
// }

const valMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
};

function getValue(card) {
  if (Object.keys(valMap).some((key) => key === card.rank)) {
    return valMap[card.rank];
  }
  return Number(card.rank);
}

let previousAction = null;

function badHeuristic(gs) {
  const us = gs.players[gs.in_action];
  const cards = us.hole_cards;
  const comms = gs.community_cards;
  const round = gs.round;

  if (us.stack === 0) {
    return "allin";
  }

  const cardScores = cards.map(getValue);
  const avgCardScore = Math.floor(
    cardScores.reduce((acc, a) => acc + a, 0) / 2
  );
  const handPair = cards[0].rank === cards[1].rank;
  const highCardAmount = cardScores.filter((s) => s > 10).length;
  const triples = 0;

  const otherPlayers = gs.players.filter((p) => p != us);
  const pairs =
    cards.map((c) => comms.find((c2) => c.rank === c2.rank)).filter(Boolean)
      .length + Number(handPair);

  console.log(`We have:
  - ${avgCardScore} Avg card score
  - ${highCardAmount} High cards
  - ${handPair} Hand pairs
  - ${triples} Triples
  - ${pairs} Pairs
`);

  if (!comms.length) {
    if (handPair) {
      return "allin";
    }
    if (highCardAmount == 2) {
      if (previousAction !== "raise") {
        return "call";
      }
      return "raise";
    } else if (highCardAmount == 1) {
      return "call";
    } else {
      return "fold";
    }
  }

  if (pairs >= 3) {
    return "allin";
  } else if (pairs >= 2) {
    return "allin";
  } else if (pairs == 1) {
    return "call";
  } else {
    return "fold";
  }
}

class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gs, bet) {
    bet(this._betRequest(gs));
  }

  static _betRequest(gs) {
    const us = gs.players[gs.in_action];

    const callAmount = gs.current_buy_in - us.bet;
    const minimumRaise = gs.current_buy_in - us.bet + gs.minimum_raise;

    const otherPlayers = gs.players.filter((p) => p != us);
    const highestOtherStack = otherPlayers
      .map((o) => o.stack)
      .reduce((acc, a) => acc + a, 0);

    const action = badHeuristic(gs);
    console.log("Determined action", action);
    previousAction = action;

    if (action === "allin") {
      if (us.stack >= highestOtherStack) {
        console.log("Forcing others all in", highestOtherStack);
        return highestOtherStack;
      } else {
        console.log("Going all in", us.stack);
        return us.stack;
      }
    } else if (typeof action === "number" || action === "raise") {
      console.log("Raising", minimumRaise);
      return minimumRaise;
    } else if (action === "call") {
      console.log("Calling", callAmount);
      return callAmount;
    } else {
      return 0;
    }
  }

  static showdown(gs) {}
}

module.exports = Player;
