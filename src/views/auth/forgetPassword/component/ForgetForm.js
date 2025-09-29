// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Button, FormControl, FormHelperText, InputLabel } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../../redux/auth/actions";
import { setLoader } from "../../../../redux/auth/actions";
import TextField from "@material-ui/core/TextField";
import "@fontsource/public-sans";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

const ForgetForm = ({ ...others }) => {
  const theme = useTheme();
  const loader = useSelector((state) => state.auth.loader);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Formik
        initialValues={{
          email: ""
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email("Invalid email").max(255).required("Email is required!")
        })}
        onSubmit={async (values) => {
          await dispatch(setLoader(true));
          dispatch(
            forgotPassword({
              email: values.email,
              navigate: navigate
            })
          );
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-email-login"
            >
              Email{" "}
            </InputLabel>
            <FormControl
              sx={{ ...theme.typography.customInput }}
              className="auth-formcontrol"
              fullWidth
              error={Boolean(touched.email && errors.email)}
            >
              <TextField
                placeholder="email"
                className="textForm"
                // onChange={(event)=>handelAccount("password",event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="email"
                value={values.email}
                name="email"
                autoComplete="current-email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                {loader ? (
                  <Button
                    className="signbuttonMarket"
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Send Email
                  </Button>
                ) : (
                  <Button
                    className="signbuttonMarket"
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Send Email
                  </Button>
                )}
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ForgetForm;
