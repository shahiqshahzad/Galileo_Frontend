import React from "react";
import { Box, Stack } from "@mui/system";
import { Grid, CircularProgress } from "@mui/material";

export const LoaderComponent = ({ justifyContent = "center", alignItems = "center", height, ...rest }) => {
  return (
    <Grid container justifyContent={"center"}>
      <Grid
        item
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        xs={12}
        md={11.9}
        lg={11.9}
        sx={{ textAlign: "center" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack justifyContent={justifyContent} alignItems={alignItems} {...rest}>
            <CircularProgress />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};
