/* import analyze controller
   import dummy data
   perform testing  */

import { returnTimeSeriesForEachDifficulty } from "../analyzeModule/returnTimeSeriesForEachDifficulty";
import { generateDummyData } from "./generateDummyData";

const dummyData = generateDummyData(1000);
const timeSeriesForEachDifficulty = returnTimeSeriesForEachDifficulty(
  dummyData,
  "classifiedDifficulty",
  25
);
console.log(timeSeriesForEachDifficulty);