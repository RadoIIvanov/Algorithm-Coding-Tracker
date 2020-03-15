let whenToEvaluateBothLongTermVsRecentPerformance: number = 3;
let recentPerformance: number = 3; /// how many points to take from the end of the whole timeseries to evaluate recent performance in case the whole line is longer the above

let benchmarkArr = [
    0.75, /// agility
    0.8, /// composure
    0.9, /// consistency
    0.8, /// hone in
    [25 * 60, 35 * 60, 45 * 60], /// eff
    0.5, /// effec
    0.05, /// persistence
];

///  0 - ag, 1 - comp, 2- cons, 3 - hon, 4 - effi, 5 - effec, 6 - pers   /* 

export {
  benchmarkArr,
  whenToEvaluateBothLongTermVsRecentPerformance,
  recentPerformance
};

