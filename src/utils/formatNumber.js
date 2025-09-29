import numeral from "numeral";

export function fData(number) {
  return numeral(number).format("0.0 b");
}
