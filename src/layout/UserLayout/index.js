import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Grid, Divider, Typography } from "@mui/material";
// import Footer from "./footer";
import Header from "./header";
import SideBar from "./sidebar";
import { Box, Stack } from "@mui/system";
import { Icons } from "shared/Icons/Icons";
import { Link as MuiLink } from "@mui/material";
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";

const UserLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const restrictApplicationss = useSelector((state) => state.auth.restrictApplication);

  return (
    <>
      <Grid
        container
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(to top right, 50% 50% at 50% 50%, #2B8CFF 0%, rgba(43, 140, 255, 0.27))"
              : "#f3f3f3",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(to top right, black,rgba(255,0,0,0), rgba(43 140 255 / 27%) )"
              : ""
        }}
      >
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          sx={{
            mt: 2,
            ml: 2,
            mr: 2,
            background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
            color: theme.palette.mode === "dark" ? "white" : "#404040",
            borderRadius: "4px"
          }}
        >
          <Header />
        </Grid>

        {process.env.REACT_APP_ENVIRONMENT === "development" &&
        (location.pathname === "/cart" || location.pathname === "/wishlist") ? (
          <>
            <Grid mt={0.5} item md={11} xs={12} sm={12} sx={{ minWidth: "100%" }}>
              <Outlet />
            </Grid>
          </>
        ) : (
          <>
            <Stack
              item
              sx={{
                mt: 2,
                width: "7%",
                "@media (max-width:1150px)": {
                  width: "8%"
                },
                marginBottom: "28px",
                position: "sticky",
                height: "100%",
                top: "0",
                display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }
              }}
            >
              <SideBar />
            </Stack>

            <Grid mt={0.5} item md={11} xs={12} sm={12} className="outlet-Margin">
              {!restrictApplicationss?.isInEU && !restrictApplicationss?.isInAvailableCountry ? (
                <Grid container sx={{ ml: "2em", mb: "10px" }}>
                  <Grid
                    item
                    md={11.8}
                    sx={{
                      background: theme.palette.mode === "dark" ? "#181C1F" : "#ffffff",
                      height: "50px",
                      mt: 1.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "400",
                      borderRadius: "8px"
                    }}
                  >
                    <Box sx={{ marginTop: "3px" }}>{Icons.warningIcon}</Box>
                    <Typography ml={1}>
                      The application is unavailable in your country. For assistance, please{" "}
                      <MuiLink href="#" rel="noopener noreferrer">
                        Support Team
                      </MuiLink>
                    </Typography>
                  </Grid>
                </Grid>
              ) : !restrictApplicationss?.isInEU && restrictApplicationss?.isInAvailableCountry ? (
                <Grid container sx={{ ml: "2em", mb: "10px" }}>
                  <Grid
                    item
                    md={11.8}
                    sx={{
                      background: theme.palette.mode === "dark" ? "#181C1F" : "#ffffff",
                      height: "50px",
                      mt: 1.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "400",
                      borderRadius: "8px"
                    }}
                  >
                    <Box sx={{ marginTop: "3px" }}>
                      <InfoIcon />
                    </Box>

                    <Typography ml={1}>
                      We're only accepting registrations from your country for now. Our products will be available for
                      purchase soon.
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}

              <Outlet />
            </Grid>
          </>
        )}
      </Grid>

      <Divider sx={{ borderBottomWidth: 1, border: "1px solid #ccc" }} />

      <Grid
        item
        md={10}
        sm={10}
        xs={12}
        sx={{
          pl: {},
          background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        {/* <Footer /> */}
      </Grid>
    </>
  );
};

export default UserLayout;
