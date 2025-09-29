import React, { forwardRef, useState } from "react";
import { Box, Stack } from "@mui/system";
import { UploadImage } from "./UploadImage";
// import previewImage from "assets/images/previewImages/preview.png";

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControlLabel,
  Grid,
  IconButton,
  Slide,
  Typography
} from "@mui/material";
import { Icons } from "../../../../../../shared/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { BackgroundRemovalImageSuccess, UploadNftImagesSuccess } from "redux/nftManagement/actions";
import { toast } from "react-toastify";
import { CardImage } from "utils/CardImage";
import { Link } from "react-router-dom";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const UploadPrimaryImgDlg = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  ImageUpload,
  showDlg,
  primaryImage,
  setShowDlg,
  primaryImgLoader,
  formik,
  setErrorsArray,
  errorsArray,
  setPrimaryLoader
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const recentImages = useSelector((state) => state.nftReducer?.upload_nft_images);
  // const [switchremoveBackground, setSwitchRemoveBackground] = useState(false);
  const removeBackgroundLoader = false;
  const dispatch = useDispatch();
  const handleRemoveBackgroundImage = (path) => {
    const removeImage = recentImages.filter((img) => img.path !== path);
    dispatch(UploadNftImagesSuccess(removeImage));
    dispatch(BackgroundRemovalImageSuccess(null));
    // setSwitchRemoveBackground(false);
  };

  const handleSubmitHandler = () => {
    if (!acceptTerms) {
      toast.error("Please accept the image standards.");
    } else {
      setShowDlg(false);
      const checkPrimaryImage = recentImages.some((img) => img.isPrimary === true);
      if (checkPrimaryImage) {
        setErrorsArray(errorsArray.filter((item) => item !== "Media"));
      }
    }
  };

  const cancelHandler = () => {
    const removeImage = recentImages.filter((img) => !img.isPrimary);
    dispatch(UploadNftImagesSuccess(removeImage));
    dispatch(BackgroundRemovalImageSuccess(null));
    // setSwitchRemoveBackground(false);
    setShowDlg(false);
    setPrimaryLoader(false);
    const checkPrimaryImage = recentImages.some((img) => img.isPrimary === true);
    if (!checkPrimaryImage) {
      setErrorsArray([...errorsArray, "Media"]);
    }
  };

  return (
    <Dialog
      open={showDlg}
      aria-labelledby="form-dialog-title"
      className="adminDialog dialog"
      maxWidth="lg"
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description1"
      onClose={() => setShowDlg(false)}
      PaperProps={{
        sx: {
          background: "#252B2F",
          width: "72vw !important",
          maxWidth: "72vw !important",
          maxHeight: "fit-content !important",
          overflowY: "visible"
        }
      }}
    >
      <DialogContent>
        <Typography sx={{ color: "white", fontSize: "24px", fontWegiht: 700 }}>Main Image Compliance</Typography>
        <Stack sx={{ borderBottom: "4px solid #1D2125", mt: 1 }} />
      </DialogContent>
      <Stack sx={{ paddingX: "3rem", width: "43vw" }}>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Stack>
            <Typography sx={{ color: "white", fontSize: "20px", fontWegiht: 700, mb: 2 }}>
              {primaryImage ? "Uploaded Image" : "Upload image"}
            </Typography>
            {primaryImgLoader ? (
              <Stack sx={{ flexDirection: "row", gap: "2rem" }} onClick={() => setShowDlg(true)}>
                <div
                  style={{
                    cursor: "pointer",
                    border: "2px dashed #646769",
                    borderRadius: "5px",
                    height: "215px",
                    width: "215px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#181C1F",
                    marginRight: "auto"
                  }}
                >
                  <div>
                    <Grid container direction="column">
                      <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                        <CircularProgress />
                      </Box>
                    </Grid>
                  </div>
                </div>
              </Stack>
            ) : primaryImage ? (
              <Stack sx={{ position: "relative" }}>
                {/* <img
                  src={primaryImage.path}
                  alt={"primaryImage"}
                  style={{ width: "215px", height: "215px", cursor: "pointer", backgroundColor: "transparent" }}
                  className={"add-nft-container"}
                /> */}
                <CardImage src={primaryImage.path} alt={"primary"} background="transparent" />

                <IconButton
                  color="error"
                  edge="end"
                  size="small"
                  onClick={() => handleRemoveBackgroundImage(primaryImage.path)}
                  sx={{ ml: "3px", position: "absolute", right: "-4%", top: "-5%" }}
                >
                  {/* <Icon icon={closeFill} width={20} height={20} /> */}
                  {Icons.cancelPrimaryImage}
                </IconButton>
              </Stack>
            ) : (
              <UploadImage
                marginRight={"auto"}
                background={"#181C1F"}
                ImageUpload={ImageUpload}
                title="Main/Front Side Photo"
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                isDragAccept={isDragAccept}
                isDragReject={isDragReject}
              />
            )}
          </Stack>
          <Stack>
            <Typography sx={{ color: "white", fontSize: "20px", fontWegiht: 700, mb: 2 }}>
              Preview in Marketplace
            </Typography>

            {removeBackgroundLoader ? (
              <Stack sx={{ flexDirection: "row", gap: "2rem" }}>
                <div
                  style={{
                    cursor: "pointer",
                    border: "2px dashed #646769",
                    borderRadius: "5px",
                    height: "200px",
                    width: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#181C1F",
                    marginRight: "auto"
                  }}
                >
                  <div>
                    <Grid container direction="column">
                      <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                        <CircularProgress />
                      </Box>
                    </Grid>
                  </div>
                </div>
              </Stack>
            ) : primaryImage ? (
              <CardImage
                src={primaryImage.useBackGroundRemoved ? primaryImage?.backgroundRemovedPath : primaryImage.path}
                alt={"primaryImage"}
              />
            ) : // <img
            //   alt="preview in marketplace"
            //   src={primaryImage.useBackGroundRemoved ? primaryImage?.backgroundRemovedPath : primaryImage.path}
            //   style={{
            //     width: "200px",
            //     height: "200px",
            //     background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
            //   }}
            // />
            null}
          </Stack>
        </Stack>
        {primaryImage && (
          <Stack>
            {/* <Switch
              sx={{ marginLeft: "-10px" }}
              checked={primaryImage?.useBackGroundRemoved}
              onChange={() => handleBackGroundRemoval(primaryImage?.useBackGroundRemoved)}
            /> */}

            <Typography sx={{ color: "white", paddingTOp: "10px", fontSize: "16px", fontWeight: "600" }} mt={1}>
              Remove Background
            </Typography>
            <Typography color={"white"} sx={{ fontFamily: "Public Sans", fontWeight: "400" }}>
              Images without backgrounds are more likely to capture user attention and increase the chances of a
              purchase. To remove the background from an image,{" "}
              <Link to="https://www.remove.bg/" target="_blank" style={{ color: "#2F8EFF" }}>
                click here.
              </Link>
            </Typography>
          </Stack>
        )}
        <Stack sx={{ mt: 1 }}>
          <Typography sx={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Main Image Standards</Typography>
          <Typography color={"white"} mt={1}>
            1. The image should have a transparent background.
          </Typography>
          <Typography color={"white"}>2. Use the "Remove background" option to eliminate the background.</Typography>
          <Typography color={"white"}>3. Only paintings are exempt from the plain background requirement.</Typography>
          <Typography color={"white"}>
            4. If the item does not meet this requirement, it will be delisted from the marketplace.
          </Typography>
          <FormControlLabel
            sx={{
              mt: 2,
              color: "white",
              "& .MuiFormControlLabel-label": { marginTop: "4px" }
            }}
            control={
              <Checkbox
                name="checked"
                color="primary"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(!acceptTerms)}
              />
            }
            label="I accept the image meets the required standards for listing the item on Galileo Marketplace"
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ height: "2.6rem" }}>
          <Button
            className="app-text"
            variant="outlined"
            sx={{
              width: "150px",
              color: "#4044ED",
              border: "1.46px solid #4044ED"
            }}
            onClick={() => cancelHandler()}
          >
            Cancel
          </Button>
          <Button
            className="app-text"
            variant="contained"
            sx={{ width: "150px", background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)" }}
            onClick={() => {
              handleSubmitHandler();
            }}
            disabled={primaryImgLoader}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
