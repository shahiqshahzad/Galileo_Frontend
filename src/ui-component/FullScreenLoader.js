import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  loaderContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999
  }
}));

const FullScreenLoader = () => {
  const classes = useStyles();

  return (
    <div className={classes.loaderContainer}>
      <CircularProgress color="primary" />
    </div>
  );
};

export default FullScreenLoader;
