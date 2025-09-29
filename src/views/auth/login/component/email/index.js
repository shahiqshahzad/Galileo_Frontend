import { Link, useNavigate } from "react-router-dom";
import "@fontsource/public-sans";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Box, Typography } from "@mui/material";
import AuthWrapper1 from "shared/component/AuthWrapper";
import Email from "./email";
import { decodeErrorResult } from 'viem'

import MainCard from "ui-component/cards/MainCard";
import galileo from "assets/images/galileo.png";
import galileoWhite from "assets/images/galileo-white.png";
import BackgroundPattern1 from "ui-component/cards/BackgroundPattern1";
import { Helmet } from "react-helmet";
import { client } from "../../../../../utils/thirdWebClient";
import { ConnectButton } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { ethers } from "ethers";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import BLOCKCHAIN from "../../../../../constants";
import { defineChain } from "thirdweb";
import axios from "axios";
import { setNotification } from "shared/helperMethods/setNotification";
import { loginSuccess } from "redux/auth/actions";
import { useDispatch } from "react-redux";
import { polygonAmoy, polygon } from "thirdweb/chains";
import ThirdWebConnectButton from "../thirdWebConnectButton";



const Login = () => {

  const theme = useTheme();

  // const handleSubmit = async () => {
  //   try {
  //     console.log("account::::::", account);
  //     const signer = await ethers5Adapter.signer.toEthers({ client, chain: defineChain(80002), account });
  //     // console.log("signer:::::::",signer);
  //     // const signer2 = provider.getSigner();
  //     // console.log("signer2:::::::",signer2);

  //     const provider2 = ethers5Adapter.provider.toEthers({
  //       client,
  //       chain: defineChain(80002),
  //     });

  //     console.log("provider2:::", provider2);

  //     const signerUpdated = provider2.getSigner();
  //     console.log("signerUpdated::", signerUpdated);



  //     const nfts = new ethers.Contract("0x70aC1e7EfFC3fa5DC0C4bE3206d93B500AF07203", NFTAbi.abi, signer);
  //     console.log("nfts::", nfts);


  //     await (await nfts.grantRole(BLOCKCHAIN.FACTORY_ROLE, BLOCKCHAIN.SIGNATURE_WALLET_ADDRESS)).wait();

  //   } catch (error) {
  //     console.log(error)
  //   }

  // }
  // if (/mobile|android|iphone|ipad|iemobile/.test(window.navigator.userAgent.toLowerCase())) {
  //   const a = document.createElement("a");
  //   a.href = `https://metamask.app.link/dapp/${window.location.origin}/login`;
  //   a.target = "_self";
  //   document.body.appendChild(a);
  //   if (/metamaskmobile/.test(window.navigator.userAgent.toLowerCase())) {
  //     a.remove();
  //   } else {
  //     a.click();
  //     a.remove();
  //   }
  // }

  return (
    <AuthWrapper1>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ minHeight: "100vh", background: theme.palette.mode === "dark" ? "#000" : "#fff" }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title> Sign In </title>
        </Helmet>
        <Grid
          item
          md={4.5}
          lg={4.5}
          sx={{ position: "relative", alignSelf: "stretch", display: { xs: "none", md: "block" } }}
        >
          <BackgroundPattern1>
            <Grid item container alignItems="flex-end" justifyContent="center" spacing={3}>
              <Grid item xs={12}>
                <span />
              </Grid>
            </Grid>
          </BackgroundPattern1>
        </Grid>
        <Grid item container justifyContent="center" md={7.5} lg={7.5}>
          <MainCard
            sx={{
              borderRadius: "4px",
              maxWidth: { xs: 400, lg: 425 },
              margin: { xs: 2.5, md: 3 },
              "& > *": {
                flexGrow: 1,
                flexBasis: "50%"
              },
              background: "transparent"
            }}
            content={false}
          >
            <Grid container direction="column" justifyContent="center" spacing={2}>
              <Grid item xs={12} container alignItems="center" justifyContent="center">
                <Box sx={{ display: { xs: "block", sm: "block", md: "none", lg: "none" } }}>
                  <Typography variant="h6" noWrap component="div" sx={{ marginTop: "5px" }}>
                    {theme.palette.mode === "dark" ? (
                      <img src={galileoWhite} alt="Galileo White Logo" width="100" />
                    ) : (
                      <img src={galileo} alt="Galileo Dark Logo" width="100" />
                    )}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} container alignItems="left" justifyContent="left">
                <Box sx={{ mb: 2 }}>
                  {/* <Typography className="signInMarket" variant="subtitle1">
                    Sign In
                  </Typography> */}
                  <ThirdWebConnectButton embed={true}/>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Email />
              </Grid>
              <Grid item xs={12}>
                <Grid item container justifyContent="center" xs={12}>
                  <Typography
                    className="fontfamily"
                    component={Link}
                    to="/privacy-policy"
                    variant="subtitle1"
                    sx={{ textDecoration: "none", marginRight: "12px", color: "#FFFFFF" }}
                    target="_blank"
                  >
                    Privacy Policy
                  </Typography>
                  <Typography
                    className="fontfamily"
                    component={Link}
                    to="/Terms-of-Service"
                    variant="subtitle1"
                    sx={{ textDecoration: "none", color: "#FFFFFF" }}
                    target="_blank"
                  >
                    Terms and Condition
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
