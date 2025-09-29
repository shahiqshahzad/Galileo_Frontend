import React from "react";
import { ErrorMessage } from "utils/ErrorMessage";
import { Grid, Button, TextField } from "@mui/material";

export const EditNftDetail = ({ formik, currencyType, handleCurrencyType, fieldDataArray, setFieldDataArray }) => {
  return (
    <Grid container mt={1}>
      <Grid xs={4} md={4} lg={4}>
        <TextField
          className="textfieldStyle"
          id="nftName"
          name="nftName"
          label="NFT Name"
          fullWidth
          value={formik.values.nftName}
          onChange={formik.handleChange}
          inputProps={{ maxLength: 120 }}
          error={formik.touched.nftName && Boolean(formik.errors.nftName)}
          helperText={formik.touched.nftName && formik.errors.nftName}
          autoComplete="given-name"
          variant="standard"
        />
        <ErrorMessage textLength={formik.values.nftName?.length} length={120} />
      </Grid>

      <Grid xs={4} md={4} lg={4} pl={2} pr={2}>
        <TextField
          className="textfieldStyle"
          id="nftPrice"
          name="nftPrice"
          label="NFT Price"
          fullWidth
          value={formik.values.nftPrice}
          onChange={formik.handleChange}
          error={formik.touched.nftPrice && Boolean(formik.errors.nftPrice)}
          helperText={formik.touched.nftPrice && formik.errors.nftPrice}
          autoComplete="given-name"
          variant="standard"
        />
      </Grid>
      <Grid xs={4} md={4} lg={4} mt={2}>
        <TextField
          className="textfieldStyle"
          id="type"
          // type="number"
          name="type"
          fullWidth
          value={currencyType}
          variant="standard"
          disabled
        />
      </Grid>
      <Grid xs={12} md={12} lg={12} mt={2}>
        <TextField
          className="textfieldStyle"
          multiline
          maxRows={2}
          id="nftDescription"
          name="nftDescription"
          label="NFT Description"
          fullWidth
          onChange={formik.handleChange}
          inputProps={{ maxLength: 1000 }}
          value={formik.values.nftDescription}
          error={formik.touched.nftDescription && Boolean(formik.errors.nftDescription)}
          helperText={formik.touched.nftDescription && formik.errors.nftDescription}
          autoComplete="given-name"
          variant="standard"
        />
        <ErrorMessage textLength={formik.values.nftDescription?.length} length={1000} />
      </Grid>
      <Grid xs={12} mt={2}>
        <Button
          className="fieldbutton"
          variant="contained"
          sx={{ float: "left", padding: { md: " 6px 38px", lg: "6px 38px" } }}
          onClick={() => {
            setFieldDataArray([
              ...fieldDataArray,
              {
                display_type: "Text",
                trait_type: "",
                value: "",
                countryCode: "",
                isEditable: false,
                proofRequired: false,
                primaryLocation: false,
                Proofs: null
              }
            ]);
          }}
        >
          Add more fields
        </Button>
      </Grid>
    </Grid>
  );
};
