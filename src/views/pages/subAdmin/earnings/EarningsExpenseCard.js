import React from "react";
import { Stack } from "@mui/system";
import { Tooltip, Typography } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import "./styles.css";
import { useTheme } from "@mui/material/styles";

export const EarningsExpenseCard = ({ earningsData }) => {
  const theme = useTheme();
  return (
    <Stack sx={{ width: "30em" }}>
      <Typography
        className="HeaderFonts"
        variant="h4"
        sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}
      >
        Earnings
      </Typography>
      <Stack sx={{ background: "#181C1F", borderRadius: "10px", mt: "1em", height: "19em" }}>
        <Stack sx={{ padding: "1em", height: "9.1em" }}>
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
            Earning to date
          </Typography>
          <Typography variant="h2" fontWeight={500} my={1.5} className="app-text">
            ${earningsData?.earningsToDate.toFixed(2)}
          </Typography>
          <Typography
            className="earningText"
            sx={{ fontSize: "14px", fontWeight: 500, color: "#757575", fontFamily: theme?.typography.appText }}
          >
            {/* Your earnings, without referral fee{" "}
            <span style={{ whiteSpace: "nowrap", fontFamily: theme?.typography.appText }}> till date </span> */}
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
              color: "#757575",
              fontFamily: theme?.typography.appText
            }}
          >
            Withdrawn to date
            <Tooltip
              placement="top-start"
              title="The amount withdrawn till date, this also includes the amount sent to your wallet directly when the refunds are processed and partial refund is made to the buyer."
            >
              <span>{Icons.questionMarkSmallIcon}</span>
            </Tooltip>
          </Typography>
          <Typography variant="h2" fontWeight={500} mt={1.5} className="app-text">
            ${earningsData?.withdrawnToDate.toFixed(2)}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#757575",
              mt: "1em"
            }}
            className="app-text"
          >
            Amount withdrawn till date
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
