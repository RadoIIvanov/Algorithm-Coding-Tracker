/* import everything
   perform testing  */

import { returnAllTimeSeriesResults } from "./assembleAllTimeSeriesResults";
import { generateDummyData } from "./generateData/generateDummyData";

const dummyData = generateDummyData(1000);
const timeSeriesForEachDifficulty = returnAllTimeSeriesResults(
  dummyData,
  "classifiedDifficulty",
  "hard",    //// specifies the index - difficulty level (0 for easy, 1 for medium, 2 for hard)
  25,
);
console.log(timeSeriesForEachDifficulty);




