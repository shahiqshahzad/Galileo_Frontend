export const calculateShippingCost = (item, itemsArray) => {
  let price = 0;

  if (item?.Nft?.shippingCalculationMethod === "CCS") {
    const rateObjectId = item?.Nft?.rateObjectId;
    const matchingNfts = itemsArray.filter((obj) => obj?.Nft?.rateObjectId === rateObjectId);
    price = item?.Nft?.shippingCost / matchingNfts.length;
  }

  if (item?.Nft?.shippingCalculationMethod === "FRS") {
    if (item?.Nft?.noExternalCostForMultipleCopies) {
      const bulkId = item?.Nft?.bulkId;
      let matchingObjects = itemsArray.filter((obj) => obj.Nft?.bulkId === bulkId);
      price = item?.Nft?.flatRateShippingCost / matchingObjects?.length;
    } else {
      price = item?.Nft?.flatRateShippingCost;
    }
  }

  return price.toFixed(2);
};
