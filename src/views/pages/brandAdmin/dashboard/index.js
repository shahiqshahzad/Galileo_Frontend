import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import UserCountCard from "shared/Card/UserCountCard";
import { Grid } from "@mui/material";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "react-redux";
import { branddashboard } from "redux/auth/actions";
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const brandId = useSelector((state) => state.auth.user.BrandId);

  useEffect(() => {
    dispatch(
      branddashboard({
        brandId: brandId
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dashboardBrandadmin = useSelector((state) => state.auth.branddahboardUser);
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Brand Categories"
              secondary={dashboardBrandadmin?.totalBrandCategories}
              color={theme.palette.primary.main}
            />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Nfts"
              secondary={dashboardBrandadmin?.totalNfts}
              color={theme.palette.secondary.main}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Redeem Nfts"
              secondary={dashboardBrandadmin?.redeemNfts}
              color={theme.palette.error.main}
            />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <UserCountCard
              primary="Total Sold Nfts"
              secondary={dashboardBrandadmin?.soldNfts}
              color={theme.palette.success.main}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
