import { Button, Dialog, DialogActions, DialogContent, Slide } from "@mui/material";
import { forwardRef } from "react";
import Paper from "@mui/material/Paper";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ViewRejectReasonDialog({ nftData, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      // onClose={handleClose}
      maxWidth="md"
      // aria-labelledby="alert-dialog-slide-title1"
      // aria-describedby="alert-dialog-slide-description1"
    >
      <Paper style={{ minWidth: "300px" }}>
        <DialogContent>
          <p style={{ padding: "1rem", overflow: "hidden", wordWrap: "break-word" }}>{nftData.rejectReason}</p>
        </DialogContent>
      </Paper>

      <DialogActions sx={{ pr: 2.5 }}>
        <Button onClick={handleClose} color="primary" variant="contained" className="buttonSize" size="large">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
