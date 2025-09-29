import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel } from "@mui/material";
import TextField from "@material-ui/core/TextField";
import * as Yup from "yup";
import { Formik } from "formik";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useDispatch } from "react-redux";
import { resetPassword } from "redux/auth/actions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";

const ResetPasswordForm = ({ token, ...others }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowconfirmPassword = () => {
    setShowconfirmPassword(!showconfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownconfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          password: "",
          confirmPassword: ""
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .max(255)
            .required("Password is required!")
            .matches(
              /^(?=(?:.*[A-Z].*){1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"
            ),
          confirmPassword: Yup.string().when("password", {
            is: (val) => !!(val && val.length > 0),
            then: Yup.string().oneOf([Yup.ref("password")], "Both Password must be match!")
          })
        })}
        onSubmit={async (values) => {
          await dispatch(
            resetPassword({
              newPassword: values.password,
              token: token,
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
              htmlFor="outlined-adornment-password-login"
            >
              {" "}
              Password
            </InputLabel>
            <FormControl className="auth-formcontrol" fullWidth error={Boolean(touched.password && errors.password)}>
              <TextField
                placeholder=" Password"
                className="textForm"
                // onChange={(event)=>handelAccount("password",event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
              <IconButton
                className="iconvisible"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                aria-label="toggle password visibility"
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </FormControl>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="authFont"
              htmlFor="outlined-adornment-password-login"
            >
              Confirm Password
            </InputLabel>
            <FormControl className="auth-formcontrol" fullWidth error={Boolean(touched.password && errors.password)}>
              <TextField
                placeholder="Confirm Password"
                className="textForm"
                // onChange={(event)=>handelAccount("password",event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={values.confirmPassword}
                name="confirmPassword"
                type={showconfirmPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />

              <IconButton
                className="iconvisible"
                onClick={handleClickShowconfirmPassword}
                onMouseDown={handleMouseDownconfirmPassword}
                aria-label="toggle password visibility"
                edge="end"
                size="large"
              >
                {showconfirmPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <div>
              * Password should be at least 8 characters long containing 1 uppercase, 1 numeric and 1 special character
            </div>
            <Box sx={{ mt: 5 }}>
              <AnimateButton>
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
                  Reset Password
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordForm;
