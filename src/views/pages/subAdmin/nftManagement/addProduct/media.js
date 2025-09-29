/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import clsx from "clsx";
import "react-circular-progressbar/dist/styles.css";
import closeFill from "@iconify-icons/eva/close-fill";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
import CloseIconn from "@mui/icons-material/Close";
import ImageUpload from "assets/images/icons/upload-image.svg";
import axios, { CancelToken, isCancel } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import resetIcon from "assets/images/icons/resetIcon.svg";
import uploadErrorIcon from "assets/images/icons/uploadError.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { toast } from "react-toastify";
import fileFill from "@iconify-icons/eva/file-fill";

import { motion, AnimatePresence } from "framer-motion";
import VComponent from "views/pages/brandAdmin/nftManagement/component/videoPreview";
import { PrimaryImage } from "./addImages/PrimaryImage";
import { useDispatch, useSelector } from "react-redux";
import { UploadNftImages, UploadNftImagesSuccess } from "redux/nftManagement/actions";

export const Media = ({
  primaryImage,
  isUploading,
  cancelVideoUpload,
  uploadProgress,
  threeDModel,
  isUploadingVideo,
  uploadProgressvideo,
  formik,
  theme,
  set3dModel,
  uploadedImages,
  videoModel,
  setUploadedImages,
  setPrimaryImage,
  setIsUploadingVideo,
  setIsUploading,
  setUploadProgress,
  setThreeDModelUrl,
  setThreeDFileName,
  setVideoModel,
  setUploadProgressvideo,
  animationUrl,
  handleToggle,
  setHandleToggle,
  threeDFileName,
  threeDModelUrl,
  setIsRemoveVideo,
  nftId,
  newUploadedFiles,
  setNewUploadedFiles,
  newPrimaryFile,
  setPrimaryFile,
  setAnimationUrl,
  errorsArray,
  setErrorsArray
}) => {
  const MAX_SIZE = 5 * 1024 * 1024;
  const MAX_FILES = 6;
  const [uploadError, setUploadError] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [uploadErrorforVideo, setUploadErrorforVideo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [primaryImgLoader, setPrimaryImgLoader] = useState(false);
  const [secondaryImageLoader, setSecondaryImageLoader] = useState(false);
  const recentImagesState = useSelector((state) => state.nftReducer?.upload_nft_images);
  const recentImages = recentImagesState.filter((img) => img.isPrimary === false);
  const dispatch = useDispatch();
  const cancelUpload = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Upload canceled by user");
    }
  };
  const resetThreeDModel = () => {
    setThreeDModelUrl(null);
    setThreeDFileName(null);
    set3dModel(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(false);
  };

  const handleRemoveFile = (path) => {
    const removeImage = recentImages.filter((img) => img.id !== path);
    const getPrimaryImage = recentImagesState.filter((img) => img.isPrimary === true);
    dispatch(UploadNftImagesSuccess(getPrimaryImage.concat(removeImage)));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      dispatch(
        UploadNftImages({
          acceptedFiles,
          recentImages,
          isPrimary: false,
          setPrimaryLoader: setPrimaryImgLoader,
          setSecondaryImageLoader
        })
      );
    },

    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      const validFiles = acceptedFiles.filter(
        (file) => {
          if (file.size > MAX_SIZE) {
            toast.error(`${file.name} is larger than 5MB`);
            return false;
          }
          return true;
        } // Filter files that exceed the size limit
      );
      if (secondaryImageLoader) {
        toast.warn("Please wait until the current upload is finished.");
        return;
      }
      if (recentImages.length + validFiles.length > MAX_FILES) {
        toast.error(`You can only add up to ${MAX_FILES} images.`);
        return;
      }
      setSecondaryImageLoader(true);
      handleDrop(validFiles, rejectedFiles);
    },
    multiple: true
  });

  const handleDropFor3d = useCallback(
    async (acceptedFiles) => {
      if (
        acceptedFiles &&
        acceptedFiles[0].name.split(".").pop() !== "glb" &&
        acceptedFiles[0].name.split(".").pop() !== "3ds" &&
        acceptedFiles[0].name.split(".").pop() !== "obj"
      ) {
        toast.error("Upload 3D model with these extensions: glb, 3ds");
        return;
      } else if (acceptedFiles[0].size / 1000000 > 10) {
        toast.error("3D model size must be under 10MB");
        return;
      }

      formik.setFieldValue("threeDModel", acceptedFiles);
      set3dModel(acceptedFiles);
      const uploadUrl = `${process.env.REACT_APP_API_URL}/users/uploadImage`;
      try {
        setIsUploading(true);
        const cancelToken = CancelToken.source();
        setCancelTokenSource(cancelToken);

        const formData = new FormData();
        formData.append("image", acceptedFiles[0]);

        const response = await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          cancelToken: cancelToken.token
        });

        setUploadProgress(100);
        setThreeDModelUrl(response.data.data.image);
        setThreeDFileName(acceptedFiles[0].name);

        setIsUploading(false);
      } catch (error) {
        if (isCancel(error)) {
          setIsUploading(false);
        } else {
          setIsUploading(false);
          setUploadError(true);
        }
      }
    },

    [formik.setFieldValue, threeDModel]
  );

  const dropZone = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/3d-graphics": [".3ds"]
    },
    onDrop: handleDropFor3d,
    multiple: false
  });

  const resetVideoModel = () => {
    setVideoModel(null);
    setIsUploadingVideo(false);
    setUploadProgressvideo(0);
    setUploadErrorforVideo(false);

    if (nftId) {
      formik.setFieldValue("videoModel", "");
      setIsRemoveVideo(true);
    }
  };

  const handleDropForvideo = useCallback(
    async (acceptedFiles) => {
      formik.setFieldValue("videoModel", acceptedFiles);

      // Check if the file size exceeds 100MB
      if (acceptedFiles.some((file) => file.size > 100 * 1024 * 1024)) {
        toast.error("File size exceeds 100MB!");
        return;
      }
      if (!acceptedFiles[0]?.type) {
        toast.error("invalid File!");
        return;
      }

      setVideoModel(acceptedFiles);
      try {
        setIsUploadingVideo(true);

        setUploadProgressvideo(100);
        setIsUploadingVideo(false);
      } catch (error) {
        if (isCancel(error)) {
          setIsUploadingVideo(false);
        } else {
          setIsUploadingVideo(false);
          setUploadErrorforVideo(true);
        }
      }
    },

    [formik.setFieldValue, videoModel]
  );

  const dropZonevideo = useDropzone({
    accept: {
      "video/mp4": [".mp4", ".MP4"],
      "video/quicktime": [".mov", ".MOV"]
    },
    onDrop: handleDropForvideo,
    multiple: false
  });

  const resetVideoModelEdit = () => {
    formik.setFieldValue("videoModel", "");

    setAnimationUrl(null);
    setVideoModel(null);
    setIsRemoveVideo(true);
    setIsUploadingVideo(false);
    setUploadProgressvideo(0);
    setUploadErrorforVideo(false);
  };

  return (
    <>
      <Typography sx={{ color: "white", fontSize: "20px", fontWeight: 600 }} className="HeaderFonts">
        Media
      </Typography>
      <Typography sx={{ color: "white", fontSize: "18px", fontWeight: 600 }} mt={2} className="HeaderFonts">
        Primary / Main Image (Click to update)
      </Typography>
      <PrimaryImage formik={formik} setErrorsArray={setErrorsArray} errorsArray={errorsArray} />
      <Typography sx={{ color: "white", fontSize: "18px", fontWeight: 600 }} mt={2} className="HeaderFonts">
        Other Images
      </Typography>

      {!recentImages?.length && !secondaryImageLoader ? (
        <>
          <Grid
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "white",
              border: "2px dashed  #646769",
              borderRadius: "5px",
              paddingBottom: "1rem",
              paddingTop: "1rem"
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
                  <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                  <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                    <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                      <b style={{ color: "white" }}>Upload Image</b> or drag and drop &nbsp;
                      {/* <Link underline="always">browse</Link>.&nbsp; */}
                      <Box sx={{ fontSize: "12px" }} mt={0.5}>
                        PNG, JPG (max file size 5 mb)
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
              </div>
            </div>
          </Grid>
        </>
      ) : (
        <Grid container spacing={1} sx={{ gap: "1rem" }}>
          <Grid item mt={2}>
            <div
              className={clsx("dropZoneContainer", "xyz")}
              style={{
                border: "2px dashed  #646769",
                borderRadius: "5px",
                height: "200px",
                width: "186px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
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
                  <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                  <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                    <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                      <b style={{ color: "white" }}>Upload More &nbsp;</b> <br /> or drag and drop
                    </Typography>
                  </Box>
                </Grid>
              </div>
            </div>
          </Grid>

          {recentImages.length > 0 &&
            recentImages.map((file, index) => (
              <Grid item mt={2} key={index} sx={{ position: "relative" }}>
                <div className="add-nft-container">
                  <img src={file?.path} alt={file?.index} className="image" />
                </div>
                <IconButton
                  color="error"
                  edge="end"
                  size="small"
                  onClick={() => handleRemoveFile(file.id)}
                  sx={{ ml: "3px", position: "absolute", right: "0%", top: "2%" }}
                >
                  <Icon icon={closeFill} width={20} height={20} />
                </IconButton>
              </Grid>
            ))}
          {secondaryImageLoader && (
            <Grid item mt={2}>
              <div
                className={clsx("dropZoneContainer", "xyz")}
                style={{
                  border: "2px dashed  #646769",
                  borderRadius: "5px",
                  height: "200px",
                  width: "186px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
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
            </Grid>
          )}
        </Grid>
      )}

      <Typography sx={{ color: "white", fontSize: "14px", mt: "1rem" }}>
        Upload Video <span style={{ color: "grey" }}>(optional)</span>
      </Typography>
      {!animationUrl && (
        <Grid
          sx={{
            border: "2px dashed  #646769",
            borderRadius: "5px",
            paddingBottom: "1rem",
            paddingTop: "1rem",
            backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "white"
          }}
          item
          lg={12}
          mt={2}
          container
          direction={"column"}
          textAlign={"center"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {isUploadingVideo ? (
            <>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  className={`threed-progress-bar ${uploadProgressvideo === 100 && "threed-progress-bar-100"}`}
                  styles={{ background: "red" }}
                  value={uploadProgressvideo}
                  text={`${uploadProgressvideo}%`}
                />
              </div>
              <div>
                <p>Uploading...</p>
                <Button sx={{ color: "white" }} onClick={cancelVideoUpload}>
                  Cancel
                </Button>
              </div>
            </>
          ) : !isUploadingVideo && uploadProgressvideo === 100 && videoModel ? (
            <>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  className={`threed-progress-bar ${uploadProgressvideo === 100 && "threed-progress-bar-100"}`}
                  styles={{ background: "red" }}
                  value={uploadProgressvideo}
                  text={`${uploadProgressvideo}%`}
                />
              </div>
              <div>
                <p>Upload successful</p>
                <Grid container textAlign={"center"} justifyContent={"center"} alignItems={"center"} gap={"5px"}>
                  <p>{videoModel[0]?.name}</p>
                  <IconButton onClick={resetVideoModel}>
                    <CloseIconn width={20} height={20} />
                  </IconButton>
                </Grid>
              </div>
            </>
          ) : uploadErrorforVideo ? (
            <Grid>
              <img src={uploadErrorIcon} alt="close" />
              <p>Something went wrong</p>
              <Button sx={{ color: "red" }} onClick={resetVideoModel}>
                <img style={{ marginRight: "3px" }} src={resetIcon} alt="close" />
                Reset
              </Button>
            </Grid>
          ) : (
            <div className={clsx("dropZoneContainer", "xyz")}>
              <div
                className={clsx("dropZonevideo", {
                  isDragActive: dropZonevideo.isDragActive,
                  isDragAccept: dropZonevideo.isDragAccept,
                  isDragReject: dropZonevideo.isDragReject
                })}
                {...dropZonevideo.getRootProps()}
              >
                <input type="file" accept="video/mp4, video/quicktime" {...dropZonevideo.getInputProps()} />

                <Grid container direction="column">
                  <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                  <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                    <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                      <b style={{ color: "white" }}>Upload Video</b> or drag and drop &nbsp;
                      <Box sx={{ fontSize: "12px" }} mt={0.5}>
                        mp4,MOV (max. 100mb)
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
              </div>
            </div>
          )}
        </Grid>
      )}
      <AnimatePresence>
        {animationUrl && (
          <Grid item xs={12} lg={12} sx={{ position: "relative", mt: 2 }}>
            <VComponent vid={animationUrl} handleToggle={handleToggle} setHandleToggle={setHandleToggle} />

            <IconButton
              className="closevideoSuperAdmin"
              color="error"
              edge="end"
              size="small"
              onClick={resetVideoModelEdit}
              sx={{ position: "absolute", top: "12px", left: "23%" }}
            >
              <Icon icon={closeFill} width={24} height={24} />
            </IconButton>
          </Grid>
        )}
      </AnimatePresence>
      <Typography sx={{ color: "white", fontSize: "14px", mt: "1rem" }}>
        Upload 3D Model <span style={{ color: "grey" }}>(optional)</span>
      </Typography>
      {!threeDModelUrl && (
        <Grid
          sx={{
            border: "2px dashed  #646769",
            borderRadius: "5px",
            paddingBottom: "1rem",
            paddingTop: "1rem",
            backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "white"
          }}
          item
          lg={12}
          mt={2}
          container
          direction={"column"}
          textAlign={"center"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {isUploading ? (
            <>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  className={`threed-progress-bar ${uploadProgress === 100 && "threed-progress-bar-100"}`}
                  styles={{ background: "red" }}
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                />
              </div>
              <div>
                <p>Uploading...</p>
                <Button sx={{ color: "white" }} onClick={cancelUpload}>
                  Cancel
                </Button>
              </div>
            </>
          ) : !isUploading && uploadProgress === 100 && threeDModel ? (
            <>
              <div style={{ width: 100, height: 100 }}>
                <CircularProgressbar
                  className={`threed-progress-bar ${uploadProgress === 100 && "threed-progress-bar-100"}`}
                  styles={{ background: "red" }}
                  value={uploadProgress}
                  text={`${uploadProgress}%`}
                />
              </div>
              <div>
                <p>Upload successful</p>
                <Grid container textAlign={"center"} justifyContent={"center"} alignItems={"center"} gap={"5px"}>
                  <p>{threeDModel[0].name}</p>
                  <IconButton onClick={resetThreeDModel}>
                    <CloseIconn width={20} height={20} />
                  </IconButton>
                </Grid>
              </div>
            </>
          ) : uploadError ? (
            <Grid>
              <img src={uploadErrorIcon} alt="close" />
              <p>Something went wrong</p>
              <Button sx={{ color: "red" }} onClick={resetThreeDModel}>
                <img style={{ marginRight: "3px" }} src={resetIcon} alt="close" />
                Reset
              </Button>
            </Grid>
          ) : (
            <div className={clsx("dropZoneContainer", "xyz")}>
              <div
                className={clsx("dropZone", {
                  isDragActive: dropZone.isDragActive,
                  isDragAccept: dropZone.isDragAccept,
                  isDragReject: dropZone.isDragReject
                })}
                {...dropZone.getRootProps()}
              >
                <input accept="image/jpeg, image/png, image/jpg" {...dropZone.getInputProps()} />

                <Grid container direction="column">
                  <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                  <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                    <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                      <b style={{ color: "white" }}>Upload 3d Model</b> or drag and drop &nbsp;
                      <Box sx={{ fontSize: "12px" }} mt={0.5}>
                        GLB , 3DS (max file size 10 mb)
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
              </div>
            </div>
          )}
        </Grid>
      )}
      <AnimatePresence>
        {threeDFileName && (
          <ListItem component={motion.div} className="listItem">
            <ListItemIcon>
              <Icon icon={fileFill} width={32} height={32} />
            </ListItemIcon>

            <ListItemText className="encap" primary={threeDFileName} />

            <IconButton color="error" edge="end" size="small" onClick={resetThreeDModel}>
              <Icon icon={closeFill} width={28} height={28} />
            </IconButton>
          </ListItem>
        )}
      </AnimatePresence>
    </>
  );
};
