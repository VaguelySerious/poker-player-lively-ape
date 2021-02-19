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

function badHeuristic(ours, comms, round) {
  const highCardAmount = ours.map((o) => +o.rank).filter((o) => Number.isNaN(o))
    .length;

  if (!comms.length) {
    if (highCardAmount >= 1) {
      return 50;
    } else {
      return 0;
    }
  }

  const pairs = ours
    .map((c) => comms.find((c2) => c.rank === c2.rank))
    .filter(Boolean).length;

  if (pairs.length >= 2) {
    return 100;
  } else if (pairs.length == 2) {
    return 50;
  } else {
    return 0;
  }

  return 50;
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
    const ourCards = us.hole_cards;
    const commCards = gs.community_cards;

    const callAmount = gs.current_buy_in - us.bet + gs.minimum_raise;
    // const score = getScore(ourCards, commCards, gs.round);
    const score = badHeuristic(ourCards, commCards, gs.round);
    console.log("Score", score);

    if (score > 70) {
      const otherPlayers = gs.players.filter((p) => p != us);
      const highestOtherStack = otherPlayers
        .map((o) => o.stack)
        .reduce((acc, a) => acc + a, 0);

      const ourStack = us.stack;

      if (ourStack >= highestOtherStack) {
        console.log("Forcing others all in", highestOtherStack);
        return highestOtherStack;
      } else {
        console.log("Going all in", ourStack);
        return ourStack;
      }
    } else if (score > 20) {
      console.log("Calling", callAmount);
      return callAmount;
    } else {
      console.log("Call or fold");
      return 0;
    }
  }

  static showdown(gs) {
    // Always call during showdown for now
    // const us = gs.players[gs.in_action];
    // console.log({ us, in_action });
    // const callAmount = gs.current_buy_in - us.bet + gs.minimum_raise;
    // console.log("Calling in showdown", callAmount);
    // bet(callAmount);
  }
}

module.exports = Player;
