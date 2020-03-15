
import { roundingUpToNDecimalPlaces } from "../../analyzeTimeSeries/linearAlgebraOperations";
import {splitDataInSequentialGroups} from "../cleanAndSplitData";
import {shapeOfTheCodingData} from "../../../dataStructureInterfaces";

const calculatePercentOfIncompletes = function (
    groupOfProblems: shapeOfTheCodingData[]
): number {
    let totalIncompletes = 0;
    let totalNumberOfProblems = groupOfProblems.length;

    for (let i = 0; i < totalNumberOfProblems; ++i) {
        let currentProblem = groupOfProblems[i];
        if (currentProblem.status === "Incomplete") {
            totalIncompletes += 1;
        }
    }
    return totalIncompletes / totalNumberOfProblems;
};

const returnTimeSeriesForPercentOfIncompletes = function (data : shapeOfTheCodingData[], sizeOfGroups: number ) : string | number[] {
    /// assemble timeseries => pass groups, get percent of incompletes, round, push
    let arrOfGroups = splitDataInSequentialGroups(data, sizeOfGroups);
    let timeSeries = [];
    let totalGroups = arrOfGroups.length;
    if (totalGroups === 0) {
        return "Not enough data";
    } 

    for (let i = 0; i < totalGroups; ++i) {
        let currentGroup = arrOfGroups[i];
        timeSeries[i] = calculatePercentOfIncompletes(currentGroup); 
    }
    return timeSeries;
}

export {returnTimeSeriesForPercentOfIncompletes};