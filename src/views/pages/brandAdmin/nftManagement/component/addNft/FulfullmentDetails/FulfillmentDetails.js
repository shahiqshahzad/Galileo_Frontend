import React from "react";
import Select from "react-select";
import { Stack } from "@mui/system";
import { FlatRateShipping } from "./FlatRateShipping";
import { CarrierCalculatedShipping } from "./CarrierCalculatedShipping";

export const FulfillmentDetails = ({
  theme,
  formik,
  getCurrency,
  shipmentMethod,
  setShipmentMethod,
  shipmentMethodPayload,
  setShipmentMethodPayload
}) => {
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3",
      border: "none",
      borderRadius: "7px",
      padding: "8px"
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: theme.palette.mode === "dark" ? "white" : "black"
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      color: theme.palette.mode === "dark" ? "white" : "#181C1F",
      background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3"
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#2F53FF"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor:
        theme.palette.mode === "dark"
          ? state.isSelected
            ? "#2F53FF"
            : "#181C1F"
          : state.isSelected
            ? "#2F53FF"
            : "white",
      color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black",
      cursor: "pointer"
    })
  };

  return (
    <Stack sx={{ minHeight: "25rem", marginTop: "1rem" }}>
      <Select
        components={{ IndicatorSeparator: () => null }}
        styles={selectStyles}
        variant="standard"
        placeholder="Shipping calculation method"
        options={[
          { label: "Flat Rate Shipping", value: "FRS" },
          { label: "Free Shipping", value: "FS" },
          { label: "Carrier Calculated Shipping (Beta)", value: "CCS" }
        ]}
        getOptionLabel={(options) => {
          return options["name"] ? options["name"] : options["label"];
        }}
        getOptionValue={(options) => {
          return options["name"] ? options["name"] : options["value"];
        }}
        value={
          shipmentMethod?.value
            ? {
                value: shipmentMethod?.value,
                label: shipmentMethod?.label
              }
            : ""
        }
        onChange={(item) => {
          setShipmentMethod(item);
        }}
      />
      {shipmentMethod?.value === "FRS" && (
        <FlatRateShipping
          theme={theme}
          formik={formik}
          getCurrency={getCurrency}
          shipmentMethodPayload={shipmentMethodPayload}
          setShipmentMethodPayload={setShipmentMethodPayload}
        />
      )}
      {shipmentMethod?.value === "CCS" && (
        <CarrierCalculatedShipping
          theme={theme}
          getCurrency={getCurrency}
          shipmentMethodPayload={shipmentMethodPayload}
          setShipmentMethodPayload={setShipmentMethodPayload}
        />
      )}
    </Stack>
  );
};
