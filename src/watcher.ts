import * as vscode from "vscode";
import { TimerState, Timer } from "./timer";
import * as fs from "fs";

export function createWatcher(fsWaitVariable, path, protagonist, context) {
  return fs.watch(path, (eventType, filename) => {
    if (eventType) {
      if (fsWaitVariable) {
        return;
      }
      fsWaitVariable = setTimeout(() => {
        fsWaitVariable = undefined;
      }, 100);

      if (protagonist.state !== TimerState.NotNeeded) {
        protagonist.stop(context);
        return;
      } else {
        vscode.window
          .showInformationMessage(
            `Data was saved successfully in ${context.globalState.get(
              "fixedPath"
            )}. Do you want to start another session?`,
            { modal: true },
            ...["Yes", "No"]
          )
          .then(choice => {
            protagonist.stop(context);
            if (choice === "Yes") {
              vscode.commands.executeCommand(
                "extension.algocodingtracker.initiateTimer"
              );
            }
          });
      }
    }
  });
}

