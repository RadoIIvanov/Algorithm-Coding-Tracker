import { strict } from "assert";

/* Do validation upfront to avoid "malicious inputs" (i.e. a lot of consecutive space characters in the middle)
that ultimately would have to be cleaned up */

export function validateClassifiedDifficulty (str : string | undefined) {
  let stringLowerCase = str.toLowerCase();
  let regex = /easy|medium|hard|unknown/
  if (regex.test(stringLowerCase)) {
    return undefined;
  } else {
    return "Only easy/medium/hard/unknown are allowed";
  }
}

export function validateNameInputInShowBox(str: string | undefined) {
  let regexForAtLeastOneNonSpaceCharacter = /\S/;
  if (!str || !regexForAtLeastOneNonSpaceCharacter.test(str)) {
    return "Please don't leave the box empty";
  }

  let regexForMultipleSpaceCharactersBetweenNonSpaceCharacters = /\S\s\s+\S/;
  if (regexForMultipleSpaceCharactersBetweenNonSpaceCharacters.test(str)) {
    return "Please trim the spaces between words";
  }

  return undefined;
}

export function validatePercentAcceptedSubmissionsInputInShowBox(
  percent: string | undefined
) {
  if (percent.toLowerCase() === "unknown") {
    return undefined;
  }

  let regexToCheckForAnyWordCharacters = /[^0-9.\s]/;
  if (!percent || regexToCheckForAnyWordCharacters.test(percent)) {
    return "Please don't include any word characters, unless the percent is unknown";
  }
  let regexForMoreThanOneDecimalPoint = /[.]/g;
  let matchingResults = percent.match(regexForMoreThanOneDecimalPoint);
  if (matchingResults && matchingResults.length > 1) {
    return "More than 1 decimal point is not allowed";
  }
  let regexForSpaceCharactersBetweenNumberCharacters = /[0-9.]\s+[0-9]/;
  if (regexForSpaceCharactersBetweenNumberCharacters.test(percent)) {
    return "Please trim the spaces between digits";
  }
  let trimmedPercent = percent.trim();
  if (trimmedPercent.charAt(0) === "0" && trimmedPercent.charAt(1) !== ".") {
    return "Numbers can only start with zero, if the following character is a decimal point.";
  }

  if (Number(percent) < 0 || Number(percent) > 100) {
    return "Numbers must be positive and less than 100";
  }

  return undefined;
}
