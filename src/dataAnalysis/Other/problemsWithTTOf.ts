/* this sub-module will be used to return problems that took a lot of time (i.e. ask to user to dig deeper). It gets its own module because it doesn't return a timeseries.
These problems will be after data cleanup, however without any kind of data split. This will be imported by something operating closer to the UI.
 */

import {outerShapeOfTheCodingFile, shapeOfTheCodingData, shapeOfCodingDetailsForAStageInAProblem, shapeOfObjectForReturnBackVisitsOfAStage} from "../../dataStructureInterfaces";
import {cleanUpData} from "../produceTimeSeries/cleanAndSplitData";

const returnInfoForProblemsWithTTof = function(
  data: shapeOfTheCodingData[],
  chosenDifficultyMeasure,
  chosenDifficultyLevel,
  ttReq: number
): shapeOfTheCodingData[] {
  let arrOfProblems : shapeOfTheCodingData[] = cleanUpData(data, chosenDifficultyMeasure, chosenDifficultyLevel);
  let arrOfProblemsThatFitTheRequirement = [];
  let totalProblems = arrOfProblems.length;
  for (let i = 0; i < totalProblems; ++i) {
    let currentProblem = arrOfProblems[i];
    if (currentProblem.totalTime > ttReq) {
      arrOfProblemsThatFitTheRequirement.push(currentProblem);
    }
  }
  return arrOfProblemsThatFitTheRequirement;
};

export {returnInfoForProblemsWithTTof};
