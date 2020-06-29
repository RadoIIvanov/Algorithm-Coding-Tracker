/* imports: time series, time series analyzers, performs analysis and returns information (intercept/slope to create graphs, booleans whether we improved or not)  */
import { returnTimeSeriesController } from "./produceTimeSeries/returnTimeSeriesController";
import { returnTimeSeriesForPercentOfIncompletes } from "./produceTimeSeries/otherSubmodulesThatProduceTimeSeries/returnTimeSeriesForPercentOfIncompletes";
import { getResultsForIndividualMeasures } from "./getIndividualResultsForATimeSeries";
import { benchmarkArr } from "./options";
import { objofResultsForAnObjective } from "../dataStructureInterfaces";
import { outerShapeOfTheCodingFile } from "../dataStructureInterfaces";

/* directionOfSuccess is boolean - true for positive and false for negative */
const returnAllTimeSeriesResults = function (
  file: outerShapeOfTheCodingFile,
  difficultyMeasure: string,
  difficultyLevel: string,
  sizeOfGroup: number,
): Array<string | objofResultsForAnObjective> {
  let returnArrOfResults: Array<string | objofResultsForAnObjective> = [];
  let data = file.data;
  let timeSeriesWithoutIncompletes = returnTimeSeriesController(
    data,
    difficultyMeasure,
    difficultyLevel,
    sizeOfGroup
  ); /// this can return not enough data
  let timeSeriesForIncompletes = returnTimeSeriesForPercentOfIncompletes(data, sizeOfGroup);
  let actualizedBenchmarksForChosenDifficulty = benchmarkArr.map(benchmark => {
    if (typeof benchmark === "number") {
      return benchmark;
    } else {
      return difficultyLevel === "easy"
        ? benchmark[0]
        : difficultyLevel === "medium"
          ? benchmark[1]
          : benchmark[2];
    }
  });

  let numberOfTimeSeries = timeSeriesWithoutIncompletes.length;
  if (typeof timeSeriesWithoutIncompletes === "string") {
    for (let i = 0; i < actualizedBenchmarksForChosenDifficulty.length - 1; ++i) {
      returnArrOfResults[i] = "Not enough data";
    }
  } else {
    for (let i = 0; i < numberOfTimeSeries; ++i) {
      let currentTimeSeries = timeSeriesWithoutIncompletes[i];
      if (typeof currentTimeSeries !== "string") {
        returnArrOfResults[i] = getResultsForIndividualMeasures(
          i < 4 ? true : false,
          currentTimeSeries,
          actualizedBenchmarksForChosenDifficulty[i]
        );
      }
    }
  }

  if (typeof timeSeriesForIncompletes === "string") {
    returnArrOfResults[returnArrOfResults.length] = "Not enough data";
  } else {
    returnArrOfResults[returnArrOfResults.length] = getResultsForIndividualMeasures(false, timeSeriesForIncompletes, actualizedBenchmarksForChosenDifficulty[actualizedBenchmarksForChosenDifficulty.length - 1]);
  }

  return returnArrOfResults;
};

export {returnAllTimeSeriesResults};
