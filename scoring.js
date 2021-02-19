const PokerRank = require("@rgerd/poker-rank");

function convertToPR(cards) {
  return cards.map((c) => {
    return {
      rank: c.rank,
      suit: c.suit.slice(0, 1),
    };
  });
}

function getScore(ours, comm, round) {
  console.log({
    ours,
    comm,
  });
  console.log({
    ours: convertToPR(ours),
    comm: convertToPR(comm),
  });
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
    console.log(e);
    return 20;
  }
}

module.exports = getScore;
