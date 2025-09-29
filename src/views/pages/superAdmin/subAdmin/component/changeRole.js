import { forwardRef } from "react";
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
  CircularProgress,
  Grid
} from "@mui/material";
import { changeRole } from "redux/subAdmin/actions";
import NFTAbi from "contractAbi/NFT.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Escrow from "contractAbi/GalileoEscrow.js";
import BLOCKCHAIN from "../../../../../constants";
import { checkWallet } from "utils/utilFunctions";
import { useWeb3 } from "utils/MagicProvider";
import { useActiveAccount } from "thirdweb/react";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ChangeRoleDialog({ open, setOpen, page, limit, search, subAdminData, setSubAdminData }) {
  const { provider, signer } = useWeb3();
  const account = useActiveAccount();
  const user = useSelector((state) => state.auth.user);

  const theme = useTheme();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setLoader(false);
    setSubAdminData({
      id: null,
      firstName: "",
      lastName: "",
      adminEmail: "",
      adminPassword: "",
      walletAddress: "",
      role: "",
      isActive: "",
      hasMintingAccess: "",
      contractAddress: ""
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
        <DialogTitle id="alert-dialog-slide-title1" className="statusHeading">
          Change Role
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              {subAdminData.role === "User"
                ? "Are you sure you want to change the role of User?"
                : "Are you sure you want to change the role of Sub Admin?"}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2.5 }}>
          {loader ? (
            <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>
          ) : (
            <>
              <Button
                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                onClick={handleClose}
                className="buttonSize"
                size="large"
                color="secondary"
              >
                No
              </Button>
              <Button
                variant="contained"
                className="buttonSize"
                size="large"
                onClick={async () => {
                  if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
                    const address = await signer.getAddress();
                    const nfts = new ethers.Contract(subAdminData.contractAddress, NFTAbi.abi, signer);
                    const escrow = new ethers.Contract(Escrow.address, Escrow.abi, signer);
                    const result = await nfts.hasRole(BLOCKCHAIN.SUB_ADMIN_ROLE, address);
                    setLoader(true);
                    if (subAdminData.role === "User") {
                      try {
                        await (await nfts.grantRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress)).wait();
                        // await (await escrow.grantRole(BLOCKCHAIN.ESCROW_ROLE, subAdminData.walletAddress)).wait();
                        dispatch(
                          changeRole({
                            id: subAdminData.id,
                            page: page,
                            limit: limit,
                            search: search,
                            handleClose: handleClose
                          })
                        );
                      } catch (error) {
                        setOpen(false);
                        setLoader(false);
                        if (provider?.provider?.isMagic && !error?.reason) return;
                        toast.error(error.reason);
                      }
                    } else {
                      if (result) {
                        try {
                          await (await nfts.revokeRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress)).wait();
                          // await (await escrow.revokeRole(BLOCKCHAIN.ESCROW_ROLE, subAdminData.walletAddress)).wait();
                          dispatch(
                            changeRole({
                              id: subAdminData.id,
                              page: page,
                              limit: limit,
                              search: search,
                              brandCategoryId: subAdminData?.BrandCategories[0]?.id || null,
                              handleClose: handleClose
                            })
                          );
                        } catch (error) {
                          setOpen(false);
                          setLoader(false);
                          if (provider?.provider?.isMagic && !error?.reason) return;
                          toast.error(error.reason);
                        }
                      } else {
                        toast.error("Please connect your registered wallet");
                        setOpen(false);
                        setLoader(false);
                      }
                    }
                  }
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
