import { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Typography,
  CircularProgress
} from "@mui/material";
import { requestNftForMinting } from "redux/nftManagement/actions";
import Erc20 from "../../../../../contractAbi/Erc20.json";
import { ethers, utils } from "ethers";
import BLOCKCHAIN from "../../../../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SNACKBAR_OPEN } from "store/actions";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function EditRequestDialog({ open, setOpen, page, limit, search, type, nftData, categoryId }) {
  const theme = useTheme();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    setLoader(false);
  };
  const user = useSelector((state) => state.auth.user);

  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window?.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) == false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      toast.error("No crypto wallet found. Please install it.");
      setOpen(false);
      setLoader(false);
    } else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
      console.log("Please connect your registered Wallet Address");
      setOpen(false);
      setLoader(false);
    } else {
      return true;
    }
  };

  const EditRequest = async () => {
    if (await checkWallet()) {
      try {
        setLoader(true);
        let erc20Address = BLOCKCHAIN.USDC_ERC20;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const token = new ethers.Contract(erc20Address, Erc20, signer);
        let contractAddress =
          nftData?.brandContractAddress ||
          nftData?.contractAddress ||
          nftData?.Category?.BrandCategories[0]?.contractAddress;
        if (!contractAddress) {
          dispatch({
            type: SNACKBAR_OPEN,
            open: true,
            message: "No Contract Address found for this NFT",
            variant: "alert",
            alertSeverity: "info"
          });
        }
        let data = await (await token.approve(contractAddress, "100000000000000000000000000000000000000")).wait();

        await dispatch();
        // requestNftForMinting({
        //     id: nftData.id,
        //     categoryId: categoryId,
        //     page: page,
        //     limit: limit,
        //     search: search,
        //     type: type,
        //     brandId: user.BrandId,
        //     handleClose: handleClose
        // })
        setLoader(false);
        // toast.success("Please wait for confirmation Notification !");
      } catch (error) {
        toast.error(error.reason);
        setOpen(false);
        setLoader(false);
      }
    }
  };
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1">Request Sub Admin for mint</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span">
              Are you sure you want to request Sub Admin to allow the brand admin for editing after minting?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2.5 }}>
          {loader ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                onClick={handleClose}
                color="secondary"
              >
                No
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  // handleMintRequest();
                }}
              >
                Yes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
