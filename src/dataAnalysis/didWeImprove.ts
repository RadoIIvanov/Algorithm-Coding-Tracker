/* imports: time series, time series analyzers, performs analysis and returns information (intercept/slope to create graphs, booleans whether we improved or not)  */
import {returnTimeSeriesForEachDifficulty} from "./produceTimeSeries/returnTimeSeriesForEachDifficulty";
import {returnTimeSeriesForPercentOfIncompleteProblems} from "./produceTimeSeries/otherSubmodules/incompleteProblems";
import {createMatrixOfRegressors} from "./analyzeTimeSeries/linearAlgebraOperations";
import {calcInterceptAndSlope} from "./analyzeTimeSeries/linearAlgebraOperations";

const returnInterceptAndSlope = function () {
    // returnTimeSeriesForEachDifficulty();
    // returnTimeSeriesForPercentOfIncompleteProblems();
    
    // createMatrixOfRegressors()

    // calcInterceptAndSlope()
}

/* the graphic functions (i.e. the ones that modify the canvas drawing context, these activate when dig deeper button is pressed 
    (i.e. each box with an objective passes its own string(used to access the relevant object property that holds the data below)
     of objective as an argument to the graphic function)) need 
1. intercept(whole line), 2. slope(whole line), 3. time series (points), 4. benchmark level for the benchmark line.
the function that evaluates whether we improved needs:
1 intercept/slope (whole line if points <= 3) and two intercepts/slopes if #points > 3 (slope whole line vs last 3 points line) */
