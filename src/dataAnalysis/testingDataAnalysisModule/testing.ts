/* import produce time series controllers
   import dummy data generator
   perform testing  */

import { returnTimeSeriesForEachDifficulty } from "../produceTimeSeries/returnTimeSeriesForEachDifficulty";
import {returnTimeSeriesForPercentOfIncompleteProblems} from "../produceTimeSeries/otherSubmodules/incompleteProblems";
import { generateDummyData } from "./generateDummyData";

const dummyData = generateDummyData(1000);
const timeSeriesForEachDifficulty = returnTimeSeriesForEachDifficulty(
  dummyData,
  "classifiedDifficulty",
  25
);
console.log(timeSeriesForEachDifficulty);