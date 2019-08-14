/// this sub-module will be used for problems that took a lot of time (i.e. ask to user to dig deeper)

import {outerShapeOfTheCodingFile, shapeOfTheCodingData, shapeOfCodingDetailsForAStageInAProblem, shapeOfObjectForReturnBackVisitsOfAStage} from "../../dataStructureInterfaces";

const infoForProblemsWithTTof = function(
  file: outerShapeOfTheCodingFile,
  ttReq: number
): shapeOfTheCodingData[] {
  let problemsData = file.data;
  let arrOfProblemsThatFitTheRequirement = [];
  let totalProblems = problemsData.length;
  for (let i = 0; i < totalProblems; ++i) {
    let currentProblem = problemsData[i];
    if (currentProblem.totalTime > ttReq) {
      arrOfProblemsThatFitTheRequirement.push(currentProblem);
    }
  }
  return arrOfProblemsThatFitTheRequirement;
};
