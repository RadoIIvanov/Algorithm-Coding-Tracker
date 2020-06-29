# Main Modules

## analyzeTimeSeries
*linearAlgebraOperations.ts => typical vector/matrix operations, calculates coefficients of the regression line for a time series 

## generateData for testing
Instead of unit and integration tests, simplified form of fuzz testing is used to generate dummy data and test the behavior of the functions/submodules (i.e. although not optimal, it is much easier and quicker when you are dealing with data analysis where the inputs are complex objects (e.g. manual creation is cumbersome, plus I wanted to play with the random generator function) )
*generateDummyData.ts => using Math.random() to roll numbers from a uniform or normal distribution (i.e. using transform) and to create dummy data. Keep in mind that it
creates as little data as possible (i.e. only sufficient to test the produceTimeSeries module). So, if you change that module, you would have to add/reduce this module.

## Other
*problemsWithTTOf.ts => after cleaning the data, returns the problems that took a long time (i.e. to ask the user to go back to them and understand why it happened)

## produceTimeSeries 
*cleanAndSplitData.ts => takes user inputs from the contoller (datafile, size groups, difficultyMeasure, difficultyLevel), cleans and splits the data, making it ready for analysis
*returnTimeSeriesOfMetrics.ts => takes cleaned and split data, performs analysis, returns one timeseries for each objective
*returnTimeSeriesController.ts => serves as a controller of the submodules above

### otherSubmodulesThatProduceTimeSeries - these don't follow the typical path as in the produceTimeSeries module
*percentOfIncompletes.ts => without cleaning the data, just splitting in sequential groups, => returs a timeseries of % of incompletes

## Comment on evaluation of improvement
*Conservative approach is taken, here are the basics:
1. If number of points is low, get slope of whole reg line and compare its sign against the objective (same sign => improved)
2. If number of points is high, get 2 slopes (whole and recent), only if both of their signs + the sign of objective is the same, and if recent > whole > 1 => improved, else not (i.e it is conservative because it is not satisfied if i.e. recent and objective are the same sign but recent is not strong enough to overturn the sign of the slope of the whole line, or in cases where the 3 are the same sign but recent / whole < 1>)
make sure slope of whole line is not equal to 0 (i.e. to avoid NaN cases from division in 2 and other cases specific to the use of boolean/number conversions in the algorithm)  

## Other comments
1. number of problems that = 1 point in the time series, 2. objectives and 3. benchmarks are all chosen arbitrarily (i.e. superficial judgement)
In the long run and users' experience level (i.e. higher level => more flexible, trust choices) those things can be made a bit flexible if needed (i.e. similar to infoView interface, load data, let the user choose how to build the time series
himself (depending on his needs)) 