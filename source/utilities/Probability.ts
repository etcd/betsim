/** Odds (European) of a win if you bet `yes` */
export const ratioToOdds = (nNo: number, nYes: number) => (nNo + nYes) / nYes;

/**
 * Inverts odds (given `yes` odds, return `no` odds, and vice versa).
 *
 * Proof:
 *                odds = (nNo + nYes) / nYes
 *            odds - 1 = nNo / nYes
 *   odds / (odds - 1) = (nNo + nYes) / nYes / (nNo / nYes)
 *                     = (nNo + nYes) / nYes * (nYes / nNo)
 *                     = (nNo + nYes) / nNo
 */
export const invertOdds = (odds: number) => odds / (odds - 1);

/** Given a point, probability of a win if you bet `yes` */
export const ratioToImpliedP = (nNo: number, nYes: number) =>
  oddsToImpliedP(ratioToOdds(nNo, nYes));

/** Given odds, calculate probability of a win if you bet `yes` */
export const oddsToImpliedP = (odds: number) => 1 / odds;
