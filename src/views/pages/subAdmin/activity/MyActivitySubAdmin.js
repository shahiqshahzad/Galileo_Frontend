import { Box, CircularProgress, Grid, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyActivitySubAdmin } from "redux/subAdmin/actions";
import MyActivityCard from "./MyActivityCard";
import ActivityCardEmpty from "./ActivityCardEmpty";

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
const MyActivitySubAdmin = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState("Buy and Redeem");
  const [activityLoader, setActivityLoader] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allActivity = useSelector((state) => state.subAdminReducer.myActivitySubadmin);
  const blurBgStyle = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    filter: "blur(1px)",
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  };
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
        setStatus("Buy and Redeem");
        break;
      case 1:
        setPage(1);
        setStatus("Returns");
        break;
      default:
        setStatus("Buy and Redeem");
    }
  };
  useEffect(() => {
    dispatch(getMyActivitySubAdmin({ status, page, setActivityLoader }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  return (
    <Stack sx={activityLoader ? blurBgStyle : {}}>
      {activityLoader && (
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

      <Typography className="HeaderFonts " variant="h1" p={1}>
        Order Dashboard
      </Typography>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            mb: 1,
            ml: 1,
            mt: 2,
            width: "261px",
            "& a": {
              p: 1.5,
              mr: 3.7,
              minHeight: "1rem",
              color: theme.palette.grey[600],
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme?.typography.appText
            },
            "& a.Mui-selected": {
              color: theme.palette.primary.main,
              borderTop: "2px solid #2196f3",
              borderLeft: "2px solid #2196f3",
              borderRight: "2px solid #2196f3",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "8px",
              marginBottom: "none",
              textDecoration: "none",
              borderBottom: "none",
              fontFamily: theme?.typography.appText
            },
            "& .MuiTabs-flexContainer": {
              borderBottom: "2px solid #2196f3",
              overflow: "hide"
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
              height: "0px"
            }
          }}
          variant="standard"
        >
          <Tab component={Link} to="#" label="Buy and Redeem" {...a11yProps(0)} />
          <Tab component={Link} to="#" label="Returns" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {activityLoader ? (
          <MyActivityCard key={1} activityData={[]} status="Buy and Redeem" />
        ) : allActivity?.sales?.length && allActivity.sales.length > 0 ? (
          <>
            {allActivity.sales.map((activity, index) => (
              <MyActivityCard key={index} activityData={activity} status="Buy and Redeem" />
            ))}
            {allActivity?.pages > 1 && (
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
            )}
          </>
        ) : (
          <ActivityCardEmpty text={"No Buy and Redeem Items found"} />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {activityLoader ? (
          <MyActivityCard key={1} activityData={[]} status="Returns" />
        ) : allActivity?.sales?.length && allActivity.sales.length > 0 ? (
          <>
            {allActivity.sales.map((activity, index) => (
              <MyActivityCard key={index} activityData={activity} status="Returns" />
            ))}
            {allActivity?.pages > 1 && (
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
            )}
          </>
        ) : (
          <ActivityCardEmpty text={"No Return Items found"} />
        )}
      </TabPanel>
    </Stack>
  );
};

export default MyActivitySubAdmin;
