import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ResellDialog({ open, handleClose, rprice, setRprice, handleResellNft }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Resale</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter the selling price for NFT in USDC</DialogContentText>
        <TextField
          autoFocus
          type="number"
          margin="dense"
          label="Price "
          fullWidth
          variant="standard"
          value={rprice}
          onChange={(e) => {
            setRprice(Number(e.target.value));
          }}
          InputProps={{ inputProps: { min: 0 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="large">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            handleResellNft();
            handleClose();
          }}
        >
          Resell
        </Button>
      </DialogActions>
    </Dialog>
  );
}
