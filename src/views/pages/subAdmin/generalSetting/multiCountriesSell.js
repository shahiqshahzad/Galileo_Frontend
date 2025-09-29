import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { InputLabel, Button, Select, MenuItem, FormControl, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { optionalCountries } from "redux/subAdmin/actions";
import { EU_countries, countries } from "utils/utilFunctions";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

export default function MultiCountriesSell({ color, getCountries }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const getDefaultCountries = () =>
    getCountries?.operationalCountries?.map((option) => ({
      value: option?.shortName,
      label: `${option?.fullName} (${option?.shortName})`
    })) || [];
  const [selectedCountries, setSelectedCountries] = useState(getDefaultCountries() ? getDefaultCountries() : []);
  const [selectedEUCountries, setSelectedEUCountries] = useState(EU_countries);
  const [loader, setLoader] = useState(true);

  const [selectedValues, setSelectedValues] = useState(
    getCountries?.operationalCountries?.length < 28 || getCountries?.operationalCountries?.length > 28
      ? "Select specific countries"
      : getCountries?.operationalCountries?.length === 28
        ? "Sell in entire European Union and United Kingdom"
        : getCountries?.operationalCountries?.length === 0 && ""
  );

  let selectedShortNames;

  const handleAllCountries = (event, value) => {
    selectedShortNames = value.map((country) => country.value);
    const defaultShortNames = getCountries?.operationalCountries?.map((option) => option.shortName) || [];
    const duplicates = selectedShortNames.filter((name) => defaultShortNames.includes(name));

    if (duplicates?.length > getCountries?.operationalCountries?.length) {
      toast.error("Duplicate values are not allowed!");
      return;
    }
    setSelectedCountries(value);
  };

  const handleCountrySelect = (event, value) => {
    setSelectedValues(event.target.value ? event.target.value : "");

    if (event.target.value === "Sell in entire European Union and United Kingdom") {
      setSelectedEUCountries(EU_countries);
    } else {
      setSelectedCountries(getDefaultCountries());
    }
  };

  const SellingOption = () => {
    setLoader(false);
    let selectedEUC = selectedEUCountries.map((country) => country.code);
    let shortName = selectedCountries.map((country) => country.value);
    dispatch(
      optionalCountries({
        operationalCountries:
          selectedValues === "Sell in entire European Union and United Kingdom"
            ? selectedEUC
            : shortName !== undefined && shortName,
        setLoader: setLoader

        // handleCancel: handleCancel
      })
    );
  };
  const handleCancel = () => {
    // Clear selected countries
    selectedShortNames = [];
    setSelectedCountries(getDefaultCountries());
    setSelectedValues(
      getCountries?.operationalCountries?.length < 28 || getCountries?.operationalCountries?.length > 28
        ? "Select specific countries"
        : getCountries?.operationalCountries?.length === 28
          ? "Sell in entire European Union and United Kingdom"
          : getCountries?.operationalCountries?.length === 0 && ""
    );
  };

  const defaultOptions = [
    { title: "Sell in entire European Union and United Kingdom" },
    { title: "Select specific countries" }
  ];

  return (
    <>
      <Stack spacing={3} sx={{ width: 500 }}>
        <InputLabel className="app-text" sx={{ color: color, marginBottom: "-12px !important" }}>
          Selling Location
        </InputLabel>
        <FormControl
          sx={{
            background: "transparent",
            color: "#bdc8f0",
            fontWeight: "400",
            // border: '4px solid red',
            borderRadius: "0px"
          }}
        >
          <Select
            className="selectCountries"
            sx={{
              color: "#bdc8f0",
              fontWeight: "400",
              fontFamily: theme?.typography.appText,

              "& .MuiSelect-icon": {
                right: "10px",
                top: "20%"
              }
            }}
            variant="standard"
            onChange={handleCountrySelect}
            value={selectedValues}
            disableUnderline={true}
            inputProps={{ "aria-label": "Without label" }}
            MenuProps={{
              PaperProps: {
                style: {
                  background: "#181C1F !important",
                  borderRadius: "0px",
                  fontFamily: theme?.typography.appText
                }
              }
            }}
          >
            {defaultOptions.map((name, i) => (
              <MenuItem
                sx={{
                  color: "#bdc8f0",
                  background: "#262626",
                  fontSize: "14px !important",
                  fontWeight: "400 !important",
                  fontFamily: theme?.typography.appText
                }}
                key={i}
                value={name?.title}
              >
                {name.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/*  <Autocomplete
          single
          id="tags-readOnly"
          options={defaultOptions.map((option) => ({
            value: option.title,
            label: option.title
          }))}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select"
              sx={{
                "& .MuiInputBase-root.MuiOutlinedInput-root": {
                  fontFamily: theme?.typography.appText,
                  background: "inherit  !important",
                  borderRadius: "0px  !important",
                  border: "1px solid rgb(117, 117, 117)  !important",
                  outline: "none !important",
                  " & .MuiOutlinedInput-notchedOutline": {
                    border: "none !important"
                  },
                  "&:hover": {
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    }
                  },
                  "&:focus": {
                    ".MuiOutlinedInput-notchedOutline": {
                      border: "none"
                    }
                  }
                }
              }}
            />
          )}
          // defaultValue="Select specific countries"
          onChange={handleCountrySelect}
          value={selectedValues}
        /> */}
      </Stack>
      {selectedValues === "Select specific countries" && (
        <Stack spacing={3} sx={{ width: 500, mt: 2 }}>
          <InputLabel sx={{ color: color, marginBottom: "-12px !important", fontFamily: theme?.typography.appText }}>
            Select Countries
          </InputLabel>

          <Autocomplete
            multiple
            id="tags-readOnly"
            options={countries.map((option) => ({
              value: option.shortName,
              label: `${option.fullName} (${option.shortName})`
            }))}
            defaultValue={selectedCountries}
            value={selectedCountries}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select"
                sx={{
                  "& .MuiInputBase-root.MuiOutlinedInput-root": {
                    fontFamily: theme?.typography.appText,
                    background: "inherit  !important",
                    borderRadius: "0px  !important",
                    border: "1px solid rgb(117, 117, 117)  !important",
                    outline: "none !important",
                    " & .MuiOutlinedInput-notchedOutline": {
                      border: "none !important"
                    },
                    "&:hover": {
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none"
                      }
                    },
                    "&:focus": {
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none"
                      }
                    }
                  }
                }}
              />
            )}
            onChange={handleAllCountries}
          />
        </Stack>
      )}
      {loader === false ? (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={4}
          sx={{ mt: 2, position: "absolute", top: "7rem", right: "4rem" }}
        >
          <Button variant="text" sx={{ width: "150px" }} className="app-text">
            <CircularProgress />
          </Button>
        </Stack>
      ) : (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ mt: 2, position: "absolute", top: "7rem", right: "4rem" }}
        >
          <Button
            type="submit"
            variant="outlined"
            sx={{
              width: "150px",
              color: "#4044ED",
              border: "1.46px solid #4044ED"
            }}
            onClick={() => handleCancel()}
            className="app-text"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => SellingOption()}
            className="app-text"
            sx={{
              width: "150px",
              background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
            }}
          >
            Save
          </Button>
        </Stack>
      )}
    </>
  );
}
