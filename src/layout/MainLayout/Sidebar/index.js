import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
import { drawerWidth } from "store/constant";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { MENU_TYPE } from "store/actions";

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);
  const [navType] = useState(customization.navType);
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    dispatch({ type: MENU_TYPE, navType });
  }, [dispatch, navType]);

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
            paddingLeft: "16px",
            paddingRight: "16px"
          }}
        >
          <div style={{ paddingBottom: "50%" }}>
            <MenuList sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }} />
          </div>
          {/* <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#98A2B2" }}>
                  <QuizIcon sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }} />
                </ListItemIcon>
                <Typography
                  className="icons sidebartitle"
                  sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }}
                  variant="body1"
                >
                  FAQ
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#98A2B2" }}>
                  <ChatIcon sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }} />
                </ListItemIcon>
                <Typography
                  className="icons sidebartitle"
                  sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }}
                >
                  Contact
                </Typography>
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                background: customization.navType == "light" ? "#f3f3f3" : "#020508",
                borderRadius: "120px",
                mb: 3,
                padding: "3%"
              }}
            >
              <ListItemButton
                onClick={() => setNavType("light")}
                sx={{ background: customization.navType == "light" ? "white" : "", borderRadius: "150px" }}
              >
                <ListItemIcon>
                  <LightModeIcon sx={{ color: customization.navType == "light" ? "#000" : "#98A2B2" }} />
                </ListItemIcon>

                <span style={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }}>Light</span>
              </ListItemButton>
              <ListItemButton
                sx={{ ml: 2, background: customization.navType == "dark" ? "#181C1F" : "", borderRadius: "150px" }}
                onClick={() => setNavType("dark")}
              >
                <ListItemIcon>
                  <DarkModeIcon sx={{ color: customization.navType == "dark" ? "#98A2B2" : "#000" }} />
                </ListItemIcon>
                <span style={{ color: customization.navType == "dark" ? "#98A2B2" : "#000" }}>Dark</span>
              </ListItemButton>
            </ListItem>
            <Divider></Divider>
            <ListItem disablePadding sx={{ mt: 3 }}>
              <ListItemButton>
                <ListItemIcon>
                  <ArticleIcon sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }} />
                </ListItemIcon>

                <Typography
                  className="icons sidebartitle"
                  sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }}
                >
                  Terms of services
                </Typography>
              </ListItemButton>
            </ListItem>
          </List> */}
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : "auto" }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "9c6a36",
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "88px"
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
