import { simulate } from "./lib/Simulation";

const N_POINTS = 2000;

const simulationData = simulate({
  name: "kelly",
  nPoints: N_POINTS,
  marketInefficiency: 0.2,
  betFn: () => 3,
});

console.log(simulationData);
