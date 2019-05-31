import * as os from "os";
import * as path from "path";

let homedir = os.homedir();
let suffixToFile = "codingDetailsData.json";
let fullPath = path.join(homedir, suffixToFile);

export { fullPath };
