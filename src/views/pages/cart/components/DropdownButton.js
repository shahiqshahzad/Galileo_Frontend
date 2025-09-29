import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";

const menuItems = [
  { name: "Buy", value: "buy" },
  { name: "Buy & Redeem", value: "buyRedeem" }
];

const DropdownButton = ({ handleBuy, disabled = false, defaultOption = "buyRedeem" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([menuItems[0]]);
  const [selectedItem, setSelectedItem] = useState({ label: "Buy & Redeem", value: "buyRedeem" });

  useEffect(() => {
    if (defaultOption === "buy") {
      setFilteredOptions([menuItems[1]]);
      setSelectedItem({ label: "Buy", value: "buy" });
    } else {
      setFilteredOptions([]);
      setSelectedItem({ label: "Buy & Redeem", value: "buyRedeem" });
    }
  }, [defaultOption]);

  return (
    <Stack sx={{ width: "100%" }}>
      <Select
        isDisabled={disabled}
        menuIsOpen={isDropdownOpen}
        onMenuOpen={() => {
          if (!isDropdownOpen) {
            handleBuy(selectedItem.value);
          }
        }}
        onMenuClose={() => setIsDropdownOpen(false)}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: (props) => (
            <div
              onMouseDown={() => {
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <components.DropdownIndicator {...props} />
            </div>
          )
        }}
        isSearchable={false}
        styles={{
          control: (base, state) => ({
            ...base,
            background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
            border: "none",
            borderRadius: "7px",
            padding: "0px"
          }),
          singleValue: (provided, state) => ({
            ...provided,
            color: "white",
            height: "50px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px"
          }),
          valueContainer: (provided, state) => ({
            ...provided,
            padding: 0,
            background: disabled ? "gray" : "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)",
            cursor: "pointer",
            borderTopLeftRadius: "7px",
            borderBottomLeftRadius: "7px"
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            padding: 0,
            background: disabled ? "gray" : "#2F6AFE",
            borderTopRightRadius: "7px",
            borderBottomRightRadius: "7px",
            cursor: "pointer"
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            color: "white",
            "&:hover": {
              color: "white"
            }
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "0",
            marginTop: 0,
            color: "white",
            background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
          }),
          option: (provided, state) => ({
            ...provided,
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
          })
        }}
        variant="standard"
        placeholder="Tag"
        options={
          filteredOptions?.length
            ? filteredOptions.map((item) => {
                return { label: item.name, value: item.value };
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
          selectedItem?.value
            ? {
                value: selectedItem?.value,
                label: selectedItem?.label
              }
            : ""
        }
        onChange={(item) => {
          setSelectedItem(item);

          if (item?.value === "buy") {
            setFilteredOptions([menuItems[1]]);
          } else {
            setFilteredOptions([menuItems[0]]);
          }
        }}
      />
    </Stack>
  );
};

export default DropdownButton;
