import { range } from "../utilities/Arrays";
import {
  invertOdds,
  ratioToImpliedP,
  ratioToOdds,
} from "../utilities/Probability";
import { makePoint } from "./Point";

import { offsetProbability } from "./ProbabilityOffset";
import { BinaryTrialBets, makeBinaryTrial } from "./Trial";

/** Calculates the amount won from a bet given relevant factors from the scenario */
const calculateAmountWon = (
  point: BinaryTrialBets,
  outcome: boolean,
  bet: number
) => {
  const yesOdds = ratioToOdds(...point);
  const noOdds = invertOdds(yesOdds);

  // bet `yes` and win
  if (bet > 0 && outcome === true) return bet * (yesOdds - 1);
  // bet `no` and won
  if (bet < 0 && outcome === false) return -1 * bet * (noOdds - 1);
  // lose
  return outcome ? bet : -bet;
};

/** Facts known at time of bet */
export interface Facts {
  bets: BinaryTrialBets;
  balance: number;
  realProbability: number;
}

/** Simulates a sequence of bet scenarios and outcomes */
export const simulate = ({
  name,
  nPoints,
  marketInefficiency,
  betFn,
  startingBalance = 1,
}: {
  name: string;
  nPoints: number;
  marketInefficiency: number;
  betFn: (facts: Facts) => number;
  startingBalance?: number;
}) => {
  const trials = Array.from({ length: nPoints }, () =>
    makeBinaryTrial((n) => offsetProbability(n, marketInefficiency))
  );

  const trialBets = trials.map((t) => t.bets);
  const trialProbabilities = trials.map((t) => t.probability);
  const trialOutcomes = trials.map((t) => t.outcome);

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
      bets: trialBets[i],
      balance: startingBalances[i],
      realProbability: trialProbabilities[i],
    });
    amountWon[i] = calculateAmountWon(trialBets[i], trialOutcomes[i], bets[i]);
    startingBalances[i + 1] = startingBalances[i] + amountWon[i];
  }

  // prepare simulation data to output
  const simulationData = range(bets.length).map((i) => ({
    x: i,
    startingBalance: startingBalances[i],
    odds: ratioToOdds(...trialBets[i]),
    outcome: trialOutcomes[i],
    impliedP: ratioToImpliedP(...trialBets[i]),
    realProbability: trialProbabilities[i],
    bet: bets[i],
    betFraction: bets[i] / startingBalances[i],
    amountWon: amountWon[i],
    name,
    ...trialBets[i],
  }));

  return simulationData;
};
