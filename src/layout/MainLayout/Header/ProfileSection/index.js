import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import User1 from "assets/images/Ellipse.png";
import { logout } from "../../../../redux/auth/actions";

// assets
import { IconLogout, IconSettings, IconKey } from "@tabler/icons";
import { useWeb3 } from "utils/MagicProvider";
// import { useSDK } from "@metamask/sdk-react";
import { useActiveWallet, useActiveAccount, useDisconnect } from "thirdweb/react";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const account = useActiveWallet();
  const {disconnect} = useDisconnect();
  const theme = useTheme();
  const { magic } = useWeb3();
  // const { sdk } = useSDK({});
  const customization = useSelector((state) => state.customization);
  const userData = useSelector((state) => state.auth);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async() => {
    try {
      if (account) {
        await account.disconnect()
        disconnect(account)
      }
      dispatch(logout());
      navigate("/")
      // window.location.href = "/login"
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = "") => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== "") {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleRevealPrivatekey = async () => {
    try {
      await magic.user.revealPrivateKey();
    } catch (error) {
      console.log(error);
    }
  };
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  var myDate = new Date();
  var hrs = myDate.getHours();
  var greet;

  if (hrs < 12) {
    greet = "Good Morning";
  } else if (hrs >= 12 && hrs <= 17) {
    greet = "Good Afternoon";
  } else if (hrs >= 17 && hrs <= 24) {
    greet = "Good Evening";
  }

  return (
    <>
      <Chip
        className="chip"
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light
            }
          },
          "& .MuiChip-label": {
            lineHeight: 0
          }
        }}
        icon={
          theme.palette.mode === "dark" ? (
            <img
              alt="ew"
              src={userData?.user?.UserProfile?.profileImg || User1}
              width="32px"
              height="32px"
              style={{ borderRadius: "50%", border: "2px solid white", objectFit: "cover" }}
            />
          ) : (
            <img
              alt="ewa"
              src={userData?.user?.UserProfile?.profileImg || User1}
              width="32px"
              height="32px"
              style={{ borderRadius: "50%", border: "2px solid black", objectFit: "cover" }}
            />
          )
        }
        label={<IconSettings stroke={1.5} size="1.5rem" sx={{ color: "" }} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4" sx={{ color: "#FFC107" }} className="HeaderFonts">
                          {greet},
                        </Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 500 }} className="HeaderFonts">
                          {userData?.user.firstName}
                        </Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 500 }} className="HeaderFonts">
                          {userData?.user.lastName}
                        </Typography>
                      </Stack>

                      <Typography variant="subtitle2" className="HeaderFonts">
                        {userData?.user.role === "Super Admin"
                          ? "Super Admin"
                          : userData?.user.role === "Sub Admin"
                            ? "Sub Admin"
                            : userData?.user.role === "Brand Admin"
                              ? "Brand Admin"
                              : "Null"}
                      </Typography>
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: "100%", maxHeight: "calc(100vh - 250px)", overflowX: "hidden" }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: "100%",
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: "10px",
                          [theme.breakpoints.down("md")]: {
                            minWidth: "100%"
                          },
                          "& .MuiListItemButton-root": {
                            mt: 0.5
                          }
                        }}
                      >
                        {userData?.user.role === "Sub Admin" && (
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0, "/addresses")}
                          >
                            <ListItemIcon>
                              <HomeIcon stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" className="HeaderFonts">
                                  Add Warehouse Address
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        )}
                        {userData?.user.role === "Sub Admin" && loginMethod === "MAGIC" && (
                          <ListItemButton
                            sx={{ borderRadius: `${customization.borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={() => handleRevealPrivatekey()}
                          >
                            <ListItemIcon>
                              <IconKey stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" className="HeaderFonts">
                                  Export Private Key
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        )}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 1, "/ChangePassword")}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" className="HeaderFonts">
                                Change Password
                              </Typography>
                            }
                          />
                        </ListItemButton>

                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout className="logouticon" stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" className="HeaderFonts">
                                Logout
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
