import { Facts } from "../Simulation";

/**
 * This strategy bets directly proportional to the real probability and
 * account balance. It does not account for the odds given by the market.
 *
 * This strategy should perform about as well as the scaled random strategy
 * in simulations where positive edges are roughly equal to negative edges,
 * because the real probability of an outcome will not influence its profitability.
 */
export const RealProbabilityStrategy =
  (scale: number) =>
  ({ balance, realProbability }: Facts) => {
    return (realProbability - 0.5) * balance * scale;
  };
