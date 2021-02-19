const valMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
}

const exampleCards = [
  {
    rank: '4',
    suit: 'spades',
  },
  {
    rank: 'A',
    suit: 'hearts',
  },
  {
    rank: '6',
    suit: 'clubs',
  },
]

function convertCardsToNumbers(cards) {
  return cards
    .map((card) => card.rank)
    .map((rank) => {
      if (Object.keys(valMap).some((key) => key === rank)) {
        return valMap[rank]
      }
      return Number(rank)
    })
}

const numberCards = convertCardsToNumbers(exampleCards)

console.log(numberCards)
