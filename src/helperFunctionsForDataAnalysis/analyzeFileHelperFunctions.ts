/* import shapeOfCodingDataFromTimer to use to typecast all the data object */
/* naive functions/naive structure, later you can optimize/refactor etc. */

import { shapeOfTheCodingData } from "../timer";

interface shapeOfObjectForReturnBackVisitsOfAStage {
  additionalTime: number;
  returnDetails: number[];
}

interface shapeOfCodingDetailsForAStageInAProblem {
  initialVisitTime: number;
  returnBackVisits: shapeOfObjectForReturnBackVisitsOfAStage[];
}

interface callback {
  ();
}


let someObj = {
  "initialVisitTime": 10, /* no check */
  "returnBackVisits": [
    { "additionalTime": 5, "returnDetails": [2, 0] }, /* no check because there is a subsequent returnCycle FROM 2 (prior any returnCycles FROM 3 or higher) */
    { "additionalTime": 1, "returnDetails": [2, 1] }, /* needs to pass check because there is a subsequent returnCycle FROM 3 or higher (prior any other returnscycles FROM 2) */
    { "additionalTime": 8, "returnDetails": [4, 2] }, /* no check because there is a subsequent returnCycle from 2 (prior any returnCycles FROM 3 or higher) */
    { "additionalTime": 1, "returnDetails": [2, 0] }  /* check the last one because this stage is not involved in any other subsequent returnCycles */
  ]
};

/// functions that determine the frequency/groups/x axis of slope will consolidate results

/// the modifications of the returned dataAnalysisObject are conditional to the cleanUp requirements, lower level functions need to return a boolean as part
/// of their returned information to signify whether the problem has passed the tests

/* cleanUp tests => 
1. total stage time (stage + returnbackVisits data)
2. total time (stage + returnbackVisits data)
3. time for all instances of returns to GI (returnbackVisitsData) (i.e. they don't have to by primary returns(i.e. to this destination, can be as part to the return cycle
  where the original destination was prior - e.g. understanding the problem stage))  */

interface shapeOfLowLevelAnalysisData {

}

interface shapeOfMidLevelAnalysisData {}

interface shapeOfTopLevelAnalysisData {
  numberOfReturnsToGenerateAnIdeaOrPrior: Array<
    number[]
  > /*
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - returnBackVisits level*/;
  totalTime: Array<
    number[]
  > /*
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - stage + returnBackvisits level*/;
  numberOfProblemsThatSatisfyTheTimeDistributionByStage: Array<
    boolean[]
  > /* 
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage + returnBackVisits level, % of total time */;
  numberOfReturnCyclesThatAreFasterThanTheirPreviousCounterparts: Array<
    boolean[]
  > /* 
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage + returnBackVisits level */;
  infoForProblemsLongerThanTwoHours: shapeOfTheCodingData[];
  /*
  stage + returnBackVisits level, if TT > 2 hours put in the array */
  numberOfTotalReturns: Array<
    number[]
  > /*
  should be an array of arrays, each subarray.length = the size of the group 
  data needed - stage level, returnBackVisits.length*/;
  numberOfProblemsWithOneReturn: Array<
    boolean[]
  > /* 
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage level, returnBackVisits.length */;
  numberOfProblemsWithOneReturnOrMore: Array<
    boolean[]
  > /* 
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - stage level, returnBackVisits.length */;
  numberOfTotalProblems: number[] /* 
  Array of sizes (i.e. may have partial groups)
  data needed - problem level */;
  numberOfIncompletes: Array<
    boolean[]
  > /* 
  array of arrays, the subarrays are 0s and 1s with length = the size of the group
  data needed - problem level */;
}
