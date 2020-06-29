import {returnAllTimeSeriesResults} from "./dataAnalysis/assembleAllTimeSeriesResults";
import {objofResultsForAnObjective} from "./dataStructureInterfaces";
/// don't forget about the problems that took too long (there are not in the timeseries)

const graphicFn = function (
    objective: string,
    relevantPieceOfDataForDiggingDeeper: objofResultsForAnObjective
  ) {
    return; //// just drawing, return value is not important?
  };
  
  /* the graphFn is general (i.e. receives data for an objective)
  1. intercepts(whole line only if n = 3, else whole + last 3n), 2. slopes(whole line only if n = 3, else whole + last 3n), 3. time series (points), 4. benchmark level for the benchmark line.
  */

