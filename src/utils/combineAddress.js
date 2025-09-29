import { Country, State } from "country-state-city";

export function getAddressValuesString(addressObj) {
  // return `${addressObj?.houseNo || ''}, ${addressObj?.area || ''},  ${addressObj?.landmark || ''},  ${addressObj?.city || ''},  ${addressObj?.state || ''},  ${addressObj?.pinCode || ''},  ${addressObj?.country || ''}`;

  let address =
    `${addressObj?.houseNo ? addressObj.houseNo + ", " : ""}` +
    `${addressObj?.area ? addressObj.area + ", " : ""}` +
    `${addressObj?.landmark ? addressObj.landmark + ", " : ""}` +
    `${addressObj?.city ? addressObj.city + ", " : ""}` +
    `${addressObj?.state ? addressObj.state + ", " : ""}` +
    `${addressObj?.pinCode ? addressObj.pinCode + ", " : ""}` +
    `${addressObj?.country ? addressObj.country : ""}`;

  const addressArray = address.split(",").map((item) => item.trim());
  const uniqueAddressArray = Array.from(new Set(addressArray));
  const uniqueAddress = uniqueAddressArray.join(", ");

  return uniqueAddress;
}

export function getShippingValuesString(addressObj, email, name, shippingCarrier) {
  let shippingString = "";

  shippingString += `${addressObj?.houseNo ? addressObj.houseNo + ", " : ""}`;
  shippingString += `${addressObj?.area ? addressObj.area + ", " : ""}`;
  shippingString += `${addressObj?.landmark ? addressObj.landmark + ", " : ""}`;
  shippingString += `${addressObj?.city ? addressObj.city + ", " : ""}`;
  shippingString += `${addressObj?.state ? addressObj.state + ", " : ""}`;
  shippingString += `${addressObj?.pinCode ? addressObj.pinCode + ", " : ""}`;
  shippingString += `${addressObj?.country ? addressObj.country + ", " : ""}`;
  shippingString += `${name ? name + ", " : ""}`;
  shippingString += `${addressObj?.mobileNumber ? addressObj.mobileNumber + ", " : ""}`;
  shippingString += `${email ? email + ", " : ""}`;
  shippingString += `${shippingCarrier ? shippingCarrier : ""}`;

  return shippingString;
}

export const getFullAddress = (address) => {
  if (!address) return "";

  const fullName = address?.fullName || "";
  const landmark = address?.landmark || "";
  const state = State?.getStateByCodeAndCountry(address?.state, address?.country)?.name || "";
  const cityStatePin = `${address?.pinCode || ""}, ${address?.city || ""}, ${state || ""}`;
  const country = Country?.getCountryByCode(address?.country)?.name || "";

  const updatedAddress = address?.area
    ?.replace(address?.city || "", "")
    ?.replace(state || "", "")
    ?.replace(country || "", "")
    ?.trim()
    ?.replace(/,{2,}/g, ",")
    ?.replace(/,$/, "")
    ?.replace(/, /g, "")
    ?.trim();

  const houseNoArea = `${address?.houseNo || ""}, ${updatedAddress || ""}`;

  return {
    fullName,
    houseNoArea,
    landmark,
    cityStatePin,
    country
  };
};

export const getUserEmail = (orderDetail) => {
  if (orderDetail.multiPieceParcels && orderDetail.multiPieceParcels[0]) {
    return orderDetail.multiPieceParcels[0]?.nft?.user?.email || "";
  } else if (orderDetail.singlePieceParcel && orderDetail.singlePieceParcel.length) {
    return orderDetail.singlePieceParcel[0]?.user?.email || "";
  }
  return "";
};
