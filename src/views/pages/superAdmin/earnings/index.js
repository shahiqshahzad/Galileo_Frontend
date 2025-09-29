import { Stack } from "@mui/system";
import React, { useState } from "react";
import { blurBgStyle } from "./style";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Index = () => {
  const user = useSelector((state) => state.auth.user);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const userWalletAddress = useSelector((state) => state.auth?.walletAddress);
  // eslint-disable-next-line no-unused-vars
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  return (
    <Stack sx={loading ? blurBgStyle : {}}>
      {loading && (
        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            margin: "auto",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          <CircularProgress color="primary" size={50} />
        </Stack>
      )}
      <Typography variant="h1" className="HeaderFonts">
        Earnings
      </Typography>
      <Stack sx={{ mt: "1.5em", flexDirection: "row", gap: "10px" }} mt={"1.5em"}>
        <Stack sx={{ width: "30em" }}>
          <Stack sx={{ background: "#181C1F", padding: "1em", borderRadius: "10px", mt: "1em", height: "19em" }}>
            <Typography
              className="app-text"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#757575"
              }}
            >
              Available for withdrawal
            </Typography>
            <Typography variant="h2" fontWeight={500} my={1} className="app-text">
              $2
            </Typography>
            <Typography variant="h4" fontWeight={500} my={"3px"} color={"#757575"} className="app-text">
              2
            </Typography>
            <Typography
              sx={{ opacity: "0" }}
              variant="h4"
              fontWeight={500}
              my={"3px"}
              color={"#757575"}
              className="app-text"
            >
              4 USDC
            </Typography>

            <Button
              variant="contained"
              sx={{
                paddingX: "4em",
                paddingY: "10px",
                borderRadius: "8px",
                background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
                fontSize: "14px",
                my: "1.5em",
                width: "15rem"
              }}
              disabled={false}
              onClick={console.log("d")}
              className="app-text"
            >
              {withdrawLoading ? <CircularProgress size={25} color="info" /> : "Withdraw Balance"}
            </Button>
            <Typography sx={{ fontWeight: "400", my: "3px", color: "#2F53FF" }} className="app-text">
              Amount will be withdrawn to{" "}
              <Tooltip
                title={userWalletAddress ? userWalletAddress : user?.userWalletAddress}
                placement="right"
                arrow
                className="app-text"
              >
                <span style={{ cursor: "pointer" }} className="app-text">
                  {userWalletAddress
                    ? userWalletAddress.slice(0, 5) + "..." + userWalletAddress.slice(39, 42)
                    : user?.walletAddress?.slice(0, 5) + "..." + user?.walletAddress?.slice(36, 40)}
                </span>
              </Tooltip>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Index;
