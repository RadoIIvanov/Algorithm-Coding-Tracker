const BigNumber = require("bignumber.js");

const createMatrixOfRegressors = function (
  depVarTimeSeriesLength: number
): Array<number[]> {
  let regMatrix = [];
  for (let ob = 0; ob < depVarTimeSeriesLength; ++ob) {
    let observationVector = [1, ob + 1];
    regMatrix[ob] = observationVector;
  }
  return regMatrix;
};

const roundingUpToNDecimalPlaces = function (
  number: number,
  n: number
): number {
  let fixDecimalPlaces = number.toFixed(n);
  return Number(fixDecimalPlaces);
};

const transposeMatrix = function (matrix: Array<any[]>): Array<any[]> {
  let totalRows = matrix.length;
  let transposedVersion = [];
  for (let rowIndex = 0; rowIndex < totalRows; ++rowIndex) {
    let currentRow = matrix[rowIndex];
    let totalCols = currentRow.length;
    for (let colIndex = 0; colIndex < totalCols; ++colIndex) {
      let currentValue = matrix[rowIndex][colIndex];
      if (transposedVersion[colIndex] === undefined) {
        transposedVersion[colIndex] = [];
      }
      transposedVersion[colIndex][rowIndex] = currentValue;
    }
  }
  return transposedVersion;
};

const eliminateRowColFromAMatrix = function (
  matrix: Array<any[]>,
  row: number,
  col: number
): Array<any[]> {
  let minor = [];
  let totalRows = matrix.length;
  for (let rowIndex = 0; rowIndex < totalRows; ++rowIndex) {
    if (rowIndex === row) {
      continue;
    }
    let currentRow = matrix[rowIndex];
    let totalCols = currentRow.length;
    minor.push([]);
    for (let colIndex = 0; colIndex < totalCols; ++colIndex) {
      if (colIndex === col) {
        continue;
      }
      let element = currentRow[colIndex];
      minor[minor.length - 1].push(element);
    }
  }

  return minor;
};

const calcProductMatrixWithAScalar = function (
  matrix: Array<number[]>,
  scalar: number
): Array<number[]> {
  let totalRows = matrix.length;
  let product = [];
  for (let rowIndex = 0; rowIndex < totalRows; ++rowIndex) {
    let currentRow = matrix[rowIndex];
    product[rowIndex] = [];
    let totalCols = currentRow.length;
    for (let colIndex = 0; colIndex < totalCols; ++colIndex) {
      let element = new BigNumber(currentRow[colIndex]);
      let scB = new BigNumber(scalar);
      let p = element.multipliedBy(scB);
      product[rowIndex][colIndex] = p.toNumber();
    }
  }
  return product;
};

const calcDotProduct = function (
  vectorOne: number[],
  vectorTwo: number[]
): number {
  /*  1. also known as scalar product => returns a scalar = sum of products (i.e. where each product = one element from vectorOne * one from vectorTwo
        (i.e. not all possible combinations (only a subset), the elements need to have the same relative position).
        2. size matters => the vectors need to be non-empty arrays of equal length, else => return undefined ) 
        3. requirements for each vectors => a) each element must hold data, b) data must be a number, else => return undefined*/
  let lengthVectorOne = vectorOne.length;

  let dotProduct = new BigNumber(0);

  for (let index = 0; index < lengthVectorOne; ++index) {
    let elementFromV1 = new BigNumber(vectorOne[index]);
    let elementFromV2 = new BigNumber(vectorTwo[index]);
    dotProduct = dotProduct.plus(elementFromV1.multipliedBy(elementFromV2));
  }
  return dotProduct.toNumber();
};

const calcMatrixProductWithAVector = function (
  matrix: Array<number[]>,
  vector: number[]
): number[] {
  let totalRows = matrix.length;
  let product = [];
  for (let index = 0; index < totalRows; ++index) {
    let currentRowVector = matrix[index];
    product[index] = calcDotProduct(currentRowVector, vector);
  }
  return product;
};

