import { forwardRef } from "react";
import { useDispatch } from "react-redux";
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
import { deleteBrandAdmin } from "../../../../../../redux/brandAdmin/actions";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function DeleteBrandAdminDialog({ open, setOpen, page, limit, search, brandAdminData }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
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
          Delete Brand Admin
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              Are you sure you want to delete this Admin?
            </Typography>
          </DialogContentText>
        </DialogContent>
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
              dispatch(
                deleteBrandAdmin({
                  id: brandAdminData.id,
                  brandId: brandAdminData.brandId,
                  page: page,
                  limit: limit,
                  search: search,
                  handleClose: handleClose
                })
              );
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
