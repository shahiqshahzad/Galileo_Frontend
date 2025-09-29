// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emailVerification } from "redux/auth/actions";

import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
import { Formik } from "formik";

const VerifyEmail = ({ token, ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      emailVerification({
        token: token,
        navigate: navigate
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <Formik>
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid xs={12} sx={{ color: theme.palette.mode === "dark" ? "#CDCDCD" : "#6d6e72" }}>
              <Typography className="wallet-select" variant="h3">
                Your Account is being verified...{" "}
              </Typography>
              {/* <Grid container justifyContent="center" sx={{ width: '50%', m: '15px auto ' }}>
                                <Grid item>
                                    <CircularStatic />
                                </Grid>
                            </Grid> */}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default VerifyEmail;
