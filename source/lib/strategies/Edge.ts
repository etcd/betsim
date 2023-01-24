import { ratioToImpliedP } from "../../utilities/Probability";
import { Facts } from "../Simulation";

/**
 * This strategy bets directly proportional to the edge, which is
 * the difference between real probability and implied probability.
 *
 * This strategy should perform very well, but not optimally (see Kelly
 * strategy), because edge is not exactly proportional to payout.
 *
 * This is not a realistic strategy because it uses `realProbability`.
 */
export const EdgeStrategy =
  (scale: number) =>
  ({ point, balance, realProbability }: Facts) => {
    const edge = realProbability - ratioToImpliedP(...point);
    return edge * balance * scale;
  };
