import "@fontsource/public-sans";
import { useTheme } from "@mui/material/styles";
import { Grid, Box, Typography, Button, ButtonGroup, CircularProgress, Stack } from "@mui/material";
import AuthWrapper1 from "shared/component/AuthWrapper";
import MainCard from "ui-component/cards/MainCard";
import galileo from "assets/images/galileo.png";
import galileoWhite from "assets/images/galileo-white.png";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useWeb3 } from "utils/MagicProvider";

const Metamask = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { magic } = useWeb3();

  const [loading, setLoading] = useState(true);

  const magicFunction = async () => {
    setLoading(false);
    let email = location?.state?.email;
    let referalCode = location?.state?.referalCode;

    try {
      const token = await magic.auth.loginWithEmailOTP({
        email,
        showUI: true
      });
      if (token) {
        navigate("/socialLogin", { state: { token: token, referalCode } });
      }
      setLoading(true);
    } catch (error) {
      setLoading(true);
      // toast.error("Error!", error);
    }
  };

  const metamaskFunction = async () => {
    let email = location?.state?.email;
    let referalCode = location?.state?.referalCode;
    navigate("/signUp", {
      state: { email, referalCode }
    });
  };

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/email");
    }
  }, [navigate, location?.state?.email]);

  return (
    <AuthWrapper1>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ minHeight: "100vh", background: theme.palette.mode === "dark" ? "#000" : "#fff" }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title> metamask </title>
        </Helmet>
        <Grid
          item
          md={4.5}
          lg={4.5}
          sx={{ position: "relative", alignSelf: "stretch", display: { xs: "none", md: "block" } }}
        >
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <span />
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
        <Grid item container justifyContent="center" md={7.5} lg={7.5}>
          <MainCard
            sx={{
              borderRadius: "4px",
              maxWidth: { xs: 400, lg: 425 },
              margin: { xs: 2.5, md: 3 },
              "& > *": {
                flexGrow: 1,
                flexBasis: "50%"
              },
              background: "transparent"
            }}
            content={false}
          >
            <Grid container direction="column" justifyContent="center" spacing={2}>
              <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none" } }}>
                  <Typography variant="h6" noWrap component="div" sx={{ marginTop: "5px" }}>
                    {theme.palette.mode === "dark" ? (
                      <img src={galileoWhite} alt="Galileo White Logo" width="100" />
                    ) : (
                      <img src={galileo} alt="Galileo Dark Logo" width="100" />
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} container alignItems="left" justifyContent="left">
                <Box sx={{ mb: 2 }}>
                  <Typography className="MetamaskWallet" variant="subtitle1">
                    Do you have a Metamask Wallet?
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center">
              {loading === false ? (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Stack justifyContent={"center"} alignItems={"center"}>
                    <CircularProgress />
                  </Stack>
                </Box>
              ) : (
                <Grid item xs={12}>
                  <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                    <Grid item xs={6}>
                      {" "}
                      <Button
                        className="yesNoButton"
                        sx={{ marginRight: "15px" }}
                        onClick={() => {
                          magicFunction();
                        }}
                      >
                        No
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button className="yesNoButton" onClick={metamaskFunction}>
                        Yes
                      </Button>
                    </Grid>
                  </ButtonGroup>
                </Grid>
              )}
              <Grid item xs={12}>
                <Grid item container justifyContent="center" xs={12}>
                  <Typography
                    className="MetamaskWallet-para"
                    variant="subtitle1"
                    sx={{ textDecoration: "none", marginRight: "12px", color: "#FFFFFF" }}
                  >
                    If you don't have a Metamask wallet, a new crypto wallet will be created for you after a successful
                    sign-up
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Metamask;
