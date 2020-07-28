let arrOfM = [
  "agility",
  "composure",
  "consistency",
  "honeIn",
  "efficiency",
  "effectiveness",
  "persistence",
];

const drawGraph3V = function (userC, data) {
  const nameMeasure = {
    agility: "% Returns to Generate an Idea",
    composure: "% of P with 1 Return from all P with any # of Returns",
    consistency: "% of P where each stage is 10-25% of TT",
    honeIn: "% of Return Cycles shorter than Previous Cycle",
    efficiency: "Average Total Time per Problem (in minutes)",
    effectiveness: "% of P completed in the first attempt",
    persistence: "% of Incompleted Problems",
  };

  const roundCoefficients = function (arrofCoeff, n) {
    let totalNumberOfCoefficients = arrofCoeff.length;
    let arrofRoundCoeff = [];
    for (let index = 0; index < totalNumberOfCoefficients; ++index) {
      let coefficient = arrofCoeff[index];
      arrofRoundCoeff.push(Number(roundingUpToNDecimalPlaces(coefficient, n)));
    }
   return arrofRoundCoeff;
  };

  const roundingUpToNDecimalPlaces = function (number, n) {
   /// not quite the same fn as in ts linear algebra files
    let fixDecimalPlaces = number.toFixed(n);
    return fixDecimalPlaces;
  };

  const canvas = /** @type {HTMLCanvasElement}*/ (document.getElementsByTagName(
    "canvas"
  ))[0];

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const cs = canvas.getContext("2d");

  let seriesArr = data.timeSeriesPoints;
  let intAndSlopArr = data.interceptAndSlopeData;
  let benchV = data.benchmark;
  let vIncrement;
  if (benchV > 1) {
    vIncrement = 5;
    benchV = benchV / 60;
    seriesArr = seriesArr.map((element) =>
      Number(roundingUpToNDecimalPlaces(element / 60, 2))
    );
   intAndSlopArr = intAndSlopArr.map((element) =>
      Number(roundingUpToNDecimalPlaces(element / 60, 7))
    );
 } else {
    vIncrement = 0.05;
    intAndSlopArr = roundCoefficients(intAndSlopArr, 7);
  }

  let minV = Math.min(...seriesArr, Number(benchV));
  let maxV = Math.max(...seriesArr, Number(benchV));

  const incMV = function (maxV, vIncrement, minV) {
    //// typical GC function.... need to be cleaned at some point
    if (maxV !== undefined) {
      if (maxV > 1) {
        if (Number.parseInt(String(maxV)) % vIncrement === 0) {
          return Number.parseInt(String(maxV));
        } else {
          return (
            Number.parseInt(String(maxV)) +
            (vIncrement - (Number.parseInt(String(maxV)) % vIncrement))
          );
        }
      } else {
        if ((maxV * 100) % (vIncrement * 100) === 0) {
          return maxV;
        } else {
          return maxV + (vIncrement - (maxV % vIncrement));
        }
      }
    } else {
      if (minV > 1) {
        if (Number.parseInt(String(minV)) % vIncrement === 0) {
          return Number.parseInt(String(minV));
        } else {
          return (
            Number.parseInt(String(minV)) -
            (Number.parseInt(String(minV)) % vIncrement)
          );
        }
      } else {
        if ((minV * 100) % (vIncrement * 100) === 0) {
          return minV;
        } else {
          return minV - (minV % vIncrement);
        }
      }
    }
  };

  let topV =
    benchV > 1
      ? incMV(maxV, vIncrement, minV) + vIncrement
      : Number(roundingUpToNDecimalPlaces(incMV(maxV, vIncrement, minV), 2)) +
        vIncrement;
  let botV = 0;

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

  let title = nameMeasure[userC];
  cs.font = `${canvas.height / 30}px Georgia`;
  let titleWidth = cs.measureText(title).width;
  if (titleWidth > canvas.width) {
    cs.fillText(
      title,
      0.05 * canvas.width,
      canvas.height * 0.04,
      canvas.width * 0.9
    );
  } else {
    cs.fillText(title, (canvas.width - titleWidth) / 2, canvas.height * 0.04);
  }

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
        let commentBench = "arbitrary benchmark level";
        cs.font = `${canvas.height / 35}px Verdana`;
        let wOfC = cs.measureText(commentBench).width;
        cs.fillText(
          commentBench,
          0.9 * (canvas.width - wOfC),
          canvas.height * 0.07
        );
        let midOfC = 0.9 * (canvas.width - wOfC) + wOfC / 2;
        cs.moveTo(midOfC, canvas.height * 0.075);
        cs.lineTo(0.8 * midOfC, vPosition);
      }
    }
  };

  cs.setLineDash([vStep * 0.5]);
  cs.beginPath();
  drawYValAndHLines(startX, startY, vStep, topV, widthOfGraph, benchV);
  cs.stroke();

  let canPlot = true;
  const drawXValAndLines = function (
    startX,
    startY,
    vStep,
    hStep,
    lengthOfGraph,
    marginTandB
  ) {
    let str = "";
    for (let i = 0; i <= nOfHSect; i++) {
      str = str + i;
    }
    let p = 0.4;
    cs.font = `${vStep * p}px Verdana`;
    let cStrW = cs.measureText(str).width;
    for (let i = 0.05, j = 1; cStrW > 0.5 * widthOfGraph; j++) {
      p = p - i * j;
      if (p < i) {
        canPlot = false;
        break;
      }
      cs.font = `${vStep * p}px Verdana`;
      cStrW = cs.measureText(str).width;
    }
    if (canPlot === false) {
      return;
    }
    for (let i = 0; i <= nOfHSect; i++) {
      let hPosition = startX + i * hStep;
      let hValue = i;
      cs.moveTo(hPosition, startY);
      cs.lineTo(hPosition, startY + lengthOfGraph);
      let widthOfV = cs.measureText(`${hValue}`).width;
      let heightOfV = Number.parseFloat(cs.font);
      cs.fillStyle = "black";
      cs.fillText(
        `${hValue}`,
        hPosition - widthOfV / 2,
        startY + lengthOfGraph + marginTandB * 0.6
      );
    }
  };

  cs.beginPath();
  cs.globalAlpha = 0.4;
  drawXValAndLines(startX, startY, vStep, hStep, lengthOfGraph, marginTandB);
  cs.stroke();
  cs.globalAlpha = 1;

  cs.setLineDash([]);
  cs.beginPath();
  cs.translate(startX, startY + lengthOfGraph);

  const constPoint = function (x, y) {
    cs.arc(x, y, ((canvas.height + canvas.width) / 2) * 0.003, 0, Math.PI * 2);
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
  if (canPlot === true) {
      plotTs(vStep, hStep, botV, vIncrement);
  cs.fill();
  }


  const plotRegL = function (
    interceptAndSlopeData,
    tsLength,
    vStep,
    hStep,
    botV,
    vIncrement,
    nOfHSect,
    name,
  ) {
    let pS = interceptAndSlopeData[0];
    let s = interceptAndSlopeData[1];

    let pE = pS + tsLength * s;
    let yS = -(((pS - botV) / vIncrement) * vStep);

    let yE = -(((pE - botV) / vIncrement) * vStep);
    if (name === 'whole' || name === 'first half') {
      cs.moveTo(0, yS);
      cs.lineTo(tsLength * hStep, yE);
    } else {
      cs.moveTo(tsLength * hStep, yS);
      cs.lineTo(tsLength * hStep * 2, yE);
    }

    let com, yPos;
    if (name === 'whole' || name === 'first half') {
      yPos = canvas.height / 35;
    } else {
      yPos = (canvas.height / 35) * 2;
    }

    if (name === 'whole') {
      com = `${name} regression line, slope ${s}`;
    } else {
      com = `${name} regression line, mid point(avg level) ${roundingUpToNDecimalPlaces(pS + (s * tsLength / 2), 7)}, slope ${s}`;
    }
    cs.font = `${canvas.height / 35}px Verdana`;
    let comW = cs.measureText(com).width;
    cs.strokeText(com, hStep * nOfHSect - comW, yPos);
  };
  cs.lineWidth = 3;
  if (intAndSlopArr.length > 2) {
    cs.beginPath();
    cs.strokeStyle = "green";
    plotRegL(
      intAndSlopArr,
      Math.ceil(seriesArr.length / 2),
      vStep,
      hStep,
      botV,
      vIncrement,
      nOfHSect,
      "first half",
    );
    cs.stroke();

    cs.beginPath();
    cs.strokeStyle = "red";
    plotRegL(
      intAndSlopArr.slice(2),
      Math.ceil(seriesArr.length / 2),
      vStep,
      hStep,
      botV,
      vIncrement,
      nOfHSect,
      `last half`,
    );
    cs.stroke();
  } else {
    cs.beginPath();
    cs.strokeStyle = "green";
    plotRegL(
      intAndSlopArr,
      Math.ceil(seriesArr.length / 2),
      vStep,
      hStep,
      botV,
      vIncrement,
      nOfHSect,
      "whole",
    );
    cs.stroke();
  }
};

