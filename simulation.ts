makeSimulation = ({
  name,
  nPoints,
  startingBalance = 1,
  marketInefficiency,
  betFn,
}) => {
  const points = Array.from({ length: nPoints }, () =>
    makePoint(marketInefficiency)
  );

  // get real probabilities given market inefficiency
  const realProbabilities = points.map((p) => {
    return offsetProbability(ratioToImpliedP(p.no, p.yes), marketInefficiency);
  });

  // collapse probabilities to outcomes
  const outcomes = points.map((p, i) =>
    Math.random() < realProbabilities[i] ? 1 : -1
  );

  // simulate
  const bets = Array.from({ length: nPoints });
  const amountWon = Array.from({ length: nPoints });
  const startingBalances = Array.from({ length: nPoints + 1 });
  startingBalances[0] = startingBalance;

  for (let i = 0; i < nPoints; i++) {
    if (startingBalances[i] <= 0) {
      bets.length = i;
      amountWon.length = i;
      startingBalances.length = i;
      break;
    }

    bets[i] = betFn({
      point: points[i],
      balance: startingBalances[i],
      realProbability: realProbabilities[i],
    });
    amountWon[i] = calculateAmountWon(points[i], outcomes[i], bets[i]);
    startingBalances[i + 1] = startingBalances[i] + amountWon[i];
  }

  // prepare simulation data to output
  const simData = range(bets.length).map((i) => ({
    x: i,
    startingBalance: startingBalances[i],
    odds: ratioToOdds(points[i].no, points[i].yes),
    outcome: outcomes[i],
    impliedP: ratioToImpliedP(points[i].no, points[i].yes),
    realProbability: realProbabilities[i],
    bet: bets[i],
    betFraction: bets[i] / startingBalances[i],
    amountWon: amountWon[i],
    name,
    ...points[i],
  }));

  return simData;
};
