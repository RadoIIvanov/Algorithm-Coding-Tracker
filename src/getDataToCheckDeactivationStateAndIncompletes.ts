import * as fs from "fs";
import { fullPath } from "./pathToDatabaseFile";

/* This is "needed"(i.e. there is probably a better way) because it seems that we cannot change
extension global state in the deactivation function when vscode is closing */

interface outerShapeOfTheCodingFile {
  data: Array<any>;
  isTimerDeactivated: boolean;
}

export function getDataToCheckDeactivationStateAndIncompletes(): outerShapeOfTheCodingFile {
  try {
    let ourCodingData = fs.readFileSync(fullPath);
    let convertBufferToString = ourCodingData.toString();
    let JSONtoJS: outerShapeOfTheCodingFile = JSON.parse(convertBufferToString);
    return JSONtoJS;
  } catch (error) {
    console.log(error);
  }
}
