import { Box, Grid, Stack } from "@mui/material";
import { useEffect } from "react";
import "@fontsource/public-sans";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import galileoLogo from "../../../assets/images/galileo-white.png";
// import music from "../../../assets/vedio.mp4";
import { Link, useNavigate } from "react-router-dom";
import { fetchNftTokenAndAddress } from "utils/fetchNftTokenAddress";
import { useTheme } from "@mui/material/styles";

const TrackNFT = () => {
  const [serialNo, setSerialNo] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState();
  const [addres, setAddres] = useState();
  const [seconds, setSeconds] = useState();
  const theme = useTheme();
  useEffect(() => {
    let interval = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds]);

  const navigate = useNavigate();
  {
    /*  const handleConnect = async () => {
        const response = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
        if (response) {
            if (!window.ethereum) {
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'No crypto wallet found. Please install it.',
                    variant: 'alert',
                    alertSeverity: 'info'
                });
                console.log('No crypto wallet found. Please install it.');
                // toast.error('No crypto wallet found. Please install it.');
            }

          
            else if (utils?.getAddress(response[0]) !== user?.walletAddress) {
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Please connect your registered Wallet Address',
                    variant: 'alert',
                    alertSeverity: 'info'
                });
                console.log('Please connect your registered Wallet Address');
                setWalletAddress();
            } else {
                const address = utils?.getAddress(response[0]);
                setWalletAddress(address);
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'wallet connected',
                    variant: 'alert',
                    alertSeverity: 'success'
                });
            }
        } else {
            console.log('No crypto wallet found. Please install it.');
            // toast.error('No crypto wallet found. Please install it.');
        }
    }; */
  }

  {
    /*  useEffect(() => {
        dispatch(setWallet(walletAddress));
        handleConnect();
    }, [walletAddress]);

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
           
            handleConnect();
        });
    } */
  }
  const searchSerial = async () => {
    setSuccess(true);
    if (serialNo == "") {
      setSuccess(false);
      toast.error("Please enter valid serial Id");
    }

    const { tokenId, address } = await fetchNftTokenAndAddress(serialNo);

    setAddres(address);

    if (tokenId == "0" && serialNo != "") {
      toast.error("Incorrect serial Id!");
      setSuccess(false);
    }
    setToken(tokenId);
  };

  if (seconds == 0) {
    if (token != undefined && token != "0") {
      navigate("/tracking/" + serialNo, {
        state: {
          tokenId: token,
          address: addres
        }
      });
    } else {
    }
  }

  return (
    <Stack position={"relative"} sx={{ height: "100vh", overflow: "hidden" }}>
      {/* // TODO: uncomment this later */}
      {/* <video src={music} loop autoPlay="true" /> */}
      <Grid item md={12} xs={12} position={"absolute"} sx={{ width: "100%" }}>
        <Grid container-fluid="true">
          <Grid sx={{ textAlign: "center", marginTop: "30px" }}>
            <img className="mainLogo" src={galileoLogo} alt="logo" />
          </Grid>
          <Grid
            sx={{
              marginTop: { xs: "100px", md: "200px" },
              marginLeft: { xs: "20px", md: "0px" },
              marginRight: { xs: "20px", md: "none" }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: theme?.typography.appText,
                fontStyle: "normal !important",
                fontWeight: "700",
                textAlign: "center",
                fontSize: { xs: "12px", sm: "30px", md: "30px", lg: "30px" },
                lineHeight: { xs: "1", sm: "1", md: "33px", lg: "33px" },

                color: "white"
              }}
            >
              Track your NFT history{" "}
            </Typography>
            <Box className="trackBox">
              <input
                className="trackInput"
                placeholder="Serial Id"
                onChange={(e) => {
                  setSerialNo(e.target.value);
                }}
              />
              {success ? (
                <Button
                  sx={{ alignSelf: "center !important" }}
                  className="createTrack"
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSeconds(3);
                    searchSerial();
                  }}
                >
                  <CircularProgress sx={{ width: "24px !important", height: "24px  !important", color: "#ffff" }} />
                </Button>
              ) : (
                <Button
                  sx={{ alignSelf: "center !important" }}
                  className="createTrack"
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSeconds(6);
                    // handleConnect();
                    searchSerial();
                  }}
                >
                  Track
                </Button>
              )}
            </Box>
            <Grid container justifyContent="center">
              <Typography
                variant="h4"
                mt={-1}
                mb={1}
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontStyle: "normal !important",
                  fontWeight: "600",
                  textAlign: "center",
                  fontSize: { xs: "12px", sm: "15px", md: "15px", lg: "15px" },
                  // lineHeight: { xs: '1', sm: '1', md: '33px', lg: '33px' },

                  color: "#2fc1ff"
                }}
              >
                {success == true && token != "0" ? "Please wait for tracking..." : ""}
              </Typography>
            </Grid>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: theme?.typography.appText,
                  fontStyle: "normal !important",
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: { xs: "12px", sm: "15px", md: "15px", lg: "15px" },
                  // lineHeight: { xs: '1', sm: '1', md: '33px', lg: '33px' },

                  color: "white"
                }}
              >
                By initiating authentication, you declare that you accept our{" "}
                <Link
                  to="/legal-disclaimer"
                  underline="none"
                  textDecoration="none"
                  // color={theme.palette.mode === 'dark' ? darkModeColor : lightModeColor}
                  target="_blank"
                  style={{ color: "#ffff" }}
                  // rel='noopener noreferrer'
                >
                  Legal Notice
                </Link>
                <span> and </span>
                <Link
                  to="/privacy-policy"
                  underline="none"
                  textDecoration="none"
                  // color={theme.palette.mode === 'dark' ? darkModeColor : lightModeColor}
                  target="_blank"
                  style={{ color: "#ffff" }}
                  // rel='noopener noreferrer'
                >
                  Privacy Policy
                </Link>
                {/* <a href="" style={{ color: '#ffff' }}>
                  Privacy Policy.
                </a> */}
              </Typography>
            </Box>
            <Grid container justifyContent={"center"}>
              <Button
                sx={{ alignSelf: "center !important", marginTop: "2rem" }}
                className="createTrack"
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate("/home");
                }}
              >
                Back To Home
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TrackNFT;
