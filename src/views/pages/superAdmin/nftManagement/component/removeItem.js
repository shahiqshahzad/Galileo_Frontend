import { forwardRef } from "react";
import { useDispatch } from "react-redux";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Typography
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import { removedNft } from "redux/nftManagement/actions";
import { LoaderComponent } from "utils/LoaderComponent";
import Stack from "@mui/material/Stack";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function RemovedItemDialog({
  open,
  setOpen,
  page,
  limit,
  search,
  type,
  nftData,
  loader,
  setLoader,
  bulkId
}) {
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    setLoader(false);
  };
  const useStyles = makeStyles((theme) => ({
    dialogPaper: {
      [theme.breakpoints.up("md")]: {
        borderRadius: 0,
        // width: "430px !important",
        // height: "330px !important",
        overflow: "hidden !important",
        background: "#0a0707bd !important"
      }
    }
  }));

  const classes = useStyles();
  const removedIcons = (
    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.5 32C25.6127 32 33 24.8366 33 16C33 7.16344 25.6127 0 16.5 0C7.3873 0 0 7.16344 0 16C0 24.8366 7.3873 32 16.5 32Z"
        fill="url(#paint0_linear_10817_945)"
      />
      <path
        d="M14.0263 12.95C14.6657 11.5862 17.8368 12.0075 18.0926 13.595C16.9673 14.9344 16.3788 19.7944 17.4281 20.0181C17.8374 20.0925 18.4768 18.8031 18.8094 16.9681C18.886 16.5712 19.9089 16.6706 19.8071 17.1663C19.2186 20.0681 18.5541 24.2588 16.3286 24.2588C12.1855 24.2588 12.9783 15.2069 14.0269 12.9506L14.0263 12.95ZM14.9976 9.77562C14.9976 8.66 15.9438 7.74187 17.12 7.74187C18.2963 7.74187 19.2173 8.65937 19.2173 9.77562C19.2173 10.8919 18.2712 11.8337 17.12 11.8337C15.9689 11.8337 14.9976 10.9162 14.9976 9.77562Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_10817_945"
          x1="0"
          y1="0"
          x2="39.8193"
          y2="5.49732"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2F57FF" />
          <stop offset="1" stop-color="#2FA3FF" />
        </linearGradient>
      </defs>
    </svg>
  );
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        sx={{
          padding: "0 !important",
          borderRadius: 0,
          // width: "454px",
          // height: "299px",
          overflow: "hidden",
          background: "#0a0707bd"
        }}
        classes={{ paper: classes.dialogPaper }}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="removedHeading">
          Remove item
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="removedtypo">
              The item will be removed from the marketplace.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1" className="removedText">
            <Stack direction="row" spacing={2}>
              <Button className="actionButton" variant="outlined" startIcon={removedIcons}>
                This action cannot be undone.
              </Button>
            </Stack>
          </DialogContentText>
        </DialogContent>
        {loader ? (
          <LoaderComponent justifyContent={"flex-end"} alignItems={"center"} />
        ) : (
          <DialogActions sx={{ pr: 2.5 }}>
            <Button
              sx={{ color: "#2196f3 !important", borderColor: "#2196f3 !important" }}
              onClick={handleClose}
              color="secondary"
              className="buttonSize"
              size="large"
              variant="outlined"
            >
              cancel
            </Button>
            <Button
              variant="contained"
              className="buttonSize"
              size="large"
              onClick={() => {
                setLoader(true);
                dispatch(
                  removedNft({
                    nftId: nftData.id,
                    id: nftData.id,
                    categoryId: nftData?.CategoryId,
                    type: type,
                    page: page,
                    limit: limit,
                    search: search,
                    brandId: nftData?.BrandId,
                    bulkId: bulkId,
                    handleClose: handleClose,
                    setLoader: setLoader
                  })
                );
              }}
            >
              confim
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
