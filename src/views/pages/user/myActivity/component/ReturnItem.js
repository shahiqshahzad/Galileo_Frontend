import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import MenuItem from "@mui/material/MenuItem";
import { Box, FormHelperText, List, ListItem, TextField, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail, postRefundStatus } from "redux/activity/actions";
import { ethers } from "ethers";
import GalileoEscrow from "../../../../../contractAbi/GalileoEscrow.js";
import GalileoProtocol from "../../../../../contractAbi/NFT.json";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { activityStatusLoaderSuccess } from "redux/brandActivityDashboard/actions";
import { loggerApi } from "utils/loggerApi.js";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet } from "utils/utilFunctions";
import { BLOCKCHAIN_ACTIONS } from "utils/constants.js";
import { useActiveAccount } from "thirdweb/react";

const DotListItem = withStyles((theme) => ({
  root: {
    "&::before": {
      content: "'\\2022'",
      marginRight: theme.spacing(1),
      color: "#fff"
    },
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    color: "#FFF"
  }
}))(ListItem);

const ReturnItem = ({ setOpen, open, orderId, setRenderComponent, nft }) => {
  const [refundReason, setRefundReason] = useState("null");
  const [helperText, setHelperText] = useState("");
  const [returnLoader, setReturnLoader] = useState(false);
  const LoggedInWalletAddress = useSelector((state) => state.auth.user.walletAddress);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { provider, signer } = useWeb3();
  const account = useActiveAccount();

  const options = [
    { text: "Select reason for return", value: "null" },
    { text: "Item no longer needed", value: "Item no longer needed" },
    { text: "Defective/wrong item delivered", value: "Defective/wrong item delivered" }
  ];
  const CustomTextField = withStyles({
    root: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderRadius: `0px`
        },
        "& MuiOutlinedInput-root": {
          borderRadius: "0px"
        }
      }
    }
  })(TextField);

  const fetchAfterReturn = () => {
    let payload = {
      orderId: orderId,
      setLoader: () => dispatch(activityStatusLoaderSuccess(false))
    };
    dispatch(getOrderDetail(payload));
  };

  const handleReturnReason = async () => {
    console.log("YUP");
    try {
      if (refundReason === "null") {
        setHelperText("Please select a value.");
        return;
      }

      if ((await checkWallet(provider, dispatch, account, LoggedInWalletAddress)) === null) {
        return;
      }
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const accounts = await provider.listAccounts();
      // const signer = provider.getSigner();
      // const userAddress = await signer?.getAddress();

      // if (userAddress == null) {
      //   toast.error("Please connect with your wallet");
      //   return;
      // } else if (userAddress !== LoggedInWalletAddress) {
      //   dispatch({
      //     type: SNACKBAR_OPEN,
      //     open: true,
      //     message: "Please connect your registered Wallet Address",
      //     variant: "alert",
      //     alertSeverity: "info"
      //   });
      //   return;
      // } else if ( ["DIRECT", "GOOGLE"].includes(loginMethod) && window?.ethereum?.networkVersion !== CHAIN_IDS.POLYGON_CHAIN_ID) {
      //   toast.error(WRONG_CHAIN_MESSAGES.POLYGON);
      //   return;
      // }
      
      const escrow = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);
      const protocol = new ethers.Contract(nft.contractAddress, GalileoProtocol.abi, signer);

      setReturnLoader(true);

      let nftAddresses = [];
      let refundReasons = [];
      let tokenIdParse = [];

      nft?.tokenIds?.forEach((token) => {
        nftAddresses.push(nft.contractAddress);
        refundReasons.push(refundReason);
        tokenIdParse.push(parseInt(token));
      });

      // Approve GalileoEscrow contract for managing tokens on behalf of protocol
      let isApproved = await protocol.isApprovedForAll(LoggedInWalletAddress, GalileoEscrow.address);
      if (!isApproved) {
        await (await protocol.setApprovalForAll(GalileoEscrow.address, true)).wait();
      }

      const refundPayload = {
        orderNumber: orderId,
        returnReason: refundReason,
        setOpen,
        setRenderComponent,
        serialIds: nft.serialIds,
        setReturnLoader,
        middleware: true,
        blockchainAction: BLOCKCHAIN_ACTIONS.RETURN_REQUEST
      };
      const endpoint = "/users/return-order-request";
      const method = "POST";
      await loggerApi(endpoint, method, refundPayload);

      const { hash: transactionHash, ...rest } = await escrow.submitMultipleDisputes(
        nftAddresses,
        tokenIdParse,
        refundReasons
      );
      delete refundPayload.middleware;
      delete refundPayload.blockchainAction;
      refundPayload.transactionHash = transactionHash;

      // Dispatch postRefundStatus action upon successful submission
      dispatch(postRefundStatus(refundPayload));

      const receipt = await rest.wait();
      const requiredReceiptData = {
        transactionHash: receipt?.transactionHash,
        status: receipt?.status 
      }
      refundPayload.frontEndReceipt = requiredReceiptData;

      refundPayload.fetchAfterReturn = fetchAfterReturn;

      dispatch(postRefundStatus(refundPayload));
    } catch (error) {
      console.error("Error during handleReturnReason:", error);
      dispatch(activityStatusLoaderSuccess(false));
      setReturnLoader(false);
      if (provider?.provider?.isMagic && !error?.reason) return;
      toast.error(error.reason);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ maxWidth: "xs" }}
      fullWidth
    >
      {/* <DialogTitle
        id="alert-dialog-title"
        sx={{ fontWeight: "400", fontStyle: "normal", fontFamily: theme?.typography.appText, fontSize: "24px" }}
      >
        Return item SerialID
      </DialogTitle> */}
      <DialogContent>
        <Typography
          fontFamily={theme?.typography.appText}
          fontSize="18px"
          fontWeight="400"
          color="#fff"
          fontStyle="normal"
          mt={2}
        >
          Reason for Return
        </Typography>
        <CustomTextField
          variant="outlined"
          select
          labelId="select-reason-label"
          value={refundReason}
          onChange={(e) => {
            if (e.target.value === "null") {
              setHelperText("Please select a value.");
              setRefundReason(e.target.value);
            } else {
              setRefundReason(e.target.value);
              setHelperText("");
            }
          }}
          fullWidth
          sx={{
            "& .MuiSelect-root": {
              borderRadius: "0px"
            }
          }}
          defaultValue="null"
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </CustomTextField>
        <FormHelperText sx={{ color: "#d32f2f" }}>{helperText}</FormHelperText>

        <DialogContentText id="alert-dialog-description">
          <List>
            <Box as="div">Instructions</Box>

            <DotListItem>You'll receive the return instructions from the seller to your registered email</DotListItem>
            {refundReason === "Item no longer needed" ? (
              <DotListItem>
                The refunded amount will exclude the shipping fees and may have additional deductions for processing the
                return
              </DotListItem>
            ) : refundReason === "Defective/wrong item delivered" ? (
              <DotListItem>
                If the item is defective or the wrong item was delivered, the full amount will be refunded to your
                registered wallet address.
              </DotListItem>
            ) : null}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {returnLoader ? (
          <Box sx={{ mr: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button variant="contained" onClick={handleReturnReason}>
            Accept and proceed
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReturnItem;
