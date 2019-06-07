import * as vscode from "vscode";
import * as fs from "fs";
import { initiateWatcher } from "./watcher";
import { platforms, stageDescriptions, problemDifficulty } from "./options";
import {
  validateNameInputInShowBox,
  validatePercentAcceptedSubmissionsInputInShowBox
} from "./validationOfInputs";

//// define interface for object of data and use it instead of any (current one)

interface TimeInfoObjectInterface {
  hours: string;
  minutes: string;
  seconds: string;
}

interface TempObjToStoreUserInputsAtTheEndOfACodingSession {
  platform: string;
  classifiedDifficulty: string;
  percentAcceptedSubmissions: number | string;
}

interface ProlongedTime {
  seconds: number;
}

export enum TimerState {
  Running,
  Paused,
  Stopped
}

export class Timer {
  /// Timer
  private _statusBarItemTimer: vscode.StatusBarItem;
  private _timer: NodeJS.Timer;
  private _secondsElapsed: number;
  private _startingTime: number; /// this is will be used to measure elapsed time by comparing the time during the start of a stage vs the currenttime
  private _state: TimerState;

  /// Description of the current stage in the problem solving process
  private _statusBarItemDescription: vscode.StatusBarItem;
  private _arrOfDescriptions: Array<string>;
  private _currentIndexInTheArrOfDescriptions: number;

  /// Button to stop the timer
  private _statusBarItemButtonStop: vscode.StatusBarItem;

  /// Buttons to change the stage of the problem solving process (change the current index of the arr of descriptions)
  private _statusBarItemButtonMoveOn: vscode.StatusBarItem;
  private _statusBarItemButtonReturnTo: vscode.StatusBarItem;
  private _returnBackVisit: boolean;
  private _numberOfReturns: number;
  private _originOfReturn: number;
  private _destinationOfReturn: number;

  /// Object to hold the data of the coding session that will ultimately be appended to a json file
  private _objectOfData: any;

  /// additional info to describe the problem
  private _currentPlatforms: Array<string>;
  private _problemDifficulty: Array<string>;

  /// FSWatcher to signal changes to the data file, so that we start the disposal of resources
  private _fsWatcherToSignalChangesToDataFileAndDisposeResources: fs.FSWatcher;
  /// Create a local version of the fixed path to the database file that is stored in globalState, so that you don't have to pass the context as argument everytime
  private _localVariableToStoreFixedPathToDatabaseFile: string;

  /// Event emitter for prolonged stage (i.e. will apply to the 4th and 5th stages, which are more likely)
  private _eventEmitterForProlongedStages: vscode.EventEmitter<ProlongedTime>;

  /// Local variable to store context - useful if you want to keep only one active instance of timer across all vscode instances
  private _context: vscode.ExtensionContext; //// this needs to be evaluated

  /// boolean variable to signal whether we are returning to a problem we have tried previously
  private _revisitingAProblem: boolean;

