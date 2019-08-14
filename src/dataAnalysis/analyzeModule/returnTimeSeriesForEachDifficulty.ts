import {outerShapeOfTheCodingFile, shapeOfTheCodingData, shapeOfCodingDetailsForAStageInAProblem, shapeOfObjectForReturnBackVisitsOfAStage} from "../../dataStructureInterfaces";
import {shapeOfTimeSeriesObject} from "./dataStructureInterfaces"
import {returnCleanAndSplitData} from "./cleanAndSplitData"   /// submodule one
import {returnTimeSeriesOfMetrics} from "./returnTimeSeriesOfMetrics"/// submodule two

const returnTimeSeriesForEachDifficulty = function(
  file: outerShapeOfTheCodingFile,
  chosenDifficulty: string,
  sizeOfGroups: number
): Array<string | shapeOfTimeSeriesObject> {
  let data = returnCleanAndSplitData(file, chosenDifficulty, sizeOfGroups);

  let arrofTimeSeriesForEachDifficulty: Array<
    string | shapeOfTimeSeriesObject
  > = [];

  for (let i = 0; i < data.length; ++i) {
    let dataForParticularDifficulty = data[i];
    arrofTimeSeriesForEachDifficulty.push(
      returnTimeSeriesOfMetrics(dataForParticularDifficulty)
    );
  }
  /// it will call the analysis sub-controller and pass it the array for one of the difficulties

  return arrofTimeSeriesForEachDifficulty;
};


