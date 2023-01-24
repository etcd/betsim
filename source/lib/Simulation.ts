import { range } from "../utilities/Arrays";
import {
  invertOdds,
  ratioToImpliedP,
  ratioToOdds,
} from "../utilities/Probability";
import { makePoint, Point } from "./Point";
import { offsetProbability } from "./ProbabilityOffset";

const calculateAmountWon = (point: Point, outcome: boolean, bet: number) => {
  const yesOdds = ratioToOdds(...point);
  const noOdds = invertOdds(yesOdds);

  // bet `yes` and win
  if (bet > 0 && outcome === true) return bet * (yesOdds - 1);
  // bet `no` and won
  if (bet < 0 && outcome === false) return -1 * bet * (noOdds - 1);
  // lose
  return outcome ? bet : -bet;
};

/** Facts given at time of bet */
interface Facts {
  point: Point;
  balance: number;
  realProbability: number;
}

export const simulate = ({
  name,
  nPoints,
  startingBalance = 1,
  marketInefficiency,
  betFn,
}: {
  name: string;
  nPoints: number;
  startingBalance: number;
  marketInefficiency: number;
  betFn: (facts: Facts) => number;
}) => {
  // get points
  const points = Array.from({ length: nPoints }, () =>
    makePoint(marketInefficiency)
  );

  // get real probabilities given market inefficiency
  const realProbabilities: number[] = points.map((point) => {
    return offsetProbability(ratioToImpliedP(...point), marketInefficiency);
  });

  // collapse probabilities to outcomes
  const outcomes: boolean[] = points.map(
    (_, i) => Math.random() < realProbabilities[i]
  );

  // simulate
  const bets: number[] = Array.from({ length: nPoints });
  const amountWon: number[] = Array.from({ length: nPoints });
  const startingBalances: number[] = Array.from({ length: nPoints + 1 });
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
    odds: ratioToOdds(...points[i]),
    outcome: outcomes[i],
    impliedP: ratioToImpliedP(...points[i]),
    realProbability: realProbabilities[i],
    bet: bets[i],
    betFraction: bets[i] / startingBalances[i],
    amountWon: amountWon[i],
    name,
    ...points[i],
  }));

  return simData;
};
