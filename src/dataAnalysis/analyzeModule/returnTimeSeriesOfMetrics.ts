import {
  outerShapeOfTheCodingFile,
  shapeOfTheCodingData,
  shapeOfCodingDetailsForAStageInAProblem,
  shapeOfObjectForReturnBackVisitsOfAStage
} from "../../dataStructureInterfaces";
import {shapeOfTimeSeriesObject} from "./dataStructureInterfaces";

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

const calculatePercentOfIncompletes = function(
  groupOfProblems: shapeOfTheCodingData[]
): number {
  let totalIncompletes = 0;
  let totalNumberOfProblems = groupOfProblems.length;

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = groupOfProblems[i];
    if (currentProblem.status === "Incomplete") {
      totalIncompletes += 1;
    }
  }
  return totalIncompletes / totalNumberOfProblems;
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
): string | shapeOfTimeSeriesObject {
  if (dataForDifficulty[0].length === 0) {
    return "Not enough Data";
  }

  let totalNumberOfGroups = dataForDifficulty.length;
  let objectOfTimeSeries = {
    averageTT: [],
    averageTries: [],
    returnsToGIvsTotalReturns: [],
    percentOfProblemsThatSatisfyStageDistribution: [],
    percentOfIncompletes: [],
    percentOfOneReturnProblemsFromTotalReturnProblems: [],
    percentOfReturnsWithHoneInProperty: []
    //// note : functionality to present the user the problems that took really long (i.e. more than 2 hours) needs to be done serparately
  };

  for (let i = 0; i < totalNumberOfGroups; ++i) {
    let groupOfProblemsToAnalyze = dataForDifficulty[i];
    objectOfTimeSeries.averageTT.push(
      calculateAverageTT(groupOfProblemsToAnalyze)
    );
    objectOfTimeSeries.averageTries.push(
      calculateAverageTries(groupOfProblemsToAnalyze)
    );
    objectOfTimeSeries.returnsToGIvsTotalReturns.push(
      calculateReturnsToGIvsTR(groupOfProblemsToAnalyze)
    );
    objectOfTimeSeries.percentOfProblemsThatSatisfyStageDistribution.push(
      calculatePercentOfProblemsThatSatisfyStageDistribution(
        groupOfProblemsToAnalyze
      )
    );
    objectOfTimeSeries.percentOfIncompletes.push(
      calculatePercentOfIncompletes(groupOfProblemsToAnalyze)
    );
    objectOfTimeSeries.percentOfOneReturnProblemsFromTotalReturnProblems.push(
      calculatePercentOfOneReturnProblemsFromTRP(groupOfProblemsToAnalyze)
    );
    objectOfTimeSeries.percentOfReturnsWithHoneInProperty.push(
      calculatePercentOfReturnsWithHoneIn(groupOfProblemsToAnalyze)
    );
  }

  return objectOfTimeSeries;
};
export {returnTimeSeriesOfMetrics};