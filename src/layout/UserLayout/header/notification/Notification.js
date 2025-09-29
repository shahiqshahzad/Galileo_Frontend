/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Badge, Box, Button, Divider, Grid, Tab, Typography } from "@mui/material";
import { Icons } from "../../../../shared/Icons/Icons";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  clearNotifications,
  deleteSeparateNotification,
  getSeparateNotification,
  notificationChangeStatus
} from "redux/marketplace/actions";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";

const Notification = () => {
  const [notificationValue, setNotificationValue] = useState("All");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pageRef = useRef(1);
  const pageHigh = useRef(1);
  const pageLow = useRef(1);
  const pageMedium = useRef(1);
  const notifications = useSelector((state) => state.marketplaceReducer.separateNotifications);
  const notificationsHigh = useSelector((state) => state.marketplaceReducer.separateHighNotifications);
  const notificationLow = useSelector((state) => state.marketplaceReducer.separateLowNotifications);
  const notificationMedium = useSelector((state) => state.marketplaceReducer.separateMediumNotifications);
  const notificationCount = useSelector((state) => state.marketplaceReducer.allCountNotification);

  const handleNotificationStatus = (id, navigateLink) => {
    dispatch(notificationChangeStatus({ id, navigateLink, navigate }));
  };
  const handleScrollHighNotification = () => {
    pageHigh.current = pageHigh.current + 1;
    dispatch(
      getSeparateNotification({ notificationValue, page: pageHigh.current, notifications: notificationsHigh.rows })
    );
  };
  const handleScrollAllNotification = () => {
    pageRef.current = pageRef.current + 1;
    dispatch(getSeparateNotification({ notificationValue, page: pageRef.current, notifications: notifications.rows }));
  };
  const handleScrollLowNotification = () => {
    pageLow.current = pageLow.current + 1;
    dispatch(
      getSeparateNotification({ notificationValue, page: pageLow.current, notifications: notificationLow.rows })
    );
  };
  const handleScrollMediumNotification = () => {
    pageMedium.current = pageMedium.current + 1;
    dispatch(
      getSeparateNotification({ notificationValue, page: pageMedium.current, notifications: notificationMedium.rows })
    );
  };

  function extractPriority(input) {
    const match = input.match(/(Medium|Low|High)Priority/);

    if (match && match[1]) {
      return match[1];
    }

    return input;
  }

  const handleDelete = (n) => {
    const notificationType = extractPriority(n.severity);
    let notification = [];
    let pages = 1;
    if (notificationType === "All") {
      notification = notifications.rows;
      pages = pageRef.current;
    } else if (notificationType === "Low") {
      notification = notificationLow.rows;
      pages = pageLow.current;
    } else if (notificationType === "Medium") {
      notification = notificationMedium.rows;
      pages = pageMedium.current;
    } else if (notificationType === "High") {
      notification = notificationsHigh.rows;
      pages = pageHigh.current;
    }
    dispatch(
      deleteSeparateNotification({
        id: n.id,
        notificationValue: notificationType,
        notifications: notification,
        page: pages,
        pageAll: pageRef.current
      })
    );
    // dispatch(deleteNotification({ id: n.id, severity: n.severity, notification }));
  };
  useEffect(() => {
    let targetArray, targetPage;

    switch (notificationValue) {
      case "All":
        targetArray = notifications.rows ? notifications.rows : [];
        targetPage = pageRef.current;
        break;
      case "High":
        targetArray = notificationsHigh.rows ? notificationsHigh.rows : [];
        targetPage = pageHigh.current;
        break;
      case "Low":
        targetArray = notificationLow.rows ? notificationLow.rows : [];
        targetPage = pageLow.current;
        break;
      case "Medium":
        targetArray = notificationMedium.rows ? notificationMedium.rows : [];
        targetPage = pageMedium.current;
        break;
      default:
        targetArray = [];
        targetPage = 1;
    }

    if (targetArray.length === 0) {
      dispatch(getSeparateNotification({ notificationValue, page: targetPage, notifications: targetArray }));
    }
  }, [notificationValue]);

  useEffect(() => {
    return () => {
      dispatch(clearNotifications());
    };
  }, []);
  return (
    <Grid container justifyContent="center" mt={3}>
      <Grid item xs={12} md={10}>
        <h1>Notification</h1>
        <TabContext value={notificationValue}>
          <TabList onChange={(e, newValue) => setNotificationValue(newValue)} aria-label="lab Notification value">
            <Tab
              sx={{ marginRight: "40px", overflow: "visible", minWidth: "auto" }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, fontSize: "16px" }}>All</Typography>
                  <Badge
                    badgeContent={`${notificationCount.totalNotifications ? notificationCount.totalNotifications : 0}`}
                    sx={{
                      "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "#46494C",
                        fontSize: "12px"
                      }
                    }}
                  />
                </Box>
              }
              value="All"
            />
            <Tab
              sx={{ marginRight: "40px", overflow: "visible", minWidth: "auto" }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, color: "#FF2323" }}>High Priority</Typography>
                  <Badge
                    badgeContent={`${notificationCount.highSeverityCount ? notificationCount.highSeverityCount : 0}`}
                    sx={{
                      "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "#FF2323"
                      }
                    }}
                  />
                </Box>
              }
              value="High"
            />
            <Tab
              sx={{ marginRight: "40px", overflow: "visible", minWidth: "auto" }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, color: "#6FFF2B" }}>Medium Priority </Typography>
                  <Badge
                    badgeContent={`${notificationCount.mediumSeverityCount ? notificationCount.mediumSeverityCount : 0}`}
                    sx={{
                      "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "#6FFF2B"
                      }
                    }}
                  />
                </Box>
              }
              value="Medium"
            />
            <Tab
              sx={{ marginRight: "40px", overflow: "visible", minWidth: "auto" }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ mr: 2, color: "#FFA620" }}>Low Priority</Typography>
                  <Badge
                    badgeContent={`${notificationCount.lowSeverityCount ? notificationCount.lowSeverityCount : "0"}`}
                    sx={{
                      "& .MuiBadge-badge": {
                        color: "white",
                        backgroundColor: "#FFA620"
                      }
                    }}
                  />
                </Box>
              }
              value="Low"
            />
          </TabList>
          <TabPanel value="All">
            {notifications.rows.length !== 0 && notifications ? (
              <InfiniteScroll
                next={handleScrollAllNotification}
                hasMore={notifications.count === notifications.rows.length ? false : true}
                dataLength={notifications.rows.length}
                loader={<h4>Loading</h4>}
              >
                <Grid container rowSpacing={2}>
                  {notifications.rows.map((n, i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={1}>
                        {n.severity === "HighPriority" && Icons.notificationHight}
                        {n.severity === "LowPriority" && Icons.notificationLow}
                        {n.severity === "MediumPriority" && Icons.notificationMedium}
                      </Grid>
                      <Grid item xs={11}>
                        <Typography>{n.detail}</Typography>
                        <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                          {/* <Typography variant="subtitle2">{n.type}</Typography> */}
                          <Typography variant="subtitle2">{moment(n.createdAt).format("MMMM D, YYYY")}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleDelete(n)}>
                          Clear
                        </Button>
                        <Button
                          variant="contained"
                          color={n.isRead ? "inherit" : "primary"}
                          sx={{ ml: 2 }}
                          onClick={() => handleNotificationStatus(n.id, n.redirectUrl)}
                        >
                          View
                        </Button>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Divider />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <Grid container rowSpacing={2}>
                <Grid item>
                  <Typography>No Notifications</Typography>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value="High">
            {notificationsHigh?.rows?.length !== 0 && notificationsHigh ? (
              <InfiniteScroll
                next={handleScrollHighNotification}
                hasMore={notificationsHigh.count === notificationsHigh.rows.length ? false : true}
                dataLength={notificationsHigh?.rows?.length}
                loader={<h4>Loading</h4>}
              >
                <Grid container rowSpacing={2}>
                  {notificationsHigh?.rows?.map((n, i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={1}>
                        {n.severity === "HighPriority" && Icons.notificationHight}
                        {n.severity === "LowPriority" && Icons.notificationLow}
                        {n.severity === "MediumPriority" && Icons.notificationMedium}
                      </Grid>
                      <Grid item xs={11}>
                        <Typography>{n.detail}</Typography>
                        <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">{moment(n.createdAt).format("MMMM D, YYYY ")}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleDelete(n)}>
                          Clear
                        </Button>
                        <Button
                          variant="contained"
                          color={n.isRead ? "inherit" : "primary"}
                          sx={{ ml: 2 }}
                          onClick={() => handleNotificationStatus(n.id, n.redirectUrl)}
                        >
                          View
                        </Button>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Divider />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <Grid container rowSpacing={2}>
                <Grid item>
                  <Typography>No Notifications</Typography>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value="Medium">
            {notificationMedium.rows.length !== 0 ? (
              <InfiniteScroll
                next={handleScrollMediumNotification}
                hasMore={notificationMedium.count === notificationMedium.rows.length ? false : true}
                dataLength={notificationMedium.rows.length}
                loader={<h4>Loading</h4>}
              >
                <Grid container rowSpacing={2}>
                  {notificationMedium.rows.map((n, i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={1}>
                        {n.severity === "HighPriority" && Icons.notificationHight}
                        {n.severity === "LowPriority" && Icons.notificationLow}
                        {n.severity === "MediumPriority" && Icons.notificationMedium}
                      </Grid>
                      <Grid item xs={11}>
                        <Typography>{n.detail}</Typography>
                        <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">{moment(n.createdAt).format("MMMM D, YYYY ")}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleDelete(n)}>
                          Clear
                        </Button>
                        <Button variant="contained" color={n.isRead ? "inherit" : "primary"} sx={{ ml: 2 }}>
                          View
                        </Button>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Divider />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <Grid container rowSpacing={2}>
                <Grid item>
                  <Typography>No Notifications</Typography>
                </Grid>
              </Grid>
            )}
          </TabPanel>
          <TabPanel value="Low">
            {notificationLow.rows.length !== 0 ? (
              <InfiniteScroll
                next={handleScrollLowNotification}
                hasMore={notificationLow.count === notificationLow.rows.length ? false : true}
                dataLength={notificationLow.rows.length}
                loader={<h4>Loading</h4>}
              >
                <Grid container rowSpacing={2}>
                  {notificationLow.rows.map((n, i) => (
                    <React.Fragment key={i}>
                      <Grid item xs={1}>
                        {n.severity === "HighPriority" && Icons.notificationHight}
                        {n.severity === "LowPriority" && Icons.notificationLow}
                        {n.severity === "MediumPriority" && Icons.notificationMedium}
                      </Grid>
                      <Grid item xs={11}>
                        <Typography>{n.detail}</Typography>
                        <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                          <Typography variant="subtitle2">{moment(n.createdAt).format("MMMM D, YYYY ")}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleDelete(n)}>
                          Clear
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          sx={{ ml: 2 }}
                          onClick={() => handleNotificationStatus(n.id, n.redirectUrl)}
                        >
                          View
                        </Button>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Divider />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </InfiniteScroll>
            ) : (
              <Grid container rowSpacing={2}>
                <Grid item>
                  <Typography>No Notifications</Typography>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Notification;
