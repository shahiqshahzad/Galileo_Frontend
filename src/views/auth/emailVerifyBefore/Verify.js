// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "@fontsource/source-sans-pro";
import "@fontsource/public-sans";
import { resendEmail } from "redux/auth/actions";
import EmailVerifyDialog from "./emailVerifyDialog";

const VerifyEmail = ({ token, ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [changeEmail, setChangeEmail] = useState(false);
  const [timer, setTimer] = useState(5);
  // eslint-disable-next-line no-unused-vars
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timer]);

  const handleResendClick = () => {
    setIsResendDisabled(true);
    setTimer(5); // Set the desired timer value in seconds
    dispatch(
      resendEmail({
        id: user.id,
        navigate: navigate
      })
    );
  };

  const user = useSelector((state) => state.auth.user);
  const email = useSelector((state) => state.auth.email);

  return (
    <>
      <EmailVerifyDialog open={changeEmail} setOpen={setChangeEmail} />

      <Grid xs={12} sx={{ color: theme.palette.mode === "dark" ? "#CDCDCD" : "#6d6e72" }}>
        <Typography className="wallet-select" variant="h3">
          Please check your email account, the verification email has been sent to you.
          <br />
          <b>{email ? email : user?.email}</b>
        </Typography>
      </Grid>

      <Grid mt={2} xs={12}>
        <Grid xs={12} md={1}></Grid>
        <Box sx={{ display: "flex" }}>
          <Grid xs={6} md={7.5}>
            <Typography
              className="email-verify"
              sx={{ cursor: "pointer" }}
              variant="body"
              onClick={() => {
                setChangeEmail(true);
              }}
            >
              <b> change email address </b>
            </Typography>
          </Grid>
          <Grid xs={6} md={4.5} sx={{ display: "flex" }}>
            <Typography
              onClick={() => {
                timer === 0 && handleResendClick();
              }}
              // disabled={isResendDisabled}
              sx={{ ml: { md: 1 }, cursor: "pointer" }}
              className="email-verify"
              variant="body"
            >
              <b> resend code</b>
            </Typography>
            {timer > 0 ? (
              <Typography className="email-verify" variant="body">
                <b> ({timer}) </b>
              </Typography>
            ) : (
              <Typography className="email-verify" sx={{ color: "red !important" }} variant="body">
                <b> (0) </b>
              </Typography>
            )}
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

export default VerifyEmail;
