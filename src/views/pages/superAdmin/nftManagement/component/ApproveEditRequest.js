import { forwardRef, useState } from "react";
import VComponent from "views/pages/brandAdmin/nftManagement/component/videoPreview";
import { AnimatePresence } from "framer-motion";

// material-ui
import { DialogActions, Button, Dialog, Grid, Slide, Typography, CircularProgress, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// assets
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { approveEditNft } from "redux/nftManagement/actions";
import MainCard from "ui-component/cards/MainCard";
import { utils } from "ethers";
import { SNACKBAR_OPEN } from "store/actions";

import moment from "moment";
import { BLOCK_EXPLORER_URL } from "utils/constants";
// slide animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ===============================|| UI DIALOG - FULL SCREEN ||=============================== //

export default function ApproveEditNftDialog({ open, setOpen, page, limit, search, type, nftData, loader, setLoader }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [handleToggle, setHandleToggle] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleClose = () => {
    setLoader(false);
    setOpen(false);
  };

  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      console.log("No crypto wallet found. Please install it.");
      // toast.error('No crypto wallet found. Please install it.');
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

  const handleDirectMint = async () => {
    setLoader(true);
    try {
      dispatch(
        approveEditNft({
          id: nftData.id,
          categoryId: nftData?.CategoryId,
          brandId: nftData?.BrandId,
          ipfsUrl: nftData?.ipfsUrl,
          type: type,
          page: page,
          limit: limit,
          search: search,
          handleClose: handleClose
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.reason);

      setLoader(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        {/*    <IconButton float="left" color="inherit" onClick={handleClose} aria-label="close" size="large">
                    <CloseIcon />
                </IconButton> */}
        <DialogActions sx={{ pr: 2.5, pt: 2.5 }}>
          <Button
            className="buttonSize"
            size="large"
            sx={{ color: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
          >
            <CloseIcon />
          </Button>
        </DialogActions>

        <MainCard
          className="tableShadow"
          sx={{ margin: "20px", overflow: "initial" }}
          title={
            <Grid container>
              <Grid item md={8} xs={12}>
                <Typography
                  variant="h1"
                  component="h3"
                  className="approveHeading"
                  sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                >
                  NFT MetaData
                </Typography>
              </Grid>
            </Grid>
          }
          content={false}
        >
          <Grid container sx={{ pr: 0, pl: 0, pt: 2.5 }}>
            {/*   <caption className="approveHeading">NFT MetaData </caption> */}

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Display Type</TableCell>

                    <TableCell align="center">Trait Type</TableCell>
                    <TableCell align="center">Value</TableCell>
                    <TableCell align="center">Country Code</TableCell>
                    <TableCell align="center">Primary Location</TableCell>
                    <TableCell align="center">isEditable</TableCell>
                    <TableCell align="center">Proof Required</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nftData?.NFTMetaData?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">{row?.display_type}</TableCell>
                      <TableCell align="center">
                        <Tooltip placement="right" title={row?.trait_type}>
                          <span>{row?.trait_type.slice(0, 20)}</span>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip
                          placement="right"
                          title={row?.display_type === "Date" ? moment(row?.value).format("DD MMM YYYY") : row?.value}
                        >
                          <span>
                            {row?.display_type === "Date"
                              ? moment(row?.value).format("DD MMM YYYY")
                              : row?.value?.slice(0, 20)}
                          </span>
                        </Tooltip>
                      </TableCell>

                      {/* <TableCell align="center">{row?.display_type == 'date' ? row?.value : row?.value?.slice(0, 14)}</TableCell> */}
                      <TableCell align="center">{row?.countryCode ? row?.countryCode : "-"}</TableCell>
                      <TableCell align="center">{row?.primaryLocation === true ? "true" : "false"}</TableCell>
                      <TableCell align="center">{row?.isEditable === true ? "true" : "false"}</TableCell>
                      <TableCell align="center">{row?.proofRequired === true ? "true" : "false"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </MainCard>

        <MainCard
          className="tableShadow"
          sx={{ margin: "20px", overflow: "initial" }}
          title={
            <Grid container>
              <Grid item md={8} xs={12}>
                <Typography
                  variant="h1"
                  component="h3"
                  className="approveHeading"
                  sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                >
                  Authenticity Files
                </Typography>
              </Grid>
            </Grid>
          }
          content={false}
        >
          <Grid container sx={{ pr: 0, pl: 0, pt: 2.5 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Field Name </TableCell>

                    <TableCell align="center">Field Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nftData?.NFTMetaFiles?.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell align="center" sx={{ fontSize: "15px", textTransform: "capitalize" }}>
                        {row?.fieldName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "15px", color: "#2194FF", cursor: "pointer" }}
                        onClick={() => {
                          window.open(`${BLOCK_EXPLORER_URL}address/${row?.fieldValue}`, "_blank");
                        }}
                      >
                        {row?.fieldValue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </MainCard>
        {nftData?.animation_url && (
          <MainCard
            className="tableShadow"
            sx={{ margin: "20px", overflow: "initial" }}
            title={
              <Grid container>
                <Grid item md={8} xs={12}>
                  <Typography
                    variant="h1"
                    component="h3"
                    className="approveHeading"
                    sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                  >
                    Video
                  </Typography>
                </Grid>
              </Grid>
            }
            content={false}
          >
            <AnimatePresence>
              <Grid item xs={12} lg={12} sx={{ position: "relative", p: 3 }}>
                <VComponent
                  vid={nftData?.animation_url}
                  handleToggle={handleToggle}
                  setHandleToggle={setHandleToggle}
                />
              </Grid>
            </AnimatePresence>
          </MainCard>
        )}
        <DialogActions sx={{ pr: 2.5, pt: 2.5 }}>
          {loader ? (
            <Button
              // type="submit"
              variant="contained"
              sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
              className="buttons"
              size="large"
              // disableElevation
            >
              <CircularProgress disableShrink sx={{ color: "#fff" }} size={"3rem"} />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
              onClick={() => {
                if ((nftData.mintType === "directMint" || nftData.mintType === "lazyMint") && checkWallet()) {
                  //   if (['directMint', 'lazyMint'].includes(nftData.mintType) && checkWallet()) {
                  handleDirectMint();
                  //   }
                }
              }}
              className="buttons"
              size="large"
              // disableElevation
            >
              Approve
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
