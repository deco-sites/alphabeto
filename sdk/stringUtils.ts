import { isEven, isOdd } from "site/sdk/numberUtils.ts";

export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const isNumberOnly = (str: string) => {
  return str.match(/^[0-9]+$/) !== null;
};
export const strToNumber = (str: string) => {
  return isNumberOnly(str) ? parseInt(str) : NaN;
};
export const isOddStringNumber = (str: string) => {
  const number = strToNumber(str);
  if (isNaN(number)) {
    return false;
  }
  return isOdd(number);
};

export const isEvenStringNumber = (str: string) => {
  const number = strToNumber(str);
  if (isNaN(number)) {
    return false;
  }
  return isEven(number);
};
