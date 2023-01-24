import { Facts } from "../Simulation";

/**
 * This strategy places random bets; it is scaled with balance.
 *
 * This strategy generally performs poorly in efficient markets. However,
 * in inefficient markets where there are massive discrepancies between
 * real and implied probabilities, this strategy can actually perform well.
 *
 * This strategy is a pretty good model for the real world "spray and pray"
 * strategy that VCs use in euphoric markets.
 */
export const ScaledRandomStrategy =
  (scale: number) =>
  ({ balance }: Facts) =>
    (Math.random() - 0.5) * 2 * balance * scale;
