/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { lookup } from "country-data";
import { State } from "country-state-city";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import { Grid, InputLabel, TextField, MenuItem } from "@mui/material";

export const AutoCompleteAddress = ({
  open,
  color,
  formik,
  inputStyles,
  inputValue,
  setSelectedCountry,
  setSelectedState,
  countryChanged
}) => {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  let selectedCountry = formik?.values?.country ? formik.values.country.toLowerCase() : null;
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      ...(selectedCountry !== null && {
        // Add country only if selectedCountry is not null
        componentRestrictions: {
          country: selectedCountry
        }
      }),
      types: ["address"],
      fields: ["formatted_address", "address_components"]
    },
    debounce: 0,
    cacheKey: `${selectedCountry}-places`
  });

  const getFormattedAddress = (addressData, area) => {
    let city = "";
    let state = "";
    let country = "";
    let pinCode = "";

    addressData.address_components.forEach((component) => {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component;
      } else if (component.types.includes("administrative_area_level_2")) {
      } else if (component.types.includes("administrative_area_level_3")) {
      } else if (component.types.includes("postal_code")) {
        pinCode = component.long_name;
      } else if (component.types.includes("country")) {
        country = component.long_name;
      }
    });

    let valuesToSet = { ...formik.values, pinCode, city, area };

    const countryData = lookup.countries({ name: country })[0];
    if (countryData) {
      valuesToSet = {
        ...valuesToSet,
        country: countryData.alpha2
      };
      if (!formik?.values?.mobileNumber?.length) {
        valuesToSet = {
          ...valuesToSet,
          mobileNumber: countryData.countryCallingCodes[0]
        };
      }

      setSelectedCountry({
        name: country,
        isoCode: countryData.alpha2
      });

      const stateData = State?.getStateByCodeAndCountry(state.short_name, countryData?.alpha2);

      if (stateData) {
        setSelectedState(stateData);
        valuesToSet.state = stateData.isoCode;
      }
    }

    formik.setValues(valuesToSet);
  };

  const handleSelect = async (location) => {
    setValue(location.description);
    setIsDropdownOpen(false);

    if (location) {
      let request = {
        placeId: location.place_id,
        fields: ["formatted_address", "address_components"]
      };
      const details = await getDetails(request);
      getFormattedAddress(details, location.description);
    }

    // clearSuggestions();

    // // empty states if the the user clear the input field
    // if (newInputValue === "") {
    //   formik.setFieldValue("pinCode", "");
    //   formik.setFieldValue("city", "");
    //   formik.setFieldValue("country", "");
    //   formik.setFieldValue("state", "");
    //   formik.setFieldValue("mobileNumber", "");
    //   setSelectedState(null);
    //   setSelectedCountry(null);
    // }
  };

  const handleCountryChange = () => {
    formik.setFieldValue("area", "");
    formik.setFieldValue("pinCode", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("state", "");
    setSelectedState(null);
    setValue("");
    clearSuggestions();
  };

  useEffect(() => {
    // Disply selected location while editing
    if (open && inputValue) {
      setValue(inputValue);
    } else {
      setValue("");
    }
  }, [open, inputValue]);

  useEffect(() => {
    // if user change country then remove values of fields related to country
    handleCountryChange();
  }, [countryChanged]);

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Grid item xs={12}>
      <InputLabel sx={{ color }}>Address 1</InputLabel>
      <div className="dropdown-suggestion" ref={dropdownRef}>
        <TextField
          onFocus={openDropdown}
          sx={{ ...inputStyles }}
          inputProps={{
            style: {
              border: "1px solid #757575",
              borderRadius: 0,
              background: "#181c1f"
            }
          }}
          placeholder="Start typing to view suggestions"
          fullWidth
          value={value}
          disabled={!ready}
          onChange={(e) => {
            setValue(e.target.value);
            formik.setFieldValue("area", e.target.value);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.area && Boolean(formik.errors.area)}
          helperText={formik.touched.area && formik.errors.area}
        />
        {isDropdownOpen && data?.length > 0 && (
          <ul className="suggestion-list">
            {data.map((suggestion, index) => (
              <MenuItem key={index} onClick={() => handleSelect(suggestion)}>
                {suggestion.description}
              </MenuItem>
            ))}
          </ul>
        )}
      </div>
    </Grid>
  );
};
