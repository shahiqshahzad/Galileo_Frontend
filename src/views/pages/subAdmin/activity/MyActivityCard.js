import { Box, Button, Grid, Typography, useTheme } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import moment from "moment";
import { Link } from "react-router-dom";

const MyActivityCard = ({ activityData, status }) => {
  const theme = useTheme();

  const styles = {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#252B2F",
    fontWeight: "500",
    fontFamily: theme?.typography.appText
  };
  const textDecoration = {
    color: theme.palette.mode === "dark" ? "#757575" : "#252B2F",
    fontWeight: "400",
    fontFamily: theme?.typography.appText
  };
  const themeBgColor = {
    backgroundColor: theme.palette.mode === "dark" ? "#252B2F" : "#fff"
  };

  let totalPrice = () => {
    let price = activityData?.totalPrice ? Number(activityData.totalPrice) : 0;
    let cost = activityData?.shippingCost ? Number(activityData.shippingCost) : 0;
    let tax = activityData?.totalTax ? Number(activityData.totalTax) : 0;
    return (price + cost + tax).toFixed(2);
  };

  return (
    <Grid
      container
      sx={{ backgroundColor: themeBgColor, borderRadius: "15px" }}
      columnSpacing={1}
      rowSpacing={2}
      mt={2}
      px={2}
    >
      <Grid item md={2}>
        <Typography variant="h3" color={styles}>
          {status === "buyAndRedeem" ? "Redeemed On" : "Bought On"}
        </Typography>
        <Typography variant="body1" mt={1} alignItems="center" sx={textDecoration}>
          {moment(activityData.createdAt).format("D MMMM YYYY")}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography variant="h3" color={styles}>
          Items
        </Typography>
        <Typography variant="body1" mt={1} sx={textDecoration}>
          {activityData.quantity}
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography variant="h3" color={styles}>
          Total
        </Typography>
        <Typography variant="body1" mt={1} sx={{ display: "flex", alignItems: "center", ...textDecoration }}>
          {totalPrice()} {activityData?.currency}
          <Link style={{ display: "flex" }} to={activityData?.transactionLink} target="_blank">
            {Icons?.hashSmallIcon}
          </Link>
        </Typography>
      </Grid>
      <Grid item md={2}>
        <Typography variant="h3" color={styles}>
          Shipping Address
        </Typography>
        <Typography variant="body1" mt={1} sx={textDecoration}>
          {activityData?.addressTag}
        </Typography>
      </Grid>
      <Grid item md={3} sx={{ marginLeft: "auto", textAlign: "center" }}>
        <Typography variant="h3" color={styles}>
          Order # {activityData.orderNumber}
        </Typography>
        <Box my={1}>
          <Link
            to={
              status === "Buy and Redeem"
                ? `/activity-dashboard-mint/${activityData.orderNumber}`
                : `/ActivityDashboardDetail/${activityData.orderNumber}`
            }
          >
            <Button variant="contained" sx={{ width: "60%", height: "30px" }}>
              View Details
            </Button>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MyActivityCard;
