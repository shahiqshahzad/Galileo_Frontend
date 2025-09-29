import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import UserCountCard from "shared/Card/UserCountCard";
import { Grid } from "@mui/material";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "react-redux";
import { dashboard } from "redux/auth/actions";
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dashboard({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dashboardAdmin = useSelector((state) => state.auth.dahboardUser);
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Brands"
              secondary={dashboardAdmin?.totalBrands}
              color={theme.palette.primary.main}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Categories"
              secondary={dashboardAdmin?.totalCategories}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCountCard primary="Total Nfts" secondary={dashboardAdmin?.totalNfts} color={theme.palette.info.main} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Redeem Nfts"
              secondary={dashboardAdmin?.redeemNfts}
              color={theme.palette.error.main}
            />
          </Grid>

          <Grid item lg={4} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Sold Nfts"
              secondary={dashboardAdmin?.soldNfts}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
