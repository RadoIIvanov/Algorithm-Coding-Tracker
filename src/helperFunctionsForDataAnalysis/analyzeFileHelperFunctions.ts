/* import shapeOfCodingData from timer.ts to use to typecast all the data object */
/* naive functions/naive structure, later you can optimize/refactor etc. */

import { outerShapeOfTheCodingFile } from "../getDataToCheckDeactivationStateAndIncompletes";
import { shapeOfTheCodingData } from "../timer";

interface shapeOfObjectForReturnBackVisitsOfAStage {
  additionalTime: number;
  returnDetails: number[];
}

interface shapeOfCodingDetailsForAStageInAProblem {
  initialVisitTime: number;
  returnBackVisits: shapeOfObjectForReturnBackVisitsOfAStage[];
  totalStageTime: number;
}

interface callback {
  ();
}

const cleanUpCallback = function(
  problem,
  index,
  arr,
  totalTimeReq: number = 600,
  stageTimeReq: number = 60,
  returnToGITimeReq: number = 60
): boolean {
  if (problem.totalTime <= totalTimeReq) {
    return false;
  } else if (
    problem.codingProcessDetails.some(stage => {
      return stage.totalStageTime <= stageTimeReq;
    })
  ) {
    return false;
  } else if (
    problem.codingProcessDetails[2].returnBackVisits.length > 0 &&
    problem.codingProcessDetails[2].returnBackVisits
      .filter(visit => {
        return visit !== null && visit.returnDetails[1] === 2;
      })
      .some(({ additionalTime }) => {
        return additionalTime <= returnToGITimeReq;
      })
  ) {
    return false;
  } else {
    return true;
  }
};

const cleanUpData = function(
  file: outerShapeOfTheCodingFile
): shapeOfTheCodingData[] {
  return file.data.filter(cleanUpCallback);
};

// let someObj = {
//   "initialVisitTime": 10, /* no check */
//   "returnBackVisits": [
//     { "additionalTime": 5, "returnDetails": [2, 0] }, /* no check because there is a subsequent returnCycle FROM 2 (prior any returnCycles FROM 3 or higher) */
//     { "additionalTime": 1, "returnDetails": [2, 1] }, /* needs to pass check because there is a subsequent returnCycle FROM 3 or higher (prior any other returnscycles FROM 2) */
//     { "additionalTime": 8, "returnDetails": [4, 2] }, /* no check because there is a subsequent returnCycle from 2 (prior any returnCycles FROM 3 or higher) */
//     { "additionalTime": 1, "returnDetails": [2, 0] }  /* check the last one because this stage is not involved in any other subsequent returnCycles */
//   ]
// };

/// ["Easy", "Medium", "Hard", "Other", "Unknown"]; AcceptedSubmissions is interger or unknown
const splitDataAccordingToCDMeasure = function(
  data: shapeOfTheCodingData[]
): Array<Array<shapeOfTheCodingData>> {
  let totalNumberOfProblems = data.length;
  let splitData = [[], [], []]; //// at index 0 = Easy Problems, index 1 = Medium, index 2 = Hard

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = data[i];

    if (currentProblem.classifiedDifficulty === "Easy") {
      splitData[0].push(currentProblem);
      continue;
    } else if (currentProblem.classifiedDifficulty === "Medium") {
      splitData[1].push(currentProblem);
      continue;
    } else if (currentProblem.classifiedDifficulty === "Hard") {
      splitData[2].push(currentProblem);
      continue;
    }

    if (currentProblem.percentAcceptedSubmissions >= 50) {
      splitData[0].push(currentProblem);
    } else if (currentProblem.percentAcceptedSubmissions >= 30) {
      splitData[1].push(currentProblem);
    } else if (currentProblem.percentAcceptedSubmissions < 30) {
      currentProblem[2].push(currentProblem);
    }
  }

  return splitData;
};

