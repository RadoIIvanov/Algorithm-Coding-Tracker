/* this sub-module will be used for the analysis of incomplete problems. It gets its own module because the typical path doesn't apply
(i.e. data not cleaned, nor split by difficulty, just split by sequential groups) */

import {
  outerShapeOfTheCodingFile,
  shapeOfTheCodingData,
  shapeOfCodingDetailsForAStageInAProblem,
  shapeOfObjectForReturnBackVisitsOfAStage
} from "../../dataStructureInterfaces";

const splitDataInSequentialGroupsDerivative = function(
  data: Array<shapeOfTheCodingData>,
  sizeOfGroups: number
): Array<Array<shapeOfTheCodingData>> {
  let splitData = [];
  let totalProblemsThatFitIntoGroups =
    data.length - (data.length % sizeOfGroups);
  if (totalProblemsThatFitIntoGroups / sizeOfGroups < 2) {
    /// do nothing
  }
  let group = [];
  for (let j = 0; j < totalProblemsThatFitIntoGroups; ++j) {
    group.push(data[j]);
    if (group.length === sizeOfGroups) {
      splitData.push(group);
      group = [];
    }
  }
  return splitData;
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

const returnTimeSeriesForPercentOfIncompleteProblems = function(
  file : outerShapeOfTheCodingFile,
  sizeOfGroups : number
): string | number[] {
  /// after the split it needs to check for enough data
  let allProblems = file.data;
  let problemsSplitInGroups = splitDataInSequentialGroupsDerivative(
    allProblems,
    sizeOfGroups
  );
  let totalNumberOfGroups = problemsSplitInGroups.length;
  if (totalNumberOfGroups === 0) {
      return "Not enough Data";
  } 
  let timeSeriesForPercentOfIncompleteProblems : number[] = [];
  for (let i = 0; i < totalNumberOfGroups; ++i ) {
      let currentGroup = problemsSplitInGroups[i];
      timeSeriesForPercentOfIncompleteProblems.push(calculatePercentOfIncompletes(currentGroup));
  }

  return timeSeriesForPercentOfIncompleteProblems;
};

export {returnTimeSeriesForPercentOfIncompleteProblems};