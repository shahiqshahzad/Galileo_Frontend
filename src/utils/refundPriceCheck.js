const countDigitsAfterDecimal = (number) => {
  const numberString = number.toString();

  const decimalIndex = numberString.indexOf(".");
  if (decimalIndex === -1) {
    return 0;
  } else {
    const digitsAfterDecimal = numberString.slice(decimalIndex + 1).length;
    return digitsAfterDecimal;
  }
};

export default countDigitsAfterDecimal;
