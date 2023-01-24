/**
 * This strategy places random bets; it is NOT scaled with balance, and
 * therefore, suffers from risk of ruin (in efficient markets, this risk
 * is extreme).
 *
 * This strategy generally performs poorly in efficient markets. However,
 * in inefficient markets where there are massive discrepancies between
 * real and implied probabilities, this strategy can actually perform well.
 */
export const RANDOM_STRATEGY = (scale: number) => () =>
  (Math.random() - 0.5) * 2 * scale;
