import "@fontsource/public-sans";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Typography, Box } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import galileo from "assets/images/galileo.png";
import galileoWhite from "assets/images/galileo-white.png";
// project imports
import AuthWrapper1 from "shared/component/AuthWrapper";
import SignUpForm from "./component/SignUp";
import { Helmet } from "react-helmet";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";

// assets

// styles

// ================================|| AUTH1 - LOGIN ||================================ //

const SignUp = () => {
  const theme = useTheme();

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
          <title> Sign Up</title>
          <link rel="canonical" />
        </Helmet>
        <Grid
          item
          md={6}
          lg={5}
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
        <Grid item container justifyContent="center" md={6} lg={7}>
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
                  <Typography className="signInMarket" variant="subtitle1">
                    Sign Up
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <SignUpForm />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default SignUp;
