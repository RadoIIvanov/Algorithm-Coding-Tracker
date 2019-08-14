/* 1. Uses Math.random to roll numbers from a uniform or a normal one (using transform) distribution
2. Keep in mind that the data is incomplete but sufficient for testing the particular functions in analyzeFileHelperFunctions
(i.e. if you change the functions you might want to increase/decrease the amount of data this module generates) */

import {outerShapeOfTheCodingFile, shapeOfTheCodingData, shapeOfCodingDetailsForAStageInAProblem, shapeOfObjectForReturnBackVisitsOfAStage} from "../../dataStructureInterfaces";

const returnRandomNumberGeneratorFromNormal = function(
  mean,
  std,
  lowerBound,
  upperBound
) {
  let randOneFromNormal;
  let randTwoFromNormal;
  let bool;
  let randOneFromUniform;
  let randTwoFromUniform;
  return (m = mean, s = std, lb = lowerBound, ub = upperBound) => {
    const piConstant = 2 * Math.PI;
    bool = !bool;

    if (!bool) {
      return randTwoFromNormal;
    }

    do {
      randOneFromUniform = Math.random();
      randTwoFromUniform = Math.random();
      randOneFromNormal =
        Math.sqrt(-2 * Math.log(randOneFromUniform)) *
          Math.cos(randTwoFromUniform * piConstant) *
          s +
        m;
      randTwoFromNormal =
        Math.sqrt(-2 * Math.log(randOneFromUniform)) *
          Math.sin(randTwoFromUniform * piConstant) *
          s +
        m;
    } while (
      randOneFromUniform === 0 ||
      randTwoFromUniform === 0 ||
      randOneFromNormal < lowerBound ||
      randTwoFromNormal < lowerBound ||
      randOneFromNormal > upperBound ||
      randTwoFromNormal > upperBound
    );

    return randTwoFromNormal;
  };
};

const createNewProblem = function(): shapeOfTheCodingData {
  let newProblem: shapeOfTheCodingData = {};
  newProblem.codingProcessDetails = [];
  newProblem.totalTime = 0;

  let rollForStatus = Math.random();
  if (rollForStatus > 0.1) {
    newProblem.status = "Complete";
  } else {
    newProblem.status = "Incomplete";
    return newProblem;
  }
  let rollForNumberOfTries = Math.random();
  newProblem.numberOfTries = Math.round(rollForNumberOfTries * 10);
  let problemDifficulty = ["Easy", "Medium", "Hard", "Other", "Unknown"];
  let rollForProblemDifficulty = Math.random();
  newProblem.classifiedDifficulty =
    problemDifficulty[Math.round(rollForProblemDifficulty * 4)];
  let rollForKnownPercentAS = Math.random();
  if (rollForKnownPercentAS > 0.1) {
    let rollForPercentAS = Math.random();
    newProblem.percentAcceptedSubmissions = rollForPercentAS * 100;
  } else {
    newProblem.percentAcceptedSubmissions = "unknown";
  }
  let rollForTotalReturns = Math.random();
  newProblem.totalReturns = Math.round(rollForTotalReturns * 7);
  let rollForTotalReturnsToGi = Math.random();
  newProblem.totalReturnsToGI = Math.round(
    rollForTotalReturnsToGi * newProblem.totalReturns
  );
  let rollForNumberOfReturnCyclesFaster = Math.random();
  newProblem.numberOfReturnCyclesFasterThanPreviousCounterparts = Math.round(
    rollForNumberOfReturnCyclesFaster * newProblem.totalReturns
  );
  for (let i = 0; i < 6; ++i) {
    let stageDetails: shapeOfCodingDetailsForAStageInAProblem = {};
    stageDetails.returnBackVisits = [];
    let totalStageTimeGenerator = returnRandomNumberGeneratorFromNormal(7.5 * 60, 4.5 * 60, 0.6 * 60, 30 * 60);
    stageDetails.totalStageTime = totalStageTimeGenerator();
    newProblem.totalTime += stageDetails.totalStageTime;
    if (i === 2) {
      let timeConstraint = stageDetails.totalStageTime;
      for (let j = newProblem.totalReturnsToGI; j > 0; --j ) {
        let returnBackVisit: shapeOfObjectForReturnBackVisitsOfAStage = {};
        let totalReturnBackVisitTimeGenerator = returnRandomNumberGeneratorFromNormal(2.5 * 60, 1 * 60, 0, timeConstraint / j);
        returnBackVisit.additionalTime = totalReturnBackVisitTimeGenerator();
        timeConstraint -= returnBackVisit.additionalTime;
        returnBackVisit.returnDetails = [Math.round(Math.random() * (2)) + 3, 2];
        stageDetails.returnBackVisits.push(returnBackVisit);
      }
      if (newProblem.totalReturns > newProblem.totalReturnsToGI) {
        stageDetails.returnBackVisits.push(null);
      }

    }
    newProblem.codingProcessDetails.push(stageDetails);
  }

  return newProblem;
};

const generateDummyData = function(): outerShapeOfTheCodingFile {
  let outerObject: outerShapeOfTheCodingFile = {
    data: []
  };

  for (let i = 0; i < 10; ++i) {
    outerObject.data.push(createNewProblem());
  }

  return outerObject;
};

