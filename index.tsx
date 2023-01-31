import React from "react";
import * as ReactDOM from "react-dom/client";
import { Chart as ReactLineChart } from "etchart/build/lib/ReactLineChart";

import { Facts, simulate } from "./source/lib/Simulation";
import { EdgeStrategy } from "./source/lib/strategies/Edge";
import { KellyStrategy } from "./source/lib/strategies/Kelly";
import { RandomStrategy } from "./source/lib/strategies/Random";
import { RealProbabilityStrategy } from "./source/lib/strategies/RealProbability";
import { ScaledRandomStrategy } from "./source/lib/strategies/ScaledRandom";

const N_POINTS = 2000;

const makeSimulationData = (nPoints: number) => {
  const makeSimWithBetFn = (betFn: (facts: Facts) => number, name: string) =>
    simulate({
      name,
      nPoints,
      marketInefficiency: 0.2,
      betFn,
    });

  return [
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
    ...makeSimWithBetFn(EdgeStrategy(1), "edge"),
  ];
};

const rootElement = document.getElementById("root");

/** Given odds, calculate probability of a win if you bet `yes` */
const oddsToImpliedP = (odds: number) => 1 / odds;

const simData = makeSimulationData(N_POINTS);

rootElement &&
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="m-28">
        {/* line chart */}
        <div className="m-10 border">
          <ReactLineChart
            // data
            data={simData}
            getX={(dp) => dp.x}
            getY={(dp) => dp.startingBalance}
            getZ={(dp) => dp.name}
            chartType="log"
            xAxisLabel="x axis"
            yAxisLabel="y axis"
            // display
            height={300}
          />
        </div>

        {/* implied probability */}
        <div className="m-10 border">
          <ReactLineChart
            // data
            data={simData}
            getX={(dp) => oddsToImpliedP(dp.odds)}
            getY={(dp) => (dp.outcome ? 1 : -1)}
            xAxisLabel="Implied probability"
            yAxisLabel="Outcome"
            // display
            height={150}
            pointOpacity={100 / N_POINTS}
            showLines={false}
            showPoints={true}
            pointRadius={1}
            yDomain={[-2, 2]}
            xAxisLocation={0}
          />
        </div>

        {/* real probability */}
        <div className="m-10 border">
          <ReactLineChart
            // data
            data={simData}
            getX={(dp) => dp.realProbability}
            getY={(dp) => (dp.outcome ? 1 : -1)}
            xAxisLabel="Real probability"
            yAxisLabel="Outcome"
            // display
            height={150}
            pointOpacity={100 / N_POINTS}
            showLines={false}
            showPoints={true}
            pointRadius={1}
            yDomain={[-2, 2]}
            xAxisLocation={0}
          />
        </div>

        {/* point chart */}
        <div className="m-10 border">
          <ReactLineChart
            // data
            data={simData}
            getX={(dp) => dp.realProbability - oddsToImpliedP(dp.odds)}
            getY={(dp) => dp.amountWon / dp.startingBalance}
            getZ={(dp) => dp.name}
            xAxisLabel="Edge (real p – implied p)"
            yAxisLabel="Scaled amount won"
            // display
            height={500}
            pointOpacity={10000 / N_POINTS}
            showLines={false}
            showPoints={true}
            pointRadius={0.5}
            yDomain={[-0.2, 0.2]}
            xAxisLocation={0}
          />
        </div>
      </div>
    </React.StrictMode>
  );
