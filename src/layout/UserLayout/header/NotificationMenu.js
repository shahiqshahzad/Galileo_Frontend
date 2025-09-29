import React from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Badge,
  Button,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Tab,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import { Icons } from "../../../shared/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteNotification,
  getNotifications,
  notificationAllRead,
  notificationChangeStatus
} from "redux/marketplace/actions";
import moment from "moment";
import { useNavigate } from "react-router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NotificationMenu = ({ notificationDrop, setNotificationDrop, isNotificationOpen }) => {
  const [notificationValue, setNotificationValue] = useState("All");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const notifications = useSelector((state) => state.marketplaceReducer.notifications);
  const currentDate = moment();
  useEffect(() => {
    dispatch(getNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (notificationId, value) => {
    dispatch(deleteNotification({ notificationId, value }));
  };
  const handleNotificationStatus = (id, navigateLink) => {
    navigate(navigateLink);
    handleCloseNotification();
    dispatch(notificationChangeStatus({ id }));
  };
  const handleCloseNotification = () => {
    setNotificationDrop(null);
    setNotificationValue("All");
  };
  return (
    <Menu
      anchorEl={notificationDrop}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      sx={{ top: "3.5%", left: "2%" }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      PaperProps={{
        style: {
          width: isMediumScreen ? "30%" : "100% ",
          borderRadius: "5px"
        }
      }}
      open={isNotificationOpen}
      onClose={handleCloseNotification}
    >
      <MenuItem sx={{ textAlign: "right", display: "flex", alignItems: "center" }}>
        <ListItemText sx={{ textAlign: "right", cursor: "pointer" }}>
          <Typography variant="body1" onClick={() => dispatch(notificationAllRead())}>
            Mark all as read
          </Typography>
        </ListItemText>
        <ListItemIcon sx={{ ml: 1 }}>{Icons.NotificationTick}</ListItemIcon>
      </MenuItem>
      <TabContext value={notificationValue}>
        <TabList
          onChange={(e, newValue) => setNotificationValue(newValue)}
          aria-label="lab Notification value"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-evenly"
            }
          }}
        >
          <Tab
            sx={{ padding: "0px", overflow: "visible", minWidth: "auto" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 2 }}>All</Typography>
                <Badge
                  badgeContent={`${notifications?.allCount ? notifications.allCount : 0}`}
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
            sx={{ padding: "0px", overflow: "visible", minWidth: "auto" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography className="HeaderFonts" sx={{ mr: 2, color: "#FF2323" }}>
                  High Priority
                </Typography>
                <Badge
                  badgeContent={`${notifications?.highCount ? notifications.highCount : 0}`}
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
            sx={{ padding: "0px", overflow: "visible", minWidth: "auto" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography className="HeaderFonts" sx={{ mr: 2, color: "#6FFF2B" }}>
                  Medium Priority{" "}
                </Typography>
                <Badge
                  badgeContent={`${notifications?.mediumCount ? notifications.mediumCount : 0}`}
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
            sx={{ padding: "0px", overflow: "visible", minWidth: "auto" }}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography className="HeaderFonts" sx={{ mr: 2, color: "#FFA620" }}>
                  Low Priority
                </Typography>
                <Badge
                  badgeContent={`${notifications?.lowCount ? notifications.lowCount : 0}`}
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
          {notifications?.all?.length !== 0 ? (
            <Grid container rowSpacing={2}>
              {notifications?.all?.map((n, index) => (
                <React.Fragment key={n.id}>
                  {index !== 0 && (
                    <Grid item xs={12} mt={2}>
                      <Divider />
                    </Grid>
                  )}
                  <Grid item xs={2}>
                    {n.severity === "HighPriority" && Icons.notificationHight}
                    {n.severity === "LowPriority" && Icons.notificationLow}
                    {n.severity === "MediumPriority" && Icons.notificationMedium}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className="HeaderFonts">{n.detail}</Typography>
                    <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                      <Typography className="HeaderFonts" variant="subtitle2">
                        {n.type}
                      </Typography>
                      <Box
                        as="div"
                        sx={{ height: "4px", width: "4px", borderRadius: "50%", background: "gray", ml: 1 }}
                      ></Box>
                      <Typography className="HeaderFonts" sx={{ ml: 0.5 }} variant="subtitle2">
                        {moment(n.createdAt).isSame(currentDate, "day")
                          ? moment(n.createdAt).format("[Today at] h:mm A")
                          : moment(n.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                      </Typography>
                    </Box>
                    <Button
                      className="HeaderFonts"
                      variant="outlined"
                      color="inherit"
                      onClick={() => handleDelete(n.id, "High")}
                    >
                      Clear
                    </Button>
                    <Button
                      className="HeaderFonts"
                      variant="contained"
                      color={n.isRead ? "inherit" : "primary"}
                      sx={{ ml: 2 }}
                      onClick={() => handleNotificationStatus(n.id, n.redirectUrl)}
                    >
                      View
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          ) : (
            <Grid container rowSpacing={2}>
              <Grid item>
                <Typography className="HeaderFonts">No Notifications</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        <TabPanel value="High">
          {notifications?.high?.length !== 0 ? (
            <Grid container rowSpacing={2}>
              {notifications?.high?.map((n) => (
                <React.Fragment key={n.id}>
                  <Grid item xs={2}>
                    {n.severity === "HighPriority" && Icons.notificationHight}
                    {n.severity === "LowPriority" && Icons.notificationLow}
                    {n.severity === "MediumPriority" && Icons.notificationMedium}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className="HeaderFonts">{n.detail}</Typography>
                    <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                      <Typography className="HeaderFonts" variant="subtitle2">
                        {n.type}
                      </Typography>
                      <Box
                        as="div"
                        sx={{ height: "4px", width: "4px", borderRadius: "50%", background: "gray", ml: 1 }}
                      ></Box>
                      <Typography className="HeaderFonts" sx={{ ml: 0.5 }} variant="subtitle2">
                        {moment(n.createdAt).isSame(currentDate, "day")
                          ? moment(n.createdAt).format("[Today at] h:mm A")
                          : moment(n.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                      </Typography>
                    </Box>
                    <Button
                      className="HeaderFonts"
                      variant="outlined"
                      color="inherit"
                      onClick={() => handleDelete(n.id, "High")}
                    >
                      Clear
                    </Button>
                    <Button
                      className="HeaderFonts"
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
          ) : (
            <Grid container rowSpacing={2}>
              <Grid item>
                <Typography className="HeaderFonts">No Notifications</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value="Medium">
          {notifications?.medium?.length !== 0 ? (
            <Grid container rowSpacing={2}>
              {notifications?.medium?.map((n) => (
                <React.Fragment key={n.id}>
                  <Grid item xs={2}>
                    {n.severity === "HighPriority" && Icons.notificationHight}
                    {n.severity === "LowPriority" && Icons.notificationLow}
                    {n.severity === "MediumPriority" && Icons.notificationMedium}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className="HeaderFonts">{n.detail}</Typography>
                    <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                      <Typography className="HeaderFonts" variant="subtitle2">
                        {n.type}
                      </Typography>
                      <Box
                        as="div"
                        sx={{ height: "4px", width: "4px", borderRadius: "50%", background: "gray", ml: 1 }}
                      ></Box>
                      <Typography className="HeaderFonts" sx={{ ml: 0.5 }} variant="subtitle2">
                        {moment(n.createdAt).isSame(currentDate, "day")
                          ? moment(n.createdAt).format("[Today at] h:mm A")
                          : moment(n.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                      </Typography>
                    </Box>
                    <Button
                      className="HeaderFonts"
                      variant="outlined"
                      color="inherit"
                      onClick={() => handleDelete(n.id, "Medium")}
                    >
                      Clear
                    </Button>
                    <Button
                      className="HeaderFonts"
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
          ) : (
            <Grid container rowSpacing={2}>
              <Grid item>
                <Typography className="HeaderFonts">No Notifications</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value="Low">
          {notifications?.low?.length !== 0 ? (
            <Grid container rowSpacing={2}>
              {notifications?.low?.map((n) => (
                <React.Fragment key={n.id}>
                  <Grid item xs={2}>
                    {n.severity === "HighPriority" && Icons.notificationHight}
                    {n.severity === "LowPriority" && Icons.notificationLow}
                    {n.severity === "MediumPriority" && Icons.notificationMedium}
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className="HeaderFonts">{n.detail}</Typography>
                    <Box sx={{ my: 0.5, display: "flex", alignItems: "center" }}>
                      <Typography className="HeaderFonts" variant="subtitle2">
                        {n.type}
                      </Typography>
                      <Box
                        as="div"
                        sx={{ height: "4px", width: "4px", borderRadius: "50%", background: "gray", ml: 1 }}
                      ></Box>
                      <Typography className="HeaderFonts" sx={{ ml: 0.5 }} variant="subtitle2">
                        {moment(n.createdAt).isSame(currentDate, "day")
                          ? moment(n.createdAt).format("[Today at] h:mm A")
                          : moment(n.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                      </Typography>
                    </Box>
                    <Button
                      className="HeaderFonts"
                      variant="outlined"
                      color="inherit"
                      onClick={() => handleDelete(n.id, "Low")}
                    >
                      Clear
                    </Button>
                    <Button
                      className="HeaderFonts"
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
          ) : (
            <Grid container rowSpacing={2}>
              <Grid item>
                <Typography className="HeaderFonts">No Notifications</Typography>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </TabContext>
      <Typography
        className="HeaderFonts"
        onClick={() => navigate("/notifications")}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
      >
        See all <ExpandMoreIcon />
      </Typography>
    </Menu>
  );
};

export default NotificationMenu;
