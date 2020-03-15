import {
  outerShapeOfTheCodingFile,
  shapeOfTheCodingData,
  shapeOfCodingDetailsForAStageInAProblem,
  shapeOfObjectForReturnBackVisitsOfAStage
} from "../../dataStructureInterfaces";
import { problemDifficulty } from "../../options";

const AsToCdWhenCdUnknown = function (percentAcceptedSubmissions, chosenDifficultyLevel : string) : boolean {
  if (chosenDifficultyLevel === "easy" && percentAcceptedSubmissions >= 50) {
    return true;
  } else if (chosenDifficultyLevel === "medium" && percentAcceptedSubmissions >= 30) {
    return true;
  } else if (chosenDifficultyLevel === "hard" && percentAcceptedSubmissions < 30) {
    return true;
  }
  return false;
}

const stageTTGreaterThan = function(
  arrOfStages: shapeOfCodingDetailsForAStageInAProblem[],
  stageTimeReq: number
): boolean {
  let reqIsMet = true;
  let totalStages = arrOfStages.length;

  for (let i = 0; i < totalStages; ++i) {
    let currentStageTotalTime = arrOfStages[i].totalStageTime;
    if (currentStageTotalTime <= stageTimeReq) {
      reqIsMet = false;
      break;
    }
  }
  return reqIsMet;
};

const returnToGIGreaterThan = function(
  arrOfReturnBackVisitsGI: shapeOfObjectForReturnBackVisitsOfAStage[],
  returnToGITimeReq: number
): boolean {
  let reqIsMet = true;
  let totalReturnBackVisits = arrOfReturnBackVisitsGI.length;

  for (let i = 0; i < totalReturnBackVisits; ++i) {
    let currentReturnBackVisit = arrOfReturnBackVisitsGI[i];
    if (
      currentReturnBackVisit === null ||
      currentReturnBackVisit.returnDetails[1] !== 2
    ) {
      continue;
    } else if (
      currentReturnBackVisit.returnDetails[1] === 2 &&
      currentReturnBackVisit.additionalTime <= returnToGITimeReq
    ) {
      reqIsMet = false;
      break;
    }
  }
  return reqIsMet;
};

const boolForChosenDifficultyMandL = function (problem : shapeOfTheCodingData, chosenDifficulty: string, chosenDifficultyLevel : string) : boolean {
  if (chosenDifficulty === "classifiedDifficulty") {
    if (problem.classifiedDifficulty === chosenDifficultyLevel) {
      return true;
    } else if (problem.classifiedDifficulty === "unknown" && problem.percentAcceptedSubmissions !== "unknown" && AsToCdWhenCdUnknown (problem.percentAcceptedSubmissions, chosenDifficultyLevel)) {
      return true;
    }
  } else {
    if (problem.percentAcceptedSubmissions !== "unknown") { //// chosenDifficultyLevel needs to be mapped at input if AS is chosen as measure
      if (chosenDifficultyLevel === "easy" && problem.percentAcceptedSubmissions >= 50) {
        return true;
      } else if (chosenDifficultyLevel === "medium" && problem.percentAcceptedSubmissions >= 30 && problem.percentAcceptedSubmissions < 50) {
        return true;
      } else if (chosenDifficultyLevel === "hard" && problem.percentAcceptedSubmissions < 30) {
        return true
      }
    } else {
      if (problem.classifiedDifficulty === chosenDifficultyLevel) {
        return true;
      }
  }}
  return false;
}  


const checkIfCleanUpRequirementsAreMet = function(
  problem : shapeOfTheCodingData,
  chosenDifficulty : string,
  chosenDifficultyLevel : string,
  totalTimeReq: number = 600,
  stageTimeReq: number = 60,
  returnToGITimeReq: number = 60,
): boolean {
  return (
    problem.totalTime > totalTimeReq &&
    stageTTGreaterThan(problem.codingProcessDetails, stageTimeReq) &&
    returnToGIGreaterThan(
      problem.codingProcessDetails[2].returnBackVisits,
      returnToGITimeReq
    ) && boolForChosenDifficultyMandL(problem, chosenDifficulty, chosenDifficultyLevel)
  );
};

const cleanUpData = function(
  arrOfProblems: shapeOfTheCodingData[],
  chosenDifficulty: string,
  chosenDifficultyLevel : string
): shapeOfTheCodingData[] {
  let totalProblems = arrOfProblems.length;
  let arrOfProblemsThatMeetCriteria: shapeOfTheCodingData[] = [];

  for (let i = 0; i < totalProblems; ++i) {
    let currentProblem = arrOfProblems[i];
    if (checkIfCleanUpRequirementsAreMet(currentProblem, chosenDifficulty, chosenDifficultyLevel)) {
      arrOfProblemsThatMeetCriteria.push(currentProblem);
    }
  }
  return arrOfProblemsThatMeetCriteria;
};

const splitDataInSequentialGroups = function(
  data: shapeOfTheCodingData[],
  sizeOfGroups: number
): Array<shapeOfTheCodingData[]> {
  let splitData : Array<shapeOfTheCodingData[]> = [];
  let totalProblems = data.length;
  let totalProblemsThatFitIntoGroups = totalProblems - (totalProblems % sizeOfGroups);
    
  if ( (totalProblemsThatFitIntoGroups / sizeOfGroups) < 2) {
    return splitData
  }
  let group = [];
  for (let i = 0; i < totalProblemsThatFitIntoGroups; ++i) {
    let problem = data[i];
    group.push(problem);
    if (group.length === sizeOfGroups) {
      splitData.push(group);
      group = [];
    }
  }
  return splitData;
};

const returnCleanAndSplitData = function(
  data: shapeOfTheCodingData[],
  chosenDifficulty: string,
  chosenDifficultyLevel: string,
  sizeOfGroups: number
): Array<Array<shapeOfTheCodingData>> {
  let cleanData = cleanUpData(data, chosenDifficulty, chosenDifficultyLevel);
  let splitFurtherInGroups = splitDataInSequentialGroups(
    cleanData,
    sizeOfGroups
  );
  return splitFurtherInGroups;
};

export {cleanUpData};
export {splitDataInSequentialGroups};
export { returnCleanAndSplitData };