const calcMatrixProduct = function (
  matrixOne: Array<number[]>,
  matrixTwo: Array<number[]>
): Array<number[]> {
  /* 1. multiplies two matrices in a particular order => returns a matrix where each element is the dot product of one vector from matrixOne and one vector from matrixTwo
     2. cols of matrixOne need to equal rows of matrixTwo, else => return undefined
     3. use calcDotProduct(rowVector from matrixOne, colVector from matrixTwo) */
  let totalRowVectorsInM1 = matrixOne.length;
  let transposedM2 = transposeMatrix(matrixTwo);
  let totalRowsInM2Transposed = transposedM2.length;
  let matrixProduct = [];
  for (
    let rowIndexInM1 = 0;
    rowIndexInM1 < totalRowVectorsInM1;
    ++rowIndexInM1
  ) {
    let currentRowVector = matrixOne[rowIndexInM1];
    matrixProduct[rowIndexInM1] = [];
    for (
      let rowIndexInM2 = 0;
      rowIndexInM2 < totalRowsInM2Transposed;
      ++rowIndexInM2
    ) {
      let currentColVector = transposedM2[rowIndexInM2];
      let currentDotProduct = calcDotProduct(
        currentRowVector,
        currentColVector
      );
      matrixProduct[rowIndexInM1][rowIndexInM2] = currentDotProduct;
    }
  }
  return matrixProduct;
};

const calcDeterminantOfMatrix = function (
  matrix: Array<number[]>,
  determinantValue: number = 0
): number {
  /* since x'x will always be 2x2, no need for anything faster than laplace(cofactor) expansion
  1. if matrix is non square (number of rows !== number of cols) => return undefined
  2. if matrix contains 1 row and 1 col, => determinant = the only element
  3. if matrix 2 row and 2 col => go through the first row and increment determinant by element * its Cofactor (Math.pow(-1, row + col) * Minor(det of smaller matrix) ) */
  let totalRows = matrix.length;
  if (totalRows === 1) {
    return matrix[0][0];
  }
  let detV = new BigNumber(determinantValue);
  for (let colIndex = 0; colIndex < totalRows; ++colIndex) {
    /// can use totalRows because it is a square matrix
    let element = new BigNumber(matrix[0][colIndex]);
    detV = detV.plus(
      element
        .multipliedBy(
          calcDeterminantOfMatrix(
            eliminateRowColFromAMatrix(matrix, 0, colIndex)
          )
        )
        .multipliedBy(Math.pow(-1, 0 + colIndex))
    );
  }

  return detV.toNumber();
}; /* general function for a non-empty 2d (square) array of numbers */

const getCofactorMatrix = function (matrix: Array<number[]>): Array<number[]> {
  let totalRows = matrix.length;
  let cofactorMatrix = [];
  for (let rowIndex = 0; rowIndex < totalRows; ++rowIndex) {
    let currentRow = matrix[rowIndex];
    let totalCols = currentRow.length;
    cofactorMatrix[rowIndex] = [];
    for (let colIndex = 0; colIndex < totalCols; ++colIndex) {
      let cofactor =
        Math.pow(-1, rowIndex + colIndex) *
        calcDeterminantOfMatrix(
          eliminateRowColFromAMatrix(matrix, rowIndex, colIndex)
        );
      cofactorMatrix[rowIndex][colIndex] = cofactor;
    }
  }
  return cofactorMatrix;
};

const genInverseOfMatrix = function (
  matrix: Array<number[]>,
  determinantValue: number
): Array<number[]> {
  if (matrix.length === 1) {
    return calcProductMatrixWithAScalar([[1]], determinantValue);
  }
  let transposedCofactorMatrix = transposeMatrix(
    getCofactorMatrix(matrix)
  ); /* this is the adjugate */
  return calcProductMatrixWithAScalar(
    transposedCofactorMatrix,
    1 / determinantValue
  );
};

const calcInterceptAndSlope = function (
  regMatrix: Array<number[]>,
  depVarVector: number[]
): number[] {
  /* this would need to calculate slope and intercept */

  let transposedRegMatrix = transposeMatrix(regMatrix);
  let varCovarRegMatrix = calcMatrixProduct(transposedRegMatrix, regMatrix);

  let covarVectorRegsAndDepVar = calcMatrixProductWithAVector(
    transposedRegMatrix,
    depVarVector
  );
  let determinantOfVarCovarMatrix = calcDeterminantOfMatrix(varCovarRegMatrix);

  let inverse = genInverseOfMatrix(
    varCovarRegMatrix,
    determinantOfVarCovarMatrix
  );
  let coefficients = calcMatrixProductWithAVector(
    inverse,
    covarVectorRegsAndDepVar
  );

  return coefficients;
};

const roundCoefficients = function (arrofCoeff: number[]): number[] {
  let totalNumberOfCoefficients = arrofCoeff.length;
  let arrofRoundCoeff = [];
  for (let index = 0; index < totalNumberOfCoefficients; ++index) {
    let coefficient = arrofCoeff[index];
    arrofRoundCoeff.push(
      roundingUpToNDecimalPlaces(coefficient, 2)
    );
  }
  return arrofRoundCoeff;
};

export {roundCoefficients};
export { roundingUpToNDecimalPlaces };
export { createMatrixOfRegressors };
export { calcInterceptAndSlope };
