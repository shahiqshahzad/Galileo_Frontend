import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const CategoriesScroll = ({ categories }) => {
  const navigate = useNavigate();
  const myDivRef = useRef(null);
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);

  useEffect(() => {
    const midpoint = Math.ceil(categories.length / 2);

    const array1Data = categories.slice(0, midpoint);
    const array2Data = categories.slice(midpoint);

    setArray1(array1Data);
    setArray2(array2Data);
  }, [categories]);

  const scrollLeft = () => {
    if (myDivRef.current) {
      const newScrollLeft = myDivRef.current.scrollLeft - 300;
      myDivRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {
    if (myDivRef.current) {
      const newScrollRight = myDivRef.current.scrollLeft + 300;
      myDivRef.current.scrollTo({
        left: newScrollRight,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", width: "100%", marginLeft: "0.5rem" }}>
      <Stack
        onClick={scrollLeft}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: "40px",
          left: "-2.5rem"
        }}
      >
        <ArrowBackIosNewIcon sx={{ color: "#2F53FF", fontSize: "40px" }} />
      </Stack>
      <Stack
        onClick={scrollRight}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: "40px",
          right: "-0.8rem",

          "@media (min-width:1800px)": {
            right: "0.5rem"
          }
        }}
      >
        <ArrowForwardIosIcon sx={{ color: "#2F53FF", fontSize: "40px" }} />
      </Stack>

      <Stack
        ref={myDivRef}
        sx={{
          width: "85.5vw",
          overflowX: "auto",
          "@media (max-width:1300px)": {
            width: "84vw"
          }
        }}
      >
        <Stack sx={{ flexDirection: "row", gap: "1rem", marginBottom: "1rem" }}>
          {array1.map((item, i) => {
            return (
              <Stack
                key={i}
                onClick={() => {
                  navigate("/marketplace", { state: { category: item } });
                }}
                sx={{
                  cursor: "pointer",
                  padding: "15px 35px",
                  borderRadius: "4px",
                  border: "1px solid #305CFF"
                }}
              >
                <Typography whiteSpace={"nowrap"} variant="h4" color="#fff" className="app-text">
                  {item?.name}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        <Stack sx={{ flexDirection: "row", gap: "1rem" }}>
          {array2.map((item, i) => {
            return (
              <Stack
                key={i}
                onClick={() => {
                  navigate("/marketplace", { state: { category: item } });
                }}
                sx={{
                  cursor: "pointer",
                  padding: "15px 35px",
                  borderRadius: "4px",
                  border: "1px solid #305CFF"
                }}
              >
                <Typography whiteSpace={"nowrap"} variant="h4" color="#fff" className="app-text">
                  {item?.name}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </div>
  );
};

export default CategoriesScroll;
