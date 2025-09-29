/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { CHAIN_IDS, RPC_URLS, NETWORKS_INFO } from "utils/constants";

import { Avatar, Box, ButtonBase, Tooltip, Badge, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// project imports
import LogoSection from "../LogoSection";
import MobileSection from "./MobileSection";
import ProfileSection from "./ProfileSection";
import { Icons } from "../../../shared/Icons/Icons";
import { ethers, utils } from "ethers";
import { setWallet } from "redux/auth/actions";
import { SNACKBAR_OPEN } from "store/actions";
import Erc20 from "../../../contractAbi/Erc20.json";
import BLOCKCHAIN from "../../../../src/constants";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { IconMenu2 } from "@tabler/icons";
import { height, styled as stylee } from "@mui/system";
import { useEffect, useRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import NotificationMenu from "layout/UserLayout/header/NotificationMenu";
import { notificationCountIcon } from "redux/marketplace/actions";
// import SocketSvg from "layout/UserLayout/header/SocketSvg";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { copyToClipboard } from "utils/utilFunctions";
import { useWalletBalance, useActiveAccount } from "thirdweb/react";
import { polygon, polygonAmoy } from "thirdweb/chains";
import { client } from "utils/thirdWebClient";
import ThirdWebConnectButton from "views/auth/login/component/thirdWebConnectButton";
// ==============================|| MAIN NAVBAR / HEADER ||============================== //
const SquareIconButton = stylee(IconButton)(({ theme }) => ({
  width: "38px",
  height: "38px",
  borderRadius: "8px",
  background: theme.palette.action.hover
}));

const Header = ({ handleLeftDrawerToggle }) => {
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
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notificationsIconss = useSelector((state) => state.marketplaceReducer.notificationIconCount);

  // const [walletAddress, setWalletAddress] = useState();
  // const [balanceValue, setbalanceValue] = useState();
  // const [maticValue, setMaticValue] = useState();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth?.token);
  const userWalletAddress = useSelector((state) => state.auth?.walletAddress);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);

  const [notificationDrop, setNotificationDrop] = useState(null);
  const isNotificationOpen = Boolean(notificationDrop);

  const { magic, provider, setProvider } = useWeb3();

  const { sdk, connected } = useSDK();

  const promptSwitchNetwork = () => {
    window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORKS_INFO.chainId }]
      })
      .then(() => {
        setTimeout(() => {
          handleConnect();
        }, 1000);
      })
      .catch((error) => {
        if (error.code === 4902) {
          // Chain not added error code
          window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: NETWORKS_INFO.chainId,
                  chainName: NETWORKS_INFO.chainName,
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18
                  },
                  rpcUrls: [NETWORKS_INFO.rpcUrls],
                  blockExplorerUrls: [NETWORKS_INFO.blockExplorerUrl]
                }
              ]
            })
            .then(() => {
              console.log("Added and switched to Polygon mainnet");
              setTimeout(() => {
                handleConnect();
              }, 1000);
            })
            .catch((addError) => {
              console.error("Failed to add and switch to Polygon mainnet:", addError.message);
            });
        } else {
          console.error("Failed to switch to Polygon mainnet:", error.message);
        }
      });
  };

  const handleConnect = async () => {
    if (["DIRECT", "GOOGLE"].includes(loginMethod) && !connected) {
      try {
        await sdk.connect();
        // if (connected) {
        //   setProvider(new ethers.providers.Web3Provider(window.ethereum));
        // }
      } catch (error) {
        console.error(error);
        return;
      }
      if (connected) {
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
        console.log("Calling handle connect again");
        handleConnect();
        // const signer = await provider.getSigner()
        // const address = await signer.getAddress()
        // setWalletAddress(address);
        // dispatch(setWallet(address));
      }
    } else if (
      ["DIRECT", "GOOGLE"].includes(loginMethod) &&
      window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID
    ) {
      promptSwitchNetwork();
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: `Please switch to ${NETWORKS_INFO.chainName} network from your metamask`,
        variant: "alert",
        alertSeverity: "info"
      });
      // setWalletAddress();
      dispatch(setWallet(null));
    } else if (provider?.provider?.isMagic || connected) {
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        // setWalletAddress(address);
        dispatch(setWallet(address));

        const maticprovider = ethers.getDefaultProvider(RPC_URLS.POLYGON_RPC_URL);
        const maticbalance = await maticprovider?.getBalance(address);
        const maticvalue = ethers.utils?.formatEther(maticbalance);
        // setMaticValue(Number(maticvalue));
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const signer = provider.getSigner();
        // const address = await signer?.getAddress();
        let erc20Address = BLOCKCHAIN.USDC_ERC20;

        const token = new ethers.Contract(erc20Address, Erc20.abi, signer);

        let balance = await token.balanceOf(address);
        let value = utils.formatUnits(balance, 6);
        // setbalanceValue(Number(value));
        // dispatch({
        //     type: SNACKBAR_OPEN,
        //     open: true,
        //     message: 'Success',
        //     variant: 'alert',
        //     alertSeverity: 'success'
        // });
      } catch (error) {
        console.log(error, "main layout");
        if (error.reason === "unknown account #0") {
          try {
            await sdk.connect();
          } catch (error) { }
          console.log(error);
        }
      }
    }
  };

  const handleConnectButtonFocus = () => {
    const button = inputRef.current.querySelector('button');
    button.click()
  }

  const CustomTypography = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#44494c",
      color: "white"
    }
  }))(Tooltip);

  useEffect(() => {
    const handleAccountsChanged = () => {
      handleConnect();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      if (window.ethereum) {
        // window.ethereum.off("accountsChanged", handleAccountsChanged);
      }
    };
  }, [provider]);

  useEffect(() => {
    if (token && userWalletAddress) {
      handleConnect();
    }
  }, [token, userWalletAddress, provider]);

  useEffect(() => {
    if (!connected && !provider?.provider?.isMagic) {
      // setWalletAddress();
    }
  }, [connected]);

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          backgroundColor: `${theme.palette.mode === "dark" ? "#181C1F" : "white"}`,
          height: "4em",
          paddingTop: "1em",
          width: 200,
          marginLeft: "2%",
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto"
          }
        }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title> Galileo Dashboard</title>
        </Helmet>
        <Box component="span" sx={{ display: { xs: "none", md: "block" }, flexGrow: 1, marginTop: "1rem" }}>
          <LogoSection />
        </Box>
        <ButtonBase
          sx={{
            display: { md: "block", lg: "none", xs: "block", sm: "block" },
            marginTop: { md: "0", lg: "0", xs: "-15px", sm: "-15px" },
            borderRadius: "",
            overflow: "hidden"
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.secondary.light,
              color: "#2F5AFF",
              "&:hover": {
                background: "#2F5AFF",
                color: "#FFF"
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      {(user?.role === "Sub Admin" || "Brand Admin" || "Super Admin") && user?.role !== "User" && user != null && (
        <Box >
          <SquareIconButton
            onClick={() => {
              navigate("/home");
            }}
            size="large"
            aria-label=""
            color="inherit"
            sx={{ mx: 0.5 }}
          >
            <Badge>{Icons.marketPlaceTopBar}</Badge>
          </SquareIconButton>
        </Box>
      )}

      <Box onClick={handleConnectButtonFocus}
        sx={{
          display: { xs: "none", sm: "flex", md: "flex" },
          color: `${theme.palette.mode === "dark" ? "#ffffff" : "#000000"}`,
          background: theme.palette.action.hover,
          paddingY: "8px",
          borderRadius: "8px",
          mx: 1
        }}
      >
        <Box sx={{ opacity: 0, width: 0, height:0 }} ref={inputRef}>
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
              display: "flex",
              alignItems: "center",
              px: 2,
              mr: 0.5
            }}
          >
            <Tooltip placement="top" title={loginMethod === "MAGIC" ? "Click to access wallet" : ""}>
              <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                {walletAddress.toLowerCase() !== user.walletAddress.toLowerCase() ? (
                  <CustomTypography title="This wallet is not registered" placement="top" arrow>
                    <Box sx={{ display: "flex", position: "relative" }}>
                      {Icons.wallet}
                      <Box sx={{ position: "absolute", right: "2%", top: "-4%" }}>{Icons.evenodd}</Box>
                    </Box>
                  </CustomTypography>
                ) : (
                  Icons.wallet
                )}
                {/* <img src={WalletIcon} alt="Notificationicon" style={{ color: '#4dabf5', width: '24px', height: '24px' }} /> */}
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
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              mr: 1
            }}
          >
            {Icons.wallet}
            <Typography onClick={handleConnect} sx={{ px: 1, cursor: "pointer" }} className="HeaderFonts">
              Connect Wallet
            </Typography>
          </Box>
        )}
      </Box>
      <SquareIconButton
        size="large"
        aria-label=""
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
        <Tooltip title="Support Center" placement="top" arrow>
          {Icons.supportIcon}
        </Tooltip>
      </SquareIconButton>
      {/* <SocketSvg /> */}
      <ProfileSection />

      {/* mobile header */}
      <NotificationMenu
        notificationDrop={notificationDrop}
        setNotificationDrop={setNotificationDrop}
        isNotificationOpen={isNotificationOpen}
      />
      <Box sx={{ display: { xs: "none", sm: "none" } }}>
        <MobileSection />
      </Box>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
