// material-ui
import { Grid, TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MarketplaceAbi from "contractAbi/Marketplace.json";
import MarketplaceAddress from "contractAbi/Marketplace-address.js";
import { ethers } from "ethers";
import { useState } from "react";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet } from "utils/utilFunctions";
import { useActiveAccount } from "thirdweb/react";

// ==============================|| TEXTFIELD PAGE ||============================== //

const Configuration = () => {
  const dispatch = useDispatch();
  const account = useActiveAccount();
  const { provider, signer } = useWeb3();
  const { sdk, connected } = useSDK();

  const [loader, setLoader] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const [loaderAddress, setLoaderAddress] = useState(false);
  const [marketFee, setMarketFee] = useState("");
  const [recieverAddress, setRecieverAddress] = useState("");
  const marketplaceFeeFunc = async (e) => {
    e.preventDefault();
    if (marketFee !== "") {
      if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
        try {
          setLoader(true);
          const nft = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
          let price = marketFee;
          await (await nft.setPlatformFee(price)).wait();
          setMarketFee("");
          toast.success("successfully Submit");
          setLoader(false);
        } catch (error) {
          setLoader(false);
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      }
    } else {
      toast.error("Market fee is required!");
      return;
    }
  };

  const recieverAddressFunc = async (e) => {
    e.preventDefault();

    const testing = /^(0x)?[0-9a-fA-F]{40}$/;
    if (testing.test(recieverAddress) === false) {
      toast.error("Invalid Wallet!");
      return;
    }
    if (recieverAddress !== "") {
      if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
        try {
          setLoaderAddress(true);
          const nft = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
          await (await nft.setPlatformFeeCollectorAddress(recieverAddress)).wait();
          setRecieverAddress("");
          toast.success("successfully Submit");
          setLoaderAddress(false);
        } catch (error) {
          setLoader(false);
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        }
      }
    } else {
      toast.error("Address is required!");
    }
  };

  return (
    <>
      <MainCard sx={{ fontFamily: theme?.typography.appText }} title="Setting marketplace fees">
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <SubCard sx={{ fontFamily: theme?.typography.appText }} title="Enter Marketplace Fee">
              <form onSubmit={marketplaceFeeFunc}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      value={marketFee}
                      onChange={(e) => {
                        const regex = /^\d*\.?\d{0,2}$/;
                        if (regex.test(e.target.value)) {
                          // const enteredValue = parseFloat(e.target.value);
                          if (e.target.value <= 100) {
                            setMarketFee(e.target.value);
                          } else {
                            // Display an error message or trigger a toaster notification
                            toast.error("Marketplace Fee cannot exceed 100");
                          }
                        }
                      }}
                      fullWidth
                      id="filled-basic"
                      type="number"
                      label="Marketplace Fee"
                      variant="standard"
                    />
                  </Grid>
                  {loader === false ? (
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" className="app-text">
                        Submit
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Button>
                        <CircularProgress />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </SubCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <SubCard className="app-text" title="Receiver Address">
              <form onSubmit={recieverAddressFunc}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      className="app-text"
                      value={recieverAddress}
                      fullWidth
                      id="filled"
                      label="Receiver Address"
                      variant="standard"
                      onChange={(e) => {
                        setRecieverAddress(e.target.value);
                      }}
                    />
                  </Grid>
                  {loaderAddress === false ? (
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" className="app-text">
                        Submit
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Button>
                        <CircularProgress />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </SubCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default Configuration;