  constructor(context: vscode.ExtensionContext) {
    if (!this._statusBarItemTimer) {
      this._statusBarItemButtonStop = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        5
      );
      this._statusBarItemButtonStop.tooltip = "Stop Timer";

      this._statusBarItemTimer = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        4
      );
      this._statusBarItemTimer.tooltip = "Pause or Unpause";
      this._statusBarItemDescription = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        3
      );
      this._statusBarItemDescription.tooltip = "Stage Description";

      this._statusBarItemButtonMoveOn = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        2
      );
      this._statusBarItemButtonMoveOn.tooltip = "Move To The Next Stage";
      this._statusBarItemButtonReturnTo = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        1
      );
      this._statusBarItemButtonReturnTo.tooltip = "Return to a Previous Stage";
      this._statusBarItemTimer.text = "00:00:00";
      this._secondsElapsed = 0;
      ///
      this._statusBarItemButtonStop.text = "Stop";
      this._arrOfDescriptions = stageDescriptions;
      this._currentIndexInTheArrOfDescriptions = 0;
      this._statusBarItemDescription.text = this._arrOfDescriptions[
        this._currentIndexInTheArrOfDescriptions
      ];
      this._statusBarItemButtonMoveOn.text = "Move on";
      this._statusBarItemButtonReturnTo.text = "Return to";
      this._returnBackVisit = false;
      this._numberOfReturns = 0;
      ///
      this._objectOfData = {
        codingProcessDetails: []
      };
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ] = {
        initialVisitTime: undefined,
        returnBackVisits: []
      };

      this._currentPlatforms = platforms;
      this._problemDifficulty = problemDifficulty;
      this._revisitingAProblem = false;

      /// initialize the event emitter for prolonged stages
      this._eventEmitterForProlongedStages = new vscode.EventEmitter<
        ProlongedTime
      >();

      if (context !== undefined) {
        /// initiate watcher
        this._fsWatcherToSignalChangesToDataFileAndDisposeResources = initiateWatcher(
          context.globalState.get("fixedPath"),
          this,
          context
        );
        /// initialize local variable to store fixed path
        this._localVariableToStoreFixedPathToDatabaseFile = context.globalState.get(
          "fixedPath"
        );

        /// initialize context
        this._context = context;
      }
    }
  }

  get state() {
    return this._state;
  }

  get onProlongedTime(): vscode.Event<ProlongedTime> {
    return this._eventEmitterForProlongedStages.event;
  }

  get context(): vscode.ExtensionContext {
    return this._context;
  }

  public start(context: vscode.ExtensionContext) {
    //// check if there are previous incompletes (aborted sessions) and whether the user wants to try again or not
    //// mark as incomplete when the timer is stopped midway as well

    fs.readFile(
      this._localVariableToStoreFixedPathToDatabaseFile,
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let convertBufferToString = data.toString();
          let convertJSONtoJS = JSON.parse(convertBufferToString);
          let incompleteChallenges = convertJSONtoJS.data.filter(
            ({ status }) => {
              return status === "Incomplete";
            }
          );
          let that = this;
          if (incompleteChallenges.length) {
            vscode.window
              .showInformationMessage(
                "There are unsolved problems. Do you want to try any of them again?",
                { modal: true },
                ...["Yes", "No"]
              )
              .then(answer => {
                if (answer === undefined) {
                  return;
                } else {
                  if (answer === "Yes") {
                    let namesOfIncompleteChallenges = incompleteChallenges.map(
                      ({ name }) => name
                    );
                    vscode.window
                      .showQuickPick(namesOfIncompleteChallenges)
                      .then(name => {
                        if (name === undefined) {
                          return;
                        } else {
                          let dataOfChosenIncomplete = incompleteChallenges.filter(
                            ({ name: nameOfIncomplete }) =>
                              nameOfIncomplete === name
                          );

                          for (let property in dataOfChosenIncomplete[0]) {
                            that._objectOfData[property] =
                              dataOfChosenIncomplete[0][property];
                          }
                          that._revisitingAProblem = true;
                          that._objectOfData["numberOfTries"]++;
                          that._startingTime = new Date().getTime();
                          that._state = TimerState.Running;
                          that._statusBarItemButtonStop.show();
                          that._statusBarItemTimer.show();
                          that._statusBarItemDescription.show();
                          that._statusBarItemButtonMoveOn.show();
                          that._statusBarItemButtonReturnTo.show();

                          that._timer = that.initiateIntervalForTimer();

                          that.registerCommandsDuringTheStart(context);
                        }
                      });
                  } else {
                    let inputBoxOptions = {
                      placeHolder: "Type the Name of the New Problem",
                      validateInput: validateNameInputInShowBox
                    };

                    vscode.window.showInputBox(inputBoxOptions).then(name => {
                      if (name === undefined) {
                        return;
                      } else {
                        that._objectOfData["name"] = name.trim();
                        that._objectOfData["numberOfTries"] = 1;
                      }
                      that._startingTime = new Date().getTime();
                      that._state = TimerState.Running;
                      that._statusBarItemButtonStop.show();
                      that._statusBarItemTimer.show();
                      that._statusBarItemDescription.show();
                      that._statusBarItemButtonMoveOn.show();
                      that._statusBarItemButtonReturnTo.show();

                      that._timer = that.initiateIntervalForTimer();

                      that.registerCommandsDuringTheStart(context);
                    });
                  }
                }
              });
          } else {
            let inputBoxOptions = {
              placeHolder: "Type the Name of the New Problem",
              validateInput: validateNameInputInShowBox
            };

            vscode.window.showInputBox(inputBoxOptions).then(name => {
              if (name === undefined) {
                return;
              } else {
                that._objectOfData["name"] = name.trim();
                that._objectOfData["numberOfTries"] = 1;
              }
              that._startingTime = new Date().getTime();
              that._state = TimerState.Running;
              that._statusBarItemButtonStop.show();
              that._statusBarItemTimer.show();
              that._statusBarItemDescription.show();
              that._statusBarItemButtonMoveOn.show();
              that._statusBarItemButtonReturnTo.show();

              that._timer = that.initiateIntervalForTimer();

              that.registerCommandsDuringTheStart(context);
            });
          }
        }
      }
    );
  }

  public registerCommandsDuringTheStart(context: vscode.ExtensionContext) {
    let timerPauseRestart = vscode.commands.registerCommand(
      "extension.algocodingtracker.pauseOrRestart",
      this.pressTimerCommand
    );

    let moveOnToADifferentStage = vscode.commands.registerCommand(
      "extension.algocodingtracker.pressMoveOnButton",
      this.pressMoveOnButton
    );

    let returnToAPreviousStage = vscode.commands.registerCommand(
      "extension.algocodingtracker.pressReturnToButton",
      this.pressReturnToButton
    );

    this.setUpOnClickCommandForTimer(
      "extension.algocodingtracker.pauseOrRestart"
    );

    this.setUpOnClickCommandForMoveOnButton(
      "extension.algocodingtracker.pressMoveOnButton"
    );

    context.subscriptions.push(timerPauseRestart);
    context.subscriptions.push(moveOnToADifferentStage);
    context.subscriptions.push(returnToAPreviousStage);
  }

  public initiateIntervalForTimer() {
    return setInterval(() => {
      this._secondsElapsed = Math.floor(
        (new Date().getTime() - this._startingTime) / 1000
      );
      if (
        (this._currentIndexInTheArrOfDescriptions === 4 ||
          this._currentIndexInTheArrOfDescriptions === 5) &&
        this._secondsElapsed === 600
      ) {
        this.fireOnProlongedEvent();
      }
      this._statusBarItemTimer.text = this.elapsedSecondsToTime(
        this.elapsedSecondsToObjWithTimeInfo(this._secondsElapsed)
      );
    }, 1000);
  }

  public stop(context: vscode.ExtensionContext) {
    this._state = TimerState.Stopped;
    this.dispose(context);
  }

  public pause() {
    this._state = TimerState.Paused;
    clearInterval(this._timer);
  }

  public pressMoveOnButton = () => {
    if (this._currentIndexInTheArrOfDescriptions === 0) {
      this.setUpOnClickCommandForReturnToButton(
        "extension.algocodingtracker.pressReturnToButton"
      );
    }

    if (
      !this._returnBackVisit ||
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].initialVisitTime === undefined
    ) {
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].initialVisitTime = this._secondsElapsed;
    } else {
      let returnBackDetails = {
        additionalTime: this._secondsElapsed,
        returnDetails: [this._originOfReturn, this._destinationOfReturn]
      };
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].returnBackVisits[this._numberOfReturns - 1] = returnBackDetails;
    }
    if (
      this._currentIndexInTheArrOfDescriptions ===
      this._arrOfDescriptions.length - 1
    ) {
      this.addAdditionalUserProvidedInfoBeforeSavingTheDetailsOfTheProblem();
    } else {
      this._currentIndexInTheArrOfDescriptions++;
      this._statusBarItemDescription.text = this._arrOfDescriptions[
        this._currentIndexInTheArrOfDescriptions
      ];
      this._startingTime = new Date().getTime();

      if (
        this._objectOfData.codingProcessDetails[
          this._currentIndexInTheArrOfDescriptions
        ] === undefined
      ) {
        this._objectOfData.codingProcessDetails[
          this._currentIndexInTheArrOfDescriptions
        ] = {
          initialVisitTime: undefined,
          returnBackVisits: []
        };
      }
    }
  };

  public addAdditionalUserProvidedInfoBeforeSavingTheDetailsOfTheProblem() {
    let tempObj: TempObjToStoreUserInputsAtTheEndOfACodingSession = {
      platform: "",
      classifiedDifficulty: "",
      percentAcceptedSubmissions: 0
    };
    vscode.window.showQuickPick(this._currentPlatforms).then(platform => {
      if (platform === undefined) {
        return;
      } else {
        tempObj.platform = platform;
        vscode.window
          .showQuickPick(this._problemDifficulty)
          .then(difficulty => {
            if (difficulty === undefined) {
              return;
            } else {
              tempObj.classifiedDifficulty = difficulty;
              let inputBoxOptions = {
                placeHolder: "Number from 0 to 100, or unknown",
                prompt:
                  "The Overall Percent Of Accepted Submissions for the Problem",
                validateInput: validatePercentAcceptedSubmissionsInputInShowBox
              };
              vscode.window
                .showInputBox(inputBoxOptions)
                .then(percentAcceptedSubmissionsText => {
                  if (percentAcceptedSubmissionsText === undefined) {
                    return;
                  } else {
                    if (
                      percentAcceptedSubmissionsText.toLocaleLowerCase() ===
                      "unknown"
                    ) {
                      tempObj.percentAcceptedSubmissions = percentAcceptedSubmissionsText.toLocaleLowerCase();
                    } else {
                      let percentAcceptedSubmissionsNumber = Number(
                        percentAcceptedSubmissionsText
                      );
                      tempObj.percentAcceptedSubmissions = percentAcceptedSubmissionsNumber;
                    }

                    for (let key in tempObj) {
                      this._objectOfData[key] = tempObj[key];
                    }
                    this._objectOfData["dateOfCompletion"] = new Date();
                    this._objectOfData["status"] = "Complete";
                    ///// start saving process

                    fs.readFile(
                      this._localVariableToStoreFixedPathToDatabaseFile,
                      (err, data) => {
                        if (err) {
                          console.log(err);
                        } else {
                          let convertBufferToString = data.toString();
                          let jsObject = JSON.parse(convertBufferToString);
                          jsObject.data.push(this._objectOfData);
                          let returnDataToJSON = JSON.stringify(jsObject);
                          fs.writeFile(
                            this._localVariableToStoreFixedPathToDatabaseFile,
                            returnDataToJSON,
                            err => {
                              if (err) {
                                console.log(err);
                              } else {
                                return;
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
            }
          });
      }
    });
  }

  public saveIfSessionAbortedAndStop(context: vscode.ExtensionContext) {
    fs.readFile(
      this._localVariableToStoreFixedPathToDatabaseFile,
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let convertBufferToString = data.toString();
          let jsObject = JSON.parse(convertBufferToString);

          if (this._objectOfData["numberOfTries"] === 1) {
            this._objectOfData["dateOfInitialTry"] = new Date();
            this._objectOfData["status"] = "Incomplete";
          }

          jsObject.data.push(this._objectOfData);
          let returnDataToJSON = JSON.stringify(jsObject);
          fs.writeFile(
            this._localVariableToStoreFixedPathToDatabaseFile,
            returnDataToJSON,
            err => {
              if (err) {
                console.log(err);
              } else {
                return;
              }
            }
          );
        }
      }
    );
  }

  public pressReturnToButton = () => {
    vscode.window
      .showQuickPick(
        this._arrOfDescriptions.slice(
          0,
          this._currentIndexInTheArrOfDescriptions
        )
      )
      .then(this.processUserInputFromTheReturnButton);
  };

  public processUserInputFromTheReturnButton = (stage: string) => {
    if (stage === undefined) {
      return;
    }
    if (
      !this._returnBackVisit ||
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].initialVisitTime === undefined
    ) {
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].initialVisitTime = this._secondsElapsed;
    } else {
      let returnBackDetails = {
        additionalTime: this._secondsElapsed,
        returnDetails: [this._originOfReturn, this._destinationOfReturn]
      };
      this._objectOfData.codingProcessDetails[
        this._currentIndexInTheArrOfDescriptions
      ].returnBackVisits[this._numberOfReturns - 1] = returnBackDetails;
    }

    this._originOfReturn = this._currentIndexInTheArrOfDescriptions;
    this._currentIndexInTheArrOfDescriptions = this._arrOfDescriptions.indexOf(
      stage
    );
    this._destinationOfReturn = this._currentIndexInTheArrOfDescriptions;
    this._returnBackVisit = true;
    this._numberOfReturns += 1;
    this._statusBarItemDescription.text = this._arrOfDescriptions[
      this._currentIndexInTheArrOfDescriptions
    ];
    this._startingTime = new Date().getTime();
  };

  public restart() {
    this._state = TimerState.Running;
    this._startingTime = new Date().getTime() - this._secondsElapsed * 1000;
    this._timer = this.initiateIntervalForTimer();
  }

  public dispose(context: vscode.ExtensionContext) {
    this._statusBarItemTimer.dispose();
    clearInterval(this._timer);
    this._statusBarItemDescription.dispose();
    this._statusBarItemButtonMoveOn.dispose();
    this._statusBarItemButtonReturnTo.dispose();
    this._statusBarItemButtonStop.dispose();
    this._fsWatcherToSignalChangesToDataFileAndDisposeResources.close();

    context.subscriptions.forEach((element, index) => {
      if (index > 1) {
        element.dispose();
      }
    });
  }

  public setUpOnClickCommandForStopButton(cmd: string) {
    this._statusBarItemButtonStop.command = cmd;
  }

  public setUpOnClickCommandForTimer(cmd: string) {
    this._statusBarItemTimer.command = cmd;
  }

  public setUpOnClickCommandForMoveOnButton(cmd: string) {
    this._statusBarItemButtonMoveOn.command = cmd;
  }

  public setUpOnClickCommandForReturnToButton(cmd: string) {
    this._statusBarItemButtonReturnTo.command = cmd;
  }

  public pressTimerCommand = () => {
    if (this._state === TimerState.Paused) {
      this.restart();
    } else if (this._state === TimerState.Running) {
      this.pause();
    }
  };

  private fireOnProlongedEvent() {
    this._eventEmitterForProlongedStages.fire({
      seconds: this._secondsElapsed
    });
  }

  private elapsedSecondsToTime(ObjWithTimeInfo: TimeInfoObjectInterface) {
    return `${ObjWithTimeInfo.hours}:${ObjWithTimeInfo.minutes}:${
      ObjWithTimeInfo.seconds
    }`;
  }

  private leadingZeroTimeFormat(timeComponent: number) {
    return timeComponent < 10 ? "0" + timeComponent : timeComponent + "";
  }

  private elapsedSecondsToObjWithTimeInfo(seconds: number) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let newSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);
    return {
      hours: this.leadingZeroTimeFormat(hours),
      minutes: this.leadingZeroTimeFormat(minutes),
      seconds: this.leadingZeroTimeFormat(newSeconds)
    };
  }
}

/*  */
