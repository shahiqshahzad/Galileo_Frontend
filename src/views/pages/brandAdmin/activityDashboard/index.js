import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Pagination, Tab, Tabs, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import BuyBrandCardItem from "./component/BuyBrandCardItem";
import { getAllBrandActivity } from "redux/brandActivityDashboard/actions";

const ActivityDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activityLoader, setActivityLoader] = useState(true);
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState("Buy and Redeem");
  const [page, setPage] = useState(1);
  const allActivity = useSelector((state) => state.brandActivityReducer.brandActivities);
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        setPage(1);
        setStatus("Buy");
        break;
      case 1:
        setPage(1);
        setStatus("Redeem");

        break;
      case 2:
        setPage(1);
        setStatus("Buy and Redeem");
        break;
      default:
        setStatus("Buy and Redeem");
    }
  };
  function TabPanel({ children, value, index, ...other }) {
    return (
      <Grid
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box
            sx={{
              p: 1,
              pr: 2
            }}
          >
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </Grid>
    );
  }

  useEffect(() => {
    dispatch(getAllBrandActivity({ status, page, setActivityLoader }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  return (
    <React.Fragment>
      <Typography variant="h1" p={1} className="app-text">
        My Activity
      </Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        borderBottom={2}
        sx={{
          mb: 1,
          ml: 1,
          mt: 2,
          width: "118px",
          "& a": {
            p: 1.5,
            mr: 3.7,
            minHeight: "1rem",
            minWidth: 10,
            color: theme.palette.grey[600],
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          },
          "& a.Mui-selected": {
            color: theme.palette.primary.main,
            borderTop: "2px solid #2196f3",
            borderLeft: "2px solid #2196f3",
            borderRight: "2px solid #2196f3",
            borderBottom: "2px solid #2196f3",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "8px",
            marginBottom: "none",
            textDecoration: "none",
            fontFamily: theme?.typography.appText
          },
          "& .MuiTabs-flexContainer": {
            textDecoration: "none",
            // borderBottom: "2px solid #2196f3",
            overflow: "hide"
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "transparent",
            height: "0px"
          }
        }}
      >
        {/*  <Tab component={Link} to="#" label="Buy" {...a11yProps(0)} />
        <Tab component={Link} to="#" label="Redeem" {...a11yProps(1)} /> */}
        <Tab className="app-text" component={Link} to="#" label="Buy & Redeem" {...a11yProps(2)} />
      </Tabs>
      {activityLoader ? (
        <Grid container justifyContent="left" sx={{ width: "80%", m: "15px auto " }}>
          <Grid item>
            <CircularProgress disableShrink size={"3rem"} />
          </Grid>
        </Grid>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            {allActivity?.sales?.length > 0 ? (
              <>
                {allActivity.sales.map((activity, index) => (
                  <BuyBrandCardItem key={index} activityData={activity} status="Buy & Redeem" />
                ))}
                <Pagination
                  className="app-text"
                  page={page}
                  count={allActivity.pages}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                  }}
                  sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}
                  variant="outlined"
                  shape="rounded"
                />
              </>
            ) : (
              <Typography className="app-text">No activities found.</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {allActivity.sales.length > 0 ? (
              <>
                {allActivity.sales.map((activity, index) => (
                  <BuyBrandCardItem key={index} activityData={activity} status="redeem" />
                ))}
                <Pagination
                  page={page}
                  count={allActivity.pages}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                  }}
                  sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}
                  variant="outlined"
                  shape="rounded"
                />
              </>
            ) : (
              <Typography className="app-text">No activities found.</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {allActivity.sales.length > 0 ? (
              <>
                {allActivity.sales.map((activity, index) => (
                  <BuyBrandCardItem key={index} activityData={activity} status="buyAndRedeem" />
                ))}
                <Pagination
                  page={page}
                  count={allActivity.pages}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                  }}
                  sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}
                  variant="outlined"
                  shape="rounded"
                />
              </>
            ) : (
              <Typography className="app-text">No activities found.</Typography>
            )}
          </TabPanel>
        </>
      )}
    </React.Fragment>
  );
};

export default ActivityDashboard;
