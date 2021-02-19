const suits = {
  h: "hearts",
  s: "spades",
  c: "clubs",
};

function convertToPR(cards) {
  return cards.map((c) => {
    return {
      rank: c.value,
      suit: suits[c.suit],
    };
  });
}

function getScore(ours, comm, round) {
  try {
    const rawScores = PokerRank.scoreHands(
      convertToPR(ours),
      convertToPR(comm)
    );
    const highestScore = rawScores.map((rawScore) =>
      PokerRank.getBestHand(rawScore)
    );
    console.log({ highestScore });
    return highestScore;
  } catch (e) {
    return 20;
  }
}

module.exports = getScore;
