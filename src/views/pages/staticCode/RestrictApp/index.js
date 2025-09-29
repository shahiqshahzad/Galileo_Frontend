import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { Icons } from "../../../../shared/Icons/Icons";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import BackgroundImg from "../../../../assets/images/mobile-not-supported.png";
import { Link } from "react-router-dom";
const RestrictApp = () => {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: theme.palette.mode === "dark" ? `url(${BackgroundImg})` : `url(${BackgroundImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
        width: "100%",
        overflow: "hidden",
        global: {
          body: {
            margin: "0px",
            padding: "0px"
          }
        }
      }}
    >
      <Grid container>
        <Grid item mt={5} xs={12} display="flex" justifyContent="center" alignItem="center">
          {Icons.mobileBannerLogoImg}
        </Grid>
      </Grid>
      <Grid height="80vh" container display="flex" justifyContent="center" alignItems="center">
        <Card
          sx={{
            width: "90%",
            background: " linear-gradient(180deg, #09112D 52.27%, #09112D 104.27%)",
            borderRadius: "10px",
            color: "white"
          }}
        >
          <CardContent>
            <Typography
              sx={{
                fontFamily: theme?.typography.appText,
                fontSize: "30px",
                lineHeight: "normal",
                textAlign: "center",
                textShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)"
              }}
            >
              The site is currently undergoing maintenance in preparation for the marketplace's live launch on June
              14th. For more information about the marketplace and to become a seller, please visit the official
              <Box as="span" component="span" pl={2}>
                <Link to="https://marketplace.galileoprotocol.io/" style={{ color: "white" }}>
                  Galileo Marketplace
                </Link>
              </Box>
            </Typography>
            <Typography
              mt={2}
              sx={{
                fontFamily: theme?.typography.appText,
                fontStyle: "normal",
                fontSize: "20px",
                fontWeight: 400,
                textTransform: "capitalize",
                textAlign: "center",
                opacity: "0.7"
              }}
            ></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default RestrictApp;
