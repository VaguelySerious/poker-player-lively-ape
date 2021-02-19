const PokerRank = require("poker-rank");
const getScore = require("scoring");

class Player {
  static get VERSION() {
    return "0.1";
  }

  static betRequest(gs, bet) {
    const us = gs.players[in_action];
    const ourCards = us.hole_cards;
    const commCards = gs.community_cards;

    const callAmount = gs.current_buy_in - us[bet] + gs.minimum_raise;
    const highestScore = getScore(ourCards, commCards, gs.round);

    if (highestScore < 10) {
      const otherPlayers = gs.players((p) => p != us);
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
