import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { styled as stylee } from "@mui/system";
import { useSelector } from "react-redux";

const SocketSvg = () => {
  const SquareIconButton = stylee(IconButton)(({ theme }) => ({
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    background: theme.palette.action.hover
  }));
  const socketConnect = useSelector((state) => state.auth?.socketConnection);

  return (
    <SquareIconButton size="large" aria-label="notification" color="inherit" sx={{ mx: 0.5 }}>
      <Tooltip className="fontsize" title={socketConnect ? "Connected" : "Disconnected"} placement="bottom" arrow>
        <svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx={10} cy={10} r={8} fill={socketConnect ? "green" : "red"} stroke="black" strokeWidth={1} />
          <circle
            cx={10}
            cy={10}
            r={8}
            fill={socketConnect ? "green" : "red"}
            fillOpacity={0.5}
            filter="url(#shadow)"
          />
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation={1} result="blur" />
              <feOffset in="blur" dx={1} dy={1} result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </Tooltip>
    </SquareIconButton>
  );
};

export default SocketSvg;
