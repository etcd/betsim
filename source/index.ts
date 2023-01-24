import { simulate } from "./lib/Simulation";
import { RANDOM_STRATEGY } from "./lib/strategies/Random";

const N_POINTS = 2000;

const simulationData = simulate({
  name: "random",
  nPoints: N_POINTS,
  marketInefficiency: 0.2,
  betFn: RANDOM_STRATEGY(1),
});

console.log(simulationData.length);
