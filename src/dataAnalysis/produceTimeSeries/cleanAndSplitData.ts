import {
  outerShapeOfTheCodingFile,
  shapeOfTheCodingData,
  shapeOfCodingDetailsForAStageInAProblem,
  shapeOfObjectForReturnBackVisitsOfAStage
} from "../../dataStructureInterfaces";

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

const checkIfCleanUpRequirementsAreMet = function(
  problem,
  totalTimeReq: number = 600,
  stageTimeReq: number = 60,
  returnToGITimeReq: number = 60
): boolean {
  return (
    problem.totalTime > totalTimeReq &&
    stageTTGreaterThan(problem.codingProcessDetails, stageTimeReq) &&
    returnToGIGreaterThan(
      problem.codingProcessDetails[2].returnBackVisits,
      returnToGITimeReq
    )
  );
};

const cleanUpData = function(
  file: outerShapeOfTheCodingFile
): shapeOfTheCodingData[] {
  let arrOfProblems = file.data;
  let totalProblems = arrOfProblems.length;
  let arrOfProblemsThatMeetCriteria: shapeOfTheCodingData[] = [];

  for (let i = 0; i < totalProblems; ++i) {
    let currentProblem = arrOfProblems[i];
    if (checkIfCleanUpRequirementsAreMet(currentProblem)) {
      arrOfProblemsThatMeetCriteria.push(currentProblem);
    }
  }
  return arrOfProblemsThatMeetCriteria;
};

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
      splitData[2].push(currentProblem);
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
  let splitData = [];
  for (let i = 0; i < data.length; ++i) {
    let totalProblemsThatFitIntoGroups =
      data[i].length - (data[i].length % sizeOfGroups);
    if (totalProblemsThatFitIntoGroups / sizeOfGroups < 2) {
      splitData[i] = [[]];
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
): Array<Array<Array<shapeOfTheCodingData>>> {
  let cleanData = cleanUpData(file);
  let splitDataByDM;
  if (chosenDifficulty === "classifiedDifficulty") {
    splitDataByDM = splitDataAccordingToCDMeasure(cleanData);
  } else if (chosenDifficulty === "percentAcceptedSubmissions") {
    splitDataByDM = splitDataAccordingToASMeasure(cleanData);
  }
  let splitFurtherInGroups = splitDataInSequentialGroups(
    splitDataByDM,
    sizeOfGroups
  );
  return splitFurtherInGroups;
};

export {cleanUpData};
export { returnCleanAndSplitData };
