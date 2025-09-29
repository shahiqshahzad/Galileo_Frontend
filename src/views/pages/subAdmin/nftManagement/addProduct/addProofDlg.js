import React, { useEffect, useState } from "react";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  TextField,
  Button,
  Box,
  Grid,
  Typography
} from "@mui/material";
import { Stack } from "@mui/system";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import ImageUpload from "assets/images/icons/upload-image.svg";
import { toast } from "react-toastify";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const AddProofDlg = ({
  open,
  handleClose,
  fileDataArray,
  setFileDataArray,
  setAuthFileNameBol,
  setErrorsArray,
  errorsArray,
  nftId
}) => {
  const theme = useTheme();
  const MAX_SIZE = 5 * 1024 * 1024;

  const [proofData, setProofData] = useState({ name: "", fileName: "", proofFile: "" });

  let InputProps = {
    style: { borderRadius: 0, background: "#414547" }
  };

  const textfieldStyle = {
    paddingY: "5px",
    paddingX: "10px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    background: "#414547",
    "& fieldset": { border: "none" },
    "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"]
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      // eslint-disable-next-line no-unused-vars
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });
      let name = acceptedFiles[0]?.name;
      if (name.length > 20) {
        name = name.slice(0, 20) + "...";
      }

      setProofData({ ...proofData, fileName: name, proofFile: acceptedFiles[0] });
    },
    multiple: false
  });

  const handleAddProof = async () => {
    if (proofData?.name && proofData?.proofFile) {
      let dataToAdd = { trait_type: proofData.name, value: proofData.proofFile };
      if (nftId) {
        dataToAdd = { fieldName: proofData.name, fieldValue: proofData.proofFile };
      }
      setFileDataArray([...fileDataArray, dataToAdd]);
      setAuthFileNameBol(false);
      handleClose();
      setProofData({ name: "", proofFile: "" });

      let errorsData = [...errorsArray];
      setErrorsArray(errorsData.filter((item) => item !== "Authenticity Files"));
    } else {
      toast.error("Add both name and proof file");
    }
  };

  useEffect(() => {
    setProofData({ name: "", proofFile: "" });
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
        PaperProps={{ style: { background: "#1F2326" } }}
      >
        <form>
          <DialogTitle id="alert-dialog-slide-title1" className="statusHeading ChangeEmail">
            Add Authenticity File
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description1">
              <TextField
                name="field_name"
                placeholder="Name"
                value={proofData.name}
                variant="outlined"
                sx={{ ...textfieldStyle }}
                InputProps={{ ...InputProps }}
                // error={data.trait_type === "" && authFileNameBol}
                // helperText={data.trait_type === "" && authFileNameBol && "Name is required!"}
                onChange={(e) => {
                  setProofData({ ...proofData, name: e.target.value });
                }}
              />
              {proofData?.fileName ? (
                <Typography sx={{ mt: 3, color: "white" }}>{proofData?.fileName}</Typography>
              ) : (
                <Grid
                  sx={{
                    backgroundColor: theme.palette.mode === "dark" ? "#414547" : "white",
                    border: "2px dashed  #646769",
                    borderRadius: "5px",
                    paddingBottom: "1rem",
                    paddingTop: "1rem",
                    width: "25rem",
                    height: "11rem"
                  }}
                  item
                  lg={6}
                  mt={2}
                >
                  <div className={clsx("dropZoneContainer", "xyz")}>
                    <div
                      className={clsx("dropZone", {
                        isDragActive: isDragActive,
                        isDragAccept: isDragAccept,
                        isDragReject: isDragReject
                      })}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />

                      <Grid container direction="column">
                        <Box
                          textAlign="center"
                          component="img"
                          alt="Select File"
                          src={ImageUpload}
                          sx={{ height: 48 }}
                        />
                        <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                          <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                            <b style={{ color: "white" }}>Upload File</b> or drag and drop &nbsp;
                            <Box sx={{ fontSize: "12px" }} mt={0.5}>
                              PNG, JPG or PDF (max file size 5 mb)
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                    </div>
                  </div>
                </Grid>
              )}
            </DialogContentText>
          </DialogContent>
          <Stack sx={{ flexDirection: "row", justifyContent: "flex-end", padding: "24px", gap: "5px" }}>
            <Button
              className="app-text"
              variant="outlined"
              sx={{
                width: "150px",
                color: "#4044ED",
                border: "1.46px solid #4044ED"
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="app-text"
              variant="contained"
              sx={{
                width: "150px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
              onClick={handleAddProof}
            >
              Add
            </Button>
          </Stack>
        </form>
      </Dialog>
    </>
  );
};
