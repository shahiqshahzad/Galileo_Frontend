/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { setWallet } from "../../../redux/auth/actions";
import { ethers, utils } from "ethers";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import userHeader from "assets/images/userHeader.png";
import personuser from "assets/images/person_user.png";
import galileoLogo from "assets/images/profile/logoG.svg";
import changePasswordIcon from "assets/images/icons/change-password.svg";
import Drawer from "../drawer/drawer";
import { logout } from "redux/auth/actions";
import NFTDropdown from "./countriesDropdown";
import { useSelector, useDispatch } from "react-redux";
import { Button, ListItemIcon, Tooltip } from "@mui/material";
import { Helmet } from "react-helmet";
// import MetaMask from 'shared/metaMaskwithBalance';
import { useEffect, useRef } from "react";
import { styled as stylee } from "@mui/system";
import { MENU_OPEN, SNACKBAR_OPEN } from "store/actions";
import Erc20 from "../../../contractAbi/Erc20.json";
import BLOCKCHAIN from "../../../../src/constants";
import { withStyles } from "@material-ui/core/styles";
import { Icons } from "../../../shared/Icons/Icons";
import NotificationMenu from "./NotificationMenu";
import { getAllCartItems, notificationCountIcon } from "redux/marketplace/actions";
// import SocketSvg from "./SocketSvg";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { CHAIN_IDS, RPC_URLS, NETWORKS_INFO } from "utils/constants";
import { copyToClipboard } from "utils/utilFunctions";
import SearchField from "./SearchField";
import { IconKey } from "@tabler/icons";
import { useWalletBalance, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { client } from "utils/thirdWebClient";
import ThirdWebConnectButton from "views/auth/login/component/thirdWebConnectButton";



const CustomTypography = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#44494c",
    color: "white"
  }
}))(Tooltip);

const SquareIconButton = stylee(IconButton)(({ theme }) => ({
  width: "38px",
  height: "38px",
  borderRadius: "8px",
  background: theme.palette.action.hover
}));

