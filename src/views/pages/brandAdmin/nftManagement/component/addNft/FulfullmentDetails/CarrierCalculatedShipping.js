import React from "react";
import Select from "react-select";
import { Stack } from "@mui/system";
import { Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Icons } from "shared/Icons/Icons";
import { preventSpecialKeys2 } from "utils/utilFunctions";

export const CarrierCalculatedShipping = ({ theme, getCurrency, shipmentMethodPayload, setShipmentMethodPayload }) => {
  const textColor = theme.palette.mode === "light" ? "black" : "white";
  const { categoryAddressesList, supportedCarriers } = useSelector((state) => state.addresses);

  let InputProps = {
    style: { borderRadius: 0, background: "inherit" }
  };
  const textfieldStyle = {
    marginTop: "10px",
    paddingY: "10px",
    paddingX: "20px",
    border: "none",
    background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3",
    borderRadius: "8px",
    "& fieldset": { border: "none" },
    "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  };

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
    <>
      <Stack sx={{ mt: "1rem", width: "75%", flexDirection: "row" }}>
        <Stack mr={"10px"}>
          <Typography sx={{ color: textColor }}>Weight</Typography>
          <TextField
            placeholder="weight (g.)"
            fullWidth
            type={"number"}
            onKeyDown={preventSpecialKeys2}
            sx={textfieldStyle}
            InputProps={{ ...InputProps }}
            value={shipmentMethodPayload.weight}
            onChange={(e) => {
              let newValue = e.target.value;
              if (e.target.value) {
                newValue = Math.max(Number(e.target.value), 0);
              }
              setShipmentMethodPayload({ ...shipmentMethodPayload, weight: newValue });
            }}
          />
        </Stack>
        <Stack mr={"10px"}>
          <Typography sx={{ color: textColor }}>Length</Typography>
          <TextField
            placeholder="length (cm.)"
            fullWidth
            sx={textfieldStyle}
            type={"number"}
            onKeyDown={preventSpecialKeys2}
            InputProps={{ ...InputProps }}
            value={shipmentMethodPayload.length}
            onChange={(e) => {
              let newValue = e.target.value;
              if (e.target.value) {
                newValue = Math.max(Number(e.target.value), 0);
              }
              setShipmentMethodPayload({ ...shipmentMethodPayload, length: newValue });
            }}
          />
        </Stack>
        <Stack mr={"10px"}>
          <Typography sx={{ color: textColor }}>Breadth</Typography>
          <TextField
            placeholder="breadth (cm.)"
            fullWidth
            sx={textfieldStyle}
            type={"number"}
            onKeyDown={preventSpecialKeys2}
            InputProps={{ ...InputProps }}
            value={shipmentMethodPayload.breadth}
            onChange={(e) => {
              let newValue = e.target.value;
              if (e.target.value) {
                newValue = Math.max(Number(e.target.value), 0);
              }
              setShipmentMethodPayload({ ...shipmentMethodPayload, breadth: newValue });
            }}
          />
        </Stack>
        <Stack>
          <Typography sx={{ color: textColor }}>Height</Typography>
          <TextField
            placeholder="height (cm.)"
            fullWidth
            sx={textfieldStyle}
            type={"number"}
            onKeyDown={preventSpecialKeys2}
            InputProps={{ ...InputProps }}
            value={shipmentMethodPayload.height}
            onChange={(e) => {
              let newValue = e.target.value;
              if (e.target.value) {
                newValue = Math.max(Number(e.target.value), 0);
              }
              setShipmentMethodPayload({ ...shipmentMethodPayload, height: newValue });
            }}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          my: 3,
          padding: "14px",
          flexDirection: "row",
          alignItems: "center",
          background: "#181C1F",
          borderRadius: "8px"
        }}
      >
        {Icons.infoIcon}{" "}
        <Typography sx={{ ml: 2, color: textColor }}>
          Please provide the dimensions, taking into account the packaging box needed for shipping the item.
        </Typography>
      </Stack>

      <Typography sx={{ color: textColor }}>Shipping Cost Adjustment (%)</Typography>
      <TextField
        placeholder="0%"
        fullWidth
        sx={textfieldStyle}
        InputProps={{ ...InputProps, min: 0 }}
        value={shipmentMethodPayload.shippingCostAdjustment}
        onKeyDown={preventSpecialKeys2}
        type="number"
        onChange={(e) => {
          let newValue = e.target.value;
          if (newValue) {
            // Check if the value is a number with up to two decimal places and is less than or equal to 100
            if (/^(100(\.0{0,2})?|(\d{0,2}(\.\d{0,2})?))$/.test(newValue)) {
              setShipmentMethodPayload({ ...shipmentMethodPayload, shippingCostAdjustment: newValue });
            }
          } else {
            setShipmentMethodPayload({ ...shipmentMethodPayload, shippingCostAdjustment: newValue });
          }
        }}
      />

      <Stack
        sx={{
          my: 3,
          padding: "14px",
          flexDirection: "row",
          alignItems: "center",
          background: "#181C1F",
          borderRadius: "8px"
        }}
      >
        {Icons.infoIcon}{" "}
        <Typography sx={{ ml: 2, color: textColor }}>
          Enter a percentage value to adjust the shipping cost. Positive values will increase the shipping cost,
          negative values not accepted.
        </Typography>
      </Stack>

      <Typography sx={{ color: textColor }}>In case of failure of the estimation for shipping price?</Typography>

      <Stack direction="row" alignItems="flex-end" spacing={1} marginY={"10px"} marginLeft={"-10px"}>
        <FormControlLabel
          sx={{
            color: "white",
            "& .MuiFormControlLabel-label": {
              marginTop: "4px"
            }
          }}
          control={
            <Checkbox
              name="checked"
              color="primary"
              checked={!shipmentMethodPayload.isPurchaseAllowed}
              onChange={(e) =>
                setShipmentMethodPayload({
                  ...shipmentMethodPayload,
                  isPurchaseAllowed: false
                })
              }
            />
          }
          label="Do not allow the purchase"
        />
        <FormControlLabel
          sx={{
            color: "white",
            "& .MuiFormControlLabel-label": {
              marginTop: "4px"
            }
          }}
          control={
            <Checkbox
              name="checked"
              color="primary"
              checked={shipmentMethodPayload.isPurchaseAllowed}
              onChange={(e) =>
                setShipmentMethodPayload({
                  ...shipmentMethodPayload,
                  isPurchaseAllowed: true
                })
              }
            />
          }
          label="Allow purchase with flat rate for shipping at"
        />
        <Stack sx={{ marginLeft: "3rem !important", marginBottom: "7px !important" }}>
          <Typography sx={{ color: "#808080" }}>Enter amount in {getCurrency ? getCurrency : "USDC"}</Typography>
          <TextField
            placeholder="0"
            fullWidth
            variant="filled"
            type={"number"}
            sx={{
              border: "none",
              background: "inherit",
              "& fieldset": { border: "none" },
              "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
                "-webkit-appearance": "none",
                margin: 0
              }
            }}
            onKeyDown={preventSpecialKeys2}
            disabled={!shipmentMethodPayload.isPurchaseAllowed}
            InputProps={{ ...InputProps, min: 0, borderBottom: "1px solid red" }}
            value={shipmentMethodPayload.fallBackShippingAmount}
            onChange={(e) => {
              let newValue = e.target.value;
              if (newValue) {
                if (/^\d*\.?\d{0,2}$/.test(newValue)) {
                  if (newValue <= 10000000) {
                    setShipmentMethodPayload({ ...shipmentMethodPayload, fallBackShippingAmount: newValue });
                  }
                }
              } else {
                setShipmentMethodPayload({ ...shipmentMethodPayload, fallBackShippingAmount: newValue });
              }
            }}
          />
        </Stack>
      </Stack>

      {/* Supported Carrier */}
      {process.env.REACT_APP_ENVIRONMENT === "development" && (
        <Stack mt={"1rem"}>
          <Select
            components={{ IndicatorSeparator: () => null }}
            styles={selectStyles}
            variant="standard"
            placeholder="Supported Carriers"
            options={
              supportedCarriers?.length
                ? supportedCarriers.map((item) => {
                    return { label: item.carrier_name, value: item.object_id };
                  })
                : []
            }
            getOptionLabel={(options) => {
              return options["name"] ? options["name"] : options["label"];
            }}
            getOptionValue={(options) => {
              return options["name"] ? options["name"] : options["value"];
            }}
            value={
              shipmentMethodPayload?.supportedCarrier?.value
                ? {
                    value: shipmentMethodPayload?.supportedCarrier?.value,
                    label: shipmentMethodPayload?.supportedCarrier?.label
                  }
                : ""
            }
            onChange={(item) => {
              setShipmentMethodPayload({ ...shipmentMethodPayload, supportedCarrier: item });
            }}
          />
        </Stack>
      )}

      {/* Mode Of Shipment */}
      {process.env.REACT_APP_ENVIRONMENT === "development" && (
        <Stack mt={"1rem"}>
          <Select
            components={{ IndicatorSeparator: () => null }}
            styles={selectStyles}
            variant="standard"
            placeholder="Mode Of Shipment"
            options={[
              { label: "Fastest", value: "FASTEST" },
              { label: "Cheapest", value: "CHEAPEST" },
              { label: "Best Value", value: "BESTVALUE" }
            ]}
            getOptionLabel={(options) => {
              return options["name"] ? options["name"] : options["label"];
            }}
            getOptionValue={(options) => {
              return options["name"] ? options["name"] : options["value"];
            }}
            value={
              shipmentMethodPayload?.modeOfShipment?.value
                ? {
                    value: shipmentMethodPayload?.modeOfShipment?.value,
                    label: shipmentMethodPayload?.modeOfShipment?.label
                  }
                : ""
            }
            onChange={(item) => {
              console.log(item);
              setShipmentMethodPayload({ ...shipmentMethodPayload, modeOfShipment: item });
            }}
          />
        </Stack>
      )}

      {/* Shipping Address */}
      <Stack mt={"1rem"}>
        <Typography sx={{ color: textColor, my: "10px" }}>Warehouse address</Typography>
        <Select
          components={{ IndicatorSeparator: () => null }}
          styles={selectStyles}
          variant="standard"
          placeholder="Select An Address"
          options={
            categoryAddressesList?.length
              ? categoryAddressesList.map((item) => {
                  return { label: item.tag, value: item.id };
                })
              : []
          }
          getOptionLabel={(options) => {
            return options["name"] ? options["name"] : options["label"];
          }}
          getOptionValue={(options) => {
            return options["name"] ? options["name"] : options["value"];
          }}
          value={
            shipmentMethodPayload?.warehouseAddressId?.value
              ? {
                  value: shipmentMethodPayload?.warehouseAddressId?.value,
                  label: shipmentMethodPayload?.warehouseAddressId?.label
                }
              : ""
          }
          onChange={(item) => {
            setShipmentMethodPayload({ ...shipmentMethodPayload, warehouseAddressId: item });
          }}
        />
        {/* <Button sx={{ color: '#2F5BFF', my: '10px', alignSelf: 'flex-end' }} onClick={() => navigate('/addresses')}>
          Add new address
        </Button> */}
      </Stack>
    </>
  );
};
