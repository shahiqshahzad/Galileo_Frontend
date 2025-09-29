import React from "react";
import { ErrorMessage } from "utils/ErrorMessage";
import { Button, Grid, ListItem, Switch, TextField } from "@mui/material";
import QuantitySelector from "../quantitySelector";
import { Box } from "@mui/system";

export const AddNftDetail = ({
  formik,
  useStyles,
  mintType,
  walletadded,
  theme,
  checked,
  classes,
  handleType,
  type,
  getCurrency,
  refurbishedSalesStatus
}) => {
  return (
    <Grid container mt={1}>
      <Grid xs={4} md={4} lg={4}>
        <TextField
          className="textfieldStyle"
          id="nftName"
          name="nftName"
          label={"Name"}
          size="medium"
          fullWidth
          value={formik.values.nftName}
          onChange={formik.handleChange}
          error={formik.touched.nftName && Boolean(formik.errors.nftName)}
          helperText={formik.touched.nftName && formik.errors.nftName}
          autoComplete="given-name"
          variant="standard"
          inputProps={{ maxLength: 120, className: useStyles.underline }}
        />
        <ErrorMessage textLength={formik.values.nftName?.length} length={120} />
      </Grid>
      <Grid xs={4} md={4} lg={4} pl={2} pr={2}>
        <TextField
          className="textfieldStyle"
          id="nftPrice"
          type="number"
          name="nftPrice"
          label={"Price"}
          fullWidth
          value={formik.values.nftPrice}
          onChange={(event) => {
            const { value } = event.target;
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              formik.setFieldValue("nftPrice", value);
            }
          }}
          // onChange={formik.handleChange}
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
          value={getCurrency}
          variant="standard"
          disabled
        />
      </Grid>
      <Grid xs={12} md={12} lg={12} mt={1}>
        <TextField
          className="textfieldStyle"
          id="nftDescription"
          name="nftDescription"
          multiline
          label={"Description"}
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
      {checked !== true && (
        <ListItem sx={{ paddingX: 0, mt: 1 }}>
          <Box
            sx={{
              display: "flex",
              background: theme.palette.mode === "dark" ? "#202629" : "#fff",
              border: theme.palette.mode === "dark" ? "" : "1px solid black",
              borderRadius: "5px",
              px: 2,
              py: 0.5
            }}
          >
            <QuantitySelector formik={formik} fileArray={formik.values.images} index={0} />
          </Box>
        </ListItem>
      )}
      {mintType === "directMint" && (
        <>
          <Grid xs={12} md={12} lg={12} ml={-1}>
            {process.env.REACT_APP_ENVIRONMENT === "development" && (
              <>
                {" "}
                <Button
                  className="walletbutton adminname"
                  variant="text"
                  sx={{
                    float: "left",
                    color: theme.palette.mode === "dark" ? "#fff" : "#000"
                  }}
                >
                  Mint to wallet.
                </Button>
                <Switch
                  checked={checked}
                  onChange={(e) => {
                    walletadded(e.target.checked);
                  }}
                />
                <Button
                  className="walletbutton adminname"
                  variant="text"
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "#000"
                  }}
                >
                  Auto Redeem
                </Button>
                <Switch
                  checked={formik.values.autoRedeem}
                  onChange={(e) => {
                    formik.setFieldValue("autoRedeem", e.target.checked);
                  }}
                />
              </>
            )}
            {refurbishedSalesStatus && (
              <>
                <Button
                  className="walletbutton adminname"
                  variant="text"
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "#000"
                  }}
                >
                  This is a refurbished item
                </Button>
                <Switch
                  checked={formik.values.isSoldByGalileo}
                  onChange={(e) => {
                    formik.setFieldValue("isSoldByGalileo", e.target.checked);
                  }}
                />
              </>
            )}
          </Grid>
          {checked && (
            <Grid xs={12} md={12} lg={12} mt={1}>
              <TextField
                className="textfieldStyle"
                id="directBuyerAddress"
                name="directBuyerAddress"
                label="Wallet Address"
                placeholder="wallet Address"
                fullWidth
                value={formik.values.directBuyerAddress}
                onChange={formik.handleChange}
                error={formik.touched.directBuyerAddress && Boolean(formik.errors.directBuyerAddress)}
                helperText={formik.touched.directBuyerAddress && formik.errors.directBuyerAddress}
                autoComplete=""
                variant="standard"
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
