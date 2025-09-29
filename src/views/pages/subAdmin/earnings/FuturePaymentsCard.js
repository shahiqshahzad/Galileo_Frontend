import React from "react";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";

export const FuturePaymentsCard = ({ earningsData }) => {
  return (
    <Stack sx={{ width: "30em" }}>
      <Typography
        className="HeaderFonts"
        variant="h4"
        sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}
      >
        Future
      </Typography>
      <Stack sx={{ background: "#181C1F", borderRadius: "10px", mt: "1em", height: "19em" }}>
        <Stack sx={{ padding: "1em" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#757575"
            }}
            className="app-text"
          >
            Payments being cleared
          </Typography>
          <Typography variant="h2" fontWeight={500} my={1.5} className="app-text">
            ${earningsData?.futureWithdrawalsTotal.toFixed(2)}
          </Typography>
          <Typography
            sx={{
              mt: "10px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#757575"
            }}
            className="app-text"
          >
            Payments after deducting referral fee
          </Typography>
        </Stack>
        <Stack sx={{ mb: "8px", borderTop: "1px solid #2F3235" }} />
        <Stack sx={{ padding: "1em" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#757575"
            }}
            className="app-text"
          >
            Refunded amount
          </Typography>
          <Typography variant="h2" fontWeight={500} mt={1.5}>
            ${earningsData?.canceledAmount.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
