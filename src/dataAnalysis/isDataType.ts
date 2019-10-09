/* general function for type checking */

const isDataType = function(argument: any, datatype: string) : boolean {
  let argumentType = typeof argument;
  if (
    argumentType !== "object" &&
    argumentType === `${datatype.toLowerCase()}` &&
    argument === argument
  ) {
    /// covers for typeof NaN === 'number', covers for the general object class
    return true;
  } else if (argumentType === "object") {
    let objectOfClass = Object.prototype.toString.call(argument);
    let datatypeFirstLetterCapitalized = Array.from(datatype, (char, index) => {
      if (index === 0) {
        return char.toUpperCase();
      } else {
        return char.toLowerCase();
      }
    }).join("");
    if (objectOfClass === `[object ${datatypeFirstLetterCapitalized}]`) {
      /// need to cover for RegExp (i.e. not only the first letter capitalized, use Regex)
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export {isDataType};
