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
  Typography
} from "@mui/material";
import { deleteNft } from "redux/nftManagement/actions";
import { LoaderComponent } from "utils/LoaderComponent";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function DeleteNFTDialog({
  nftInfo,
  categoryId,
  type,
  search,
  page,
  limit,
  loader,
  setLoader,
  open,
  setOpen
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    setLoader(false);
  };
  const user = useSelector((state) => state.auth.user);

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
          Delete NFT
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              Are you sure you want to delete this Nft?
            </Typography>
          </DialogContentText>
        </DialogContent>
        {loader ? (
          <LoaderComponent justifyContent={"flex-end"} alignItems={"center"} />
        ) : (
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
                setLoader(true);
                dispatch(
                  deleteNft({
                    id: nftInfo.id,
                    categoryId: categoryId,
                    type: type,
                    page: page,
                    limit: limit,
                    search: search,
                    brandId: user.BrandId,
                    handleClose: handleClose
                  })
                );
              }}
            >
              Yes
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
