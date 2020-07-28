import { createMatrixOfRegressors } from "./analyzeTimeSeries/linearAlgebraOperations";
import { calcInterceptAndSlope } from "./analyzeTimeSeries/linearAlgebraOperations";
import { whenToEvaluateBothLongTermVsRecentPerformance } from "./options";
import { splitF } from "./options";
import { create } from "domain";
import {objofResultsForAnObjective} from "../dataStructureInterfaces";

const returnTrueifImprove = function (s1: number, s2: number, i1: number, i2: number, doS: boolean, tsLength: number) : boolean {
  if (s2 === undefined) {
    return oneLineEval(s1, doS);
  } else {
    return twoLineEval(s1, s2, i1, i2, doS, tsLength);
  }
};

const oneLineEval = function (s1: number, doS: boolean) : boolean {
  if ((s1 > 0 && doS === true) || (s1 < 0 && doS === false)) {
    return true;
  } else {
    return false;
  }
};

const twoLineEval = function (s1: number, s2: number, i1: number, i2: number, doS: boolean, tsLength: number) : boolean {
  let midFL = i1 + (s1 * tsLength) / 2;
  let midSL = i2 + (s2 * tsLength) / 2;
  if ((midSL > midFL && doS === true) || (midSL < midFL && doS === false)) {
    return true;
  } else {
    return false;
  }
};

const getResultsForIndividualMeasures = function (
  directionOfSuccess: boolean,
  timeSeries: number[],
  benchmark: number
): objofResultsForAnObjective {
  let individualResults: objofResultsForAnObjective;

  let timeSeriesTotalPoints = timeSeries.length;

  let pInFirstP = Math.ceil(timeSeriesTotalPoints * splitF)
  let matrixOfRegressorsForFP = createMatrixOfRegressors(
    pInFirstP
  );
  let calcInterceptsAndSlopes = calcInterceptAndSlope(
    matrixOfRegressorsForFP,
    timeSeries.slice(0, pInFirstP)
  );

  if (timeSeriesTotalPoints > whenToEvaluateBothLongTermVsRecentPerformance) 
  {
    let pInLastPart = Math.floor(timeSeriesTotalPoints * (1 - splitF));
    let matrixOfRegressorsForRecentLine = createMatrixOfRegressors(
      pInLastPart
    );
    let recentTimeSeries = timeSeries.slice(
      timeSeriesTotalPoints - pInLastPart
    );

    calcInterceptsAndSlopes = calcInterceptsAndSlopes.concat(
      calcInterceptAndSlope(matrixOfRegressorsForRecentLine, recentTimeSeries)
    );
  }
  let improveOrNot: boolean = returnTrueifImprove(
    calcInterceptsAndSlopes[1],
    calcInterceptsAndSlopes[3],
    calcInterceptsAndSlopes[0],
    calcInterceptsAndSlopes[2],
    directionOfSuccess,
    Math.ceil(timeSeriesTotalPoints / 2)
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
