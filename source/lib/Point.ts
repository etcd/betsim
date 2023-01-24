import { randomInt } from "../utilities/Random";

/** A point type representing the number of `no`s and `yes`s */
export type Point = readonly [number, number];

/** A point represents a betting market with `no`/`yes` bet totals, and a real probability */
export const makePoint = (
  /** lower bound of the scaling constant */
  scaleMin: number = 100_000,
  /** upper bound of the scaling constant */
  scaleMax: number = 100_000_000,
  distribution: "uniform" | "centered" = "uniform"
): Point => {
  const point = (() => {
    switch (distribution) {
      case "centered": {
        const nNo = randomInt(scaleMin, scaleMax) / 2;
        const nYes = randomInt(scaleMin, scaleMax) / 2;
        return [nNo, nYes] as const;
      }
      case "uniform": {
        const probability = Math.random();
        const scale = randomInt(scaleMin, scaleMax);
        const nNo = Math.floor(probability * scale);
        const nYes = Math.floor((1 - probability) * scale);
        return [nNo, nYes] as const;
      }
    }
  })();

  return point;
};
