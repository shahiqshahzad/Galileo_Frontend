import React from "react";
import { Stack } from "@mui/system";
import { Button, Dialog, Typography } from "@mui/material";
import metamaskGif from "assets/metamask-helper.gif";

export const ThirdWebHelperDialog = ({ isOpen, handleClose }) => {
  return (
    <Dialog
      open={isOpen}
      keepMounted
      onClose={handleClose}
      PaperProps={{ sx: { width: "30%", maxWidth: "30%", borderRadius: "0px" } }}
    >
      <Stack sx={{ paddingY: "10px", paddingX: "35px", justifyContect: "center", alignItems: "center" }}>
        <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "24px", mb: 3 }}>
          Login with Metamask
        </Typography>
        {isOpen && <img src={metamaskGif} alt="metamaskGif" style={{ width: "400px", height: "400px" }} />}
        <Typography sx={{ color: "white", fontSize: "18px", textAlign: "center", mt: 3 }}>
          You had registered with the Metamask wallet. Please sign in by connecting with the same wallet.{" "}
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)", width: "6rem", mt: 3 }}
        >
          Okay
        </Button>
      </Stack>
    </Dialog>
  );
};
