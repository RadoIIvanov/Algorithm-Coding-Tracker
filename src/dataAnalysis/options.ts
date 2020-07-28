let whenToEvaluateBothLongTermVsRecentPerformance: number = 7;
let splitF: number = 0.5;

let benchmarkArr = [
    0.75, /// agility
    0.8, /// composure
    0.9, /// consistency
    0.8, /// hone in
    [25 * 60, 35 * 60, 45 * 60], /// eff
    0.75, /// effec
    0.05, /// persistence
];

///  0 - ag, 1 - comp, 2- cons, 3 - hon, 4 - effi, 5 - effec, 6 - pers   /* 

export {
  benchmarkArr,
  whenToEvaluateBothLongTermVsRecentPerformance,
  splitF
};

