import "@fontsource/public-sans";
import { Helmet } from "react-helmet";
import { useTheme } from "@mui/material/styles";
import { Grid, Box, Typography } from "@mui/material";
import AuthWrapper1 from "shared/component/AuthWrapper";
import MainCard from "ui-component/cards/MainCard";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";

const MaintenancePage = () => {
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
          <title>Maintenance</title>
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
          <MainCard content={false} sx={{ background: "transparent" }}>
            <Box sx={{ width: "35rem" }}>
              <Typography className="MetamaskWallet" variant="subtitle1">
                Galileo Marketplace Under Maintenance
              </Typography>
              <Typography sx={{ color: "#b2b2b2", fontSize: "13px" }}>
                The Galileo Marketplace is currently undergoing an upgrade to enhance your experience.
              </Typography>

              {/* <Typography sx={{ color: "#b2b2b2", fontWeight: "bold", fontSize: "15px", marginTop: "1rem" }}>
                Maintenance Schedule:
              </Typography> */}
              {/* <Typography sx={{ color: "#a5a5a5" }}>
                <span style={{ fontWeight: "bold", color: "#b2b2b2", fontSize: "15px" }}>Date:</span> Monday, 9th
                September
              </Typography> */}
              {/* <Typography sx={{ color: "#a5a5a5" }}>
                <span style={{ fontWeight: "bold", color: "#b2b2b2", fontSize: "15px" }}>Time:</span>1 PM to 5 PM CET 
              </Typography> */}
              {/* <Typography sx={{ color: "#a5a5a5", marginTop: "1rem" }}>
                We apologize for any inconvenience caused. Please check back after the maintenance window.
              </Typography> */}
              <Typography sx={{ color: "#a5a5a5", marginTop: "1rem" }}>
                We apologize for any inconvenience caused.
              </Typography>
              <Typography sx={{ color: "#a5a5a5", marginTop: "1rem" }}>
                If you have any concerns, feel free to reach out to us at{" "}
                <span style={{ fontStyle: "italic" }}>hello@galileoprotocol.io</span>
              </Typography>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default MaintenancePage;
