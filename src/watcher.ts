import * as vscode from "vscode";
import * as fs from "fs";
import * as pathModule from "path";

export function createWatcher(fsWaitVariable, path, protagonist, context) {
  return fs.watch(path, (eventType, filename) => {
    if (eventType) {
      if (fsWaitVariable) {
        return;
      }
      fsWaitVariable = setTimeout(() => {
        fsWaitVariable = undefined;
      }, 100);
      vscode.window
        .showInformationMessage(
          `Data was saved successfully in ${context.globalState.get(
            "fixedPath"
          )}. Do you want to start another session?`,
          { modal: true },
          ...["Yes", "No"]
        )
        .then(choice => {
          vscode.commands
            .executeCommand("extension.algocodingtracker.stopTimer")
            .then(value => {
              if (choice === "Yes") {
                vscode.commands.executeCommand(
                  "extension.algocodingtracker.initiateTimer"
                );
              }
            });
        });
    }
  });
}

export function initiateWatcher(path, protagonist, context) {
  let fsWait: NodeJS.Timer;
  try {
    let fileDescriptorPath = fs.openSync(path, "r");
    fs.closeSync(fileDescriptorPath);
    return createWatcher(fsWait, path, protagonist, context);
  } catch (error) {
    try {
      fs.mkdirSync(pathModule.dirname(path), { recursive: true });
      let outerObject = { data: [] };
      let jsonVersionOfOO = JSON.stringify(outerObject);
      fs.writeFileSync(path, jsonVersionOfOO);
      return createWatcher(fsWait, path, protagonist, context);
    } catch (error) {
      if (error.code !== "EEXIST") {
        console.log(error);
      } else {
        let outerObject = { data: [] };
        let jsonVersionOfOO = JSON.stringify(outerObject);
        fs.writeFileSync(path, jsonVersionOfOO);
        return createWatcher(fsWait, path, protagonist, context);
      }
    }
  }
}
