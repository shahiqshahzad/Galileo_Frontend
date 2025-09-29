import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";

const TruncatedText = ({ text, limit }) => {
  const theme = useTheme();
  const [showFullText, setShowFullText] = useState(false);

  const textLength = text?.length;

  const truncatedText = text.slice(0, limit);

  const toggleShowText = (e) => {
    e.preventDefault();
    setShowFullText(!showFullText);
  };

  useEffect(() => {
    if (textLength < limit) {
      setShowFullText(true);
    }
  }, [textLength, limit]);

  return (
    <Typography
      sx={{
        fontWeight: 400,
        color: theme.palette.mode === "dark" ? "#CDCDCD" : "#4a4848",
        // color: '#9498aa',
        fontSize: "16px",
        textAlign: "left",
        padding: "0 15px",
        lineHeight: "34px",
        fontStyle: "normal",
        letterSpacing: "0.02em",
        fontFamily: theme?.typography.appText,
        textTransform: "capitalize",
        overflowY: "vertical",
        overflowX: "hidden",
        wordBreak: "break-all",
        maxHeight: "200px",
        "&::-webkit-scrollbar": {
          width: "0.4em"
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,.1)",
          outline: "1px solid slategrey"
        }
      }}
    >
      {showFullText ? text : `${truncatedText}...`}
      {textLength > limit && (
        <span>
          <Button
            onClick={toggleShowText}
            sx={{
              p: 0,
              pl: 1,
              mb: "2px",
              fontWeight: "bold",
              color: theme.palette.mode === "dark" ? "white" : "black"
            }}
          >
            {showFullText ? "show less" : "show more"}
          </Button>
        </span>
      )}
    </Typography>
  );
};

export default TruncatedText;
