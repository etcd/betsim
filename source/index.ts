import { Facts, simulate } from "./lib/Simulation";
import { KellyStrategy } from "./lib/strategies/Kelly";
import { RandomStrategy } from "./lib/strategies/Random";
import { RealProbabilityStrategy } from "./lib/strategies/RealProbability";
import { ScaledRandomStrategy } from "./lib/strategies/ScaledRandom";

const N_POINTS = 2000;

const makeSimWithBetFn = (betFn: (facts: Facts) => number, name: string) =>
  simulate({
    name,
    nPoints: N_POINTS,
    marketInefficiency: 0.2,
    betFn,
  });

const simulationData = [
  ...makeSimWithBetFn(KellyStrategy(1), "kelly"),
  ...makeSimWithBetFn(KellyStrategy(0.5), "kelly(0.5)"),
  ...makeSimWithBetFn(KellyStrategy(0.3), "kelly(0.3)"),
  ...makeSimWithBetFn(
    KellyStrategy(1, (p) => -(0.5 ** p) + 1),
    "kelly-ra-max"
  ),
  ...makeSimWithBetFn(
    KellyStrategy(1, (p) => -(0.5 ** (p + 1)) + 1),
    "kelly-ra-med"
  ),
  ...makeSimWithBetFn(
    KellyStrategy(1, (p) => -(0.5 ** (p + 2)) + 1),
    "kelly-ra-low"
  ),
  ...makeSimWithBetFn(RealProbabilityStrategy(0.1), "real probability"),
  ...makeSimWithBetFn(RandomStrategy(0.01), "random"),
  ...makeSimWithBetFn(ScaledRandomStrategy(0.01), "scaled random"),
  //   ...makeSimWithBetFn(EDGE_STRAT(1), "edge"),
];

console.log(simulationData.length);
