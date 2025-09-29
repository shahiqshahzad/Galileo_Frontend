export const convertHtmlToText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const getValueOrDefault = (value) => value ?? "";

const getInitialValue = (field, data) => getValueOrDefault(data?.[field]);

export const generateEditInitialValues = (nftForEditData) => ({
  id: getInitialValue("id", nftForEditData),
  CategoryId: getInitialValue("CategoryId", nftForEditData),
  brandId: getInitialValue("BrandId", nftForEditData),
  nftName: getInitialValue("name", nftForEditData),
  nftDescription: getInitialValue("description", nftForEditData),
  nftPrice: getInitialValue("price", nftForEditData),
  mintType: getInitialValue("mintType", nftForEditData),
  currencyType: getInitialValue("currencyType", nftForEditData),
  fieldDataArray: getInitialValue("NFTMetaData", nftForEditData),
  fileDataArray: getInitialValue("NFTMetaFiles", nftForEditData),
  threeDModelUrl: getInitialValue("threeDModelUrl", nftForEditData),
  threeDFileName: getInitialValue("threeDFileName", nftForEditData),
  images: nftForEditData?.NFTImages || [],
  asset: getInitialValue("asset", nftForEditData),
  NFTImages: getInitialValue("NFTImages", nftForEditData),
  animation_url: getInitialValue("animation_url", nftForEditData),
  quantity: getInitialValue("quantity", nftForEditData),

  longDescription: getInitialValue("longDescription", nftForEditData),
  salePrice: nftForEditData?.salePrice !== 0 ? nftForEditData?.salePrice : "",
  taxStatus: getInitialValue("taxStatus", nftForEditData),
  taxClass: getInitialValue("taxClass", nftForEditData),
  taxCalculationMethod: getInitialValue("taxCalculationMethod", nftForEditData),
  taxRate: getInitialValue("taxRate", nftForEditData),
  multiCategoriesId: nftForEditData?.multiCategoriesId ?? [],
  productTags: nftForEditData?.productTags ?? [],

  // values for fulfillment detail
  shippingCalculationMethod: getInitialValue("shippingCalculationMethod", nftForEditData),
  flatRateShippingCost: getInitialValue("flatRateShippingCost", nftForEditData),
  noExternalCostForMultipleCopies: getInitialValue("noExternalCostForMultipleCopies", nftForEditData),
  weight: getInitialValue("weight", nftForEditData),
  height: getInitialValue("height", nftForEditData),
  length: getInitialValue("length", nftForEditData),
  breadth: getInitialValue("breadth", nftForEditData),
  warehouseAddressId: getInitialValue("warehouseAddressId", nftForEditData),
  supportedCarrier: getInitialValue("supportedCarrier", nftForEditData),
  modeOfShipment: getInitialValue("modeOfShipment", nftForEditData),

  shippingCostAdjustment: getInitialValue("shippingCostAdjustment", nftForEditData),
  isPurchaseAllowed: getInitialValue("isPurchaseAllowed", nftForEditData),
  fallBackShippingAmount: getInitialValue("fallBackShippingAmount", nftForEditData)
});

export const isEmptyObject = (obj) => Object.keys(obj).length === 0;

export const handleRequiredError = (
  fieldDataArray,
  fileDataArray,
  values,
  setIsFormSubmitBol,
  setAuthFileNameBol,
  shipmentMethod,
  shipmentMethodPayload,
  setErrorsArray,
  errors,
  uploadedImages,
  filteredData
) => {
  let errorsArrayData = [];

  if (!isEmptyObject(errors)) {
    errorsArrayData.push("General");
  }

  if (fieldDataArray.length === 0) {
    errorsArrayData.push("Properties");
    setIsFormSubmitBol(false);
  }

  fieldDataArray.forEach((array) => {
    if (!array.trait_type || array.trait_type.trim() === "") {
      errorsArrayData.push("Properties");
    } else if (!array.value || array.value.trim() === "") {
      errorsArrayData.push("Properties");
    } else if (array.display_type === "Number" && array.value < 0) {
      errorsArrayData.push("Properties");
    }
  });

  if (fileDataArray.length === 0) {
    errorsArrayData.push("Authenticity Files");
    setAuthFileNameBol(false);
  }

  fileDataArray.forEach((array) => {
    if (!array.fieldName || array.fieldName.trim() === "") {
      errorsArrayData.push("Authenticity Files");
    } else if (!array.fieldValue) {
      errorsArrayData.push("Authenticity Files");
    }
  });
  const checkPrimaryImage = filteredData.some((img) => img.isPrimary);
  if (!checkPrimaryImage) {
    errorsArrayData.push("Media");
  }

  if (!shipmentMethod?.value) {
    errorsArrayData.push("Shipping");
  }

  if (shipmentMethod?.value === "FRS" && !shipmentMethodPayload?.flatRateShippingCost) {
    errorsArrayData.push("Shipping");
  }

  if (shipmentMethod?.value === "CCS") {
    const fieldDisplayNames = {
      weight: "Weight",
      height: "Height",
      length: "Length",
      breadth: "Breadth",
      warehouseAddressId: "Shipment Address",
      modeOfShipment: "Mode of Shipment",
      shippingCostAdjustment: "Shipping Cost Adjustment",
      ...(shipmentMethodPayload.isPurchaseAllowed && {
        fallBackShippingAmount: "Fallback Shipping Amount"
      })
    };
    const requiredFields = Object.keys(fieldDisplayNames);
    const missingFields = requiredFields.filter((field) => !shipmentMethodPayload[field]);

    if (missingFields.length > 0) {
      errorsArrayData.push("Shipping");
    }
  }

  setErrorsArray(errorsArrayData);
};
