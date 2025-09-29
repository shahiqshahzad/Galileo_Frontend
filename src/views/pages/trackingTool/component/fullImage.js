import { forwardRef } from "react";
// import imgMap from 'assets/images/icons/googleMap.svg';
// import corssImg from 'assets/images/icons/cross.svg';
import CardMedia from "@mui/material/CardMedia";

import { ButtonGroup, Dialog, DialogContent, Slide, Grid } from "@mui/material";
import { Icons } from "shared/Icons/Icons";

import { makeStyles } from "@material-ui/core/styles";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FullImage({ open, setOpen, image, imageIndex }) {
  const useStyles = makeStyles((theme) => ({
    dialogPaper: {
      [theme.breakpoints.up("xs")]: {
        width: "408px",
        height: "auto",
        borderRadius: 0,

        maxHeight: "max-content !important",
        overflow: "hidden",
        padding: "0 !important"
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        height: "562px",
        borderRadius: 0,
        maxHeight: "max-content !important",
        overflow: "hidden",
        padding: "0 !important",
        background: "transparent"
      }
    }
  }));
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        sx={{ padding: "0 !important", background: "#020101db !important " }}
        classes={{ paper: classes.dialogPaper }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
        maxWidth="md"
      >
        <DialogContent sx={{ padding: "0 !important" }}>
          <Grid xs={12} sx={{ position: "absolute", top: "20px", right: "20px" }}>
            <ButtonGroup sx={{ background: "white", marginLeft: "10px", borderRadius: "none", height: "42px" }}>
              <button onClick={handleClose} style={{ border: "none", backgroundColor: "white" }}>
                {Icons?.closed}
              </button>
            </ButtonGroup>
          </Grid>

          <CardMedia
            // key={index}
            component="img"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 0
            }}
            image={image?.[imageIndex]?.asset}
            // alt={item.title}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
