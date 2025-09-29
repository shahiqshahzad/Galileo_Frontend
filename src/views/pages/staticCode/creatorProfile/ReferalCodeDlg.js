import { Box, Dialog, Grid, InputLabel, Typography } from "@mui/material";
import React from "react";
import referalCodeImg from "../../../../assets/images/profile/referralCodeModal.png";
import { Icons } from "../../../../shared/Icons/Icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ReferalCodeDlg = ({ open, referalCode, setOpen }) => {
  const links = [
    {
      name: "twitter",
      image: Icons.twitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `🌟 I’m inviting you to join the Galileo Marketplace – the home for luxury assets with verifiable authenticity on the blockchain. \n🔗 Sign up today using my referral link and unlock exclusive rewards: app.galileoprotocol.io/email?referralCode=${referalCode}`
      )}`
    },
    {
      name: "linkedin",
      image: Icons.linkedInIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        `https://app.galileoprotocol.io/email?referralCode=${referalCode}`
      )}`
    },
    {
      name: "telegram",
      image: Icons.telegramIcon,
      url: `https://t.me/share/url?url=${encodeURIComponent(
        `https://app.galileoprotocol.io/email?referralCode=${referalCode}`
      )}&text=${encodeURIComponent(
        `🌟 I’m inviting you to join the Galileo Marketplace – the home for luxury assets with verifiable authenticity on the blockchain.🔗 Sign up today using my referral link and unlock exclusive rewards`
      )}`
    }
  ];

  const copyReferalCode = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.info("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          margin: 0,
          padding: 0,
          overflow: "hidden",
          borderRadius: "5px"
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <Grid container p={0} m={0} sx={{ height: "100%" }}>
        <Grid item md={6} sx={{ position: "relative", overflow: "hidden" }}>
          <img
            src={referalCodeImg}
            alt="referral-code"
            style={{
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block" // Remove any extra space around the image
            }}
          />
        </Grid>
        <Grid item md={6} pl={2} pr={3}>
          <Box mt={2}>
            <Typography color="white" fontSize="14px">
              Referral Link & Code
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#223751",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center"
            }}
            p={1}
            mt={1}
          >
            {Icons.rewardCup}
            <Typography color="white" fontSize="12px" fontWeight="300" ml={1}>
              To know benefits,
              <Link
                to="https://learn.zohopublic.eu/external/manual/production-releases/article/referral-system?p=6ea73fd84c75b8f1a574b3e125a00798fb3ad62f37c012a340dc47c61f4f38d91e6bfb46e1d07ba38c549a5e0c4e49a7"
                target="_blank"
                style={{
                  color: "#fff", // White text
                  paddingLeft: "3px",
                  textDecoration: "none", // Remove default underline
                  position: "relative"
                }}
              >
                click here
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: "2px",
                    width: "100%",
                    height: "1px", // Adjust thickness of the underline
                    backgroundColor: "#2f53ff", // Blue underline
                    transform: "translateY(2px)" // Adjust position slightly below text
                  }}
                ></span>
              </Link>
            </Typography>
          </Box>
          <Box mt={1}>
            <InputLabel sx={{ color: "white", fontWeight: "400" }} htmlFor="outlined-adornment-email-login">
              Referral Code
            </InputLabel>
            <Box
              py={1}
              mt={1}
              sx={{ border: "1px solid #757575", display: "flex", justifyContent: "space-between" }}
              px={1}
            >
              <Box>{referalCode}</Box>
              <Box onClick={() => copyReferalCode(referalCode)} sx={{ cursor: "pointer" }}>
                {Icons.copyInputIcon}
              </Box>
            </Box>
          </Box>

          <Box mt={1}>
            <InputLabel sx={{ color: "white", fontWeight: "400" }} htmlFor="outlined-adornment-email-login">
              Referral Link
            </InputLabel>
            <Box
              py={1}
              mt={1}
              sx={{ border: "1px solid #757575", display: "flex", justifyContent: "space-between" }}
              px={1}
            >
              <Box>{`${window.location.host}/email?referralCode=${referalCode}`}</Box>
              <Box
                onClick={() => copyReferalCode(`${window.location.host}/email?referralCode=${referalCode}`)}
                sx={{ cursor: "pointer" }}
              >
                {Icons.copyInputIcon}
              </Box>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography color="white" fontSize="14px">
              Share via
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={2}>
              {links.map((link) => (
                <Box sx={{ cursor: "pointer" }} key={link.name}>
                  <Link to={link.url} target="_blank">
                    {link.image}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ReferalCodeDlg;
