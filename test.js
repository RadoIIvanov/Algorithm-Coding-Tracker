// use this folder, move the whole data analysis module in JS form (compiled from typescript)
/* 1. create a js file that modifies the html (asking questions) 
2. depending on answer => run the associated programs in the testing js files
3. show objectives + dig deeper (or no data, but make sure to have data / cases)
*/

/*    { interceptAndSlopeData: [ 0.2, -0.04, 0.07, 0 ], length = 4 if n > 3 else length = 2, intercept first, slope second
    timeSeriesPoints: [ 0.2, 0.08, 0.04, 0.08 ],
    benchmark: 0.05,
    improveOrNot: false } ]*/

const roundingUpToNDecimalPlaces = function (number, n) {
  let fixDecimalPlaces = number.toFixed(n);
  return fixDecimalPlaces;
};

const dummyData = [
  {
    interceptAndSlopeData: [0.54, -0.05, 0.58, -0.09],
    timeSeriesPoints: [0.46, 0.47, 0.47, 0.3],
    benchmark: 0.75,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [0.28, -0.04, 0.43, -0.12],
    timeSeriesPoints: [0.16, 0.3, 0.21, 0.06],
    benchmark: 0.8,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [0.12, -0.01, 0.08, 0],
    timeSeriesPoints: [0.12, 0.08, 0.08, 0.08],
    benchmark: 0.9,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [0.41, 0.02, 0.48, -0.01],
    timeSeriesPoints: [0.4, 0.44, 0.53, 0.42],
    benchmark: 0.8,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [2790.91, 39.99, 3097.26, -74.16],
    timeSeriesPoints: [2716.75, 2993.31, 3008.52, 2844.99],
    benchmark: 2700,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [4.96, 0, 5.15, -0.08],
    timeSeriesPoints: [4.88, 4.8, 5.52, 4.64],
    benchmark: 0.5,
    improveOrNot: false,
  },
  {
    interceptAndSlopeData: [0.1, 0, 0.33, -0.08],
    timeSeriesPoints: [
      0.16,
      0.2,
      0.16,
      0,
      0.12,
      0,
      0.04,
      0.12,
      0.16,
      0.12,
      0.08,
      0.04,
      0.12,
      0.24,
      0.2,
      0.08,
    ],
    benchmark: 0.05,
    improveOrNot: false,
  },
];

let benchmarkArr = [
  "0.75", /// agility
  "0.80", /// composure
  "0.90", /// consistency
  "0.80", /// hone in
  [`${25 * 60}`, `${35 * 60}`, `${45 * 60}`], /// eff, here the input needs to be divided by 60
  "0.5", /// effec
  "0.05", /// persistence
];

const canvas = /** @type {HTMLCanvasElement}*/ (document.getElementById(
  "test"
));

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const cs = canvas.getContext("2d");

let title = "AGILITY"; // this will be received from button press
let commentBench = "Arbitrary Benchmark Level";
cs.font = `${canvas.height / 30}px Georgia`;
let titleWidth = cs.measureText(title).width;
cs.fillText(title, (canvas.width - titleWidth) / 2, canvas.height * 0.04);

let dIndex = 6;
let seriesArr = dummyData[dIndex].timeSeriesPoints;
let intAndSlopArr = dummyData[dIndex].interceptAndSlopeData;
let benchV = benchmarkArr[dIndex];
let minV = Math.min(...seriesArr, Number(benchV));
let maxV = Math.max(...seriesArr, Number(benchV));

let vIncrement;
if (benchV > 1) {
  vIncrement = 5;
} else {
  vIncrement = 0.05;
}

let topV =
  benchV > 1
    ? Number.parseInt(String(maxV)) +
      (5 - (Number.parseInt(String(maxV)) % 5)) +
      vIncrement
    : Number(roundingUpToNDecimalPlaces(maxV + (0.05 - (maxV % 0.05)), 2)) +
      vIncrement;
let botV =
  benchV > 1
    ? Number.parseInt(String(minV)) -
      (Number.parseInt(String(minV)) % 5) -
      vIncrement
    : Number(roundingUpToNDecimalPlaces(minV - (minV % 0.05), 2)) - vIncrement;
// let botV = 0;

let nOfVSect = benchV > 1 ? (topV - botV) / 5 : (topV * 100 - botV * 100) / 5;
let nOfHSect = seriesArr.length + 1;

let marginLandR = canvas.width * 0.05;
let marginTandB = canvas.height * 0.08;
let widthOfGraph = canvas.width - 2 * marginLandR;
let lengthOfGraph = canvas.height - 2 * marginTandB;
let vStep = lengthOfGraph / nOfVSect;
let hStep = widthOfGraph / nOfHSect;
let startX = marginLandR;
let startY = marginTandB;

