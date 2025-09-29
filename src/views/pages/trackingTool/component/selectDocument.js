import { forwardRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, InputLabel, Grid, Slide } from "@mui/material";

// slide animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function SelectDocument({ open, setOpen, Proof }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ width: "80%", margin: "0 auto", maxHeight: "500px" }}
      >
        <Grid container sx={{ pr: 2.5, pl: 2.5 }}>
          <Grid item xs={12} md={12} lg={12} sx={{ p: 2.5 }}>
            <Grid container>
              {Proof &&
                Proof.map((item) => (
                  <Grid item xs={12} md={10} lg={10}>
                    <InputLabel
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        window.open(item?.fieldValue, "_blank");
                      }}
                      htmlFor="outlined-adornment-password-login"
                      className="textfieldStyle"
                    >
                      {item.fieldName}
                    </InputLabel>
                  </Grid>
                ))}
              {/*   <Grid item xs={12} md={2} lg={2}>
                        
                                <CloseIcon  onClick={handleClose}/>
                           
                         
                            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
