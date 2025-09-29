import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Icons } from "shared/Icons/Icons";
import { editProfileSuccess, setWallet } from "redux/auth/actions";
import { utils } from "ethers";
import { toast } from "react-toastify";
import { is_kyc_popup_shown_to_user } from "redux/auth/actions";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Typography,
  Box
} from "@mui/material";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { IDENTITY_CLIENT } from "utils/nexeraIdClientConfig";
import { ethers } from "ethers";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "utils/axios";
import { makeSelectAuthToken } from "store/Selector";
import { useNavigate } from "react-router-dom";
import { SNACKBAR_OPEN } from "store/actions";
import { useWeb3 } from "utils/MagicProvider";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function PromotedDialog({ open, setOpen }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const TOKEN = useSelector((state) => state.auth);
  const [isMessageSigned, setIsMessageSigned] = useState(false);
  const [kycLoader, setKycLoader] = useState(false);
  const { provider, signer } = useWeb3();

  const configureIdentityClient = async (addressed) => {
    if (addressed?.toLowerCase() === user?.walletAddress?.toLowerCase()) {
      try {
        if (!isMessageSigned) {
          const address = await getWalletAddress();
          if (address) {
            IDENTITY_CLIENT.onSignMessage(async (data) => {
              return await signMessageAsync({
                message: data.message
              });
            });
            IDENTITY_CLIENT.onCloseScreen(async (data) => {
              return await closeScreen({
                message: data
              });
            });
            const signingMessage = buildSignatureMessage(address);
            const signature = await signMessageAsync({
              message: signingMessage
            });
            if (!signature) {
              setKycLoader(false);
              return;
            }
            setLoader(true);
            const accessToken = await getAccessTokenFromServer(address);

            if (!accessToken) {
              setLoader(false);
              setKycLoader(false);
              return toast.error("Error getting access token from server");
            }
            IDENTITY_CLIENT.init({
              accessToken: accessToken,
              signature: signature,
              signingMessage: signingMessage
            });
            IDENTITY_CLIENT.onSdkReady((data) => {
              startKyc();
              setOpen(false);
              setLoader(false);
            });
          }
        }
      } catch (error) {
        setLoader(false);
        setOpen(false);
        toast.error('Error in KYC processing"!');
      }
    } else {
      toast.error("please connect your registered wallet address");
      setKycLoader(false);
      return;
    }
  };

  const fetchWalletAddress = async () => {
    if (!provider) {
      console.log("Provider not found");
      return;
    }
    const address = await signer?.getAddress();
    if (address === null) {
      toast.error("Please connect with your registered wallet to start KYC process");
      return;
    } else {
      dispatch(setWallet(address));
      configureIdentityClient(address);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLocalStorage = () => {
    dispatch(
      is_kyc_popup_shown_to_user({
        handleClose: handleClose
      })
    );

    setOpen(false);
  };

  const getWalletAddress = async () => {
    try {
      if (provider) {
        const address = await signer?.getAddress();
        return address;
      } else {
        console.error("MetaMask not detected.");
      }
    } catch (error) {
      console.error("Error getting wallet address:", error.message);
    }
  };

  const getAccessTokenFromServer = async (address) => {
    try {
      const token = TOKEN?.token;
      const response = await axios.get(`/users/get-access-token/${address}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data?.data?.accessToken;
    } catch (error) {
      console.error("Error getting wallet address:", error.message);
    }
  };

  const signMessageAsync = async ({ message }) => {
    try {
      if (!provider) {
        return;
      }
      const address = await signer?.getAddress();
      if (!isMessageSigned && provider && address !== null) {
        // await window.ethereum.request({ method: "eth_requestAccounts" });
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signedMessage = await signer.signMessage(message);
        console.log(signedMessage);
        setIsMessageSigned(true);
        return signedMessage;
      } else {
        console.error("MetaMask not detected or message already signed.");
      }
    } catch (error) {
      console.error("Error signing message:", error.message);
    }
  };

  const authToken = useSelector(makeSelectAuthToken());
  const closeScreen = async (data) => {
    try {
      if (!authToken) {
        navigate("/login");
      }
      const headers = {
        Authorization: `Bearer ${authToken}`
      };
      const response = await axios.get(`/users/get-user-detail`, { headers });
      const transformedUser = {
        user: {
          ...response?.data?.data?.user,
          UserProfile:
            response?.data?.data?.user?.UserProfile !== null &&
            typeof response?.data?.data?.user?.UserProfile === "object"
              ? response?.data?.data?.user?.UserProfile
              : {}
        }
      };
      dispatch(editProfileSuccess(transformedUser));
    } catch (error) {
      console.log(error);
    }
  };

  const startKyc = () => {
    IDENTITY_CLIENT.startVerification();
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          padding: "0 !important",
          background: "#020101db !important",
          "& .MuiDialog-paper": {
            borderRadius: 0,
            width: "389px",
            height: "340px",
            overflow: "hidden",
            background: "#0a0707bd !important"
          }
        }}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="CompleteKYC">
          {Icons?.promtedIcon}
        </DialogTitle>

        <DialogTitle id="alert-dialog-slide-title1" className="CompleteKYC">
          Let’s Complete KYC
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="KYCdescription">
              It is mandatory to complete the KYC process in order to buy and sell in the marketplace
            </Typography>
          </DialogContentText>
        </DialogContent>

        {loader === true ? (
          <Button
            variant="text"
            size="small"
            // onClick={fetchWalletAddress}
          >
            <CircularProgress sx={{ color: "#2F53FF" }} />
          </Button>
        ) : (
          <>
            {kycLoader ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress sx={{ color: "#2F53FF" }} />
              </Box>
            ) : (
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  sx={{
                    color: theme.palette.mode === "dark" ? "#fff" : "black",
                    borderColor: theme.palette.error.dark
                  }}
                  onClick={handleLocalStorage}
                  // color="secondary"
                  variant="outlined"
                  className="buttonSize promptedCancel"
                  size="large"
                >
                  i’ll do it later
                </Button>
                <Button
                  variant="contained"
                  className="buttonSize promptedCancel"
                  size="large"
                  onClick={fetchWalletAddress}
                >
                  Let's start
                </Button>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
