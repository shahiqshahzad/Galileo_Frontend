import { forwardRef } from "react";
import CardMedia from "@mui/material/CardMedia";
import { ButtonGroup, Dialog, DialogContent, Slide, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import minimizePicIcon from "assets/images/image-action-icons/minimize-pic.svg";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function FullImage({ open, setOpen, imageIndex, image }) {
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
  const images = image && [...image];

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
            <ButtonGroup
              sx={{
                background: "white",
                borderRadius: "none",
                height: "42px",
                boxShadow: "0px 5px 20px 0px #DDDDDD"
              }}
            >
              <button
                onClick={handleClose}
                style={{ border: "none", backgroundColor: "white", borderRadius: "4px", cursor: "pointer" }}
              >
                <img src={minimizePicIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
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
            image={images?.[imageIndex]?.asset}
            // alt={item.title}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
