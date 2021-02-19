class Player {
  static get VERSION() {
    return '0.1'
  }

  static betRequest(gameState, bet) {
    console.log('janko was here')
    bet(0)
  }

  static showdown(gameState) {}
}

module.exports = Player
