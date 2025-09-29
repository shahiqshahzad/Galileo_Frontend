/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
// import { utils } from "ethers";
// import { ethers } from "ethers";
import { toast } from "react-toastify";
import MainCard from "ui-component/cards/MainCard";
import { useSDK } from "@metamask/sdk-react";
import {
  Box,
  Tooltip,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
  Grid,
  Divider
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CircularProgress from "@mui/material/CircularProgress";

import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signup } from "../../../../redux/auth/actions";
import { useNavigate, useLocation } from "react-router-dom";
import { setWallet } from "redux/auth/actions";
// import { SNACKBAR_OPEN } from "store/actions";
import TextField from "@material-ui/core/TextField";
import { Icons } from "shared/Icons/Icons";
import { Link as MuiLink } from "@mui/material";
// import { CHAIN_IDS, NETWORKS_INFO } from "utils/constants";
import { useWeb3 } from "utils/MagicProvider";

const SignUpForm = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { provider } = useWeb3();
  const { sdk } = useSDK();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { user } = useSelector((state) => state.auth);

  const [walletError, setWalletError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [loader, setLoader] = useState(false);
  const restrictApplicationss = useSelector((state) => state.auth.restrictApplication);
  

  // const promptSwitchNetwork = () => {
  //   window.ethereum
  //     .request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: NETWORKS_INFO.chainId }]
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         handleConnect();
  //       }, 1000);
  //     })
  //     .catch((error) => {
  //       if (error.code === 4902) {
  //         // Chain not added error code
  //         window.ethereum
  //           .request({
  //             method: "wallet_addEthereumChain",
  //             params: [
  //               {
  //                 chainId: NETWORKS_INFO.chainId,
  //                 chainName: NETWORKS_INFO.chainName,
  //                 nativeCurrency: {
  //                   name: "MATIC",
  //                   symbol: "MATIC",
  //                   decimals: 18
  //                 },
  //                 rpcUrls: [NETWORKS_INFO.rpcUrls],
  //                 blockExplorerUrls: [NETWORKS_INFO.blockExplorerUrl]
  //               }
  //             ]
  //           })
  //           .then(() => {
  //             console.log("Added and switched to Polygon mainnet");
  //             setTimeout(() => {
  //               handleConnect();
  //             }, 1000);
  //           })
  //           .catch((addError) => {
  //             console.error("Failed to add and switch to Polygon mainnet:", addError.message);
  //           });
  //       } else {
  //         console.error("Failed to switch to Polygon mainnet:", error.message);
  //       }
  //     });
  // };

  const handleConnect = async () => {
    try {
      const accounts = await sdk?.connect();
      if (accounts?.length) {
        setWalletAddress(accounts?.[0]);
      }
    } catch (error) {
      if (error?.code === -32002) {
        toast.error("Unlock your metamask to connect");
      } else {
        toast.error(error?.message || "Error");
      }
      return;
    }

    // if (!connected) {
    //   try {
    //     await sdk.connect();
    //   } catch (error) {
    //     console.error(error);
    //     return;
    //   }
    // }
    // if (connected) {
    //   setWalletAddress(account);
    // setProvider(new ethers.providers.Web3Provider(window.ethereum));
    // }
    // const signer = await provider.getSigner();
    // const address = await signer.getAddress();
    // setWalletAddress(account);
    // await sdk.connect();

    // if (!window.ethereum) {
    //   dispatch({
    //     type: SNACKBAR_OPEN,
    //     open: true,
    //     message: "You need to install metamask to proceed.",
    //     variant: "alert",
    //     alertSeverity: "info"
    //   });
    //   toast.error("You need to install metamask to proceed.");

    //   return;
    // } else if (window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID) {
    //   promptSwitchNetwork();

    //   dispatch({
    //     type: SNACKBAR_OPEN,
    //     open: true,
    //     message: `Please switch to ${NETWORKS_INFO.chainName} network from your metamask`,
    //     variant: "alert",
    //     alertSeverity: "info"
    //   });
    //   setWalletAddress();
    //   dispatch(setWallet(null));
    // } else {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const accounts = await provider.listAccounts();

    //   if (accounts?.length === 0) {
    //     toast.error("Please add an account");
    //     return;
    //   }

    //   try {
    //     const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    //     if (response) {
    //       const addressed = utils?.getAddress(response[0]);
    //       setWalletAddress(addressed);
    //       dispatch(setWallet(addressed));
    //       if (addressed === user.walletAddress) {
    //       } else {
    //         toast.error("please connect your registered wallet address");

    //         return;
    //       }
    //     }
    //   } catch (e) {
    //     if (e.code === -32002) {
    //       toast.error("Please accept request in your metamask");
    //     }
    //   }
    // }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownconfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowconfirmPassword = () => {
    setShowconfirmPassword(!showconfirmPassword);
  };
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    ".MuiInputBase-input": {
      padding: "14.5px 14px",
      color: "#fff",
      cursor: "pointer"
    }
  };
  useEffect(() => {
    dispatch(setWallet(walletAddress));
  }, [walletAddress]);

  useEffect(() => {
    const handleAccountsChanged = () => {
      handleConnect();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      if (window.ethereum) {
        // window.ethereum.off("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          firstName: "",
          lastName: "",
          email: location?.state?.email ?? "",
          password: "",
          confirmPassword: "",
          walletAddress: location?.state?.email ?? "",
          isEuropeanResident: false,
          termsAndConditions: true,
          emailOptIn: true,
          refCode: location?.state?.referalCode ?? ""
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string()
            .required("First Name is required!")
            .max(42, "First Name can not exceed 42 characters"),
          // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Name'),
          lastName: Yup.string().required("Last Name is required!").max(42, "Last Name can not exceed 42 characters"),
          // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Name'),
          email: Yup.string().email("Enter valid email").max(255).required("Email is required!"),
          // password: Yup.string()
          //   .max(255)
          //   .required("Password is required!")
          //   .matches(
          //     /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          //     "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"
          //   ),
          // confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Both password need to be the same"),
          // isEuropeanResident: Yup.boolean().oneOf([true]),
          termsAndConditions: Yup.boolean().oneOf([true])
        })}
        onSubmit={(values) => {
          // if (walletAddress === "") {
          //   setWalletError(true);
          //   return;
          // }
          let signUpData = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            isResidentInEurope: values.isEuropeanResident,
            emailOptIn: values.emailOptIn,
            termsAndConditions: values.termsAndConditions,
            walletAddress: location.state.walletAddress,
            signupMethod: location.state.signupMethod,
            setLoader,
            navigate,
            referalCode: values.refCode,
            token: location.state.token,
          };
          dispatch(signup(signUpData));
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              First Name
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.firstName && errors.firstName)}
            >
              <TextField
                InputProps={{ ...InputProps }}
                placeholder="First Name"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="name"
                value={values.firstName}
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.firstName && errors.firstName && (
                <FormHelperText error id="standard-weight-helper-text-name-login">
                  {errors.firstName}
                </FormHelperText>
              )}
            </FormControl>

            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Last Name{" "}
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.lastName && errors.lastName)}
            >
              <TextField
                InputProps={{ ...InputProps }}
                placeholder="Last Name"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="lastName"
                value={values.lastName}
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.lastName && errors.lastName && (
                <FormHelperText error id="standard-weight-helper-text-name-login">
                  {errors.lastName}
                </FormHelperText>
              )}
            </FormControl>

            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Email
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.email && errors.email)}
            >
              <TextField
                InputProps={{ ...InputProps }}
                placeholder="Email"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
                disabled = {location?.state?.email ? true : false}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {/* <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-password-login"
            >
              Password
            </InputLabel>
            <FormControl
              sx={{ ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.password && errors.password)}
            >
              <TextField
                placeholder=" Password"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="new-password"
                InputProps={{
                  ...InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>

                      <Tooltip
                        title="Password should be at least 8 characters long containing 1 uppercase, 1 numeric and 1 special character"
                        arrow
                        placement="top-start"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              padding: "1rem",
                              bgcolor: "#46494C",
                              "& .MuiTooltip-arrow": {
                                color: "#46494C"
                              },
                              fontFamily: "Public Sans",
                              color: "white",
                              fontSize: "1rem",
                              cursor: "pointer"
                            }
                          }
                        }}
                      >
                        <InfoOutlinedIcon sx={{ cursor: "pointer" }} color="primary" />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-password-login"
            >
              Confirm Password
            </InputLabel>
            <FormControl
              sx={{ ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            >
              <TextField
                placeholder="Confirm Password"
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={values.confirmPassword}
                name="confirmPassword"
                type={showconfirmPassword ? "text" : "password"}
                id="password"
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="new-password"
                InputProps={{
                  ...InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowconfirmPassword}
                        onMouseDown={handleMouseDownconfirmPassword}
                        size="large"
                      >
                        {showconfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>

                      <Tooltip
                        title="Password should be at least 8 characters long containing 1 uppercase, 1 numeric and 1 special character"
                        arrow
                        placement="top-start"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              padding: "1rem",
                              bgcolor: "#46494C",
                              "& .MuiTooltip-arrow": {
                                color: "#46494C"
                              },
                              fontFamily: "Public Sans",
                              color: "white",
                              fontSize: "1rem",
                              cursor: "pointer"
                            }
                          }
                        }}
                      >
                        <InfoOutlinedIcon sx={{ cursor: "pointer" }} color="primary" />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />

              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl> */}
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Referral Code (Optional)
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput, ...inputStyles }}
              className="auth-formcontrol"
              fullWidth
            >
              <TextField
                InputProps={{ ...InputProps }}
                className="textForm"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="text"
                value={values.refCode}
                name="refCode"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
            </FormControl>
            {/* <Button variant="contained" onClick={() => handleConnect()}>
              {walletAddress ? walletAddress.slice(0, 5) + "..." + walletAddress.slice(38, 42) : "Connect Wallet"}
            </Button>
            <Box mt={1}>{walletError && <FormHelperText error>Please connect to your wallet</FormHelperText>}</Box> */}
            <MainCard
              sx={{
                borderRadius: "4px",
                p: 2,
                background: "#181C1F"
              }}
              content={false}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.isEuropeanResident}
                      onChange={handleChange}
                      name="isEuropeanResident"
                      color="primary"
                      sx={{ fontSize: "12px !important" }}
                    />
                  }
                  label="I am a resident of the European Union"
                />
              </Stack>
              {/* {touched.isEuropeanResident && errors.isEuropeanResident && (
              <FormHelperText sx={{ paddingLeft: "1em" }} error id="standard-weight-helper-text-name-login">
                This is required
              </FormHelperText>
            )} */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.termsAndConditions}
                      onChange={handleChange}
                      name="termsAndConditions"
                      color="primary"
                      sx={{ fontSize: "12px !important" }}
                    />
                  }
                  label={
                    <span>
                      By checking this box, you agree to our
                      <a
                        href="https://galileoprotocol.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "12px !important", color: "#bdc8f0" }}
                      >
                        {" "}
                        Terms and Conditions
                      </a>
                    </span>
                  }
                />
              </Stack>
              {touched.termsAndConditions && errors.termsAndConditions && (
                <FormHelperText sx={{ paddingLeft: "1em" }} error id="standard-weight-helper-text-name-login">
                  This is required
                </FormHelperText>
              )}
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.emailOptIn}
                      onChange={handleChange}
                      name="emailOptIn"
                      color="primary"
                      sx={{ fontSize: "12px !important" }}
                    />
                  }
                  label={
                    <span>
                      Select this box to receive updates and marketing. You can change your preferences at any time as
                      per our Privacy Policy.
                    </span>
                  }
                />
              </Stack>

              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}

              <>
                {loader ? (
                  <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                      <Button
                        className="signbuttonMarket"
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        <CircularProgress style={{ color: "#ffffff5" }} />
                      </Button>
                    </AnimateButton>
                  </Box>
                ) : (
                  <Box sx={{ mt: 2 }}>
                    {!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry ? (
                      <AnimateButton>
                        <Button
                          className="signbuttonMarket"
                          disableElevation
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                          disabled={true}
                        >
                          Sign up
                        </Button>
                      </AnimateButton>
                    ) : (
                      <AnimateButton>
                        <Button
                          className="signbuttonMarket"
                          disableElevation
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          color="secondary"
                        >
                          Sign up
                        </Button>
                      </AnimateButton>
                    )}
                  </Box>
                )}
              </>

              {!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry ? (
                <Box
                  sx={{
                    bgcolor: "#FFE2E0",
                    color: "#000000",
                    p: 2,
                    mt: 2,
                    fontSize: "14px",
                    display: "flex",
                    fontWeight: "400",
                    borderRadius: "4px"
                  }}
                >
                  <Box sx={{ marginRight: "8px" }}>{Icons.warningIcon}</Box>
                  <Typography>
                    The application is unavailable in your country. For assistance, reach out to us at{" "}
                    <MuiLink href="mailto:hello@galileoprotocol.io" rel="noopener noreferrer">
                      hello@galileoprotocol.io
                    </MuiLink>
                  </Typography>
                </Box>
              ) : null}
              <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1">
                  <MuiLink href="/login" sx={{ textDecoration: "none", cursor: "pointer", color: "#ffffff" }}>
                    Already have an account?
                  </MuiLink>
                </Typography>
              </Grid>
            </MainCard>
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignUpForm;
