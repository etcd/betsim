import { range } from "../utilities/Arrays";
import {
  invertOdds,
  ratioToImpliedP,
  ratioToOdds,
} from "../utilities/Probability";

import { offsetProbability } from "./ProbabilityOffset";
import { BinaryTrial, BinaryTrialBook, makeBinaryTrial } from "./Trial";

/** Calculates the amount won from a bet given relevant factors from the scenario */
const calculateAmountWon = (
  book: BinaryTrialBook,
  outcome: boolean,
  bet: number
) => {
  const yesOdds = ratioToOdds(...book);
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
  book: BinaryTrialBook;
  balance: number;
  realProbability: number;
}

/** Simulates a sequence of bet scenarios and outcomes */
export const simulate = ({
  name,
  trials,
  marketInefficiency,
  betFn,
  startingBalance = 1,
}: {
  name: string;
  trials: BinaryTrial[];
  marketInefficiency: number;
  betFn: (facts: Facts) => number;
  startingBalance?: number;
}) => {
  const trialBooks = trials.map((t) => t.book);
  const trialProbabilities = trials.map((t) => t.probability);
  const trialOutcomes = trials.map((t) => t.outcome);

  // simulate
  const bets: number[] = Array.from({ length: trials.length });
  const amountWon: number[] = Array.from({ length: trials.length });
  const startingBalances: number[] = Array.from({ length: trials.length + 1 });
  startingBalances[0] = startingBalance;

  for (let i = 0; i < trials.length; i++) {
    if (startingBalances[i] <= 0) {
      bets.length = i;
      amountWon.length = i;
      startingBalances.length = i;
      break;
    }

    bets[i] = betFn({
      book: trialBooks[i],
      balance: startingBalances[i],
      realProbability: trialProbabilities[i],
    });
    amountWon[i] = calculateAmountWon(trialBooks[i], trialOutcomes[i], bets[i]);
    startingBalances[i + 1] = startingBalances[i] + amountWon[i];
  }

  // prepare simulation data to output
  const simulationData = range(bets.length).map((i) => ({
    x: i,
    startingBalance: startingBalances[i],
    odds: ratioToOdds(...trialBooks[i]),
    outcome: trialOutcomes[i],
    impliedP: ratioToImpliedP(...trialBooks[i]),
    realProbability: trialProbabilities[i],
    bet: bets[i],
    betFraction: bets[i] / startingBalances[i],
    amountWon: amountWon[i],
    name,
    ...trialBooks[i],
  }));

  return simulationData;
};
