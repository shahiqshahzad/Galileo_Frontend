import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, DialogContentText } from "@mui/material";
import { removedNft } from "redux/nftManagement/actions";
import { LoaderComponent } from "utils/LoaderComponent";
// import { Toast } from "react-toastify/dist/components";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ReduceSupplyDialog({ open, setOpen, count, loader, setLoader, bulkId, BrandId, categoryId }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setQuantity("");
    setOpen(false);
    setLoader(false);
  };
  const useStyles = makeStyles((theme) => ({
    dialogPaper: {
      [theme.breakpoints.up("md")]: {
        borderRadius: 0,
        width: "430px",
        // height: "330px",
        overflow: "hidden",
        background: "#0a0707bd"
      }
    }
  }));
  const [quantity, setQuantity] = useState("");

  const handleQuantityChange = (event) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue) && parseInt(inputValue) !== 0) {
      setQuantity(inputValue);
    }
  };
  const handleQuantity = () => {
    if (quantity > count) {
      setLoader(false);
      toast.error("Provided quantity exceeds available quantity! ");
      return;
    }
    quantity !== "" && setLoader(true);
    dispatch(
      removedNft({
        categoryId: categoryId,
        dListingQty: quantity,
        brandId: BrandId,
        bulkId: bulkId,
        handleClose: handleClose,
        setLoader
      })
    );
  };

  const classes = useStyles();
  let removedIcons = (
    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_10817_985)">
        <path
          d="M16.5 32C25.6127 32 33 24.8366 33 16C33 7.16344 25.6127 0 16.5 0C7.3873 0 0 7.16344 0 16C0 24.8366 7.3873 32 16.5 32Z"
          fill="url(#paint0_linear_10817_985)"
        />
        <path
          d="M16.5 32C25.6127 32 33 24.8366 33 16C33 7.16344 25.6127 0 16.5 0C7.3873 0 0 7.16344 0 16C0 24.8366 7.3873 32 16.5 32Z"
          fill="url(#paint1_linear_10817_985)"
        />
        <path
          d="M14.0263 12.95C14.6657 11.5863 17.8368 12.0075 18.0926 13.595C16.9673 14.9344 16.3788 19.7944 17.4281 20.0181C17.8374 20.0925 18.4768 18.8031 18.8094 16.9681C18.886 16.5713 19.9089 16.6706 19.8071 17.1663C19.2186 20.0681 18.5541 24.2588 16.3286 24.2588C12.1855 24.2588 12.9783 15.2069 14.0269 12.9506L14.0263 12.95ZM14.9976 9.77563C14.9976 8.66001 15.9438 7.74188 17.12 7.74188C18.2963 7.74188 19.2173 8.65938 19.2173 9.77563C19.2173 10.8919 18.2712 11.8338 17.12 11.8338C15.9689 11.8338 14.9976 10.9163 14.9976 9.77563Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_10817_985"
          x1="0"
          y1="0"
          x2="39.8193"
          y2="5.49732"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2F57FF" />
          <stop offset="1" stop-color="#2FA3FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_10817_985"
          x1="0"
          y1="0"
          x2="39.8193"
          y2="5.49732"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2F57FF" />
          <stop offset="1" stop-color="#2FA3FF" />
        </linearGradient>
        <clipPath id="clip0_10817_985">
          <rect width="33" height="32" fill="white" />
        </clipPath>
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
        sx={{ padding: "0 !important", background: "#020101db !important " }}
        classes={{ paper: classes.dialogPaper }}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="removedHeading">
          Supply Adjustment
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <TextField
              className="Finalquantity"
              placeholder="Amount of items to remove"
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              sx={{
                "& input": {
                  background: "#181C1F",
                  width: "367px",
                  height: "70px",
                  textAlign: "left",
                  borderRadius: "9.947px",
                  color: "#757575",
                  fontFamily: theme?.typography.appText,
                  fontSize: "18px !important",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  paddingLeft: "10.5px"
                },

                "& input::placeholder": {
                  color: "#757575",
                  fontFamily: theme?.typography.appText,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  textAlign: "left",
                  paddingLeft: "10.5px"
                }
              }}
            />
          </DialogContentText>
        </DialogContent>
        {quantity !== "" && (
          <DialogTitle id="alert-dialog-slide-title1" className="removedHeading">
            By proceeding you will remove {quantity} {quantity > 1 ? "items" : "item"} from the marketplace
          </DialogTitle>
        )}
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1" className="removedText">
            <Stack direction="row" spacing={2}>
              <Button className="quantityButton" variant="outlined" startIcon={removedIcons}>
                You can only reduce the quantity
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
              Cancel
            </Button>
            <Button
              variant="contained"
              className="buttonSize"
              size="large"
              onClick={() => {
                handleQuantity();
              }}
            >
              Proceed
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
