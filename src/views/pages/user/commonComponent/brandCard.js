import React from "react";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";

const BrandCard = ({ data, brands }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    // <Grid item md={brands && brands?.length > 5 ? 12 : 2.3} mt={1}>
    //   <img src={data?.image} alt={data?.id} height={"140px"} width="140px" sx={{ objectFit: "cover" }} />
    // </Grid>
    <Grid
      item
      mt={1.6}
      ml={brands && brands?.length > 18 ? 0 : 1}
      sx={{
        color: theme.palette.mode === "dark" ? "white" : "black",
        textDecoration: "none"
      }}
      onClick={() => {
        navigate("/brand/" + data.id, {
          state: {
            nft: data
          }
        });
      }}
    >
      {/* <CardImage src={data?.image} alt={data?.id} className={"brand-container"} /> */}
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <img
          src={data?.image}
          alt={data?.id}
          style={{ border: "1px solid blue", height: "120px", width: "125px", borderRadius: "3px" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            textAlign: "center",
            padding: "5px"
          }}
        >
          {data?.name}
        </Box>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: "pointer"
          }}
          onMouseEnter={(e) => (e.currentTarget.previousSibling.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.previousSibling.style.opacity = 0)}
        />
      </Box>
    </Grid>
  );
};

export default BrandCard;
