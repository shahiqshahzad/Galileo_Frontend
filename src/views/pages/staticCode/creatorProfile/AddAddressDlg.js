import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import Select from "react-select";
import { useFormik } from "formik";
import { Country, State } from "country-state-city";
import { useTheme } from "@mui/material/styles";
import { euMemberCountries } from "utils/utilFunctions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from "@mui/material";
import { Stack } from "@mui/system";
import { useDispatch } from "react-redux";
import WarningIcon from "@mui/icons-material/Warning";
import { addAddress, updateAddress } from "redux/addresses/actions";
import parsePhoneNumberFromString from "libphonenumber-js";
import CloseIcon from "@mui/icons-material/Close";
import { AutoCompleteAddress } from "./AutoCompleteAddress";

const initialValues = {
  tag: "",
  fullName: "",
  mobileNumber: "",
  pinCode: "",
  houseNo: "",
  area: "",
  landmark: "",
  country: "",
  city: "",
  state: "",
  isDefault: false
};

export const AddAddressDlg = ({ open, type, handleClose, selectedAddress }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const color = theme.palette.mode === "light" ? "black" : "white";
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: color
    }
  };

  const [loader, setLoader] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedState, setSelectedState] = useState();
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [initValues, setInitValues] = useState(initialValues);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryChanged, setCountryChanged] = useState(false);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    if (process.env.REACT_APP_ENVIRONMENT === "development") {
      setCountriesToShow(allCountries);
    } else {
      if (allCountries?.length) {
        // Filter out only the countries that are part of the European Union
        const europeanUnionCountries = allCountries.filter((country) => {
          // Check if the country's isoCode code is in the list of EU member countries
          return euMemberCountries.includes(country.isoCode);
        });

        // Set the state with the European Union countries
        setCountriesToShow(europeanUnionCountries);
      }
    }
  }, []);

  const validationSchema = Yup.object({
    tag: Yup.string().max(50, "Max 50 characters").required("Required"),
    country: Yup.string().required("Required"),
    fullName: Yup.string().max(100, "Max 100 characters").required("Required"),
    pinCode: Yup.string().required("Required"),
    houseNo: Yup.string().required("Required"),
    area: Yup.string().required("Required"),
    landmark: Yup.string(),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    isDefault: Yup.boolean().oneOf([true, false]),
    mobileNumber: Yup.string()
      .test({
        name: "isValidPhoneNumber",
        message: "Enter a valid phone number",
        test: (value) => {
          try {
            const phoneNumber = parsePhoneNumberFromString(value, selectedCountry.isoCode);
            return phoneNumber ? phoneNumber.isValid() : false;
          } catch (error) {
            return false;
          }
        }
      })
      .required("Required")
  });

  useEffect(() => {
    if (open) {
      if (type === "Edit") {
        setInputValue(selectedAddress.area);
        setSelectedState(State.getStateByCodeAndCountry(selectedAddress.state, selectedAddress.country));
        setSelectedCountry(Country.getCountryByCode(selectedAddress.country));
        setInitValues({
          tag: selectedAddress.tag,
          fullName: selectedAddress.fullName,
          mobileNumber: selectedAddress.mobileNumber,
          pinCode: selectedAddress.pinCode,
          houseNo: selectedAddress.houseNo,
          area: selectedAddress.area,
          landmark: selectedAddress.landmark || "",
          country: selectedAddress.country,
          city: selectedAddress.city,
          state: selectedAddress.state,
          isDefault: selectedAddress.isDefault
        });
      } else {
        setSelectedState(null);
        setSelectedCountry(null);
        setInputValue();
        formik.resetForm();
        setInitValues(initialValues);
      }
    }
    setInvalidAddress(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = { ...values };
      if (payload.landmark === "") {
        delete payload.landmark;
      }
      if (type === "Edit") {
        dispatch(
          updateAddress({
            id: selectedAddress.id,
            data: payload,
            setLoader,
            setInvalidAddress,
            handleClose,
            resetForm: formik.resetForm
          })
        );
      } else {
        dispatch(addAddress({ data: payload, setLoader, setInvalidAddress, handleClose, resetForm: formik.resetForm }));
      }
    }
  });

  return (
    <Dialog
      open={open}
      keepMounted
      PaperProps={{ sx: { borderRadius: "5px" } }}
      sx={{
        "*::-webkit-scrollbar": {
          width: "0.3em",
          height: "0.3em"
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "grey",
          borderRadius: "10px"
        }
      }}
    >
      <DialogActions sx={{ position: "relative" }}>
        <Button size="large" sx={{ position: "absolute", top: "1px" }} onClick={handleClose}>
          <CloseIcon />
        </Button>
      </DialogActions>
      <DialogTitle id="alert-dialog-slide-title1">{type === "Edit" ? "Edit address" : "Add a new address"}</DialogTitle>
      <Container maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Tag</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={{ ...InputProps }}
                fullWidth
                name="tag"
                placeholder="Home"
                value={formik.values.tag}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.tag && Boolean(formik.errors.tag)}
                helperText={formik.touched.tag && formik.errors.tag}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Country/Region</InputLabel>
              <FormControl fullWidth>
                <Select
                  name="country"
                  components={{ IndicatorSeparator: () => null }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
                      borderColor: "#757575",
                      borderRadius: "0px"
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: color
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: 0,
                      marginTop: 0,
                      color: theme.palette.mode === "dark" ? "#181C1F" : "black"
                    }),
                    dropdownIndicator: (provided, state) => ({
                      ...provided,
                      color: "#2F53FF"
                    }),
                    placeholder: (provided, state) => ({
                      ...provided,
                      color: "#454D63"
                    }),
                    input: (provided, state) => ({
                      ...provided,
                      color: color
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      border: "0.5px solid grey",
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
                  placeholder="Select The Country"
                  options={countriesToShow}
                  getOptionLabel={(options) => {
                    return options["name"] ? options["name"] : options["label"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"] ? options["name"] : options["value"];
                  }}
                  onBlur={formik.handleBlur}
                  onChange={(item) => {
                    if (selectedCountry?.isoCode !== item?.isoCode) {
                      // If different country is selected then remove selected values
                      setSelectedState();
                      formik.setFieldValue("state", "");
                      setCountryChanged(!countryChanged);
                    }
                    setSelectedCountry(item);
                    formik.setFieldValue("country", item.isoCode);
                    formik.setFieldValue("mobileNumber", "+" + item.phonecode);
                  }}
                  value={selectedCountry?.name ? { label: selectedCountry?.name, value: selectedCountry?.name } : null}
                />
                {formik.touched.country && formik.errors.country ? (
                  <Typography sx={{ color: "red", fontSize: "12px", paddingLeft: "13px" }}>
                    {formik.errors.country}
                  </Typography>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Full Name (First and Last name)</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={{ ...InputProps }}
                fullWidth
                name="fullName"
                placeholder="Full Name"
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Mobile Number</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={InputProps}
                name="mobileNumber"
                placeholder="Mobile Number"
                fullWidth
                value={formik.values.mobileNumber}
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue("mobileNumber", e.target.value.replace(/[^\d+]/g, ""));
                }}
                error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
              />
              <Typography color={color} pt={"5px"}>
                Only used to assist delivery
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Flat, House no., Building, Company Apartment</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={InputProps}
                name="houseNo"
                placeholder="Flat, House No."
                fullWidth
                onBlur={formik.handleBlur}
                value={formik.values.houseNo}
                onChange={formik.handleChange}
                error={formik.touched.houseNo && Boolean(formik.errors.houseNo)}
                helperText={formik.touched.houseNo && formik.errors.houseNo}
              />
            </Grid>

            <AutoCompleteAddress
              open={open}
              color={color}
              formik={formik}
              inputValue={inputValue}
              inputStyles={inputStyles}
              setSelectedState={setSelectedState}
              setSelectedCountry={setSelectedCountry}
              countryChanged={countryChanged}
            />

            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Landmark</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={InputProps}
                name="landmark"
                placeholder="Landmark"
                fullWidth
                onBlur={formik.handleBlur}
                value={formik.values.landmark}
                onChange={formik.handleChange}
                error={formik.touched.landmark && Boolean(formik.errors.landmark)}
                helperText={formik.touched.landmark && formik.errors.landmark}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ color: color }}>Pin Code</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={InputProps}
                name="pinCode"
                placeholder="Pincode"
                fullWidth
                value={formik.values.pinCode}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                helperText={formik.touched.pinCode && formik.errors.pinCode}
              />
            </Grid>

            <Grid item xs={6}>
              <InputLabel sx={{ color: color }}>Town/City</InputLabel>
              <TextField
                sx={{ ...inputStyles }}
                InputProps={InputProps}
                name="city"
                placeholder="Town/City"
                fullWidth
                value={formik.values.city}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>

            <Grid item xs={6}>
              <InputLabel sx={{ color: color }}>State</InputLabel>
              <FormControl fullWidth>
                <Select
                  components={{ IndicatorSeparator: () => null }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
                      borderRadius: "0px",
                      borderColor: "#757575"
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: color
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: 0,
                      marginTop: 0,
                      color: theme.palette.mode === "dark" ? "#181C1F" : "black"
                    }),
                    dropdownIndicator: (provided, state) => ({
                      ...provided,
                      color: "#2F53FF"
                    }),
                    placeholder: (provided, state) => ({
                      ...provided,
                      color: "#454D63"
                    }),
                    input: (provided) => ({
                      ...provided,
                      color: color
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      border: "0.5px solid grey",
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
                  menuPlacement="top"
                  name="state"
                  variant="standard"
                  placeholder="Select The State"
                  options={State.getStatesOfCountry(selectedCountry?.isoCode)}
                  getOptionLabel={(options) => {
                    return options["name"] ? options["name"] : options["label"];
                  }}
                  getOptionValue={(options) => {
                    return options["name"] ? options["name"] : options["value"];
                  }}
                  onBlur={formik.handleBlur}
                  onChange={(item) => {
                    setSelectedState(item);
                    formik.setFieldValue("state", item.isoCode);
                  }}
                  value={selectedState?.name ? { label: selectedState?.name, value: selectedState?.name } : null}
                />
                {formik.touched.state && formik.errors.state ? (
                  <Typography sx={{ color: "red", fontSize: "12px", paddingLeft: "13px" }}>
                    {formik.errors.state}
                  </Typography>
                ) : null}
              </FormControl>
            </Grid>
            <Stack direction="row" alignItems="center" justifyContent="space-between" marginLeft={"15px"}>
              <FormControlLabel
                sx={{
                  "& .MuiFormControlLabel-label": {
                    paddingTop: "3px"
                  }
                }}
                control={
                  <Checkbox
                    name="isDefault"
                    checked={formik.values.isDefault}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label="Make this default address"
              />
            </Stack>
            {invalidAddress ? (
              <Stack direction="row" alignItems="center" justifyContent="space-between" paddingX={"4em"} gap={"1em"}>
                <WarningIcon sx={{ color: "red" }} />
                <Typography>The address you entered is invalid, and cannot be used for shipping products</Typography>
              </Stack>
            ) : null}

            <Grid item xs={12}>
              <DialogActions sx={{ justifyContent: "flex-end", p: 0 }}>
                <Button type="submit" disabled={loader} variant="contained">
                  {loader ? (
                    <CircularProgress sx={{ color: "white" }} size={"1.5rem"} />
                  ) : type === "Edit" ? (
                    "Update Address"
                  ) : (
                    "Add address"
                  )}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Dialog>
  );
};
