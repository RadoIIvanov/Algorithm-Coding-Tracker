"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Timer, TimerState } from "./timer";
import { fullPath } from "./pathToDatabaseFile";
import { reInitializeTimer } from "./functionalityToCreateAndWorkWithInstancesOfTimer";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let timer = new Timer(undefined);

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "algocodingtracker" is now active!'
  );
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  if (context.globalState.get("fixedPath") === undefined) {
    context.globalState.update("fixedPath", fullPath);
  }

  timer = new Timer(context);

  let timerStart = vscode.commands.registerCommand(
    "extension.algocodingtracker.initiateTimer",
    () => {
      if (
        timer.state === TimerState.Running ||
        timer.state === TimerState.Paused
      ) {
        vscode.window
          .showQuickPick(["Yes", "No"], {
            placeHolder: "Timer is running, do you want to reset it or not?"
          })
          .then(choice => {
            if (choice === "Yes") {
              timer = reInitializeTimer(timer, context);
            }
          });
      } else {
        timer = reInitializeTimer(timer, context);
      }
    }
  );

  let timerStop = vscode.commands.registerCommand(
    "extension.algocodingtracker.stopTimer",
    () => {
      if (timer.state !== TimerState.Stopped) {
        timer.saveIfSessionAbortedORStopped(context);
      } else {
        vscode.window.showInformationMessage("Timer is already stopped");
      }
    }
  );

  context.subscriptions.push(timerStart);
  context.subscriptions.push(timerStop);
}

// this method is called when your extension is deactivated
export function deactivate() {
  /// this is execute just before vs code shuts down, in the case that it does
  timer.saveIfSessionAbortedORStopped(timer.context);
}