const crudDom2V = function (data, arrOfM) {
  let body = document.documentElement.children[1];
  removeBotUp(orderTopDown(body, []));

  let cont = document.createElement("div");
  cont.setAttribute("id", "cont2v");
  body.appendChild(cont);

  let divI = document.createElement("div");
  divI.setAttribute("id", "invis");
  divI.innerHTML = "invis";
  cont.appendChild(divI);

  let divT = document.createElement("div");
  divT.setAttribute("id", "titles");
  let spanS = document.createElement("span");
  spanS.setAttribute("class", "skills");
  spanS.innerHTML = "<strong>Skill</strong>";
  let spanI = document.createElement("span");
  spanI.setAttribute("class", "impV");
  spanI.innerHTML = "<strong>Improved?</strong>";
  let invButt = document.createElement("button");
  invButt.setAttribute("id", "invButt");
  invButt.innerText = "dig deeper";

  divT.appendChild(spanS);
  divT.appendChild(spanI);
  divT.appendChild(invButt);
  cont.appendChild(divT);

  for (let i = 0; i < arrOfM.length; ++i) {
    let div = document.createElement("div");
    div.setAttribute("id", arrOfM[i]);
    let spanS = document.createElement("span");
    spanS.setAttribute("class", `skills`);
    spanS.innerText = `${arrOfM[i]}`;
    let spanI = document.createElement("span");
    spanI.setAttribute("class", `impV`);
    if (data[i].improveOrNot === true) {
      spanI.innerHTML = `&#10004;`;
    } else {
      spanI.innerHTML = `&#10060;`;
    }
    let butt = document.createElement("button");
    butt.setAttribute("id", arrOfM[i]);
    butt.setAttribute("data-index", `${i}`);
    butt.innerText = "dig deeper";
    div.appendChild(spanS);
    div.appendChild(spanI);
    div.appendChild(butt);
    cont.appendChild(div);
  }
  let notesEv = document.createElement("p");
  notesEv.setAttribute("id", "notesEv2v");
  notesEv.innerHTML =
    "<strong>** (Tick vs Cross) - 1. if 1 Reg Line(less than 7p) => slope needs to be in the right direction, 2. if 2 => compare their mid points </strong>";
  let notesCal = document.createElement("p");
  notesCal.setAttribute("id", "notesCalc2v");
  notesCal.innerHTML =
    "<strong>** Calculations are 1. imprecise (i.e. operations with decimals) and 2. rounded. Don't put much value in small slopes/differences</strong>";
  let notesPoints = document.createElement("p");
  notesPoints.setAttribute('id', "notesPoints2v");
  notesPoints.innerHTML = "<strong>** If points are too many to draw (i.e. given a certain width), only reg lines will be drawn </strong>";
  cont.appendChild(notesEv);
  cont.appendChild(notesCal);
  cont.appendChild(notesPoints);
};

