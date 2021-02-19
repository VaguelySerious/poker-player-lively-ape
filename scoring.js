const valMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
};

function convertCardsToNumbers(cards) {
  return cards
    .map((card) => card.rank)
    .map((rank) => {
      if (Object.keys(valMap).some((key) => key === rank)) {
        return valMap[rank]
      }
      return rank
    })
}

function detectPairsOrBetter(ours, comm) {
  const oursAsNumbers = convertCardsToNumbers(ours)
  const commAsNumbers = convertCardsToNumbers(comm)
  const allNumbers = [...oursAsNumbers, ...commAsNumbers]
  let result = false
  const s = new Set(allNumbers)
  if (allNumbers.length !== s.size) {
    result = true
  }
  return result
}

function toValue(rank) {
  return Number.isNaN(Number.parseInt(rank)) ? valMap[rank] : Number(rank)
}

function detectTriple() {}

function getScore(ours, comm, round) {
  try {
    return Math.floor(Math.random() * 100)
    // return score;
  } catch (e) {
    console.log(e)
    return 50
  }
}

module.exports = getScore
