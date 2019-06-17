import { Timer, TimerState } from "./timer";
import * as vscode from "vscode";

export function reInitializeTimer(
  previousTimerInstance: Timer,
  context: vscode.ExtensionContext,
  data: any
): Timer {
  if (previousTimerInstance.state !== TimerState.Aborted) {
    previousTimerInstance.stop(context);
  }
  let newInstanceOfTimer = new Timer(context);
  newInstanceOfTimer.preStartChecks(context, data).then(
    () => {
      newInstanceOfTimer.setUpOnClickCommandForStopButton(
        "extension.algocodingtracker.stopTimer"
      );
      newInstanceOfTimer.onProlongedTime(event => {
        vscode.window.showWarningMessage(
          "If you are stuck, consider going back to an earlier stage (i.e. coming up with a new idea)"
        );
      });
    },
    () => {
      /// on rejected
    }
  );
  return newInstanceOfTimer;
}
