import { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  MenuItem,
  TextField,
  InputLabel,
  Grid,
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
import { changeSubAdminMintingAccess } from "redux/subAdmin/actions";
// import NFTAbi from '../../../../../contractAbi'
import NFTAbi from "contractAbi/NFT.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assignBrandCategory } from "redux/subAdmin/actions";
import Escrow from "contractAbi/GalileoEscrow.js";
import BLOCKCHAIN from "../../../../../constants";
import { checkWallet } from "utils/utilFunctions";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { useActiveAccount } from "thirdweb/react";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ChangeSubAdminMintingAccessDialog({
  open,
  setOpen,
  page,
  limit,
  search,
  subAdminData,
  setSubAdminData
}) {
  const { provider, signer } = useWeb3();
  const account = useActiveAccount();
  const user = useSelector((state) => state.auth.user);
  const [contractAddress, setContractAddress] = useState("");
  const [brandCategoryId, setBrandCategoryId] = useState(0);
  const [loader, setLoader] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { brandCategories } = useSelector((state) => state.brandCategoryReducer.brandCategoriesAdminList);
  const handleClose = () => {
    setLoader(false);
    setOpen(false);
    setSubAdminData({
      id: null,
      firstName: "",
      lastName: "",
      adminEmail: "",
      adminPassword: "",
      role: "",
      isActive: "",
      walletAddress: "",
      hasMintingAccess: "",
      contractAddress: ""
    });
  };

  const handleMintRole = async () => {
    setLoader(true);
    const nfts = new ethers.Contract(subAdminData.contractAddress, NFTAbi.abi, signer);
    const escrow = new ethers.Contract(Escrow.address, Escrow.abi, signer);
    if (subAdminData.hasMintingAccess === true) {
      try {
        await (await nfts.revokeRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress)).wait();
        // await (await escrow.revokeRole(BLOCKCHAIN.ESCROW_ROLE, subAdminData.walletAddress)).wait();
        dispatch(
          changeSubAdminMintingAccess({
            id: subAdminData.id,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      } catch (error) {
        setLoader(false);
        setOpen(false);
        toast.error(`${error.reason}`);
      }
    } else {
      try {
        await (await nfts.grantRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress)).wait();
        // await (await escrow.grantRole(BLOCKCHAIN.ESCROW_ROLE, subAdminData.walletAddress)).wait();
        dispatch(
          changeSubAdminMintingAccess({
            id: subAdminData.id,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      } catch (error) {
        toast.error(`${error.reason}`);
        setLoader(false);
        setOpen(false);
      }
    }
  };

  const handleBrandCategoryChange = (e) => {
    setContractAddress(e.target.value.contractAddress);
    setBrandCategoryId(e.target.value.id);
  };

  const handleAssignBrandCategory = async () => {
    setLoader(true);

    const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
    // const admin="0x6f3B51bd5B67F3e5bca2fb32796215A796B79651";

    await (
      await nfts.grantRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress).catch((error) => {
        toast.error(`${error.reason}`);
        setLoader(false);
        setOpen(false);
      })
    )
      ?.wait()
      .then((data) => {
        dispatch(
          assignBrandCategory({
            id: subAdminData.id,
            brandCategory: brandCategoryId,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      });
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
        <DialogTitle className="statusHeading" id="alert-dialog-slide-title1">
          Change Admin Status
        </DialogTitle>
        {subAdminData.contractAddress === undefined || null ? (
          <>
            <DialogContent>
              <Grid container>Please assign a Brand Category:</Grid>

              <Grid item xs={6} md={12} lg={12} pt={2}>
                <InputLabel className="textfieldStyle">Select Category</InputLabel>
                <TextField
                  variant="standard"
                  className="responsiveSelectfield textfieldStyle field"
                  select
                  fullWidth
                  // label="Select Category"
                  // value={category}
                  onChange={handleBrandCategoryChange}
                >
                  {brandCategories?.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data?.Category?.name} ({data?.Brand?.name})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </DialogContent>
            {loader ? (
              <>
                <DialogActions sx={{ pr: 2.5, justifyContent: "center" }}>
                  <CircularProgress disableShrink size={"4rem"} />
                </DialogActions>
              </>
            ) : (
              <>
                <DialogActions sx={{ pr: 2.5 }}>
                  <Button
                    sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                    onClick={handleClose}
                    color="secondary"
                    className="buttonSize"
                    size="large"
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    className="buttonSize"
                    size="large"
                    onClick={() => {
                      handleAssignBrandCategory();
                    }}
                  >
                    Yes
                  </Button>
                </DialogActions>
              </>
            )}
          </>
        ) : (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description1">
                <Typography variant="body2" component="span" className="statustypo">
                  {subAdminData.hasMintingAccess === false
                    ? "Are you sure you want to give minting access to this Sub Admin?"
                    : "Are you sure you want to remove minting access of this Sub Admin?"}
                </Typography>
              </DialogContentText>
            </DialogContent>
            {loader ? (
              <>
                <DialogActions sx={{ pr: 2.5, justifyContent: "center" }}>
                  <CircularProgress disableShrink size={"4rem"} />
                </DialogActions>
              </>
            ) : (
              <>
                <DialogActions sx={{ pr: 2.5 }}>
                  <Button
                    sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                    onClick={handleClose}
                    color="secondary"
                    className="buttonSize"
                    size="large"
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    className="buttonSize"
                    size="large"
                    onClick={async () => {
                      if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
                        handleMintRole();
                      }
                    }}
                  >
                    Yes
                  </Button>
                </DialogActions>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