const splitDataAccordingToASMeasure = function(
  data: shapeOfTheCodingData[]
): Array<Array<shapeOfTheCodingData>> {
  let totalNumberOfProblems = data.length;
  let splitData = [[], [], []];

  for (let i = 0; i < totalNumberOfProblems; ++i) {
    let currentProblem = data[i];

    if (currentProblem.percentAcceptedSubmissions >= 50) {
      splitData[0].push(currentProblem);
      continue;
    } else if (currentProblem.percentAcceptedSubmissions >= 30) {
      splitData[1].push(currentProblem);
      continue;
    } else if (currentProblem.percentAcceptedSubmissions < 30) {
      splitData[2].push(currentProblem);
      continue;
    }

    if (currentProblem.classifiedDifficulty === "Easy") {
      splitData[0].push(currentProblem);
    } else if (currentProblem.classifiedDifficulty === "Medium") {
      splitData[1].push(currentProblem);
    } else if (currentProblem.classifiedDifficulty === "Hard") {
      splitData[2].push(currentProblem);
    }
  }

  return splitData;
};

const splitDataInSequentialGroups = function(
  data: Array<Array<shapeOfTheCodingData>>,
  sizeOfGroups: number
): Array<Array<Array<shapeOfTheCodingData>>> {
  /// need to perform size of the input checks and return appropriately if not enough data

  let splitData = [];
  for (let i = 0; i < data.length; ++i) {
    let totalProblemsThatFitIntoGroups =
      data[i].length - (data[i].length % sizeOfGroups);
    if (totalProblemsThatFitIntoGroups / sizeOfGroups < 2) {
      splitData[i] = "Not enough data";
      continue;
    }
    splitData[i] = [];
    let group = [];
    for (let j = 0; j < totalProblemsThatFitIntoGroups; ++j) {
      group.push(data[i][j]);
      if (group.length === sizeOfGroups) {
        splitData[i].push(group);
        group = [];
      }
    }
  }
  return splitData;
};

const returnCleanAndSplitData = function(
  file: outerShapeOfTheCodingFile,
  chosenDifficulty: string,
  sizeOfGroups: number
): Array<Array<shapeOfTheCodingData>> {
  let cleanData = cleanUpData(file);
  let splitDataByDM;
  if (chosenDifficulty === "classifiedDifficulty") {
    splitDataByDM = splitDataAccordingToCDMeasure(cleanData);
  } else if (chosenDifficulty === "percentAcceptedSubmissions") {
    splitDataByDM = splitDataAccordingToASMeasure(cleanData);
  }
  let splitFurtherInGroups = splitDataInSequentialGroups(splitDataByDM, sizeOfGroups);
  return splitFurtherInGroups;
};

/// you want one HOF controller by broad stage (i.e. calling 1. clean, 2. splitByChosenDM, 3. splitInSequentialGroups)
/// again one HOF controller for the analysis stage (i.e. calling all the small methods that generate individual time series)

interface shapeOfAnalysisData {
  numberOfReturnsToGenerateAnIdea: Array<
    number[]
  > /*
  ---- added to the data structure, problem level
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - returnBackVisits level*/;
  totalTime: Array<
    number[]
  > /*
  ----added to the data structure, problem level
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - stage + returnBackvisits level*/;
  numberOfProblemsThatSatisfyTheTimeDistributionByStage: Array<
    boolean[]
  > /* 
  ----easily reachable
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage + returnBackVisits level, % of total time */;
  numberOfReturnCyclesThatAreFasterThanTheirPreviousCounterparts: Array<
    boolean[]
  > /* 
  ---- add to problem level
    change the move functions (pressMoveToButton, processUserInputFromTheReturnButton)
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage + returnBackVisits level */;
  infoForProblemsLongerThanTwoHours: shapeOfTheCodingData[];
  /*
  ----added to the data structure, problem level
  stage + returnBackVisits level, if TT > 2 hours put in the array */
  numberOfTotalReturns: Array<
    number[]
  > /*
  ---- added to the data structure, problem level
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - stage level, returnBackVisits.length*/;
  numberOfProblemsWithOneReturn: Array<
    boolean[]
  > /*
  ---- easily reachable
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage level, returnBackVisits.length */;
  numberOfProblemsWithOneReturnOrMore: Array<
    boolean[]
  > /* 
  ---- easily reachable
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage level, returnBackVisits.length */;
  numberOfTotalProblems: number[] /* 
  ---- this is added to the data structure
  Array of sizes (i.e. may have partial groups)
  data needed - problem level */;
  numberOfTries: number[] /* 
  ---- available at problem level */;
  numberOfIncompletes: Array<
    boolean[]
  > /* 
  ---- this is added to the data structure
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - problem level */;
}
