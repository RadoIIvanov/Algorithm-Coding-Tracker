"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fullPath = require('./pathToDatabaseFile').fullPath;
const makeDataFile = require('./createDataFile');
import * as vscode from "vscode";
import { Timer, TimerState } from "./timer";
import { reInitializeTimer } from "./functionalityToCreateAndWorkWithInstancesOfTimer";
import { getDataToCheckDeactivationStateAndIncompletes } from "./getDataToCheckDeactivationStateAndIncompletes";
import { returnAllTimeSeriesResults } from "./dataAnalysis/assembleAllTimeSeriesResults";
import * as path from "path";
import * as os from "os";
import * as fs from 'fs';
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
    async () => {
      let data = getDataToCheckDeactivationStateAndIncompletes(fullPath);
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
              timer.saveIfSessionAbortedORStopped(context);
              data = getDataToCheckDeactivationStateAndIncompletes(fullPath);
              timer = reInitializeTimer(timer, context, data);
            }
          });
      } else {
        if (
          context.globalState.get("timerIsOn") === true &&
          data.isTimerDeactivated === false
        ) {
          vscode.window.showInformationMessage(
            "Timer is already on in another instance of vscode. Please use it there."
          );
          timer.stop(context);
          return;
        } else if (
          context.globalState.get("timerIsOn") === true &&
          data.isTimerDeactivated === true
        ) {
          await context.globalState.update("timerIsOn", false);
          data.isTimerDeactivated = false;
        }
        data.isTimerDeactivated = false;
        timer = reInitializeTimer(timer, context, data);
      }
    }
  );

  let timerStop = vscode.commands.registerCommand(
    "extension.algocodingtracker.stopTimer",
    () => {
      if (timer.state !== TimerState.Aborted) {
        timer.saveIfSessionAbortedORStopped(context);
      } else {
        vscode.window.showInformationMessage("Timer is already stopped");
      }
    }
  );

  context.subscriptions.push(timerStart);
  context.subscriptions.push(timerStop);

  let results = vscode.commands.registerCommand("extension.algocodingtracker.results", () => {  /*  this part with need refactor and testing */
    let resultsP: vscode.WebviewPanel = vscode.window.createWebviewPanel('resultsId', 'results', vscode.ViewColumn.One, {
      localResourceRoots: [vscode.Uri.file(os.homedir())],
      enableScripts: true,
    });

    let cssVsCId = vscode.Uri.file(path.join(context.extensionPath, 'src', 'test1.css'));
    let cssWebVId = resultsP.webview.asWebviewUri(cssVsCId);
    let jsVsCId = vscode.Uri.file(path.join(context.extensionPath, 'src', 'willBeModularized.js'));
    let jsWebVId = resultsP.webview.asWebviewUri(jsVsCId);

    const genHTMLforView1 = function () {
      return `<html>

      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" type="text/css" href=${cssWebVId}>
      </head>
      
      
      <body>
          <div id='title'>Pass Arguments</div>
          <form>
              <div id='dM'>
                  <label>Difficulty Measures</label>
                  <button type='button'>CD</button>
                  <button type='button'>AS</button>
              </div>
      
              <div id='dL'>
                  <label>Difficulty Levels</label>
                  <button type='button'>Easy</button>
                  <button type='button'>Medium</button>
                  <button type='button'>Hard</button>
              </div>
      
              <div id='sofG'>
                  <label>Number Of Problems</label>
                  <input type='text' minLength='1' maxLength='2'>
              </div>
              <button id='submit' type='submit'>Perform Analysis</button>
          </form>
          <p class='titleN'>Notes</p>
          <div id='notes'>
              <div id='dMNotes'>
                  <p>* classified difficulty is correlated with total time</p>
                  <p>* % accepted submissions is correlated with # of returns</p>
              </div>
              <div id='dLNotes'>
                  <p>Conversion if Unavailable</p>
                  <p>* easy &gt50%</p>
                  <p>* 50%&gt= medium &gt=30%</p>
                  <p>* hard &lt30%</p>
              </div>
              <div id='sofGNotes'>
                  <p>* the # of problems from the chosen difficulty level that will represent 1 unit of time in the time series</p>
                  <p>* we are controlling for DL because it is highly correlated with all performance measures </p>
      
              </div>
              
          </div> 
          <script src=${jsWebVId}></script>
      </body>
      
      </html>`
    }
    resultsP.webview.html = genHTMLforView1();

    let js2VVsCId = vscode.Uri.file(path.join(context.extensionPath, 'src', 'secView.js'));
    let js2VWebVId = resultsP.webview.asWebviewUri(js2VVsCId);
    resultsP.webview.onDidReceiveMessage((userC) => {
      let data = new Promise((resolve, reject) => {
        fs.readFile(fullPath, (err, buff) => {
          if (err) {
            reject(err);
          } else {
            let json = buff.toString();
            let js = JSON.parse(json);
            resolve(js);
          }
        })
      }).then((data) => {
        let aData = returnAllTimeSeriesResults(data, userC.difficultyMeasure, userC.difficultyLevel, userC.nofP);
        resultsP.webview.postMessage({data: aData}).then(() => {
        })
      }, (err) => {
        console.log(err)
      })
    })

  })

  context.subscriptions.push(results);
}

// this method is called when your extension is deactivated
export function deactivate() {
  /// this is execute just before vs code shuts down, in the case that it does
  timer.saveIfSessionAbortedORStopped(timer.context);
}
