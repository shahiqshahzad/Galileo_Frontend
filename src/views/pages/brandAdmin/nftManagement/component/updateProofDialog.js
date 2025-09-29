import { forwardRef } from "react";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";
import { DialogActions, Dialog, Button, InputLabel, Grid, Slide } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

// slide animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ===============================|| UI DIALOG - FULL SCREEN ||=============================== //

export default function UpdateProofDialog({
  open,
  setOpen,
  proofArray,
  updateProof,
  setProofArray,
  previousUploadedItems,
  setMetaDataFileArray,
  setMetaDataIdArray
}) {
  const theme = useTheme();
  const handleFileChange = (file, id) => {
    setMetaDataFileArray((prev) => {
      return [...prev, file];
    });
    setMetaDataIdArray((prev) => {
      return [...prev, id];
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { file: "" },

    onSubmit: async (values) => {
      // console.log('values', values);
      // previousUploadedItems = proofArray.filter((data) => {
      //   if (data?.Proofs) return data;
      // });
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        // onClose={handleClose}
        TransitionComponent={Transition}
        sx={{ width: "80%", margin: "0 auto", maxHeight: "700px" }}
      >
        <DialogActions sx={{ pr: 2.5 }}></DialogActions>
        <Grid container sx={{ pr: 2.5, pl: 2.5 }}>
          <Grid item xs={12} md={12} lg={12} sx={{ p: 2.5 }}>
            <form noValidate onSubmit={formik.handleSubmit}>
              {updateProof &&
                proofArray?.map(
                  (data, index) =>
                    data.trait_type !== "Serial ID" &&
                    data.trait_type !== "Redeemed" &&
                    data?.Proofs[0]?.proof && (
                      <Grid container key={index}>
                        <Grid item xs={12} md={12} lg={12}>
                          <InputLabel
                            htmlFor="outlined-adornment-password-login"
                            className="textfieldStyle"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {data.trait_type}
                          </InputLabel>
                        </Grid>

                        <Grid item xs={12} pt={1} pb={2} md={12} lg={12}>
                          <Grid item xs={12} md={12} lg={12}>
                            <input
                              // ref={fileInputRef}
                              // style={{ display: 'none' }}
                              type="file"
                              id="avatar"
                              name="avatar"
                              acept="image/*,.pdf"
                              // value={data?.fieldValue}
                              onChange={(event) => {
                                handleFileChange(event.currentTarget.files[0], data?.id);
                              }}
                            />

                            {/* <button onClick={handleBrowseClick}>
                              <CloudUploadIcon />
                            
                            </button> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                )}
            </form>
          </Grid>
        </Grid>

        <>
          <DialogActions sx={{ mt: 2, pr: 2.5 }}>
            <Button
              variant="text"
              className="buttonSize"
              size="large"
              type="submit"
              sx={{ color: theme.palette.error.dark }}
              onClick={() => {
                handleClose();
              }}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              className="buttonSize"
              size="large"
              type="submit"
              sx={{ color: theme.palette.success.dark }}
              onClick={() => {
                formik.handleSubmit();
                handleClose();
              }}
              color="secondary"
            >
              Update Proof
            </Button>
          </DialogActions>
        </>
      </Dialog>
    </div>
  );
}
