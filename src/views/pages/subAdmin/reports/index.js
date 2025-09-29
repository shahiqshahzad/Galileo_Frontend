import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as XLSX from "xlsx";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { styled, useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Grid, Typography, Button, TextField } from "@mui/material";
import "./styles.scss";
import { useSelector } from "react-redux";
import { formatDate } from "utils/utilFunctions";

const StyledDownloadBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "18.8px",
  marginLeft: "60px",
  letterSpacing: "0em",
  textAlign: "center",
  width: "198px",
  height: "60px",
  color: "#fff",
  borderRadius: "4.62px",
  background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
  "&:hover": { backgroundColor: "#2196f3" }
}));

const Index = () => {
  const theme = useTheme();
  const { token } = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [error, setError] = useState();
  const [lastGeneratedAt, setLastGeneratedAt] = useState();
  const currentDate = new Date().toISOString().split("T")[0];

  const getSalesData = async () => {
    if (error) return;
    if (!startDate) {
      toast.error("From date is required");
      return;
    }
    if (startDate > currentDate) {
      toast.error("From Date should be less than current date");
      return;
    }
    if (!endDate) {
      toast.error("To date is required");
      return;
    }
    if (endDate > currentDate) {
      toast.error("To Date should be less than current date");
      return;
    }
    setLoader(true);
    const url = `${process.env.REACT_APP_API_URL}brand/sales-report?fromDate=${startDate}&toDate=${endDate}`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          authorization: "Bearer " + token
        }
      });
      setLoader(false);
      if (data.data.sales) {
        if (data?.data?.sales?.length === 0) {
          toast.info("No sales record in this time period!");
          return;
        }
        console.log(data.data.sales, "sales");
        exportToCSV(data.data.sales);
      }
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  const getReportHistory = async () => {
    const url = `${process.env.REACT_APP_API_URL}brand/sales-report-history`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          authorization: "Bearer " + token
        }
      });
      setLastGeneratedAt(data?.data?.history?.downloadDate);
    } catch (err) {
      setLoader(false);
      console.error(err);
    }
  };

  function exportToCSV(sales) {
    const csvData = sales.map((sale, index) => {
      return {
        "SL No": index + 1,
        "Date ": formatDate(sale.createdAt),
        "Product name": `${sale.nft.name}`,
        "Price (Single Item)": sale.price,
        "Quantity ": sale.quantity,
        "Sub total (Price * Qty)": sale.totalPrice,
        "Referral Fees": sale.referralFee,
        "Seller Earnings": sale.sellerEarnings,
        "Tax collected": sale.tax,
        "Shipping charges": sale.shippingCost,
        "Shipping provider": sale?.shippingProvider,
        "Total ": sale.totalPrice + sale.shippingCost + sale.tax,
        "Order ID": sale.orderNumber,
        "Blockchain ": sale.blockchain,
        "Redeemed ": sale.status.includes("Redeem") ? "Yes" : "No",
        "Buyer Name": `${sale.user.firstName} ${sale.user.lastName}`,
        "Buyer Email": sale.user.email,
        "Buyer wallet": sale.user?.walletAddress,
        "Billing Address": `${sale?.billingAddress?.area} ${sale?.billingAddress?.city} ${sale?.billingAddress?.country}`,
        "Shipping Address": `${sale?.shippingAddress?.area} ${sale?.shippingAddress?.city} ${sale?.shippingAddress?.country}`,
        "Transaction Link": sale.transactionLink,
        Status: sale?.shipmentStatus === "Returned and Refunded" ? "Cancelled" : sale?.shipmentStatus,
        "Return Request":
          sale?.shipmentStatus === "Returned and Refunded" || sale?.shipmentStatus === "Request Return"
            ? "True"
            : "False",
        "Last status updated": formatDate(sale?.updatedAt)
      };
    });
    const dataForReturns = [];
    sales.forEach((sale, index) => {
      if (sale.Return) {
        dataForReturns.push({
          "SL No": index + 1,
          "Order ID": sale.orderNumber,
          "Return Reason": sale.Return.returnReason,
          "Total Order Value": sale.totalPrice + sale.shippingCost + sale.tax,
          "Amount refunded to buyer": sale.Return.refundedAmount,
          "Tax refunded": sale.Return.refundedTax,
          "Shipping refunded": sale.Return.refundedShippingCost,
          "Seller earnings": sale.Return.sellerEarnings,
          "Referral fees paid": sale.Return.referralFees,
          "NFT Status": sale.Return.nftStatusAfterReturn,
          "Refund Note": sale.Return.refundedNote
        });
      }
    });

    const salesSheet = XLSX.utils.json_to_sheet(csvData);
    const returnsSheet = XLSX.utils.json_to_sheet(dataForReturns);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales Data");
    XLSX.utils.book_append_sheet(workbook, returnsSheet, "Returns Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sales_Returns_Data.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case "maxDate":
      case "minDate": {
        return "To date shouldn't be less than From Date";
      }

      case "invalidDate": {
        return "Your date is not valid";
      }
      case "required": {
        return "Date is required";
      }

      default: {
        return "";
      }
    }
  }, [error]);

  useEffect(() => {
    getReportHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Typography
        className="HeaderFonts"
        variant="h1"
        component="h2"
        sx={{
          marginTop: "10px",
          fontWeight: 600,
          background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        Sales Report
      </Typography>

      {lastGeneratedAt && (
        <Typography
          className="HeaderFonts"
          variant="p"
          component="p"
          sx={{
            marginTop: "10px",
            fontSize: "16px",
            background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
            color: theme.palette.mode === "dark" ? "#98A2B2" : "#404040"
          }}
        >
          Last generated on {dayjs(lastGeneratedAt).format("DD/MM/YYYY")}
        </Typography>
      )}

      <Typography
        variant="h2"
        component="h2"
        className="HeaderFonts"
        sx={{
          marginTop: "10px",
          marginBottom: "20px",
          fontWeight: 600,
          background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        Select Range
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} lg={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="From Date"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate.format("YYYY-MM-DD"))}
              renderInput={(params) => <TextField {...params} />}
              className="galileo-date-picker Mui-error app-text"
              onError={(newError, value) => {
                setError(newError);
              }}
              slotProps={{
                textField: {
                  helperText: errorMessage
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} lg={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="To Date"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate.format("YYYY-MM-DD"))}
              minDate={dayjs(startDate)}
              maxDate={dayjs()}
              onError={(newError) => setError(newError)}
              renderInput={(params) => <TextField {...params} />}
              className="galileo-date-picker app-text"
              slotProps={{
                textField: {
                  helperText: errorMessage
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={6} lg={2}>
          <StyledDownloadBtn
            disabled={loader}
            onClick={() => {
              getSalesData();
            }}
            variant="filled"
            aria-label="Cart"
            fullWidth
          >
            {loader ? <CircularProgress className="circul" /> : <span className="app-text">Generate report</span>}
          </StyledDownloadBtn>
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
