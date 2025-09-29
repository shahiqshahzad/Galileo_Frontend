import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// import { Icons } from "../../../../shared/Icons/Icons";
const ActivityCardEmpty = ({ text }) => {
  const theme = useTheme();

  return (
    <Grid container justifyContent={"center"}>
      <Grid
        item
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        xs={12}
        md={12}
        lg={12}
        sx={{ background: "#22282C", borderRadius: "15px", height: "200px", textAlign: "center" }}
      >
        {/* <Box>{Icons.ActivityIconNotFound}</Box> */}
        <Typography
          variant="h3"
          mt={1}
          component="div"
          sx={{ textTransform: "capitalize", fontFamily: theme?.typography.appText }}
        >
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ActivityCardEmpty;
