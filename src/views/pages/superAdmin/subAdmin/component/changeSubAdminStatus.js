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
import { changeSubAdminStatus } from "redux/subAdmin/actions";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ChangeSubAdminStatusDialog({
  open,
  setOpen,
  page,
  limit,
  search,
  subAdminData,
  setSubAdminData
}) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setSubAdminData({
      id: null,
      firstName: "",
      lastName: "",
      adminEmail: "",
      adminPassword: "",
      role: "",
      isActive: "",
      walletAddress: ""
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
          Change Admin Status{" "}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              {subAdminData.isActive === false
                ? "Are you sure you want to unblock this Admin?"
                : "Are you sure you want to block  this Admin?"}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2.5 }}>
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
            onClick={() => {
              dispatch(
                changeSubAdminStatus({
                  id: subAdminData.id,
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
