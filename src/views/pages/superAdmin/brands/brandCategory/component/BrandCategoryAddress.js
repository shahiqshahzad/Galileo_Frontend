import React, { useEffect, useState } from "react";
import { TextField, Grid, Typography } from "@mui/material";
import { Country, State } from "country-state-city";
import { CustomSelect } from "./customSelect";

export const BrandCategoryAddress = ({ formik, open }) => {
  const [selectedState, setSelectedState] = useState();
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    setSelectedState(null);
    setSelectedCountry(null);
  }, [open]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountriesToShow(allCountries);
    // if (process.env.REACT_APP_ENVIRONMENT === 'development') {
    //   setCountriesToShow(allCountries);
    // } else {
    //   if (allCountries?.length) {
    //     const europeanUnionCountries = allCountries.filter((country) => {
    //       return euMemberCountries.includes(country.isoCode);
    //     });
    //     setCountriesToShow(europeanUnionCountries);
    //   }
    // }
  }, []);
  return (
    <>
      <Grid item xs={12} pt={2}>
        <TextField
          name="registeredBusinessName"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.registeredBusinessName}
          onChange={formik.handleChange}
          error={formik.touched.registeredBusinessName && formik.errors.registeredBusinessName}
          helperText={formik.touched.registeredBusinessName && formik.errors.registeredBusinessName}
          fullWidth
          label="Registered Business Name"
        />
      </Grid>
      <Grid item xs={12} pt={2}>
        <TextField
          name="vatNumber"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.vatNumber}
          onChange={formik.handleChange}
          error={formik.touched.vatNumber && formik.errors.vatNumber}
          helperText={formik.touched.vatNumber && formik.errors.vatNumber}
          fullWidth
          label="VAT Number"
        />
      </Grid>
      <Grid item xs={12} pt={2}>
        <Typography variant="h4">Registration Address</Typography>
      </Grid>
      <Grid item xs={12} pt={2} sx={{ display: "flex", gap: "1em", alignItems: "end" }}>
        <CustomSelect
          name="country"
          formik={formik}
          placeholder="Country"
          formikError={formik?.touched?.country && formik?.errors?.country}
          options={countriesToShow}
          handleChange={(item) => {
            setSelectedCountry(item);
            setSelectedState();
            formik.setFieldValue("country", item.isoCode);
            formik.setFieldValue("mobileNumber", "+" + item.phonecode);
          }}
          value={selectedCountry?.name ? { label: selectedCountry?.name, value: selectedCountry?.name } : null}
        />

        <TextField
          name="city"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && formik.errors.city}
          fullWidth
          label="City"
        />
      </Grid>

      <Grid item xs={12} pt={2} sx={{ display: "flex", gap: "1em" }}>
        <TextField
          name="addressLine1"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.addressLine1}
          onChange={formik.handleChange}
          error={formik.touched.addressLine1 && formik.errors.addressLine1}
          fullWidth
          label="Address Line 1"
        />
        <TextField
          name="addressLine2"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.addressLine2}
          onChange={formik.handleChange}
          error={formik.touched.addressLine2 && formik.errors.addressLine2}
          fullWidth
          label="Address Line 2"
        />
      </Grid>

      <Grid item xs={12} pt={2} sx={{ display: "flex", gap: "1em", alignItems: "end" }}>
        <CustomSelect
          name="state"
          formik={formik}
          formikError={formik?.touched?.state && formik?.errors?.state}
          placeholder="State/Province/Region"
          options={State.getStatesOfCountry(selectedCountry?.isoCode)}
          handleChange={(item) => {
            setSelectedState(item);
            formik.setFieldValue("state", item.isoCode);
          }}
          value={selectedState?.name ? { label: selectedState?.name, value: selectedState?.name } : null}
        />
        <TextField
          name="zip"
          className="textfieldStyle field"
          variant="standard"
          value={formik.values.zip}
          onChange={formik.handleChange}
          error={formik.touched.zip && formik.errors.zip}
          fullWidth
          label="ZIP/Postal Code"
        />
      </Grid>
      <Grid item xs={12} pt={2}>
        <CustomSelect
          name="taxType"
          formik={formik}
          options={[
            { label: "Standard", value: "standard" },
            { label: "Reduced", value: "reduced" },
            { label: "Zero", value: "exempt" }
          ]}
          placeholder="Select Tax Type"
          formikError={formik?.touched?.taxType && formik?.errors?.taxType}
          handleChange={(item) => formik.setFieldValue("taxType", item)}
          value={
            formik?.values?.taxType?.label
              ? { label: formik?.values?.taxType?.label, value: formik?.values?.taxType?.label }
              : null
          }
        />
      </Grid>
    </>
  );
};