const crudDom3V = function (userC, data) {
  let body = document.documentElement.children[1];
  removeBotUp(orderTopDown(body, []));
  let div = document.createElement("div");
  div.setAttribute("id", "div3v");
  let butt = document.createElement("button");
  butt.innerHTML = `&#8592; Return Back`;
  div.appendChild(butt);
  body.appendChild(div);
  let canvasEl = document.createElement("canvas");
  body.appendChild(canvasEl);
  drawGraph3V(userC, data);
};

const orderTopDown = function (root, arr) {
  let children = root.children;
  let length = children.length;
  if (length === 0) {
    arr.push(root);
    return;
  }
  arr.push(root);

  for (let i = 0; i < length; ++i) {
    let child = children[i];
    orderTopDown(child, arr);
  }
  return arr;
};

const removeBotUp = function (arr) {
  if (arr.length === 1) {
    return;
  }
  let el = arr.pop();
  el.parentNode.removeChild(el);
  removeBotUp(arr);
};

window.addEventListener(
  "error",
  (event) => {
    console.log(`There is a problem with ${event.message}`);
  },
  true
);

window.addEventListener(
  "load",
  (event) => {
    event.stopPropagation();
    let dM = /** @type {HTMLElement} */ document.getElementById("dM");
    let dMSubfS = "";
    dM.addEventListener(
      "click",
      (event) => {
        if (event.target.tagName !== "BUTTON") {
          event.stopPropagation();
          return;
        } else {
          if (event.target.style.backgroundColor === "") {
            let dMCh = dM.children;
            for (let i = 0; i < dMCh.length; ++i) {
              let el = dMCh[i];
              if (el !== event.target && el.tagName === "BUTTON") {
                el.style.backgroundColor = "";
              }
            }
            event.target.style.backgroundColor = "blue";
            if (event.target.innerHTML === "CD") {
              dMSubfS = "classifiedDifficulty";
            } else {
              dMSubfS = "percentAcceptedSubmissions";
            }
          } else {
            event.target.style.backgroundColor = "";
            dMSubfS = "";
          }
        }
      },
      true
    );

    let dL = /** @type {HTMLElement} */ document.getElementById("dL");
    let dLSubfS = "";
    dL.addEventListener(
      "click",
      (event) => {
        if (event.target.tagName !== "BUTTON") {
          event.stopPropagation();
          return;
        } else {
          if (event.target.style.backgroundColor === "") {
            let dLCh = dL.children;
            for (let i = 0; i < dLCh.length; ++i) {
              let el = dLCh[i];
              if (el !== event.target && el.tagName === "BUTTON") {
                el.style.backgroundColor = "";
              }
            }
            event.target.style.backgroundColor = "blue";
            dLSubfS = event.target.innerHTML.toLowerCase();
          } else {
            event.target.style.backgroundColor = "";
            dLSubfS = "";
          }
        }
      },
      true
    );

    let sofG = /** @type {HTMLElement} */ document.getElementById("sofG");
    let inpBox = /** @type {HTMLInputElement} */ sofG.getElementsByTagName(
      "input"
    )[0];
    inpBox.addEventListener(
      "input",
      (event) => {
        inpBox.setCustomValidity("");
        event.stopPropagation();
      },
      true
    );
    inpBox.addEventListener(
      "change",
      (event) => {
        if (inpBox.value.match(/^[1-9]\d?$/) === null || inpBox.value === "1") {
          inpBox.setCustomValidity("Please, provide a number (2-99)");
          event.stopPropagation();
          return;
        }
        inpBox.setCustomValidity("");
      },
      true
    );
    let viewToExt = acquireVsCodeApi();
    let subBut = /** @type {HTMLButtonElement} */ document.getElementById(
      "submit"
    );
    subBut.addEventListener(
      "click",
      (event) => {
        if (dMSubfS === "") {
          subBut.setCustomValidity("Please, select a difficulty measure");
          event.stopPropagation();
          return;
        }
        if (dLSubfS === "") {
          subBut.setCustomValidity("Please, select a difficulty level");
          event.stopPropagation();
          return;
        }
        if (inpBox.value.match(/^[1-9]\d?$/) === null || inpBox.value === "1") {
          inpBox.setCustomValidity("Please, provide a number (2-99)");
          event.stopPropagation();
          return;
        }
        subBut.setCustomValidity("");

        let nofP = Number(inpBox.value);
        viewToExt.postMessage({
          difficultyMeasure: dMSubfS,
          difficultyLevel: dLSubfS,
          nofP: nofP,
        });
      },
      true
    );
  },
  true
);

const handlerHof = function (event) {
  event.stopPropagation();
  let data = event.data.data;
  crudDom2V(data, arrOfM);
  let allButt = document.getElementsByTagName("button");
  for (let i = 0; i < allButt.length; ++i) {
    let butt = allButt[i];
    butt.addEventListener("click", (event) => {
      event.stopPropagation();
      crudDom3V(
        event.target.getAttribute("id"),
        data[Number(event.target.getAttribute("data-index"))]
      );
      let butt = document.getElementsByTagName("button")[0];
      butt.addEventListener("click", (event) => {
        event.stopPropagation();
        let sE = new Event("message");
        sE.data = {};
        sE.data.data = data;
        window.dispatchEvent(sE);
      });
    });
  }
};
handlerHofB = handlerHof.bind(window);

window.addEventListener("message", handlerHofB);
