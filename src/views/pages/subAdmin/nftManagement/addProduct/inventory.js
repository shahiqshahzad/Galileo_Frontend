import React from "react";
import { Stack } from "@mui/system";
import { Icons } from "shared/Icons/Icons";
import { TextField, Tooltip, Typography } from "@mui/material";
import { preventSpecialKeys2 } from "utils/utilFunctions";

let InputProps = {
  style: { borderRadius: "6px", background: "#252B2F" }
};

let inputStyles = {
  "& fieldset": { border: "none" },
  ".MuiInputBase-input": {
    padding: "10px",
    color: "white"
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#D3D3D3"
  }
};

export const Inventory = ({ formik, errorsArray, setErrorsArray, setShowPreviewDlg, setSelectedPreview }) => {
  return (
    <Stack>
      <Typography sx={{ color: "white", fontWeight: 600, fontSize: "22px" }} className="HeaderFonts">
        Inventory
      </Typography>

      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem", mt: "2rem" }}>
        <Typography sx={{ color: "#757575", fontSize: "16px" }}>Units</Typography>
        <TextField
          fullWidth
          name="quantity"
          value={formik.values.quantity}
          placeholder="Available In Stocks"
          onKeyDown={preventSpecialKeys2}
          onChange={(event) => {
            const { value } = event.target;
            formik.setFieldValue("quantity", value);
            let errorsData = [...errorsArray];
            setErrorsArray(errorsData.filter((item) => item !== "Authenticity Files"));
          }}
          sx={{ ...inputStyles }}
          InputProps={{ ...InputProps }}
        />

        <Tooltip title="Click to view more details" placement="top" arrow>
          <span
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              setShowPreviewDlg(true);
              setSelectedPreview(3);
            }}
          >
            {Icons.eyeIcon}
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
