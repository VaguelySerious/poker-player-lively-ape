const PokerRank = require("@rgerd/poker-rank");

const valMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
};

function toValue(rank) {
  return Number.isNaN(Number.parseInt(rank)) ? valMap[rank] : Number(rank);
}

function convertToPR(cards) {
  return cards.map((c) => {
    return {
      value: toValue(c.rank),
      suit: c.suit.slice(0, 1),
    };
  });
}

function getScore(ours, comm, round) {
  try {
    // const rawScores = PokerRank.scoreHands(
    //   convertToPR([ours]),
    //   convertToPR(comm)
    // );
    const rawScores =
      15 -
      ours
        .map((card) => toValue(card.rank))
        .reduce((acc, a) => (acc > a ? acc : a), 0);
    console.log({ rawScores });
    // const highestScore = rawScores.map((rawScore) =>
    //   PokerRank.getBestHand(rawScore)
    // );
    return rawScores;
  } catch (e) {
    console.log(e);
    return 20;
  }
}

module.exports = getScore;
