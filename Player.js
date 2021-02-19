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

class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gs, bet) {
    const us = gs.players[gs.in_action];
    const ourCards = us.hole_cards;
    const commCards = gs.community_cards;

    const callAmount = gs.current_buy_in - us.bet + gs.minimum_raise;
    const score = getScore(ourCards, commCards, gs.round);
    console.log("Score", score);

    if (score > 70) {
      const otherPlayers = gs.players.filter((p) => p != us);
      const highestOtherStack = otherPlayers
        .map((o) => o.stack)
        .reduce((acc, a) => acc + a, 0);

      const ourStack = us.stack;

      if (ourStack >= highestOtherStack) {
        console.log("Forcing others all in");
        bet(highestOtherStack);
      } else {
        console.log("Going all in");
        bet(ourStack);
      }
    } else if (score > 20) {
      console.log("Calling");
      bet(callAmount);
    } else {
      console.log("Call or fold");
      bet(0);
    }
  }

  static showdown(gs) {
    const us = gs.players[gs.in_action];
    const ourCards = us.hole_cards;
    const commCards = gs.community_cards;
    const callAmount = gs.current_buy_in - us.bet + gs.minimum_raise;
    // const score = getScore(ourCards, commCards, gs.round);

    const otherPlayers = gs.players.filter((p) => p != us);
    const highestOtherStack = otherPlayers
      .map((o) => o.stack)
      .reduce((acc, a) => acc + a, 0);

    const ourStack = us.stack;

    if (ourStack >= highestOtherStack) {
      console.log("Forcing others all in");
      bet(highestOtherStack);
    } else {
      console.log("Going all in");
      bet(ourStack);
    }
  }
}

module.exports = Player;
