import { roundingUpToNDecimalPlaces } from "../analyzeTimeSeries/linearAlgebraOperations";
import {
  outerShapeOfTheCodingFile,
  shapeOfTheCodingData,
  shapeOfCodingDetailsForAStageInAProblem,
  shapeOfObjectForReturnBackVisitsOfAStage
} from "../../dataStructureInterfaces";

const calculateAverageTT = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let total = 0;
  let totalNumberOfProblems = groupOfProblems.length;
  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    total += currentProblem.totalTime;
  }
  return total / totalNumberOfProblems;
};

const calculateAverageTries = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let total = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    total += currentProblem.numberOfTries;
  }
  return total / totalNumberOfProblems;
};

const calculateReturnsToGIvsTR = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let totalReturnsToGI = 0;
  let totalReturns = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    totalReturnsToGI += currentProblem.totalReturnsToGI;
    totalReturns += currentProblem.totalReturns;
  }
  return totalReturnsToGI / totalReturns;
};

const calculatePercentOfProblemsThatSatisfyStageDistribution = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let totalProblemsThatSatisfyStageDistribution = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    let totalTimeForProblem = currentProblem.totalTime;
    let currentProblemStageDetails: shapeOfCodingDetailsForAStageInAProblem[] =
      groupOfProblems[i].codingProcessDetails;
    let totalStages = currentProblemStageDetails.length;
    let satisfiesStageDistribution = true;
    for (let j = 0; j < totalStages; ++j) {
      let currentStageTotalTime = currentProblemStageDetails[j].totalStageTime;
      let stageTTvsTT = currentStageTotalTime / totalTimeForProblem;
      if (stageTTvsTT <= 0.25 && stageTTvsTT >= 0.1) {
        // do nothing
      } else {
        satisfiesStageDistribution = false;
        break;
      }
    }
    if (satisfiesStageDistribution) {
      totalProblemsThatSatisfyStageDistribution += 1;
    }
  }
  return totalProblemsThatSatisfyStageDistribution / totalNumberOfProblems;
};

const calculatePercentOfOneReturnProblemsFromTRP = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let totalProblemsWithOneReturn = 0;
  let totalReturnProblems = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    if (currentProblem.totalReturns > 1) {
      totalReturnProblems += 1;
    } else if (currentProblem.totalReturns === 1) {
      totalReturnProblems += 1;
      totalProblemsWithOneReturn += 1;
    }
  }
  return totalProblemsWithOneReturn / totalReturnProblems;
};

const calculatePercentOfReturnsWithHoneIn = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let totalReturnsWithHoneIn = 0;
  let totalReturns = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    totalReturnsWithHoneIn +=
      currentProblem.numberOfReturnCyclesFasterThanPreviousCounterparts;
    totalReturns += currentProblem.totalReturns;
  }
  return totalReturnsWithHoneIn / totalReturns;
};

const returnTimeSeriesOfMetrics = function(
  dataForDifficulty: Array<Array<shapeOfTheCodingData>>
): Array<number[]> {
  let totalNumberOfGroups = dataForDifficulty.length;
  let arrOfTimeSeries: Array<number[]> = [[], [], [], [], [], []]; ///  0 - ag, 1 - comp, 2- cons, 3 - hon, 4 - effi, 5 - effec, 6 - pers   /*

  for (let i = 0; i < totalNumberOfGroups; ++i) {
    let groupOfProblemsToAnalyze = dataForDifficulty[i];
    arrOfTimeSeries[0].push(
      roundingUpToNDecimalPlaces(
        calculateReturnsToGIvsTR(groupOfProblemsToAnalyze),
        2
      )
    );
    arrOfTimeSeries[1].push(
      roundingUpToNDecimalPlaces(
        calculatePercentOfOneReturnProblemsFromTRP(groupOfProblemsToAnalyze),
        2
      )
    );
    arrOfTimeSeries[2].push(
      roundingUpToNDecimalPlaces(
        calculatePercentOfProblemsThatSatisfyStageDistribution(
          groupOfProblemsToAnalyze
        ),
        2
      )
    );
    arrOfTimeSeries[3].push(
      roundingUpToNDecimalPlaces(
        calculatePercentOfReturnsWithHoneIn(groupOfProblemsToAnalyze),
        2
      )
    );
    arrOfTimeSeries[4].push(
      roundingUpToNDecimalPlaces(
        calculateAverageTT(groupOfProblemsToAnalyze),
        2
      )
    );
    arrOfTimeSeries[5].push(
      roundingUpToNDecimalPlaces(
        calculateAverageTries(groupOfProblemsToAnalyze),
        2
      )
    );
  }

  return arrOfTimeSeries;
};
export { returnTimeSeriesOfMetrics };
