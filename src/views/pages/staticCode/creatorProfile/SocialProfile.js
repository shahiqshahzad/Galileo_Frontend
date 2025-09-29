import { useSelector } from "react-redux";
// material-ui
import "./style.css";
import { editProfileSuccess, setWallet } from "redux/auth/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Stack from "@mui/material/Stack";

import { gridSpacing } from "store/constant";
import Cover from "assets/images/profile/img-profile-bg.png";
import { useNavigate } from "react-router-dom";
import SupportModal from "./SupportDialog";
import { useEffect, useState } from "react";
import { buildSignatureMessage } from "@nexeraid/identity-sdk";
import { IDENTITY_CLIENT } from "utils/nexeraIdClientConfig";
import axios from "utils/axios";
import { UserInfoCards } from "./UserInfoCards";
import { useDispatch } from "react-redux";
import FullScreenLoader from "ui-component/FullScreenLoader";
import { makeSelectAuthToken } from "store/Selector";
import { useWeb3 } from "utils/MagicProvider";

// ==============================|| SOCIAL PROFILE ||============================== //

const SocialProfile = () => {
  const dispatch = useDispatch();

  const { provider, signer } = useWeb3();

  const user = useSelector((state) => state.auth.user);
  const TOKEN = useSelector((state) => state.auth);
  const kycStatus =
    user?.UserKyc?.kycStatus === "Completed" ? "KYC Completed" : user?.UserKyc == null ? "Initiate KYC" : "KYC Failed";
  const navigate = useNavigate();
  const kycAttemptsScore = user?.UserKyc?.totalAttempts;
  const [open, setOpen] = useState(false);
  const [isMessageSigned, setIsMessageSigned] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const theme = useTheme();

  const [isKycInit, setKycInit] = useState(false);

  // KYC WORK
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
  const headers = {
    Authorization: `Bearer ${authToken}`
  };

  const closeScreen = async (data) => {
    try {
      if (!authToken) {
        navigate("/login");
      }
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

  const configureIdentityClient = async (addressed) => {
    if (addressed?.toLowerCase() === user?.walletAddress?.toLowerCase()) {
      try {
        if (isKycInit) {
          startKyc();
          return;
        }
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
              return;
            }
            setKycLoading(true);
            const accessToken = await getAccessTokenFromServer(address);
            if (!accessToken) {
              setKycLoading(false);
              return toast.error("Error getting access token from server");
            }
            IDENTITY_CLIENT.init({
              accessToken: accessToken,
              signature: signature,
              signingMessage: signingMessage
            });
            IDENTITY_CLIENT.onSdkReady((data) => {
              setKycInit(true);
              setKycLoading(false);
            });
          }
        }
      } catch (error) {
        setKycLoading(false);
        toast.error("Error with KYC");
      }
    } else {
      toast.error("Please connect your registered wallet");
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
  const startKyc = () => {
    IDENTITY_CLIENT.startVerification();
  };
  useEffect(() => {
    if (isKycInit) {
      startKyc();
    }
  }, [isKycInit]);
  useEffect(() => {
    closeScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {kycLoading && <FullScreenLoader />}
      <SupportModal setOpen={setOpen} open={open} />
      <Grid
        container
        spacing={gridSpacing}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        <Grid item xs={12} lg={11.86} xl={12}>
          <Stack
            className="user-info-bg"
            sx={{
              backgroundImage: `url(${user?.UserProfile?.bannerImg || Cover})`,
              backgroundSize: "cover", // Adjust the background size as needed
              backgroundRepeat: "no-repeat",
              borderRadius: "1px",
              overflow: "hidden",
              mb: 3,
              display: "flex",
              flexDirection: "row",
              paddingTop: "2rem",
              paddingLeft: "2rem",
              boxShadow: "0px 3px 20px 0px #3097FF80",
              backgroundPosition: "center"
            }}
          >
            <Stack>
              <ArrowBackIosIcon
                onClick={() => {
                  navigate("/home");
                }}
                sx={{ color: "#2F53FF", height: "2rem", width: "2rem", cursor: "pointer" }}
              />
            </Stack>
            <UserInfoCards
              user={user}
              navigate={navigate}
              kycStatus={kycStatus}
              openSupportDlg={() => setOpen(true)}
              configureIdentityClient={fetchWalletAddress}
              kycAttemptsScore={kycAttemptsScore}
            />
          </Stack>
          {/* <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={9}>
              <Avatar
                alt={`${user?.firstName} ${user?.lastName}`}
                src={user?.UserProfile?.profileImg || User1}
                sx={{
                  margin: '-70px 0 0 auto',
                  borderRadius: '16px',
                  [theme.breakpoints.down('lg')]: {
                    margin: '-70px auto 0'
                  },
                  [theme.breakpoints.down('md')]: {
                    margin: '-60px auto 0'
                  },
                  width: { xs: 72, sm: 100, md: 140 },
                  height: { xs: 72, sm: 100, md: 140 },

                  float: { md: 'left', xl: 'left' },
                  marginLeft: { md: '30px', xl: '30px' }
                }}
              />
            </Grid>
            {user?.role == 'User' && (
              <Grid item xs={12} md={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  className="outlined-borders"
                  sx={{ border: theme.palette.mode === 'dark' ? '0.648px solid #FFF;' : '0.648px solid #000' }}
                >
                  {user?.UserKyc === null || user?.UserKyc == undefined ? (
                    <Button
                      onClick={fetchWalletAddress}
                      className="buttonStyling borderstyl"
                      sx={{
                        borderRight: '2px solid ',
                        color: 'blue',
                        borderRight: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black'
                      }}
                      endIcon={theme.palette.mode === 'dark' ? Icons?.infrDark : Icons?.infrlight}
                    >
                      {kycStatus}
                    </Button>
                  ) : (
                    <Button
                      className="buttonStyling borderstyl"
                      sx={{
                        borderRight: '2px solid ',
                        color: user?.UserKyc?.kycStatus == 'Completed' ? '#6FFF2B' : 'red',
                        borderRight: theme.palette.mode === 'dark' ? '2px solid white' : '2px solid black'
                      }}
                      endIcon={theme.palette.mode === 'dark' ? Icons?.infrDark : Icons?.infrlight}
                    >
                      {kycStatus}
                    </Button>
                  )}
                  <Button
                    className="buttonStyling"
                    sx={{ marginLeft: '12px !important', color: theme.palette.mode === 'dark' ? '#FFF' : '#000' }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Support
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid> */}
          {/* <Grid container mt={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  sx={{
                    marginRight: '8px',
                    marginLeft: { md: '30px', xl: '30px' },
                    textAlign: { xs: 'center', sm: 'center', md: 'left', xl: 'left' }
                  }}
                  className="text"
                  variant="h5"
                >
                  {user?.firstName} {user?.lastName}
                </Typography>
                {user?.UserKyc?.kycStatus == 'Completed' && <span className="completProfile">{Icons?.completeProfile}</span>}
              </Box>
              <Typography
                sx={{
                  marginLeft: { md: '30px', xl: '30px' },
                  textAlign: { xs: 'center', sm: 'center', md: 'left', xl: 'left' }
                }}
                variant="subtitle2"
              >
                <span className="walletstyl" sx={{ color: theme.palette.mode === 'dark' ? '#FFF !important' : '#000 !important' }}>
                  {user?.walletAddress}
                </span>
                {user?.role == 'User' && (
                  <>
                    {user?.UserKyc == null ? (
                      <>
                        <span className="WalletRiskScore"> Wallet Risk Score:</span>
                        <span className="Low-Hight-Medium" sx={{ color: 'red' }}>
                          Not available
                        </span>{' '}
                      </>
                    ) : (
                      <>
                        {' '}
                        <span className="WalletRiskScore"> Wallet Risk Score:</span>
                        <span
                          className="Low-Hight-Medium"
                          style={{
                            color:
                              user?.UserKyc?.walletRiskScoreStatus == 'Low'
                                ? '#038B00'
                                : user?.UserKyc?.walletRiskScoreStatus == 'Medium'
                                ? '#FF7C02'
                                : user?.UserKyc?.walletRiskScoreStatus == 'High'
                                ? '#FF0202'
                                : user?.UserKyc?.walletRiskScoreStatus == 'Critical' && '#FF0202'
                          }}
                        >
                          {user?.UserKyc?.walletRiskScoreStatus}
                        </span>{' '}
                      </>
                    )}

                    {theme.palette.mode === 'dark' ? (
                      <Tooltip
                        TransitionComponent={Fade}
                        placement="top"
                        TransitionProps={{ timeout: 600 }}
                        title={
                          user?.UserKyc == null
                            ? 'Your wallet risk score is not calculated yet. Start the KYC process to calculate this score and make any transactions in the marketpalce.'
                            : user?.UserKyc?.walletRiskScoreMessage
                        }
                      >
                        <span className="informationIcon">{Icons?.infrsmalliconlight}</span>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        TransitionComponent={Fade}
                        placement="top"
                        TransitionProps={{ timeout: 600 }}
                        title={
                          user?.UserKyc == null
                            ? 'Your wallet risk score is not calculated yet. Start the KYC process to calculate this score and make any transactions in the marketpalce.'
                            : user?.UserKyc?.walletRiskScoreMessage
                        }
                      >
                        <span className="app-text">{Icons?.infrsmalliconDark}</span>
                      </Tooltip>
                    )}
                  </>
                )}
              </Typography>
              <Grid xs={6} sx={{ display: 'flex', flexDirection: 'row', mt: '5px' }}>
                <Typography
                  sx={{
                    marginLeft: { md: '30px', xl: '30px' },
                    textAlign: { xs: 'center', sm: 'center', md: 'left', xl: 'left' }
                  }}
                  className="AdminRole"
                  variant="subtitle2"
                >
                  {user?.role}
                </Typography>
                <Button
                  size="small"
                  className="buttons"
                  variant={'outlined'}
                  onClick={() => navigate('/addresses')}
                  sx={{ marginLeft: 'auto', borderRadius: '3px' }}
                >
                  {user?.role === 'Sub Admin' ? 'Warehouse Addresses' : 'Modify Address'}
                  <InfoOutlinedIcon sx={{ color: 'white', paddingLeft: '5px' }} />
                </Button>
              </Grid>
            </Grid>
          </Grid> */}
          {/* <Grid mt={2} item xs={12} md={12} sx={{ display: 'flex', marginLeft: { md: '-19px' } }}>
            <ul className="list">
              <li className="item">
                Items <b> {userNftsCount}</b>
              </li>
              <li className="itemstyle">
                Created On <b> {formattedDate}</b>
              </li>
            </ul>
          </Grid>
          <Grid mt={2} item xs={12} md={12}>
            <Typography
              sx={{ marginLeft: { md: '30px', xl: '30px' }, textAlign: { xs: 'center', sm: 'center', md: 'left', xl: 'left' } }}
              className="text"
              variant="h5"
            >
              Description
            </Typography>
          </Grid>
          <Grid mt={1} item xs={12} md={10} sx={{ padding: '17px 20px 17px 27px' }}>
            <Typography
              className="para app-text"
              variant="body"
              sx={{
                color: theme.palette.mode === 'dark' ? 'white' : '#404040',
                wordBreak: 'break-all'
              }}
            >
              {user?.UserProfile?.description || defaultDescription}
            </Typography>
          </Grid> */}
        </Grid>
      </Grid>
    </>
  );
};

export default SocialProfile;
