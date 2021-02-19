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
    return Math.floor(Math.random() * 100);
    // return score;
  } catch (e) {
    console.log(e);
    return 50;
  }
}

module.exports = getScore;
