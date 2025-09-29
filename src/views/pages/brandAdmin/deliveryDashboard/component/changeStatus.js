import * as React from "react";
import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Typography
} from "@mui/material";
import { changeStatus } from "redux/deliveryDashboard/actions";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ChangeStatusDialog({ open, setOpen, page, limit, search, user, deliveryId, setDeliveryId }) {
  const theme = useTheme();
  const [status, setStatus] = React.useState("Delivered");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const state = [
    {
      value: "Status",
      label: "Status"
    },
    {
      value: "Delivered",
      label: "Delivered"
    },
    {
      value: "Pending",
      label: "Pending"
    },
    {
      value: "In Process",
      label: "In Process"
    },
    {
      value: "In Transit",
      label: "In Transit"
    }
  ];
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
        <DialogTitle id="alert-dialog-slide-title1">Change Status</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span">
              Are you sure you want to change the status?
            </Typography>

            <Box sx={{ minWidth: 120, margin: "20px" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                  onChange={handleChange}
                >
                  {state.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ pr: 2.5 }}>
          <Button
            sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
          >
            No
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              dispatch(
                changeStatus({
                  brand: user.BrandId,
                  delivery: deliveryId,
                  status: status,
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
