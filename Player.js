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
  const val = valMap[card.rank] || Number(card.rank);
  return {
    rank: val,
    suit: card.suit,
  };
}

let previousAction = null;
function badHeuristic(gs) {
  const us = gs.players[gs.in_action];
  const cards = us.hole_cards.map(getValue);
  const comms = gs.community_cards.map(getValue);
  const round = gs.round;
  const callAmount = gs.current_buy_in - us.bet;
  const minimumRaise = gs.current_buy_in - us.bet + gs.minimum_raise;

  const cardScores = cards.map((c) => c.rank);
  const avgCardScore = Math.floor(
    cardScores.reduce((acc, a) => acc + a, 0) / 2
  );
  const handPair = +cards[0].rank === cards[1].rank;
  const highCardAmount = cardScores.filter((s) => s > 10).length;

  const otherPlayers = gs.players.filter((p) => p != us);
  const matches = cards.map(
    (c) => comms.filter((c2) => c.rank === c2.rank).length
  );
  // const highMatches;

  const pairs = matches.filter(Boolean).length + handPair;
  const triples = matches.filter((m) => m > 1).length;
  const all = cards.concat(comms).sort((a, b) => a.rank - b.rank);
  let lowest = all[0].rank;
  let inRow = 0;
  for (let i = 1; i < all.length; i++) {
    const cc = all[i];
    if (cc.rank === lowest + 1) {
      inRow++;
    } else {
      inRow = 0;
    }
    lowest = cc.rank;
  }
  const straight = Number(inRow === 4);
  const likelyFutureStraight = !straight && comms.length <= 3 && inRow === 3;
  const flushChance = all.filter((a) => a.suit === all[0].suit).length;
  const flush = flushChance >= 5;
  const likelyFutureFlush = !flush && comms.length <= 3 && flushChance >= 4;

  const score =
    (5 - comms.length) * 6 +
    straight * 70 +
    flush * 80 +
    likelyFutureFlush * 30 +
    likelyFutureStraight * 35 +
    pairs * 25 +
    highCardAmount * 8 +
    avgCardScore * 1 +
    triples * 50;

  const alreadyBet = ["raise", "bigraise"].includes(previousAction);

  console.log(`
  - Winchance: ${score}
  - ${avgCardScore} Avg card score
  - ${highCardAmount} High cards
  - ${pairs} Pairs ${handPair ? "with a hand pair" : ""}
  - ${triples} Triples${straight ? "\n-  A straight!" : ""}${
    flush ? "\n  - A FLUSH!" : ""
  }`);
  if (us.bet === 0 && score < 60) {
    return "fold";
  }
  if (us.stack > 50) {
    if (us.bet < 5 && score < 52) {
      return "fold";
    }
    if (us.bet < 3 && score < 45) {
      return "fold";
    }
  }
  if (us.stack === 0) {
    return "allin";
  }
  if (score > 80) {
    return "allin";
  }
  if (score > 58 && !alreadyBet) {
    return "bigraise";
  }
  if (score > 45 && !alreadyBet) {
    return "raise";
  }
  if (score > 28) {
    return "call";
  }
  if (score > 20 && callAmount < 500) {
    return "call";
  }
  if (score > 10 && callAmount < 100) {
    return "call";
  }
  return "fold";
}

class Player {
  static get VERSION() {
    return "scared berseker";
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
    } else if (
      typeof action === "number" ||
      action === "raise" ||
      action === "bigraise"
    ) {
      if (action === "bigraise") {
        console.log("Big raising", minimumRaise + us.stack / 2.5);
        return Math.floor(minimumRaise + us.stack / 2.5);
      }
      console.log("Raising", minimumRaise + us.stack / 6);
      return Math.floor(minimumRaise + us.stack / 6);
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
