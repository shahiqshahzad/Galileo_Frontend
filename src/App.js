/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import setupAxiosInterceptors from "utils/axiosInterceptor";

// routing
import Routes from "routes";

// defaultTheme
import themes from "themes";

// project imports
import Locales from "ui-component/Locales";
import NavigationScroll from "layout/NavigationScroll";
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from "ui-component/extended/Snackbar";
// import React from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleAnalyticsWrapper from "./wrappers/GoogleAnalyticsWrapper";
import ReactGA from "react-ga4";
import { useMediaQuery, useTheme } from "@mui/material";
import MobileWarning from "./views/pages/staticCode/MobileWarning/MobileWarning";
import { io } from "socket.io-client";
import CustomToast from "utils/CustomToast";
import { getNotifications, getNotificationsFirstTime, notificationCountIcon } from "redux/marketplace/actions";
import { updateUri } from "utils/updateUri";
import { Box } from "@mui/system";
import { getALLNftResold, getAllNftSuperAdmin, mintLoaderNft } from "redux/nftManagement/actions";
import { getnftData } from "redux/landingPage/actions";
import { restrictApplication, socketConnection } from "redux/auth/actions";
import { useNavigate } from "react-router";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSearchParams } from "react-router-dom";

import { kycNotificationSuccess } from "redux/auth/actions";
import { logout } from "./redux/auth/actions";
import { getOrderDetail } from "redux/activity/actions";
import { getMyActivitySubAdminDetail } from "redux/subAdmin/actions";
import { activityStatusLoaderSuccess, getBrandActivityDetail } from "redux/brandActivityDashboard/actions";
// import RestrictApp from "views/pages/staticCode/RestrictApp";
import useChatScript from "utils/useChatScript";
import { useWeb3 } from "utils/MagicProvider";
import { useActiveWallet , useDisconnect} from "thirdweb/react";
import MaintenancePage from "views/pages/staticCode/MaintenancePage/MaintenancePage";



// ==============================|| APP ||============================== //

const measurementId = process.env.REACT_APP_MEASUREMENT_ID;
ReactGA.initialize(measurementId);

const App = () => {
  const account = useActiveWallet();
  const {disconnect } = useDisconnect()
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useChatScript();
  const handleNonAuthorized = () => {
    if (account) {
      disconnect(account)
    }
    dispatch(logout());
    window.location.href = "/login";
  };

  // Set up Axios interceptors
  setupAxiosInterceptors(handleNonAuthorized);

  const customization = useSelector((state) => state.customization);
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const customToastStyle = {
    position: "relative",
    top: "60%",
    right: "30% ",
    color: "#fff",
    background: customization.navType === "dark" ? "#333" : "#f3f3f3",
    borderRadius: "4px",
    zIndex: " 9999"
  };
  const showToast = (msg) => {
    toast(<CustomToast message={msg} />, {
      style: customToastStyle,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: (
        <Box
          sx={{
            paddingRight: "10px",
            display: "flex",
            alignItems: "center",
            color: customization.navType === "dark" ? "#fff" : "#000",
            fontSize: "20px"
          }}
        >
          <CloseRoundedIcon fontSize="15px" />
        </Box>
      )
    });
  };

  const handleResaleNfts = (data) => {
    if (data?.action === "resaleUpdated") {
      dispatch(getALLNftResold());
    }

    if (data?.action === "canceledResale") {
      navigate(`/productDetails/${data.nftId}`);
    }
  };

  useEffect(() => {
    if (token) {
      const socket = io(process.env.REACT_APP_SOCKET_URL, {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      socket.on("connect", () => {
        dispatch(socketConnection(true));
      });
      socket.on("disconnect", () => {
        dispatch(socketConnection(false));
      });
      socket.io.on("reconnect", () => {});
      socket.io.on("reconnection_attempt", () => {});
      if (socket) {
        socket.on("notification", (data) => {
          handleResaleNfts(data);
          if (data.orderNumber) {
            let payload = {
              orderId: data.orderNumber,
              setLoader: () => dispatch(activityStatusLoaderSuccess(false))
            };

            if (user?.role === "Sub Admin") {
              if (data?.returnRequest) {
                dispatch(getMyActivitySubAdminDetail(payload));
              }
              dispatch(getBrandActivityDetail(payload));
            } else {
              dispatch(getOrderDetail(payload));
            }
          }
          dispatch(getNotifications());
          dispatch(notificationCountIcon(true));
          !data?.hideToast && showToast(data?.message);
          dispatch(mintLoaderNft(false));
        });

        // This notification listener is designed to capture successful updates to the specified URI.

        socket.on("updateUriNotification", (data) => {
          if (data?.nftId) {
            showToast(data?.message);
            dispatch(getnftData({ id: data?.nftId }));
          }
          if (data?.BrandId && data?.CategoryId) {
            const filter = searchParams.get("filter") || user?.role === "Sub Admin" ? "draft" : "all";
            const pageNumber = searchParams.get("pageNumber") || 1;

            const payload = {
              brandId: data?.BrandId,
              categoryId: data?.CategoryId,
              search: "",
              page: pageNumber,
              limit: 12,
              type: filter
            };
            showToast(data?.message);
            dispatch(mintLoaderNft(false));
            dispatch(getAllNftSuperAdmin(payload));
          }
        });

        socket.on("updateUri", (data) => {
          updateUri(data, token, dispatch);
        });
        socket.on("kycStatus", (data) => {
          showToast(data?.message);
          dispatch(kycNotificationSuccess(data));
        });

        socket.on("forcedLogout", (data) => {
          if (account) {
            disconnect(account)
          }
          showToast(data?.message);
          dispatch(logout());
          window.location.href = "/login";
        });
      }
      if (!(user?.signupMethod === "GOOGLE" && !user?.walletAddress)) {
        dispatch(getNotificationsFirstTime());
      }

      return () => {
        socket.on("disconnect", () => {});
      };
    }
  }, [token]);

  useEffect(() => {
    dispatch(restrictApplication());
  }, [token]);

  if (matchMD) {
    return <MobileWarning />;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        {/* RTL layout */}
        {/* <RTLLayout> */}
        <ToastContainer autoClose={8000} />
        <Locales>
          <NavigationScroll>
            <>
              <GoogleAnalyticsWrapper>
                <Routes />
                {/* <MaintenancePage /> */}
              </GoogleAnalyticsWrapper>
              <Snackbar />
            </>
          </NavigationScroll>
        </Locales>
        {/* </RTLLayout> */}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
