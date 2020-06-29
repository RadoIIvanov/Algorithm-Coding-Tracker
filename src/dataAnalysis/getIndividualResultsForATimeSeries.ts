import { createMatrixOfRegressors } from "./analyzeTimeSeries/linearAlgebraOperations";
import { calcInterceptAndSlope } from "./analyzeTimeSeries/linearAlgebraOperations";
import { whenToEvaluateBothLongTermVsRecentPerformance } from "./options";
import { recentPerformance } from "./options";
import { create } from "domain";
import {objofResultsForAnObjective} from "../dataStructureInterfaces";

const returnTrueifImprove = function (
  slopeOne: number,
  slopeTwo: number,
  directionOfSuccess: boolean
): boolean 
{
  return (
    ((slopeTwo !== undefined &&
      slopeTwo / slopeOne > 1 &&
      (Number(directionOfSuccess) +
        Number(!!(slopeOne + Math.abs(slopeOne))) +
        Number(!!(slopeTwo + Math.abs(slopeTwo)))) %
      3 ===
      0) ||
    (slopeTwo === undefined &&
      (Number(directionOfSuccess) + Number(!!(slopeOne + Math.abs(slopeOne)))) %
      2 ===
      0)) && slopeOne !== 0 
  );
};

const getResultsForIndividualMeasures = function (
  directionOfSuccess: boolean,
  timeSeries: number[],
  benchmark: number
): objofResultsForAnObjective {
  let individualResults: objofResultsForAnObjective;

  let timeSeriesTotalPoints = timeSeries.length;

  let matrixOfRegressorsForWholeLine = createMatrixOfRegressors(
    timeSeriesTotalPoints
  );
  let calcInterceptsAndSlopes = calcInterceptAndSlope(
    matrixOfRegressorsForWholeLine,
    timeSeries
  );

  if (timeSeriesTotalPoints > whenToEvaluateBothLongTermVsRecentPerformance) 
  {
    let matrixOfRegressorsForRecentLine = createMatrixOfRegressors(
      recentPerformance
    );
    let recentTimeSeries = timeSeries.slice(
      timeSeriesTotalPoints - recentPerformance
    );

    calcInterceptsAndSlopes = calcInterceptsAndSlopes.concat(
      calcInterceptAndSlope(matrixOfRegressorsForRecentLine, recentTimeSeries)
    );
  }
  let improveOrNot: boolean = returnTrueifImprove(
    calcInterceptsAndSlopes[1],
    calcInterceptsAndSlopes[3],
    directionOfSuccess
  );

  individualResults = 
  {
    interceptAndSlopeData: calcInterceptsAndSlopes,
    timeSeriesPoints: timeSeries,
    benchmark: benchmark,
    improveOrNot: improveOrNot
  }

  return individualResults;
};

export { getResultsForIndividualMeasures };
