import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { Icons } from "../../../../shared/Icons/Icons";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import BackgroundImg from "../../../../assets/images/mobile-not-supported.png";

const MobileWarning = () => {
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
              Mobile Devices Are Not Yet Supported
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
            >
              Kindly open in desktop to proceed
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default MobileWarning;
