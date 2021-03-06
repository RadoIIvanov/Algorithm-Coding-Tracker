# Main Modules

## analyzeTimeSeries
*linearAlgebraOperations.ts => typical vector/matrix operations, calculates coefficients of the regression line for a time series. It is not precise (i.e. errors from calculations with decimals). Additionally, the "imprecise" results are rounded before being visually presented to the user (i.e. increasing the error). At some point those need to be improved. 

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
* if one line => look at slope
* if two lines(look at half vs other half and compare their mid point)

## Other comments
1. number of problems that = 1 point in the time series, 2. objectives and 3. benchmarks are all chosen arbitrarily (i.e. superficial judgement)
In the long run and users' experience level (i.e. higher level => more flexible, trust choices) those things can be made a bit flexible if needed (i.e. similar to infoView interface, load data, let the user choose how to build the time series
himself (depending on his needs)) 
