import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { forwardRef } from "react";
import { addCurrency } from "redux/generalSettingSuperadmin/actions";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import "@fontsource/public-sans";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MenuItem, Select } from "@mui/material";
import { getAllChain } from "redux/generalSettingSuperadmin/actions";
import { Grid, Slide, FormControl, FormHelperText, Button, CircularProgress, InputLabel, Box } from "@mui/material";
import { isContractAddress, fetchCurrencySymbol } from "utils/utilFunctions";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddNewCurrencyDialog({ open, setOpen, ...others }) {
  // const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [chId, setChId] = useState("");
  const [chainId, setChainId] = useState("");
  const [loader, setLoader] = useState(false);

  const chainList = useSelector((state) => state.Currency.chainList);
  const dispatch = useDispatch();
  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "black" : "white";
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575", color: color }
  };
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      // padding: '10px',
      color: color
    }
  };
  const selectStyles = {
    background: "inherit",
    padding: "10 10px",
    color: color,
    "&:focus": {
      backgroundColor: "red"
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: 0,
      background: "inherit",
      border: "1px solid #757575"
    },
    ".MuiInputBase-input": {
      color: color
    },
    "& .MuiSelect-icon": {
      color: color
    }
  };
  const handleClose = (resetForm) => {
    setOpen(false);
    resetForm();
    setChainId("");

    setLoader(false);
  };
  const handleAddCurrencies = async (values, chId, resetForm) => {
    const testing = /^(0x)?[0-9a-fA-F]{40}$/;
    if (testing.test(values?.tokenContractAddress) === false) {
      toast.error("Invalid Wallet!");
      return;
    }

    if (values?.tokenContractAddress !== "" && chId !== "") {
      setLoader(true);

      const isValidContractAddress = await isContractAddress(values?.tokenContractAddress.trim(), chId);
      if (!isValidContractAddress?.success) {
        setLoader(false);
        return toast.error(isValidContractAddress?.message);
      }
      const CurrencySymbol = await fetchCurrencySymbol(values?.tokenContractAddress, chId);
      if (!CurrencySymbol?.success) {
        setLoader(false);
        return toast.error(CurrencySymbol?.message);
      }
      const { symbol } = CurrencySymbol;

      dispatch(
        addCurrency({
          contractAddress: values?.tokenContractAddress,
          chainId: chId,
          currencySymbol: symbol,

          handleClose: () => handleClose(resetForm),

          setLoader: setLoader
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getAllChain({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      //   onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title1"
      aria-describedby="alert-dialog-slide-description1"
      maxWidth="lg"
      PaperProps={{
        style: {
          width: "824px",
          margin: "0 auto",
          borderRadius: "0px"
        }
      }}
      open={open}
    >
      <DialogTitle className="add-new-currency" sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}>
        Add New Currency
      </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            tokenContractAddress: "",
            chainId: ""
          }}
          // validationSchema={Yup.object().shape({
          //   tokenContractAddress: Yup.string().required("Token Contract Address is required!")
          //   // TokenSymbol: Yup.string().required('Token symbol is required!').max(8, 'Token symbol can not exceed 8 characters'),
          //   // Chain: Yup.string().required('Chain is required!'),
          // })}

          validationSchema={Yup.object().shape({
            tokenContractAddress: Yup.string().trim().required("Token Contract Address is required!")
          })}
          onSubmit={async (values, { resetForm }) => {
            handleAddCurrencies(values, chId, resetForm);

            // fetchi(values);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <InputLabel
                sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
                className="currency-input-label"
                htmlFor="outlined-adornment-TokenContractAddress"
              >
                Token contract address
              </InputLabel>
              <FormControl
                sx={{ ...theme.typography.customInput }}
                className="auth-formcontrol"
                fullWidth
                error={Boolean(touched.email && errors.email)}
              >
                <TextField
                  sx={{ ...inputStyles }}
                  InputProps={{ ...InputProps }}
                  placeholder="Token contract address"
                  className="textForm"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  value={values?.tokenContractAddress}
                  name="tokenContractAddress"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.tokenContractAddress && errors.tokenContractAddress && (
                  <FormHelperText error id="standard-weight-helper-text-TokenContractAddress">
                    {errors.tokenContractAddress}
                  </FormHelperText>
                )}
              </FormControl>
              <InputLabel
                sx={{ mb: 2, color: theme.palette.mode === "dark" ? "white" : "#404040" }}
                className="currency-input-label"
                htmlFor="outlined-adornment-email-login"
              >
                Chain
              </InputLabel>

              <FormControl
                sx={{ ...theme.typography.customInput }}
                className="auth-formcontrol"
                fullWidth
                error={Boolean(touched.chainId && errors.chainId)}
                variant="outlined"
              >
                <Select
                  value={chainId}
                  onChange={(e) => setChainId(e.target.value)}
                  onBlur={handleBlur}
                  inputProps={{
                    name: "Chain",
                    id: "chain-select"
                  }}
                  sx={selectStyles}
                >
                  {chainList.map((option) => (
                    <MenuItem
                      onClick={() => {
                        setChId(option?.chainId);
                      }}
                      key={option?.chainName}
                      value={option?.chainName}
                    >
                      {option?.chainName}
                    </MenuItem>
                  ))}
                </Select>
                {touched.chainId && errors.chainId && (
                  <FormHelperText error id="standard-weight-helper-text-chainId">
                    {errors.chainId}
                  </FormHelperText>
                )}
              </FormControl>
              {/*  <InputLabel
              sx={{mt:2 , color: theme.palette.mode === 'dark' ? 'white' : '#404040' }}
              className="currency-input-label"
              htmlFor="outlined-adornment-email-login"
            >
            Token symbol
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.TokenSymbol && errors.TokenSymbol)}
            >
              <TextField
              sx={{ ...inputStyles }}
              InputProps={{ ...InputProps }}
                placeholder="Token Symbol"
                className="textForm"
              
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                value={values.TokenSymbol}
                name="TokenSymbol"
               
                onBlur={handleBlur}
                onChange={handleChange}
                
              />
              {touched.TokenSymbol && errors.TokenSymbol && (
                <FormHelperText error id="standard-weight-helper-text-TokenSymbol">
                  {errors.TokenSymbol}
                </FormHelperText>
              )}
            </FormControl> */}

              {loader === true ? (
                <Grid container justifyContent="right" sx={{ m: "15px auto " }}>
                  <Grid item>
                    <CircularProgress disableShrink size={"4rem"} />
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Box sx={{ mt: 2, ml: 2, float: "right" }}>
                    <Button
                      className="cancelCurrency button-text"
                      fullWidth
                      size="large"
                      onClick={() => {
                        handleClose(() => handleClose(resetForm));
                      }}
                      variant="oulined"
                      sx={{ color: "#4044ED", borderRadius: "6.3px", border: "3.15px solid #4044ED" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box sx={{ mt: 2, float: "right" }}>
                    <Button
                      sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
                      className="DoneCurrency button-text"
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Done
                    </Button>
                  </Box>
                </>
              )}
            </form>
          )}
        </Formik>
      </DialogContent>
      {/* // <DialogActions>
        //   <Button onClick={handleClose}>Disagree</Button>
        //   <Button onClick={handleClose}>Agree</Button>
        // </DialogActions> */}
    </Dialog>
  );
}
