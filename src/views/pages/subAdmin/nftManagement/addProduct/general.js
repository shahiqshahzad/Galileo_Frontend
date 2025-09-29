import React from "react";
import { Stack } from "@mui/system";
import { Icons } from "shared/Icons/Icons";
import { Checkbox, FormControlLabel, TextField, Tooltip, Typography } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import Select, { components } from "react-select";
// import { taxCalculationArray, taxClassArray } from "../utils/constants";

let InputProps = {
  style: { borderRadius: "4px", background: "inherit", border: "1px solid #757575" }
};

let inputStyles = {
  width: "96%",
  "& fieldset": { border: "none" },
  ".MuiInputBase-input": {
    padding: "10px",
    color: "white"
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#D3D3D3"
  }
};

// const CustomOption = (props) => {
//   return (
//     <components.Option {...props}>
//       <div>
//         <div>{props.data.label}</div>
//         {props?.data?.description && <div style={{ fontSize: "12px", color: "white" }}>{props.data.description}</div>}
//       </div>
//     </components.Option>
//   );
// };

export const General = ({
  formik,
  getCurrency,
  errorsArray,
  setErrorsArray,
  setShowPreviewDlg,
  setSelectedPreview,
  refurbishedSalesStatus
}) => {
  // const theme = useTheme();
  // const selectStyles = {
  //   control: (base, state) => ({
  //     ...base,
  //     background: "inherit",
  //     border: theme.palette.mode === "dark" ? "1px solid #757575" : "none"
  //   }),
  //   singleValue: (provided, state) => ({
  //     ...provided,
  //     color: theme.palette.mode === "dark" ? "white" : "black"
  //   }),
  //   menu: (base) => ({
  //     ...base,
  //     marginTop: 0,
  //     border: theme.palette.mode === "dark" ? "1px solid white" : "1px solid #181C1F",
  //     color: theme.palette.mode === "dark" ? "white" : "#181C1F",
  //     background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3"
  //   }),
  //   dropdownIndicator: (provided, state) => ({
  //     ...provided,
  //     color: "#2F53FF"
  //   }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor:
  //       theme.palette.mode === "dark"
  //         ? state.isSelected
  //           ? "#2F53FF"
  //           : "#181C1F"
  //         : state.isSelected
  //           ? "#2F53FF"
  //           : "white",
  //     color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black",
  //     cursor: "pointer",
  //     "&:hover": {
  //       backgroundColor: "#2196f3"
  //     }
  //   }),
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color: "grey"
  //   })
  // };

  return (
    <Stack>
      <Typography sx={{ color: "white", fontWeight: 700, fontSize: "20px" }} className="HeaderFonts">
        General
      </Typography>

      {refurbishedSalesStatus && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} marginLeft={"-10px"}>
          <FormControlLabel
            control={
              <Checkbox
                name="checked"
                color="primary"
                checked={formik.values.isSoldByGalileo}
                onChange={(e) => {
                  formik.setFieldValue("isSoldByGalileo", e.target.checked);
                }}
              />
            }
            label="This is a refurbished item"
            sx={{ "& .MuiFormControlLabel-label": { color: "white" } }}
          />
        </Stack>
      )}

      <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", marginTop: "15px" }}>
        Currency
      </Typography>
      <TextField
        fullWidth
        placeholder="USDT"
        value={getCurrency}
        sx={{ ...inputStyles }}
        InputProps={{ ...InputProps }}
        disabled
      />

      <Stack sx={{ flexDirection: "row", gap: "5px", marginBottom: "4px", marginTop: "15px" }}>
        <Typography sx={{ color: "white", fontSize: "16px" }}>Regular Price ($)</Typography>
        <Tooltip title="Click to view more details" placement="top" arrow>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowPreviewDlg(true);
              setSelectedPreview(1);
            }}
          >
            {Icons.eyeIcon}
          </span>
        </Tooltip>
      </Stack>

      <TextField
        type="number"
        name="nftPrice"
        fullWidth
        placeholder="Enter Price"
        value={formik.values.nftPrice}
        sx={{ ...inputStyles }}
        InputProps={{ ...InputProps }}
        onChange={(event) => {
          const { value } = event.target;
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            formik.setFieldValue("nftPrice", value);
            let errorsData = [...errorsArray];
            setErrorsArray(errorsData.filter((item) => item !== "General"));
          }
        }}
        // error={formik.touched.nftPrice && Boolean(formik.errors.nftPrice)}
        // helperText={formik.touched.nftPrice && formik.errors.nftPrice}
      />
      {formik?.errors["nftPrice"] ? (
        <Typography sx={{ color: "red", mt: "5px" }}>{formik?.errors["nftPrice"]}</Typography>
      ) : (
        ""
      )}

      <Stack sx={{ flexDirection: "row", gap: "5px", marginBottom: "4px", marginTop: "15px" }}>
        <Typography sx={{ color: "white", fontSize: "16px" }}>Sale Price ($) (Optional)</Typography>

        <Tooltip title="Click to view more details" placement="top" arrow>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowPreviewDlg(true);
              setSelectedPreview(2);
            }}
          >
            {Icons.eyeIcon}
          </span>
        </Tooltip>
      </Stack>
      <TextField
        type="number"
        name="salePrice"
        fullWidth
        placeholder="Enter Sale Price"
        value={formik.values.salePrice}
        sx={{ ...inputStyles }}
        InputProps={{ ...InputProps }}
        onChange={(event) => {
          const { value } = event.target;
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            formik.setFieldValue("salePrice", value);
          }
        }}
      />

      {formik?.errors["salePrice"] ? (
        <Typography sx={{ color: "red", mt: "5px" }}>{formik?.errors["salePrice"]}</Typography>
      ) : (
        ""
      )}

      {/* <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", marginTop: "15px" }}>
        Tax Status
      </Typography>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: "100%" }}>
          <Select
            components={{ IndicatorSeparator: () => null }}
            styles={selectStyles}
            variant="standard"
            placeholder="Select Tax Status"
            options={
              taxStatusArray?.length
                ? taxStatusArray.map((item) => {
                    return { label: item.label, value: item.value };
                  })
                : []
            }
            value={
              formik.values.taxStatus?.label
                ? { label: formik.values.taxStatus?.label, value: formik.values.taxStatus?.value }
                : ""
            }
            onChange={(item) => formik.setFieldValue("taxStatus", item)}
          />
        </div>
        <span>{Icons.questionMarkIcon}</span>
      </Stack> */}

      {formik?.values?.taxStatus?.value === "taxable" ? (
        <>
          <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", marginTop: "15px" }}>
            Tax Class
          </Typography>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "100%" }}>
              <TextField
                fullWidth
                placeholder="USDT"
                value={formik.values.taxClass?.value}
                sx={{ ...inputStyles }}
                InputProps={{ ...InputProps }}
                disabled
              />
              {/*    <Select
                components={{ IndicatorSeparator: () => null }}
                styles={selectStyles}
                variant="standard"
                placeholder="Select Tax Class"
                options={
                  taxClassArray?.length
                    ? taxClassArray.map((item) => {
                        return { label: item.label, value: item.value };
                      })
                    : []
                }
                value={
                  formik.values.taxClass?.label
                    ? { label: formik.values.taxClass?.label, value: formik.values.taxClass?.value }
                    : ""
                }
                onChange={(item) => formik.setFieldValue("taxClass", item)}
              /> */}
            </div>
            {/* <span>{Icons.questionMarkIcon}</span> */}
          </Stack>
        </>
      ) : (
        // <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", marginTop: "15px" }}>
        //   Tax Calculation
        // </Typography>
        // <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
        //   <div style={{ width: "96%" }}>
        //     <Select
        //       components={{ IndicatorSeparator: () => null, Option: CustomOption }}
        //       styles={selectStyles}
        //       variant="standard"
        //       placeholder="Select Tax Calculation"
        //       options={
        //         taxCalculationArray?.length
        //           ? taxCalculationArray.map((item) => {
        //               return {
        //                 label: item.label,
        //                 value: item.value,
        //                 description: item?.description ? item?.description : null
        //               };
        //             })
        //           : []
        //       }
        //       value={
        //         formik.values.taxCalculationMethod?.label
        //           ? {
        //               label: formik.values.taxCalculationMethod?.label,
        //               value: formik.values.taxCalculationMethod?.value
        //             }
        //           : ""
        //       }
        //       onChange={(item) => formik.setFieldValue("taxCalculationMethod", item)}
        //     />
        //   </div>
        //   {/* <span>{Icons.questionMarkIcon}</span> */}
        // </Stack>

        ""
      )}

      {/* {formik?.values?.taxCalculationMethod?.value === "quadreno" ? (
        <>
          <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", marginTop: "15px" }}>
            Default Tax Rate (%)
          </Typography>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
            <TextField
              type="number"
              name="taxRate"
              fullWidth
              placeholder="Enter Default Tax Rate"
              value={formik.values.taxRate}
              onKeyDown={preventSpecialKeys2}
              sx={{ ...inputStyles }}
              InputProps={{ ...InputProps }}
              onChange={(e) => {
                let newValue = e.target.value;
                if (newValue) {
                  // Check if the value is a number with up to two decimal places and is less than or equal to 100
                  if (/^(100(\.0{0,2})?|(\d{0,2}(\.\d{0,2})?))$/.test(newValue)) {
                    formik.setFieldValue("taxRate", newValue);
                  }
                } else {
                  formik.setFieldValue("taxRate", newValue);
                }
              }}
            />
            <span>{Icons.questionMarkIcon}</span>
          </Stack>
        </>
      ) : (
        ""
      )} */}
    </Stack>
  );
};
