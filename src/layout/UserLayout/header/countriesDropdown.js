import React, { useState, useEffect, useCallback } from "react";
import { getLocalStorageData } from "utils/utilFunctions";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Icons } from "shared/Icons/Icons";
import { getdropdownValue } from "redux/auth/actions";

const CustomSelectIcon = React.memo((props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="10" viewBox="0 0 9 6" fill="none" {...props}>
    <path
      d="M1 1.24023L4.53 4.76023L8.06 1.24023"
      stroke="#2F99FF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

function NFTDropdown() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState(() => {
    return getLocalStorageData("selectedOption") || "isShowAll";
  });

  useEffect(() => {
    dispatch(getdropdownValue({ isShowAll: selectedOption }));
  }, [dispatch, selectedOption]);

  const handleOptionChange = useCallback((event) => {
    console.log("value");
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    localStorage.setItem("selectedOption", selectedValue);
  }, []);

  return (
    <FormControl
      sx={{
        background: "transparent",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        fontWeight: "500",
        borderRadius: "0px"
      }}
    >
      <Select
        className="counterFilter"
        sx={{
          height: "40px",
          color: "#757575",
          fontWeight: "500",
          "& .MuiSelect-icon": {
            right: "8px",
            top: "38%"
          },
          "& .MuiSelect-select, & .MuiInputBase-input, & .MuiInput-input": {
            display: "flex",
            alignItems: "center"
          }
        }}
        variant="standard"
        displayEmpty
        value={selectedOption}
        onChange={handleOptionChange}
        disableUnderline
        inputProps={{ "aria-label": "Without label" }}
        IconComponent={CustomSelectIcon}
        MenuProps={{
          PaperProps: {
            style: {
              background: "#2D3337",
              borderRadius: "0px"
            }
          }
        }}
      >
        <MenuItem value="isShowAll">
          <span className="isShowAll">{Icons?.showAll}</span>
          <span className="HeaderFonts" style={{ color: "white" }}>
            Show all items
          </span>
        </MenuItem>
        <MenuItem value="onlySelected">
          <span className="isShowAll">{Icons?.availableCountries}</span>
          <span className="HeaderFonts" style={{ color: "white" }}>
            Available in my country
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default NFTDropdown;
