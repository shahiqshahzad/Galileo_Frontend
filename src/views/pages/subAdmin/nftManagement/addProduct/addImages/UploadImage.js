import React from "react";
import clsx from "clsx";
import { Grid, Box, Typography } from "@mui/material";

export const UploadImage = ({
  ImageUpload,
  title,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  marginRight = "",
  background = ""
}) => {
  return (
    <div
      className={clsx("dropZoneContainer", "xyz")}
      style={{
        cursor: "pointer",
        border: "2px dashed #646769",
        borderRadius: "5px",
        height: "215px",
        width: "215px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        marginRight
      }}
    >
      <div
        className={clsx("dropZone", {
          isDragActive: isDragActive,
          isDragAccept: isDragAccept,
          isDragReject: isDragReject
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <Grid container direction="column">
          <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
          <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
            <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
              <b style={{ color: "white" }}>{title}</b> <br />
              Upload or drag and drop
              <br />
              PNG, JPG or GIF
              <br />
              (max. 1024*1024px)
            </Typography>
          </Box>
        </Grid>
      </div>
    </div>
  );
};
