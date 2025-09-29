import { useTheme } from "@emotion/react";
import React from "react";
import { Icons } from "../shared/Icons/Icons.js";

const CustomToast = ({ message }) => {
  // Define your inline styles as an object
  const theme = useTheme();
  const customToastStyle = {
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    padding: "10px",
    borderRadius: "4px"
  };

  const toastContentStyle = {
    display: "flex",
    alignItems: "center"
  };

  return (
    <div style={customToastStyle} className="custom-toast">
      <div style={toastContentStyle} className="custom-toast">
        <div style={{ display: "flex" }}>{Icons.notificationSocketIcon}</div>
        <span style={{ marginLeft: "8px" }}>{message}</span>
      </div>
    </div>
  );
};

export default CustomToast;
