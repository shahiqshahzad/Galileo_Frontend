import React from "react";
import { Stack } from "@mui/system";
import nfoIcon from "assets/images/icons/info-icon.svg";
import { Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { preventSpecialKeys2 } from "utils/utilFunctions";

export const FlatRateShipping = ({ theme, formik, getCurrency, shipmentMethodPayload, setShipmentMethodPayload }) => {
  const textColor = theme.palette.mode === "light" ? "black" : "white";

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

  return (
    <Stack sx={{ paddingY: "1.2rem" }}>
      <Typography sx={{ color: textColor }}>Shipping cost in for 1 item</Typography>
      <TextField
        fullWidth
        type="number"
        sx={textfieldStyle}
        InputProps={InputProps}
        onKeyDown={preventSpecialKeys2}
        placeholder={`in ${getCurrency ? getCurrency : "<Selected currency>"}`}
        value={shipmentMethodPayload.flatRateShippingCost}
        onChange={(e) => {
          let newValue = e.target.value;
          if (newValue) {
            if (/^\d*\.?\d{0,2}$/.test(newValue)) {
              if (newValue <= 10000000) {
                setShipmentMethodPayload({ ...shipmentMethodPayload, flatRateShippingCost: newValue });
              }
            }
          } else {
            setShipmentMethodPayload({ ...shipmentMethodPayload, flatRateShippingCost: newValue });
          }
        }}
      />

      {formik?.values?.quantity > 1 && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            marginY={"1rem"}
            marginLeft={"-10px"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="checked"
                  color="primary"
                  checked={shipmentMethodPayload.noExternalCostForMultipleCopies}
                  onChange={(e) =>
                    setShipmentMethodPayload({
                      ...shipmentMethodPayload,
                      noExternalCostForMultipleCopies: e.target.checked
                    })
                  }
                />
              }
              label="No external cost for multiple copies"
            />
          </Stack>
          <Stack
            sx={{
              backgroundColor: theme.palette.mode === "light" ? "#f3f3f3" : "#181C1F",
              padding: "1rem",
              borderRadius: "7px",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center"
            }}
          >
            <img src={nfoIcon} alt="" style={{ height: "25px", width: "25px" }} />
            <Typography sx={{ color: textColor }}>
              By external cost, we mean that if user buys 2 quantities of same item, the shipping cost will be twice the
              cost of single item
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};
