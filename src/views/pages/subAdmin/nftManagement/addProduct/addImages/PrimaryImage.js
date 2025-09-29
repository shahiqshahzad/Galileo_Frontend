import React, { useCallback, useState } from "react";
import { Box, Stack } from "@mui/system";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { UploadPrimaryImgDlg } from "./UploadPrimaryImgDlg";
import ImageUpload from "assets/images/icons/upload-image.svg";
import { useDispatch, useSelector } from "react-redux";
import { UploadNftImages } from "redux/nftManagement/actions";
import { Grid, Typography } from "@mui/material";

export const PrimaryImage = ({ formik, setErrorsArray, errorsArray }) => {
  const [showDlg, setShowDlg] = useState(false);
  const [primaryImgLoader, setPrimaryLoader] = useState(false);
  const dispatch = useDispatch();
  const MAX_SIZE = 5 * 1024 * 1024;
  const recentImages = useSelector((state) => state.nftReducer?.upload_nft_images);

  const getPrimaryImageArray = recentImages.length > 0 && recentImages.filter((img) => img.isPrimary === true);
  const getPrimaryImage = getPrimaryImageArray[0] ? getPrimaryImageArray[0] : false;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.map(async (acceptedFile) => {
        setPrimaryLoader(true);

        dispatch(UploadNftImages({ acceptedFiles, recentImages, isPrimary: true, setPrimaryLoader }));
      });
    },

    []
  );
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });

      handleDrop(validFiles, rejectedFiles);
    },
    multiple: false
  });
  return (
    <>
      {getPrimaryImage.path ? (
        <Stack mt={2} onClick={() => setShowDlg(true)}>
          <img
            src={getPrimaryImage.useBackGroundRemoved ? getPrimaryImage?.backgroundRemovedPath : getPrimaryImage.path}
            alt={"primaryImage"}
            style={{
              width: "200px",
              cursor: "pointer",
              background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
            }}
            className={"add-nft-container"}
          />
        </Stack>
      ) : (
        <Stack mt={2} sx={{ flexDirection: "row", gap: "2rem" }} onClick={() => setShowDlg(true)}>
          <div
            style={{
              cursor: "pointer",
              border: "2px dashed #646769",
              borderRadius: "5px",
              height: "200px",
              width: "186px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#181C1F",
              marginRight: "auto"
            }}
          >
            <div>
              <Grid container direction="column">
                <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                  <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                    <b style={{ color: "white" }}>Main/Front Side Photo</b> <br />
                    Upload or drag and drop
                    <br />
                    PNG, JPG or GIF
                    <br />
                    (max. 1024*1024px)
                  </Typography>
                </Box>
              </Grid>
            </div>
          </div>
        </Stack>
      )}

      <UploadPrimaryImgDlg
        marginRight={"auto"}
        ImageUpload={ImageUpload}
        title="Main/Front Side Photo"
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
        showDlg={showDlg}
        setShowDlg={setShowDlg}
        primaryImage={getPrimaryImage}
        primaryImgLoader={primaryImgLoader}
        formik={formik}
        setErrorsArray={setErrorsArray}
        errorsArray={errorsArray}
        setPrimaryLoader={setPrimaryLoader}
      />
    </>
  );
};