const drawYValAndHLines = function (
  startX,
  startY,
  vStep,
  topV,
  widthOfGraph,
  benchV
) {
  for (let i = 0; i <= nOfVSect; i++) {
    let vPosition = startY + i * vStep;
    let vValue = roundingUpToNDecimalPlaces(topV - i * vIncrement, 2);
    cs.font = `${vStep * 0.4}px Verdana`;
    let heightOfV = Number.parseFloat(cs.font);
    if (Number(vValue) !== Number(benchV)) {
      cs.fillStyle = "black";
      cs.fillText(
        vValue,
        canvas.width * 0.01,
        vPosition + heightOfV / 3,
        canvas.width * 0.03
      );
      cs.moveTo(startX, vPosition);
      cs.lineTo(startX + widthOfGraph, vPosition);
    } else {
      cs.fillStyle = "blue";
      cs.fillText(
        vValue,
        canvas.width * 0.01,
        vPosition + heightOfV / 3,
        canvas.width * 0.03
      );
      cs.fillRect(startX, vPosition, widthOfGraph, 3);
      let commentBench = "Arbitrary Benchmark Level";
      cs.font = `${vStep * 0.2}px Verdana`;
      let wOfC = cs.measureText(commentBench).width;
      cs.fillText(
        commentBench,
        0.9 * (canvas.width - wOfC),
        canvas.height * 0.05
      );
      let midOfC = 0.9 * (canvas.width - wOfC) + wOfC / 2;
      cs.moveTo(midOfC, canvas.height * 0.055);
      cs.lineTo(0.8 * midOfC, vPosition);
    }
  }
};

cs.setLineDash([vStep * 0.5]);
cs.beginPath();
drawYValAndHLines(startX, startY, vStep, topV, widthOfGraph, benchV);
cs.stroke();

const drawXValAndLines = function (
  startX,
  startY,
  vStep,
  hStep,
  lengthOfGraph,
  marginTandB
) {
  for (let i = 0; i <= nOfHSect; i++) {
    let hPosition = startX + i * hStep;
    let hValue = i;
    cs.moveTo(hPosition, startY);
    cs.lineTo(hPosition, startY + lengthOfGraph);
    cs.font = `${vStep * 0.4}px Verdana`;
    let widthOfV = cs.measureText(`${hValue}`).width;
    let heightOfV = Number.parseFloat(cs.font);
    cs.fillStyle = "black";
    cs.fillText(
      `${hValue}`,
      hPosition - widthOfV / 2,
      startY + lengthOfGraph + marginTandB * 0.4
    );
  }
};

cs.beginPath();
drawXValAndLines(startX, startY, vStep, hStep, lengthOfGraph, marginTandB);
cs.stroke();

cs.setLineDash([]);
cs.beginPath();
cs.translate(startX, startY + lengthOfGraph);

const constPoint = function (x, y) {
  cs.arc(x, y, 5, 0, Math.PI * 2);
  cs.closePath();
};

const plotTs = function (vStep, hStep, botV, vIncrement) {
  for (let i = 0; i < seriesArr.length; ++i) {
    let p = seriesArr[i];
    let x = (i + 1) * hStep;
    let y = ((p - botV) / vIncrement) * vStep;
    cs.moveTo(x, -y);
    constPoint(x, -y);
  }
};
plotTs(vStep, hStep, botV, vIncrement);
cs.fill();

cs.beginPath();

const plotRegL = function (
  interceptAndSlopeData,
  vStep,
  hStep,
  botV,
  vIncrement,
  nOfHSect,
  size
) {
  let pS = interceptAndSlopeData[0];
  let s = interceptAndSlopeData[1];

  let pE = pS + nOfHSect * s;
  let yS = -(((pS - botV) / vIncrement) * vStep);

  let yE = -(((pE - botV) / vIncrement) * vStep);
  cs.moveTo(0, yS);
  cs.lineTo(nOfHSect * hStep, yE);

  let com = `${size} regression line, slope ${s}`;
  cs.font = `${vStep * 0.2}px Verdana`;
  let comW = cs.measureText(com).width;
  let pM = pS + (nOfHSect / 2) * s;
  let yM = -(((pM - botV) / vIncrement) * vStep);
  cs.translate((nOfHSect / 2) * hStep, yM);
  let test = (-yS - (-yM)) / (nOfHSect / 2 * hStep);
  // cs.rotate(Math.atan(((-yS - yM) / nOfHSect / 2) * hStep));
  cs.rotate(Math.atan(test));
  cs.fillText(com, 0 - comW / 2, -2);
  // cs.rotate(-Math.atan(((-yS - yM) / nOfHSect / 2) * hStep));
  cs.rotate(-Math.atan(test));
  cs.translate(-(nOfHSect / 2) * hStep, -yM);
};
cs.strokeStyle = "red";
plotRegL(intAndSlopArr, vStep, hStep, botV, vIncrement, nOfHSect, "whole");
cs.stroke();

if (intAndSlopArr.length > 2) {
  cs.beginPath();
  cs.strokeStyle = "brown";
  plotRegL(
    intAndSlopArr.slice(2),
    vStep,
    hStep,
    botV,
    vIncrement,
    nOfHSect,
    "partial(last 3 points)"
  );
  cs.stroke();
}

// [0.54, -0.05, 0.58, -0.09]
