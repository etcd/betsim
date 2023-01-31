import { randomInt } from "../utilities/Random";

export type BinaryTrialBets = readonly [number, number];

/** A scenario, which includes the probability, bets, and an outcome */
export interface BinaryTrial {
  probability: number;
  bets: BinaryTrialBets;
  outcome: boolean;
}

/** Binary trial bets are the `no`/`yes` bet totals */
export const makeBinaryTrialBets = (
  /** fraction that are `no`s */
  fractionNo: number,
  /** lower bound of the scaling constant */
  scaleMin: number = 100_000,
  /** upper bound of the scaling constant */
  scaleMax: number = 100_000_000
): BinaryTrialBets => {
  const scale = randomInt(scaleMin, scaleMax);
  const nNo = Math.round(fractionNo * scale);
  const nYes = Math.round((1 - fractionNo) * scale);
  return [nNo, nYes] as const;
};

/** Makes a scenario */
export const makeBinaryTrial = (
  inefficiencyFn: (_: number) => number
): BinaryTrial => {
  // randomly generate a probability
  const probability = Math.random();

  const crowdProbability = inefficiencyFn(probability);

  // get the binary bet distribution
  const bets = makeBinaryTrialBets(1 - crowdProbability);

  // collapse probability to outcome
  const outcome = Math.random() < probability;

  return { probability, bets, outcome };
};
