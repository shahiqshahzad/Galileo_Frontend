import React, { forwardRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, Slide, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const AddProductWarningDialog = ({ open, handleClose, handleStay }) => {
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
      <DialogContent>
        <Typography>Any unsaved changes will be lost. Are you sure you want to leave this page?</Typography>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}>
          <Button
            className="buttons"
            variant="contained"
            sx={{
              width: "100%",
              background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
            }}
            onClick={handleClose}
          >
            Stay
          </Button>
          <Button className="buttons" variant="outlined" sx={{ width: "100%" }} onClick={handleStay}>
            Leave
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
