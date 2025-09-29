/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import clsx from "clsx";
import "react-circular-progressbar/dist/styles.css";
import closeFill from "@iconify-icons/eva/close-fill";
import { Icon } from "@iconify/react";
import { useDropzone } from "react-dropzone";
// import StarIcon from "@mui/icons-material/Star";
import StarIcon from "../../../../../../shared/Icons/stars";
import CloseIconn from "@mui/icons-material/Close";
import CircleStarIcon from "../../../../../../shared/Icons/filledStar";
import ImageUpload from "assets/images/icons/upload-image.svg";
import axios, { CancelToken, isCancel } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import resetIcon from "assets/images/icons/resetIcon.svg";
import uploadErrorIcon from "assets/images/icons/uploadError.svg";
import { CircularProgressbar } from "react-circular-progressbar";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { CardImage } from "utils/CardImage";
import { toast } from "react-toastify";

export const AddNftMedia = ({
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
  checked,
  videoModel,
  setUploadedImages,
  setPrimaryImage,
  setIsUploadingVideo,
  setIsUploading,
  setUploadProgress,
  setThreeDModelUrl,
  setThreeDFileName,
  setVideoModel,
  setUploadProgressvideo
}) => {
  const MAX_SIZE = 5 * 1024 * 1024;

  const [uploadError, setUploadError] = useState(null);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [uploadErrorforVideo, setUploadErrorforVideo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [videoUrl, setVideoUrl] = useState(null);

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
  const handleRemoveFile = (file, index) => {
    const newFiles = [...formik.values.images];
    newFiles.splice(index, 1);
    setUploadedImages(newFiles);
    formik.setFieldValue("images", newFiles);
    if (index === 0 && primaryImage === true) {
      setPrimaryImage(newFiles.length > 0 ? newFiles[0].image : true);
    }
    if (primaryImage === uploadedImages[index].image) {
      setPrimaryImage(newFiles.length > 0 ? newFiles[0].image : true);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedImages = [...uploadedImages];
      acceptedFiles.map(async (acceptedFile) => {
        let data = { image: acceptedFile, quantity: 1 };
        newUploadedImages = [...newUploadedImages, data];
      });
      formik.setFieldValue("images", newUploadedImages);

      if (primaryImage) {
        setPrimaryImage(newUploadedImages[0].image);
      }
      setUploadedImages(newUploadedImages);
    },

    [formik.setFieldValue, uploadedImages]
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
    setVideoUrl(null);
    setVideoModel(null);
    setIsUploadingVideo(false);
    setUploadProgressvideo(0);
    setUploadErrorforVideo(false);
  };

  const handlePrimaryImage = (value) => {
    setPrimaryImage(value);
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

  return (
    <>
      {uploadedImages.length < 1 ? (
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
        <Grid container spacing={1}>
          <Grid item lg={3} mt={2}>
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

          {formik.values.images.map((file, index) => (
            <Grid item xs={3} lg={3} mt={2} key={file.image.name} sx={{ position: "relative" }}>
              {/* <img src={URL.createObjectURL(file.image)} alt={file.image.name} width="90%" height="200px" /> */}
              <CardImage src={URL.createObjectURL(file.image)} alt={file.image.name} className={"add-nft-container"} />
              <IconButton
                color="error"
                edge="end"
                size="small"
                onClick={() => handleRemoveFile(file.image, index)}
                sx={{ ml: "3px", position: "absolute", right: "3%", top: "2%" }}
              >
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
              <IconButton
                onClick={() => handlePrimaryImage(file.image)}
                color="white"
                sx={{ ml: "3px", position: "absolute", right: "2%", bottom: "2%" }}
              >
                {file.image === primaryImage ? (
                  <CircleStarIcon width={20} height={20} />
                ) : (
                  <StarIcon width={20} height={20} />
                )}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      )}

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

      {/* {checked !== true && formik.values.images.length >= 1 && (
        <ListItem sx={{ justifyContent: "flex-end" }}>
          <Box
            sx={{
              display: "flex",
              background: theme.palette.mode === "dark" ? "#202629" : "#fff",
              border: theme.palette.mode === "dark" ? "" : "1px solid black",
              borderRadius: "5px",
              px: 2,
              py: 0.5
            }}
          >
            <QuantitySelector formik={formik} fileArray={formik.values.images} index={0} />
          </Box>
        </ListItem>
      )} */}
    </>
  );
};
