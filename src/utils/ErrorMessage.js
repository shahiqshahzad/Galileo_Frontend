import React from "react";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";

export const ErrorMessage = ({ textLength, length }) => {
  return (
    <Stack>
      {textLength >= length && (
        <Typography sx={{ color: "#ff4b4b", margin: 0, marginTop: "5px" }}>Only {length} characters allowed</Typography>
      )}
    </Stack>
  );
};
