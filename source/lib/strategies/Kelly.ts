import {
  invertOdds,
  oddsToImpliedP,
  ratioToOdds,
} from "../../utilities/Probability";
import { Facts } from "../Simulation";

/** How much to bet as a fraction of holdings */
const getKellyBetFraction = (
  marketOdds: number,
  edge: number,
  riskAversionFn?: (probability: number) => number
) => {
  // the probability you believe an event has
  const p = oddsToImpliedP(marketOdds) + edge;

  // bet yes if edge is positive
  if (edge >= 0) {
    // when edge is positive, you bet `yes` and have `yes` odds
    const winProfitMultiple = marketOdds - 1;
    // apply kelly formula
    const kellyFraction = p - (1 - p) / winProfitMultiple;
    // apply risk aversion factor
    return (
      kellyFraction * (riskAversionFn !== undefined ? riskAversionFn(p) : 1)
    );
  } else {
    // when edge is negative, you bet `no` and have `no` odds
    const winProfitMultiple = invertOdds(marketOdds) - 1;
    // you have the inverse probability of a win
    const inverseP = 1 - p;
    // apply kelly formula (multiplied by -1 to bet `no`)
    const kellyFraction = -1 * (inverseP - (1 - inverseP) / winProfitMultiple);
    // apply risk aversion factor
    return (
      kellyFraction * (riskAversionFn !== undefined ? riskAversionFn(p) : 1)
    );
  }
};

/**
 * This strategy bets according to the Kelly Criterion:
 * https://en.wikipedia.org/wiki/Kelly_criterion
 *
 * These bets are theoretically optimal. The Kelly criterion sizes bets exactly
 * proportional to payout, and therefore outperforms the edge strategy.
 *
 * This is not a realistic strategy because it uses `realProbability`.
 */
export const KellyStrategy =
  (scale: number, riskAversionFn?: (probability: number) => number) =>
  ({ bets, balance, realProbability }: Facts) => {
    const marketOdds = ratioToOdds(...bets);
    const betFraction = getKellyBetFraction(
      marketOdds,
      realProbability - oddsToImpliedP(marketOdds),
      riskAversionFn
    );

    return betFraction * balance * scale;
  };
