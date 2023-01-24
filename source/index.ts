import { Facts, simulate } from "./lib/Simulation";
import { RandomStrategy } from "./lib/strategies/Random";
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
  ...makeSimWithBetFn(RandomStrategy(0.01), "random"),
  ...makeSimWithBetFn(ScaledRandomStrategy(0.01), "scaled random"),
];

console.log(simulationData.length);
