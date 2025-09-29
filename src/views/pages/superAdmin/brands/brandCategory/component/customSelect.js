import React from "react";
import Select from "react-select";
import { FormControl } from "@mui/material";
import { useTheme } from "@mui/styles";

export const CustomSelect = ({
  name,
  formik,
  options,
  handleChange,
  value,
  placeholder,
  menuPlacement = "top",
  formikError
}) => {
  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "black" : "1px solid rgba(255, 255, 255, 0.7)";
  const border = theme.palette.mode === "light" ? "1px solid gray" : "1px solid rgba(255, 255, 255, 0.7)";

  return (
    <FormControl fullWidth>
      <Select
        name={name}
        components={{ IndicatorSeparator: () => null }}
        styles={{
          control: (base) => ({
            ...base,
            background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
            border: "none",
            borderBottom: formikError ? "1px solid red" : border,
            borderRadius: "0px",
            ":hover": {
              border: "none",
              borderBottom: formikError ? "1px solid red" : border,
              borderRadius: "0px"
            }
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: 0
          }),
          singleValue: (provided) => ({
            ...provided,
            color: color,
            border: "none"
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 0,
            marginTop: 0,
            color: theme.palette.mode === "dark" ? "#181C1F" : "black",
            border: 0,
            boxShadow: "none"
          }),
          placeholder: (provided) => ({
            ...provided,
            color: formikError ? "red" : theme.palette.mode === "dark" ? "#bdc8f0" : "gray"
          }),
          input: (provided) => ({
            ...provided,
            color: color,
            border: 0
          }),
          option: (provided, state) => ({
            ...provided,
            border: "none",
            backgroundColor:
              theme.palette.mode === "dark"
                ? state.isSelected
                  ? "#2F53FF"
                  : "#181C1F"
                : state.isSelected
                  ? "#2F53FF"
                  : "#fff",
            color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black"
          }),
          menuList: (base, state) => ({
            ...base,
            border: 0,
            backgroundColor:
              theme.palette.mode === "dark"
                ? state.isSelected
                  ? "#2F53FF"
                  : "#181C1F"
                : state.isSelected
                  ? "#2F53FF"
                  : "#fff"
          })
        }}
        variant="standard"
        placeholder={placeholder}
        menuPlacement={menuPlacement}
        options={options}
        getOptionLabel={(options) => {
          return options["name"] ? options["name"] : options["label"];
        }}
        getOptionValue={(options) => {
          return options["name"] ? options["name"] : options["value"];
        }}
        value={value}
        onBlur={formik.handleBlur}
        onChange={(item) => handleChange(item)}
      />
    </FormControl>
  );
};
