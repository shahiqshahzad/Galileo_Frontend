import React, { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import { AvailableFundsCard } from "./AvailableFundsCard";
import { FuturePaymentsCard } from "./FuturePaymentsCard";
import { EarningsExpenseCard } from "./EarningsExpenseCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarnings, fetchWithdrawHistroy, ReleaseScheduled } from "redux/subAdmin/actions";
import EarningTabs from "./earningTabs";

const Earnings = () => {
  const dispatch = useDispatch();
  const { earnings, escrowHistory, ReleaseSchedule } = useSelector((state) => state.subAdminReducer);
  const [statusCode, setStatusCode] = useState(0);
  const [loading, setLoading] = useState(false);
  const [earningsData, setEarningsData] = useState({
    futureWithdrawalsTotal: 0,
    withdrawnToDate: 0,
    availableTotalFunds: 0,
    earningsToDate: 0,
    currencySymbol: "USDC",
    tokenIdsToWithdraw: [],
    collectionAddresses: null,
    canceledAmount: 0
  });

  useEffect(() => {
    if (earnings) {
      setEarningsData({
        futureWithdrawalsTotal: earnings?.futureWithdrawalsTotal || 0,
        withdrawnToDate: earnings?.withdrawnToDate || 0,
        availableTotalFunds: earnings?.availableTotalFunds || 0,
        earningsToDate: earnings?.earningsToDate || 0,
        currencySymbol: earnings?.currencySymbol || "USDC",
        tokenIdsToWithdraw: earnings?.tokenIdsToWithdraw || [],
        collectionAddresses: earnings?.collectionAddress || null,
        canceledAmount: earnings?.canceledAmount || 0
      });
    }
  }, [earnings]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchEarnings({ setLoading }));
    dispatch(fetchWithdrawHistroy());
    dispatch(ReleaseScheduled({ setStatusCode: setStatusCode }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blurBgStyle = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    filter: "blur(1px)",
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  };
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
      <Stack sx={{ paddingLeft: "10px", mt: "1.5em" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "normal",
            border: "1px solid #2F57FF",
            borderTopRightRadius: "3px",
            borderTopLeftRadius: "3px",
            width: "fit-content",
            paddingX: "20px",
            paddingY: "12px"
          }}
          className="app-text"
        >
          Overview
        </Typography>
        <Stack sx={{ mt: "1.5em", flexDirection: "row", gap: "10px" }} mt={"1.5em"}>
          <AvailableFundsCard earningsData={earningsData} setLoading={setLoading} />
          <FuturePaymentsCard earningsData={earningsData} />
          <EarningsExpenseCard earningsData={earningsData} />
        </Stack>
        <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#757575", my: "1em" }} className="app-text">
          {/*    Withdrawal History */}
        </Typography>
      </Stack>
      <EarningTabs escrowHistory={escrowHistory} ReleaseScheduled={ReleaseSchedule} statusCode={statusCode} />
    </Stack>
  );
};

export default Earnings;
