export interface outerShapeOfTheCodingFile {
  data?: shapeOfTheCodingData[];
  isTimerDeactivated?: boolean;
}

export interface shapeOfTheCodingData {
  codingProcessDetails?: Array<shapeOfCodingDetailsForAStageInAProblem>;
  name?: string;
  platform?: string;
  numberOfTries?: number;
  classifiedDifficulty?: string;
  percentAcceptedSubmissions?: number | string;
  dateOfCompletion?: Date;
  status?: string;
  problemNumber?: number;
  dateOfInitialTry?: Date;
  totalTime?: number;
  totalReturns?: number;
  totalReturnsToGI?: number;
  numberOfReturnCyclesFasterThanPreviousCounterparts?: number;
}

export interface shapeOfCodingDetailsForAStageInAProblem {
  initialVisitTime?: number;
  returnBackVisits?: shapeOfObjectForReturnBackVisitsOfAStage[];
  totalStageTime?: number;
}

export interface shapeOfObjectForReturnBackVisitsOfAStage {
  additionalTime?: number;
  returnDetails?: number[];
}

export interface objofResultsForAnObjective {
  interceptAndSlopeData: number[]; //// 0 = intercept whole line, 1 = slope whole line, 2 = intercept last 3, 3 = slope last 3]
  timeSeriesPoints: number[];
  benchmark: number;
  improveOrNot: boolean;
}
