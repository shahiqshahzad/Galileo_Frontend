import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Pagination, Tab, Tabs, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import BuyCardItem from "./component/BuyCardItem";
import { getAllActivity } from "redux/activity/actions";
// import ReturnCardItem from "./component/ReturnCardItem";
import SearchIcon from "../../../../assets/images/icons/search_icon_items.svg";
import { Stack } from "@mui/system";

const MyActivity = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activityLoader, setActivityLoader] = useState(true);
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState("Buy and Redeem");
  const [page, setPage] = useState(1);
  const allActivity = useSelector((state) => state.allActivityReducer.allActivity);

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
      case 2:
        setPage(1);
        setStatus("Returns");
        break;
      case 3:
        setPage(1);
        setStatus("Returns");
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
        {value === index && <Typography component={"span"}>{children}</Typography>}
      </Grid>
    );
  }
  const blurBgStyle = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    filter: "blur(1px)",
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  };
  useEffect(() => {
    dispatch(getAllActivity({ status, page, setActivityLoader }));
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
      <Box p={2}>
        <Typography variant="h1" className="app-text">
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
            width: "227px",
            "& a": {
              p: 1.5,
              mr: 2.7,
              minHeight: "1rem",
              minWidth: 10,
              color: theme.palette.grey[600],
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme?.typography.appText
            },
            "& a.Mui-selected": {
              color: theme.palette.primary.main,
              fontFamily: theme?.typography.appText,
              borderTop: "2px solid #2196f3",
              borderLeft: "2px solid #2196f3",
              borderRight: "2px solid #2196f3",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "8px",
              marginBottom: "none",
              textDecoration: "none"
            },
            "& .MuiTabs-flexContainer": {
              textDecoration: "none",
              borderBottom: "2px solid #2196f3",
              overflow: "hide"
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
              height: "0px"
            }
          }}
        >
          {/* <Tab component={Link} to="#" label="Buy" {...a11yProps(0)} />
        <Tab component={Link} to="#" label="Redeem" {...a11yProps(1)} /> */}
          <Tab component={Link} to="#" label="Buy & Redeem" {...a11yProps(0)} />
          <Tab component={Link} to="#" label="Returns" {...a11yProps(1)} />
        </Tabs>
        {activityLoader ? (
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
        ) : (
          <>
            {/* <TabPanel value={value} index={0}>
            {allActivity.sales.length > 0 ? (
              <>
                {allActivity.sales.map((activity, index) => (
                  <BuyCardItem key={index} activityData={activity} status="buy" />
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
              <Typography>No items purchased.</Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {allActivity.sales.length > 0 ? (
              <>
                {allActivity.sales.map((activity, index) => (
                  <BuyCardItem key={index} activityData={activity} status="redeem" />
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
              <Typography>No items purchased.</Typography>
            )}
          </TabPanel> */}
            <TabPanel value={value} index={0}>
              {allActivity.sales.length > 0 ? (
                <>
                  {allActivity.sales.map((activity, index) => (
                    <BuyCardItem key={index} activityData={activity} status="buyandredeem" />
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
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={10}
                    md={12}
                    lg={12}
                    sx={{ background: "#22282C", borderRadius: "5px", height: "200px", textAlign: "center" }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                      <Typography
                        variant="h3"
                        mt={1}
                        component="div"
                        sx={{
                          textAlign: { xs: "center", md: "left", sm: "center" },
                          fontFamily: theme?.typography.appText,
                          textTransform: "none"
                        }}
                      >
                        No items purchased
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {allActivity.sales.length > 0 ? (
                <>
                  {allActivity.sales.map((activity, index) => (
                    <BuyCardItem key={index} activityData={activity} status="return" />
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
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={10}
                    md={12}
                    lg={12}
                    sx={{ background: "#22282C", borderRadius: "5px", height: "200px", textAlign: "center" }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                      <Typography
                        variant="h3"
                        mt={1}
                        component="div"
                        sx={{
                          textAlign: { xs: "center", md: "left", sm: "center" },
                          fontFamily: theme?.typography.appText,
                          textTransform: "none"
                        }}
                      >
                        No activities found.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </TabPanel>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default MyActivity;