export default function Header() {
  const account = useActiveWallet();
  const {disconnect } = useDisconnect()
  const activeAccount = useActiveAccount();
  const inputRef = useRef(null);
  const { data, isLoading, isError } = useWalletBalance({
    chain: process.env.REACT_APP_MAINNET === "0" ? polygonAmoy : polygon,
    address: activeAccount?.address,
    client,
    tokenAddress: BLOCKCHAIN.USDC_ERC20,
  });
  const { data: matic, isLoading: loading, isError: error } = useWalletBalance({
    chain: process.env.REACT_APP_MAINNET === "0" ? polygonAmoy : polygon,
    address: activeAccount?.address,
    client,
    // tokenAddress: BLOCKCHAIN.USDC_ERC20,
  });
  const balanceValue = Number(data?.displayValue);
  const maticValue = Number(matic?.displayValue);
  const walletAddress = activeAccount?.address

  const { magic, provider, setProvider } = useWeb3();
  const { sdk, connected } = useSDK();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // getAllCartItems
  const handleLogout = () => {
    if (account) {
      disconnect(account)
    }
    dispatch(logout());
    localStorage.removeItem("userClickedLater");
    // sdk?.disconnect();
    window.location.href = "/login";
  };
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  // console.log({logedMethooood: loginMethod})
  const userWalletAddress = useSelector((state) => state.auth?.walletAddress);

  const cartItems = useSelector((state) => state.marketplaceReducer.cartItems);

  const [anchorEl, setAnchorEl] = useState(null);
  const [groupedCartItems, setGroupedCartItems] = useState([]);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  // const [walletAddress, setWalletAddress] = useState();
  // const [balanceValue, setbalanceValue] = useState();
  // const [maticValue, setMaticValue] = useState();

  const [notificationDrop, setNotificationDrop] = useState(null);
  const isNotificationOpen = Boolean(notificationDrop);
  const notificationsIconss = useSelector((state) => state.marketplaceReducer.notificationIconCount);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // useEffect(() => {
  //   (async () => {
  //     // Check if user is logged in
  //     // Metamask is connected to browser
  //     // Connected network is amoy
  //     if (provider && token) {
  //       handleConnect();
  //     }
  //   })();
  // }, [token, provider]);

  // useEffect(() => {
  //   console.log("Proverddddddddd from addupdate")
  //   console.log(provider)
  //   if(provider) {
  //     setSigner(provider?.getSigner())
  //   }
  // }, [provider]);

  // const promptSwitchNetwork = () => {
  //   window.ethereum
  //     .request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: NETWORKS_INFO.chainId }]
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         handleConnect();
  //       }, 1000);
  //     })
  //     .catch((error) => {
  //       if (error.code === 4902) {
  //         // Chain not added error code
  //         window.ethereum
  //           .request({
  //             method: "wallet_addEthereumChain",
  //             params: [
  //               {
  //                 chainId: NETWORKS_INFO.chainId,
  //                 chainName: NETWORKS_INFO.chainName,
  //                 nativeCurrency: {
  //                   name: "MATIC",
  //                   symbol: "MATIC",
  //                   decimals: 18
  //                 },
  //                 rpcUrls: [NETWORKS_INFO.rpcUrls],
  //                 blockExplorerUrls: [NETWORKS_INFO.blockExplorerUrl]
  //               }
  //             ]
  //           })
  //           .then(() => {
  //             console.log("Added and switched to Polygon mainnet");
  //             setTimeout(() => {
  //               handleConnect();
  //             }, 1000);
  //           })
  //           .catch((addError) => {
  //             console.error("Failed to add and switch to Polygon mainnet:", addError.message);
  //           });
  //       } else {
  //         console.error("Failed to switch to Polygon mainnet:", error.message);
  //       }
  //     });
  // };

  // const handleConnect = async () => {
  //   if (["DIRECT", "GOOGLE"].includes(loginMethod) && !connected) {
  //     try {
  //       await sdk.connect();
  //     } catch (error) {
  //       console.log(error);
  //       return;
  //     }
  //     if (connected) {
  //       setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //       console.log("Calling handle connect again");
  //       handleConnect();
  //     }
  //   } else if (
  //     ["DIRECT", "GOOGLE"].includes(loginMethod) &&
  //     window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID
  //   ) {
  //     promptSwitchNetwork();

  //     dispatch({
  //       type: SNACKBAR_OPEN,
  //       open: true,
  //       message: `Please switch to ${NETWORKS_INFO.chainName} network from your metamask`,
  //       variant: "alert",
  //       alertSeverity: "info"
  //     });
  //     // setWalletAddress();
  //     dispatch(setWallet(null));
  //   } else if (provider?.provider?.isMagic || connected) {
  //     try {
  //       const signer = await provider.getSigner();
  //       const address = await signer.getAddress();
  //       // setWalletAddress(address);
  //       dispatch(setWallet(address));

  //       const maticprovider = ethers.getDefaultProvider(RPC_URLS.POLYGON_RPC_URL);
  //       const maticbalance = await maticprovider?.getBalance(address);
  //       const maticvalue = ethers.utils?.formatEther(maticbalance);
  //       // setMaticValue(Number(maticvalue));
  //       // const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       // const signer = provider.getSigner();
  //       // const address = await signer?.getAddress();
  //       let erc20Address = BLOCKCHAIN.USDC_ERC20;

  //       const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

  //       let balance = await token.balanceOf(address);
  //       let value = utils.formatUnits(balance, 6);

  //       // setbalanceValue(Number(value));
  //       // dispatch({
  //       //     type: SNACKBAR_OPEN,
  //       //     open: true,
  //       //     message: 'Success',
  //       //     variant: 'alert',
  //       //     alertSeverity: 'success'
  //       // });
  //     } catch (error) {
  //       console.log(error, "user layout");
  //       if (error.reason === "unknown account #0") {
  //         try {
  //           await sdk.connect();
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     }
  //   }
  // };

  const handleConnectButtonFocus = () => {
    const button = inputRef.current.querySelector('button');
    button.click()
  }

  const handleProfileMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleRevealPrivateKey = async () => {
    handleMenuClose();
    try {
      await magic.user.revealPrivateKey();
    } catch (error) {
      console.log(error);
    }
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "black",
      color: "white",
      right: 5,
      top: 7,
      padding: "0 4px",
      height: 17,
      minWidth: 17,
      fontSize: 11,
      fontWeight: "bold",
      border: `2px solid ${theme.palette.mode === "dark" ? "#2A2E31" : "white"}`
    }
  }));
  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      id={menuId}
      sx={{ top: "2.2%" }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component={RouterLink} className="userName">
        {user?.firstName} {user?.lastName}
      </MenuItem>
      <MenuItem component={RouterLink} to="/creatorProfile" onClick={handleMenuClose} className="HeaderFonts">
        <ListItemIcon>{Icons.profile}</ListItemIcon>
        My Profile
      </MenuItem>
      <MenuItem component={RouterLink} to="/editProfile" onClick={handleMenuClose} className="HeaderFonts">
        <ListItemIcon>{Icons.edit}</ListItemIcon>
        Edit Profile
      </MenuItem>
      {loginMethod === "MAGIC" && (
        <MenuItem onClick={() => handleRevealPrivateKey()} className="HeaderFonts">
          <ListItemIcon>
            <IconKey stroke={1.5} size="1.5rem" color="#bdc8f0" />
          </ListItemIcon>
          Export Private Key
        </MenuItem>
      )}

      {user && user.signupMethod === "DIRECT" && (
        <MenuItem component={RouterLink} to="/changePassword" onClick={handleMenuClose}>
          <ListItemIcon>
            <img src={changePasswordIcon} alt="" style={{ paddingLeft: "2px" }} className="HeaderFonts" />
          </ListItemIcon>
          Change Password
        </MenuItem>
      )}

      {/* <MenuItem component={RouterLink} to="/deliveryDashboard" onClick={handleMenuClose}>
          <ListItemIcon>
            {Icons.delivery}
          </ListItemIcon>
          Delivery Dashboard
        </MenuItem>
      
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>{Icons.logoutNew}</ListItemIcon>
        Logout
      </MenuItem> */}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 
                new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        ></IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // useEffect(() => {
  //   const handleAccountsChanged = () => {
  //     handleConnect();
  //   };

  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", handleAccountsChanged);
  //   }

  //   // // Cleanup function to remove the event listener when component unmounts
  //   // return () => {
  //   //   if (window.ethereum) {
  //   //     window.ethereum.off("accountsChanged", handleAccountsChanged);
  //   //   }
  //   // };
  // }, [provider]);

  // useEffect(() => {
  //   if (token && userWalletAddress) {
  //     handleConnect();
  //   }
  // }, [token, userWalletAddress]);

  useEffect(() => {
    if (!connected && !provider?.provider?.isMagic) {
      // setWalletAddress();
    }
  }, [connected]);

  useEffect(() => {
    dispatch(getAllCartItems());
  }, []);

  useEffect(() => {
    // Create an object to store grouped cart items
    const updatedGroupedCartItems = {};

    // Iterate through the cartItems
    cartItems.forEach((item) => {
      const bulkId = item.Nft.bulkId;

      // If the bulkId is null or undefined, use a unique key to group such items
      const groupKey = bulkId || `uniqueKey_${item.id}`;

      // If the groupKey is not in the updatedGroupedCartItems, add it with the item
      if (!updatedGroupedCartItems[groupKey]) {
        // Clone the item and Nft objects
        updatedGroupedCartItems[groupKey] = {
          ...item,
          Nft: { ...item.Nft }
        };
      } else {
        // If the groupKey is already in the updatedGroupedCartItems, update the selectedQuantity
        updatedGroupedCartItems[groupKey].selectedQuantity += item.selectedQuantity;

        // Update the quantity with the biggest value
        updatedGroupedCartItems[groupKey].quantity = Math.max(
          updatedGroupedCartItems[groupKey].quantity,
          item.quantity
        );

        // Update the errorMessage property from the Nft object if it exists
        if (item.Nft.errorMessage) {
          updatedGroupedCartItems[groupKey].Nft.errorMessage = item.Nft.errorMessage;
        }
      }
    });

    // Convert the updatedGroupedCartItems object back to an array if needed
    const updatedGroupedCartItemsArray = Object.values(updatedGroupedCartItems);

    // Update the state with the grouped cart items
    setGroupedCartItems(updatedGroupedCartItemsArray);
  }, [cartItems]);
  const theme = useTheme();

  return (
    <>

      {/* <MetaMask open={metamask} setOpen={setMetamask} /> */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ backgroundColor: `${theme.palette.mode === "dark" ? "#181C1F" : "white"}`, borderRadius: "4px" }}
        >
          <Toolbar>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Galileo Marketplace</title>
              <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Box
              sx={{
                height: "3em",
                // paddingTop: '1em',
                width: "100%",
                marginLeft: "1%",
                display: "flex"
                // [theme.breakpoints.down('md')]: {
                //     width: 'auto'
                // }
              }}
            >
              <Grid container-fluid="true" sx={{ display: "flex", marginTop: "3px", alignItems: "center" }}>
                <Grid item sx={{ display: { lg: "none", md: "none" } }}>
                  <Drawer />
                </Grid>
                <Grid item md={2}>
                  {theme.palette.mode === "dark" ? (
                    <img
                      src={galileoLogo}
                      onClick={() => {
                        navigate("/home");
                      }}
                      alt="Galileo White Logo"
                      width="100"
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <img
                      src={galileoLogo}
                      onClick={() => {
                        navigate("/home");
                      }}
                      alt="Galileo Dark Logo"
                      width="100"
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </Grid>
              </Grid>
              <Box sx={{ flexGrow: 1, paddingLeft: 6 }}>
                <SearchField />
              </Box>

              <Box sx={{ paddingLeft: 6 }}>
                <NFTDropdown />
              </Box>

              <Box sx={{ flexGrow: 1 }} />
              {(user?.role === "Sub Admin" || "Brand Admin" || "Super Admin") &&
                user?.role !== "User" &&
                (token !== null || undefined) &&
                !/metamaskmobile/.test(window.navigator.userAgent.toLowerCase()) && (
                  <Box sx={{ marginTop: "3px" }}>
                    <SquareIconButton
                      onClick={() => {
                        if (user?.role === "Sub Admin") {
                          let url = `/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=draft`;
                          dispatch({ type: MENU_OPEN, id: "nftManagement" });
                          navigate(url);
                        } else {
                          dispatch({ type: MENU_OPEN, id: "subAdminManagement" });
                          navigate("/subAdminManagement");
                        }
                      }}
                      size="large"
                      aria-label=""
                      color="inherit"
                      sx={{ mx: 1 }}
                    >
                      <Badge>{Icons.dashboard}</Badge>
                    </SquareIconButton>
                  </Box>
                )}
              {(user?.role === "Sub Admin" || "Brand Admin" || "Super Admin" || "User") &&
                (token != null || undefined) && (
                  <>
                    <Box onClick={handleConnectButtonFocus} sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}>
                      <Box sx={{ opacity: 0, width:0 }} ref={inputRef}>
                        <ThirdWebConnectButton />
                      </Box>
                      {user?.walletAddress && walletAddress ? (
                        <Box
                          onClick={() => {
                            if (loginMethod === "MAGIC") {
                              magic?.wallet?.showUI();
                            } 
                            // else {
                            //   copyToClipboard(walletAddress);
                            // }
                          }}
                          sx={{
                            background: theme.palette.action.hover,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            mr: 0.5,
                            color: `${theme.palette.mode === "dark" ? "#ffffff" : "#000000"}`
                          }}
                        >
                          <Tooltip placement="top" title={loginMethod === "MAGIC" ? "Click to access wallet" : ""}>
                            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                              {walletAddress?.toLowerCase() !== user?.walletAddress?.toLowerCase() ? (
                                <CustomTypography title="This wallet is not registered" placement="top" arrow>
                                  <Box sx={{ display: "flex", position: "relative" }}>
                                    {Icons.wallet}
                                    <Box sx={{ position: "absolute", right: "2%", top: "-4%" }}>{Icons.evenodd}</Box>
                                  </Box>
                                </CustomTypography>
                              ) : (
                                Icons.wallet
                              )}

                              <Typography sx={{ ml: 1 }} className="HeaderFonts">
                                {balanceValue && (
                                  <>
                                    {balanceValue.toFixed(2)} <Box as="span">USDC</Box>
                                  </>
                                )}
                              </Typography>
                              <Box sx={{ borderRight: "1px solid  #575c5f", height: "22px", marginX: "5px" }}></Box>
                              <Typography className="HeaderFonts">
                                {/* {balanceValue && balanceValue.slice(0, 5)} <Box as="span">USDT</Box> */}
                                {maticValue && maticValue.toFixed(2)} <Box as="span">MATIC</Box>
                              </Typography>
                              <Box sx={{ borderRight: "1px solid  #575c5f", height: "22px", marginX: "5px" }}></Box>

                              <Typography className="HeaderFonts" sx={{ cursor: "pointer" }}>
                                {walletAddress && walletAddress.slice(0, 5) + "..." + walletAddress.slice(39, 42)}
                              </Typography>
                            </Box>
                          </Tooltip>

                          <Box sx={{ borderRight: "2px solid #575c5f", mx: 1, height: "100%" }}></Box>
                          <Box>
                            {token && user?.role === "Super Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                            {token && user?.role === "Sub Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                            {token && user?.role === "Brand Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}

                            {user?.role === "User" && user?.isVerified === false && (
                              <Button
                                size="large"
                                variant="outlined"
                                className="HeaderFonts"
                                onClick={() => {
                                  navigate("/login");
                                }}
                              >
                                Login
                              </Button>
                            )}

                            {token && user?.role === "User" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            background: theme.palette.action.hover,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            mr: 1,
                            color: `${theme.palette.mode === "dark" ? "#ffffff" : "#000000"}`
                          }}
                        >
                          {Icons.wallet}
                          {/* <Typography onClick={handleConnect} sx={{ px: 1, cursor: "pointer" }}>
                            Connect Wallet
                          </Typography> */}
                          <Box sx={{ borderRight: "2px solid #575c5f", mx: 1, height: "100%" }}></Box>

                          <Box>
                            {token && user?.role === "Super Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                            {token && user?.role === "Sub Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                            {token && user?.role === "Brand Admin" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                            <>
                              {user?.role === "User" && user?.isVerified === false && (
                                <Button
                                  size="large"
                                  variant="outlined"
                                  onClick={() => {
                                    navigate("/login");
                                  }}
                                >
                                  Login
                                </Button>
                              )}
                            </>
                            {token && user?.role === "User" && user?.isVerified === true && (
                              <>
                                {theme.palette.mode === "dark" ? (
                                  <img
                                    src={user?.UserProfile?.profileImg || userHeader}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid white",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                ) : (
                                  <img
                                    src={user?.UserProfile?.profileImg || personuser}
                                    alt=""
                                    height="25"
                                    width="25"
                                    style={{
                                      display: "inlineBlock",
                                      marginTop: "3px",
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      objectFit: "cover"
                                    }}
                                    onClick={handleProfileMenuOpen}
                                  />
                                )}
                              </>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SquareIconButton
                        size="large"
                        aria-label="notification"
                        color="inherit"
                        sx={{ mx: 0.5 }}
                        onClick={(e) => {
                          setNotificationDrop(e.currentTarget);
                          if (notificationsIconss) {
                            dispatch(notificationCountIcon(false));
                          }
                        }}
                      >
                        <Badge>{notificationsIconss ? Icons.notification : Icons.notificationCount}</Badge>
                      </SquareIconButton>

                      <SquareIconButton
                        size="large"
                        aria-label="notification"
                        color="inherit"
                        sx={{ mx: 0.5, padding: "8px" }}
                        onClick={() => {
                          window.open("https://galileonetwork.zohodesk.eu/portal/en/kb", "_blank");
                        }}
                      >
                        <Tooltip title="Support Centers" placement="top" arrow>
                          {Icons.supportIcon}
                        </Tooltip>
                      </SquareIconButton>

                      {/* <SocketSvg /> */}
                      {user?.role === "User" && process.env.REACT_APP_ENVIRONMENT === "development" && (
                        <Box className="cartIcon">
                          <SquareIconButton
                            size="large"
                            aria-label="cart"
                            color="inherit"
                            title="Cart"
                            sx={{ mx: 0.5 }}
                            onClick={() => {
                              navigate("/cart");
                            }}
                          >
                            <StyledBadge badgeContent={groupedCartItems?.length}>{Icons.shoppingCart}</StyledBadge>
                          </SquareIconButton>
                        </Box>
                      )}
                    </Box>
                  </>
                )}

              {/*   ******************* these are important condtions */}
              {(token == null || undefined) && (
                <Button size="large" variant="outlined" onClick={handleLogout} sx={{ ml: 1 }}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        {(user?.role === "Sub Admin" || "Brand Admin" || "Super Admin" || "User") && (token != null || undefined) && (
          <>
            {renderMobileMenu}
            {renderMenu}

            <NotificationMenu
              notificationDrop={notificationDrop}
              setNotificationDrop={setNotificationDrop}
              isNotificationOpen={isNotificationOpen}
            />
          </>
        )}
      </Box>
    </>
  );
}
