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
    if (!gs) {
      console.log("GameState undefined");
      bet(0);
      return;
    }
    const us = gs.players[gs.in_action];
    const ourCards = us.hole_cards;
    const commCards = gs.community_cards;

    const callAmount = gs.current_buy_in - us.bet + gs.minimum_raise;
    const highestScore = getScore(ourCards, commCards, gs.round);

    if (highestScore < 10) {
      const otherPlayers = gs.players.filter((p) => p != us);
      const highestOtherStack = otherPlayers
        .map((o) => o.stack)
        .reduce((acc, a) => acc + a, 0);

      const ourStack = us.stack;

      if (ourStack >= highestOtherStack) {
        bet(highestOtherStack);
      } else {
        bet(ourStack);
      }
    } else if (gs.round < 4 && highestScore < 19) {
      // Think about raising later
      bet(callAmount);
    } else {
      bet(0);
    }
  }

  static showdown(gameState) {}
}

module.exports = Player;
