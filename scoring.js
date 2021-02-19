const valMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
};

function toValue(rank) {
  return Number.isNaN(Number.parseInt(rank)) ? valMap[rank] : Number(rank);
}

function detectPairs() {}

function detectTriple() {}

function getScore(ours, comm, round) {
  try {
    const score =
      15 -
      ours
        .map((card) => toValue(card.rank))
        .reduce((acc, a) => (acc > a ? acc : a), 0);
    console.log({ score });
    // const highestScore = rawScores.map((rawScore) =>
    //   PokerRank.getBestHand(rawScore)
    // );
    return score;
  } catch (e) {
    return 20;
  }
}

module.exports = getScore;
