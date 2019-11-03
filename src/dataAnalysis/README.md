# Main Modules

## produceTimeSeries
* cleanAndSplitData.ts => cleans and splits the data, making it ready for analysis
* returnTimeSeriesOfMetrics.ts => performs analysis, returns several timeseries
* returnTimeSeriesForEachDifficulty.ts => serves as a controller, using the submodules above to create time series for each difficulty

## analyzeTimeSeries
* linearAlgebraOperations.ts =>  

### OtherSubmodules - these don't follow the typical path => clean, split by difficulty, split in sequential groups, analyze, return time series
* incompleteProblems.ts => data is just split in sequential groups (i.e. not cleaned, nor split by difficulty), returns a time series for percent of incomplete problems
*problemsWithTTOf.ts => after cleaning the data, returns the problems that took a long time (i.e. to ask the user to go back to them and understand why it happened)

## testingAnalyzeModuleWithDummyData
Instead of unit and integration tests, simplified form of fuzz testing is used to generate dummy data and test the behavior of the functions/submodules (i.e. although not optimal, it is much easier and quicker when you are dealing with data analysis where the inputs are complex objects (e.g. manual creation is cumbersome, plus I wanted to play with the random generator function) )
* generateDummyData.ts => using Math.random() to roll numbers from a uniform or normal distribution (i.e. using transform) and to create dummy data. Keep in mind that it
creates as little data as possible (i.e. only sufficient to test the produceTimeSeries module). So, if you change that module, you would have to add/reduce this module.
* testing.ts => tests how the produceTimeSeries module performs on dummy data