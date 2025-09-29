import { Box } from "@mui/system";
import React from "react";
import transak from "utils/Transak";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Icons } from "../../../../shared/Icons/Icons";
const Index = () => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }} mb={2} ml={1}>
        {/* <ArrowBackIosIcon
          onClick={() => {
            navigate("/home");
          }}
          sx={{ color: "#2F53FF", cursor: "pointer" }}
        /> */}
        <Typography className="HeaderFonts" variant="h2" color="white" fontSize="38px">
          Sell Crypto
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#252B2F",
          height: "71px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center"
        }}
        pl={3}
        mt={3}
      >
        <Typography color="white" fontSize="22px" className="app-text">
          Watch a video to learn how this works.
        </Typography>
        <Link
          to="https://youtu.be/30U7LctNjXQ?si=zT_wwWtPdOcISu8k"
          target="_blank"
          underline="none"
          style={{ textDecoration: "none" }}
        >
          <Typography ml={1} color="#2F6fFF" fontSize="22px" display="flex" className="app-text">
            Watch now <Typography mt={1}>{Icons.hashSmallIcon}</Typography>
          </Typography>
        </Link>
      </Box>
      <Typography
        variant="subtitle1"
        mx={1}
        mt={2.5}
        color="#fff"
        fontSize="20px"
        sx={{ lineHeight: "23.5px", textAlign: "justify" }}
        className="app-text"
      >
        Easily convert your cryptocurrency into fiat with our straightforward selling process. Our app ensures a secure
        and efficient transaction every time.
        <br />
        Please note that we use Transak for our crypto conversion service. You can view the associated fees based on the
        payout method
        <Link
          to="https://docs.transak.com/docs/transak-off-ramp"
          target="_blank"
          style={{ paddingLeft: "5px", color: "#2795fd" }}
        >
          here.
        </Link>
      </Typography>
      <Button
        onClick={() => transak.init()}
        type="submit"
        variant="contained"
        className="app-text"
        style={{
          width: "286px",
          height: "34px",
          marginTop: "15px",
          marginLeft: "6px",
          background: "linear-gradient(to right, #2F57FF, #2FA3FF)",
          borderRadius: "6.3px",
          fontSize: "16px"
        }}
      >
        Sell Now
      </Button>
    </>
  );
};

export default Index;
