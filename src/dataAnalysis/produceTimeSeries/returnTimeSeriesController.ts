import {outerShapeOfTheCodingFile, shapeOfTheCodingData, shapeOfCodingDetailsForAStageInAProblem, shapeOfObjectForReturnBackVisitsOfAStage} from "../../dataStructureInterfaces";
import {returnCleanAndSplitData} from "./cleanAndSplitData"   /// submodule one
import {returnTimeSeriesOfMetrics} from "./returnTimeSeriesOfMetrics"/// submodule two

const returnTimeSeriesController = function(
  data: shapeOfTheCodingData[],
  chosenDifficulty: string,
  chosenDifficultyLevel: string,
  sizeOfGroups: number
): string | Array<number[]> {
  let cleanAndSplitData = returnCleanAndSplitData(data, chosenDifficulty, chosenDifficultyLevel, sizeOfGroups);
  let totalNumberOfGroups = cleanAndSplitData.length;

  if (totalNumberOfGroups === 0) {
    return "Not enough data";
  } else {
    return returnTimeSeriesOfMetrics(cleanAndSplitData); 
  }
  
  /// it will call the analysis sub-controller and pass it the array for one of the difficulties

};

export {returnTimeSeriesController};

