export const calculateTotalShippingCost = (cartItems) => {
  let totalShippingCost = 0;

  cartItems.forEach((item) => {
    if (item?.shippingCalculationMethod === "FRS") {
      if (item.bulkId === null) {
        totalShippingCost += +item.shippingCost;
      }
    }
  });

  const groupedFrsData = cartItems.reduce((acc, obj) => {
    const bulkId = obj?.bulkId;
    const isFRS = obj?.shippingCalculationMethod === "FRS";

    if (bulkId !== null && isFRS) {
      // If the group doesn't exist, create an empty array for it
      if (!acc[bulkId]) {
        acc[bulkId] = [];
      }
      // Add the object to the group
      acc[bulkId].push(obj);
    }
    return acc;
  }, {});

  // Convert the groupedFrsData object into an array of arrays
  const resultArrays = Object.values(groupedFrsData);

  resultArrays.forEach((subArray) => {
    if (subArray[0]?.noExternalCostForMultipleCopies) {
      totalShippingCost += +subArray[0]?.shippingCost / subArray.length;
    } else {
      totalShippingCost += +subArray[0]?.shippingCost;
    }
  });

  const groupedCcsData = cartItems.reduce((acc, obj) => {
    const isCCS = obj?.shippingCalculationMethod === "CCS";

    if (isCCS) {
      // If the group doesn't exist, create an empty array for it
      if (!acc["rateObjectId"]) {
        acc["rateObjectId"] = [];
      }
      // Add the object to the group
      acc["rateObjectId"].push(obj);
    }
    return acc;
  }, {});

  const resultCcsArrays = Object.values(groupedCcsData);

  resultCcsArrays.forEach((subArray) => {
    totalShippingCost += +subArray[0]?.shippingCost;
  });
  return totalShippingCost ? parseFloat(totalShippingCost.toFixed(2)) : 0;
};
