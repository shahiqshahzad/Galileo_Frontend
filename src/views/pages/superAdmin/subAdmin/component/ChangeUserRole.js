import React from "react";
import { forwardRef } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  InputLabel,
  TextField,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import NFTAbi from "contractAbi/NFT.json";
import Escrow from "contractAbi/GalileoEscrow.js";
import { changeRole } from "redux/subAdmin/actions";
import BLOCKCHAIN from "../../../../../constants";
import { checkWallet } from "utils/utilFunctions";
import { useWeb3 } from "utils/MagicProvider";
import { useActiveAccount } from "thirdweb/react";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ChangeUserRole = ({ open, setOpen, subAdminData, setSubAdminData, page, limit, search }) => {
  const account = useActiveAccount();
  const { provider, signer } = useWeb3();
  const user = useSelector((state) => state.auth.user);
  const [contractAddress, setContractAddress] = useState("");
  const [brandCategoryId, setBrandCategoryId] = useState(0);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { brandCategories } = useSelector((state) => state.brandCategoryReducer.brandCategoriesAdminList);

  const handleBrandCategoryChange = (e) => {
    setBrandCategoryId(e.target.value.id);
    setContractAddress(e.target.value.contractAddress);
  };

  const categorySubmitHandler = async () => {
    if (brandCategoryId === 0) {
      toast.error("Please choose a category");
    } else if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
      setLoader(true);
      const address = await signer.getAddress();
      const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
      const escrow = new ethers.Contract(Escrow.address, Escrow.abi, signer);
      const result = await nfts.hasRole(BLOCKCHAIN.SUB_ADMIN_ROLE, address);
      if (result) {
        try {
          await (await nfts.grantRole(BLOCKCHAIN.SUB_ADMIN_ROLE, subAdminData.walletAddress)).wait();
          // await escrow.grantRole(BLOCKCHAIN.ESCROW_ROLE, subAdminData.walletAddress);
          dispatch(
            changeRole({
              id: subAdminData.id,
              brandCategoryId,
              page: page,
              limit: limit,
              search: search,
              handleClose: handleClose
            })
          );
          setLoader(false);
        } catch (err) {
          toast.error(err.reason);
          setOpen(false);
          setLoader(false);
        }
      } else {
        toast.error("Connect to your register wallet");
        setOpen(false);
        setLoader(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
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
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      className="adminDialog dialog"
      maxWidth="md"
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description1"
    >
      <DialogTitle id="alert-dialog-slide-title1" className="statusHeading">
        Change User Role
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={6} md={12} lg={12}>
            <InputLabel className="textfieldStyle">Select Category</InputLabel>
            <TextField
              variant="standard"
              className="responsiveSelectfield textfieldStyle field"
              name="categoryId"
              select
              fullWidth
              onChange={handleBrandCategoryChange}
            >
              {brandCategories?.map((data, index) => (
                <MenuItem key={index} value={data}>
                  {data.Category?.name} ({data.Brand?.name})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {loader ? (
          <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
            <Grid item>
              <CircularProgress disableShrink size={"4rem"} />
            </Grid>
          </Grid>
        ) : (
          <Grid item width={"100%"}>
            <Button
              className="buttons"
              variant="contained"
              sx={{
                width: "100%",
                // margin: '0px 0px 10px 8px',
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
              type="submit"
              size="large"
              disableElevation
              onClick={categorySubmitHandler}
            >
              {/* {subAdminData.id == null ? 'Create ' : 'Update '} */}
              Change Role
            </Button>
            <Button
              className="buttons"
              variant="outlined"
              sx={{
                width: "100%",
                // margin: '0px 0px 10px 8px',
                marginTop: "10px"
              }}
              type="submit"
              size="large"
              disableElevation
              onClick={handleClose}
            >
              {/* {subAdminData.id == null ? 'Create ' : 'Update '} */}
              Cancel
            </Button>
          </Grid>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChangeUserRole;
