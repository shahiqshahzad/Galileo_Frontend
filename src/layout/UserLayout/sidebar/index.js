import { Grid, Box } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { MENU_TYPE } from "store/actions";
import Tooltip from "@mui/material/Tooltip";
import { logout } from "redux/auth/actions";
import { useWeb3 } from "utils/MagicProvider";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

// import { useSDK } from "@metamask/sdk-react";

const SideBar = () => {
  const account = useActiveWallet();
  const {disconnect } = useDisconnect()

  const { magic } = useWeb3();
  // const { sdk } = useSDK();
  const navigate = useNavigate();
  const [color] = useState("#2196f3");
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const customization = useSelector((state) => state.customization);
  const auth = useSelector((state) => state.auth.user);
  const [navType] = useState(customization.navType);

  useEffect(() => {
    dispatch({ type: MENU_TYPE, navType });
  }, [dispatch, navType]);

  const handleLogout = () => {
    if (account) {
      disconnect(account)
    }
    dispatch(logout());
    // magic?.user?.logout();
    // sdk?.disconnect();
    localStorage.removeItem("userClickedLater");
    window.location.href = "/login";
  };

  const sidebarItems = [
    location.pathname === "/"
      ? { pathName: "/", icon: Icons.home, label: "Home" }
      : { pathName: "/home", icon: Icons.home, label: "Home" },
    { pathName: "/marketplace", icon: Icons.marketPlace, label: "Marketplace" },
    // { pathName: "/ComingSoon", icon: Icons.comingSoon, label: "ComingSoon" },
    {
      pathName: "/myactivity",
      icon: Icons.sideBarActivityIcon,
      label: "My Activity",
      condition: auth?.role === "User"
    }
    // { pathName: '/chart', icon: Icons.pieChart, label: 'Coming Soon' }
    // { pathName: '/tags', icon: Icons.label, label: 'Coming Soon' },
    // { pathName: '/settings', icon: Icons.settings, label: 'Coming Soon' },
    // { pathName: '/tracknft', icon: Icons.trackNft, label: 'Track NFT' }
  ];
  return (
    <>
      <Grid
        className="sidebar"
        container
        alignItems="center"
        sx={{
          ml: 2,
          mr: 2,
          width: "5.3vw",
          "@media (max-width:1350px)": {
            width: "6vw"
          },
          "@media (max-width:1150px)": {
            width: "6.3vw"
          },
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
          display: "block",
          backgroundColor: `${theme.palette.mode === "dark" ? "#181C1F" : "#ffffff"}`,
          borderRadius: "4px",
          height: "80vh"
        }}
      >
        <Grid item xs={12} sx={{ height: "65vh", mt: 3 }}>
          {sidebarItems.map(
            (item, index) =>
              (item.condition === undefined || item.condition) && (
                <Grid
                  key={index}
                  item
                  sx={{
                    mt: "8px",
                    paddingLeft: "0 ! important",
                    textAlign: "center",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(item.pathName)}
                >
                  <Box
                    className="barHeight"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1.2vw",
                      width: "100%",
                      height: { xl: "62px", md: "40px" },
                      position: "relative"
                    }}
                  >
                    <Box
                      className="barHeight"
                      sx={{
                        position: "absolute",
                        left: "0px",
                        height: { xl: "62px", md: "40px" },
                        width: { xl: "12px", md: "9px" },
                        padding: "3px",
                        background:
                          item.pathName === location.pathname
                            ? "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)"
                            : "transparent",
                        borderRadius: "0px 5px 5px 0px"
                      }}
                    ></Box>
                    <Tooltip className="fontsize" title={item.label} placement="right" arrow>
                      <span
                        className={`${item.pathName === location.pathname ? "selected-icon" : ""}`}
                        style={{
                          color: `${item.pathName === location.pathname ? color : ""}`,
                          alignSelf: "center"
                        }}
                      >
                        {item.icon}
                      </span>
                    </Tooltip>
                  </Box>
                </Grid>
              )
          )}

          {/* <Grid
            item
            sx={{
              mt: 8,
              mb: 2,
              paddingLeft: "0 ! important",
              textAlign: "center"
            }}
          >
            {customization.navType == "dark" ? (
              <>
                <Tooltip className="fontsize" title="light" placement="right" arrow>
                  <DarkModeIcon
                    style={{
                      color: `${color}`,
                      cursor: "pointer",
                      fontSize: { xl: "40px" }
                    }}
                    onClick={() => setNavType("light")}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                {" "}
                <Tooltip className="fontsize" title="Dark" placement="right" arrow>
                  <WbSunnyIcon style={{ color: `${color}`, cursor: "pointer" }} onClick={() => setNavType("dark")} />
                </Tooltip>{" "}
              </>
            )}
          </Grid> */}
        </Grid>
        <Grid item xs={12} mt={3}>
          {token != null && (
            <Grid
              item
              sx={{
                paddingLeft: "0 ! important",
                textAlign: "center",
                cursor: "pointer"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Tooltip className="fontsize" title="Logouts" placement="right" arrow>
                  <span onClick={handleLogout}>{Icons.logout}</span>
                </Tooltip>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default SideBar;
