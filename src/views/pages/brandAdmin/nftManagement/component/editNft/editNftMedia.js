/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import CloseIconn from "@mui/icons-material/Close";
import VComponent from "../videoPreview";
import { ErrorMessage } from "utils/ErrorMessage";
import {
  Grid,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fileFill from "@iconify-icons/eva/file-fill";
import closeFill from "@iconify-icons/eva/close-fill";
import ImageUpload from "assets/images/icons/upload-image.svg";
import uploadErrorIcon from "assets/images/icons/uploadError.svg";

import clsx from "clsx";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
// import StarIcon from "@mui/icons-material/Star";
import StarIcon from "../../../../../../shared/Icons/stars";
import CircleStarIcon from "../../../../../../shared/Icons/filledStar";
import resetIcon from "assets/images/icons/resetIcon.svg";
import { useDropzone } from "react-dropzone";
import { isCancel } from "axios";

export const EditNftMedia = ({
  setVideoUrl,
  isUploading,
  cancelVideoUpload,
  uploadProgress,
  threeDModel,
  isUploadingVideo,
  uploadProgressvideo,
  uploadedImages,
  videoModel,
  fileDataArray,
  setFileDataArray,
  threeDModelUrl,
  newUploadedFiles,
  handleRemoveUploadedFile,
  newPrimaryFile,
  resetVideoModel,
  setHandleToggle,
  handleToggle,
  animationUrl,
  dropZone,
  resetThreeDModel,
  threeDFileName,
  handleFileRemoveField,
  handleFileFieldValChange,
  handleFileFieldNameChange,
  uploadError,
  uploadErrorforVideo,
  setNewUploadedFiles,
  formik,
  cancelUpload,
  setPrimaryFile,
  setPrimaryImage,
  setUploadedImages,
  primaryImage,
  setVideoModel,
  setIsUploadingVideo,
  setUploadProgressvideo,
  setUploadErrorforVideo
}) => {
  const handleDropForvideo = useCallback(
    async (acceptedFiles) => {
      formik.setFieldValue("videoModel", acceptedFiles);
      if (acceptedFiles.some((file) => file.size > 100 * 1024 * 1024)) {
        toast.error("File size exceeds 100MB!");
        return;
      }
      if (!acceptedFiles[0]?.type) {
        toast.error("invalid File!");
        return;
      }
      // if (acceptedFiles[0]?.type != 'video/mp4') {
      //   toast.error(`please select  video in mp4 !`);
      // }
      setVideoModel(acceptedFiles);
      try {
        setIsUploadingVideo(true);

        setUploadProgressvideo(100);
        setVideoUrl(acceptedFiles[0]);
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

  const handleRemoveFile = (file) => {
    if (primaryImage === file.asset) {
      setPrimaryImage(null);
    }
    const removeFile = uploadedImages.filter((item) => item !== file && { ...item });
    setUploadedImages(removeFile);
  };

  const handlePrimary = (ImageId) => {
    if (newPrimaryFile) {
      // setNewUploadedFiles();
      const recent = [...newUploadedFiles, newPrimaryFile];
      setNewUploadedFiles(recent);
      setPrimaryFile(null);
    }
    setUploadedImages((prev) => prev.map((item) => (item.isPrimary === true ? { ...item, isPrimary: false } : item)));
    setUploadedImages((prev) => prev.map((item) => (item.id === ImageId ? { ...item, isPrimary: true } : item)));
    setPrimaryImage(ImageId);
    formik.setFieldValue(uploadedImages);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedImages = [...newUploadedFiles];
      acceptedFiles.map(async (acceptedFile) => {
        let data = { image: acceptedFile };
        newUploadedImages = [...newUploadedImages, data];
      });
      setNewUploadedFiles(newUploadedImages);
    },
    [formik.setFieldValue, newUploadedFiles]
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
    }
  });
  const MAX_SIZE = 5 * 1024 * 1024;

  const handlePrimaryFile = (file) => {
    setUploadedImages((prev) => prev.map((item) => (item.isPrimary === true ? { ...item, isPrimary: false } : item)));
    if (newPrimaryFile) {
      const recentFile = [...newUploadedFiles, newPrimaryFile];
      const check = recentFile.filter((item) => item !== file && { ...item });
      setNewUploadedFiles(check);
      setPrimaryFile(file);
      setPrimaryImage(null);
    } else {
      const check = newUploadedFiles.filter((item) => item !== file && { ...item });
      setNewUploadedFiles(check);
      setPrimaryFile(file);
      setPrimaryImage(null);
    }
  };

  return (
    <Grid container>
      <Grid xs={12} mt={2} pr={3}>
        <Button
          className="fieldbutton"
          variant="contained"
          sx={{ float: "left" }}
          onClick={() => {
            setFileDataArray([
              ...fileDataArray,
              {
                fieldName: "",
                fieldValue: null
              }
            ]);
          }}
        >
          Add Authenticity Files
        </Button>
      </Grid>
      {fileDataArray?.length !== 0 && (
        <>
          {fileDataArray?.map((data, index) => (
            <Grid container spacing={2} mt={1} key={index}>
              <Grid item xs={4} md={3}>
                <TextField
                  id="field_name"
                  name="field_name"
                  label="File Name"
                  inputProps={{ maxLength: 200 }}
                  value={data?.fieldName}
                  onChange={(e) => {
                    handleFileFieldNameChange(e.target.value, index);
                  }}
                  variant="standard"
                  fullWidth
                />
                <ErrorMessage textLength={data?.fieldName?.length} length={200} />
              </Grid>
              {data?.fieldValue?.length > 1 ? (
                <Grid item xs={3} mt={3.5} className="encap" sx={{}}>
                  <a target="_blank" href={data?.fieldValue} style={{ color: "#4198e3" }} rel="noreferrer">
                    {data?.fieldValue}
                  </a>
                </Grid>
              ) : (
                <Grid item mt={3} xs={4} md={3} style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor={`avatar-${index}`}>
                    <AddCircleOutlinedIcon color="primary" sx={{ fontSize: "2.5rem" }} />
                  </label>
                  <input
                    type="file"
                    id={`avatar-${index}`}
                    name={`avatar-${index}`}
                    accept="image/*,.pdf"
                    onChange={(event) => {
                      const selectedFile = event.currentTarget.files[0];
                      handleFileFieldValChange(selectedFile, index);
                      document.getElementById(`file-name-${index}`).textContent = selectedFile.name;
                    }}
                    style={{ display: "none" }}
                  />
                  <p sx={{ display: "inline-block" }} id={`file-name-${index}`}></p>
                </Grid>
              )}
              <Grid item xs={2} mt={2}>
                <IconButton
                  color="error"
                  edge="end"
                  size="small"
                  onClick={() => {
                    handleFileRemoveField(index);
                  }}
                >
                  <Icon icon={closeFill} width={28} height={28} />
                </IconButton>
              </Grid>
              <Grid item xs={2} mt={2} md={3}></Grid>
            </Grid>
          ))}
        </>
      )}

      <Typography variant="subtitle1" className="" sx={{ marginY: "10px" }}>
        3D Model
      </Typography>
      <>
        {!threeDModelUrl && (
          <Grid
            sx={{ border: "2px dashed  #646769", borderRadius: "5px", paddingBottom: "1rem", paddingTop: "1rem" }}
            item
            lg={12}
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
            ) : !isUploading && uploadProgress === 100 ? (
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
                  <input {...dropZone.getInputProps()} />

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
      </>

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
      <Typography variant="subtitle1" className="" sx={{ marginY: "10px" }}>
        Video
      </Typography>
      {
        <>
          {!animationUrl && (
            <Grid
              sx={{ border: "2px dashed  #646769", borderRadius: "5px", paddingBottom: "1rem", paddingTop: "1rem" }}
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
                      <p>{videoModel[0].name}</p>
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
        </>
      }

      <AnimatePresence>
        {animationUrl && (
          <Grid item xs={12} lg={12} sx={{ position: "relative" }}>
            <VComponent vid={animationUrl} handleToggle={handleToggle} setHandleToggle={setHandleToggle} />

            <IconButton
              className="closevideo"
              color="error"
              edge="end"
              size="small"
              onClick={resetVideoModel}
              sx={{ position: "absolute", top: "12px", left: "23%" }}
            >
              <Icon icon={closeFill} width={28} height={28} />
            </IconButton>
          </Grid>
        )}
      </AnimatePresence>
      <Grid item xs={3} lg={3} mt={2}>
        <div
          className={clsx("dropZoneContainer", "xyz")}
          style={{
            marginRight: "1rem",
            border: "2px dashed  #646769",
            borderRadius: "5px",
            height: "200px",
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
      {uploadedImages?.map((file, index) => (
        <Grid item xs={3} lg={3} mt={2} key={index} sx={{ position: "relative" }}>
          <img
            src={file instanceof File ? URL.createObjectURL(file.image) : file.asset}
            alt={file.UserId}
            width="90%"
            height="200px"
          />
          <IconButton
            color="error"
            edge="end"
            size="small"
            onClick={() => handleRemoveFile(file)}
            sx={{ ml: "3px", position: "absolute", right: "11%", top: "2%" }}
          >
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
          <IconButton
            onClick={() => handlePrimary(file.id)}
            color="white"
            sx={{ ml: "3px", position: "absolute", right: "11%", bottom: "2%" }}
          >
            {/* {<StarBorderIcon width={20} height={20} />} */}
            {file.isPrimary ? <CircleStarIcon width={20} height={20} /> : <StarIcon width={20} height={20} />}
          </IconButton>
        </Grid>
      ))}
      {newPrimaryFile && (
        <Grid item xs={3} lg={3} mt={2} sx={{ position: "relative" }}>
          <img src={URL.createObjectURL(newPrimaryFile.image)} alt={"primaryImage"} width="90%" height="200px" />
          <IconButton
            color="error"
            edge="end"
            size="small"
            // onClick={() => cancleHandler(file.id)}
            onClick={() => toast.error("The primary image cannot be removed.")}
            sx={{ ml: "3px", position: "absolute", right: "11%", top: "2%" }}
          >
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
          <IconButton
            // onClick={() => handlePrimary(file.id)}
            color="white"
            sx={{ ml: "3px", position: "absolute", right: "11%", bottom: "2%" }}
          >
            {/* {<StarBorderIcon width={20} height={20} />} */}
            <CircleStarIcon width={20} height={20} />
          </IconButton>
        </Grid>
      )}
      {newUploadedFiles &&
        newUploadedFiles.map((file, index) => (
          <Grid item xs={3} lg={3} mt={2} key={index} sx={{ position: "relative" }}>
            <img src={URL.createObjectURL(file.image)} alt={file.UserId} width="90%" height="200px" />
            <IconButton
              color="error"
              edge="end"
              size="small"
              onClick={() => handleRemoveUploadedFile(file)}
              sx={{ ml: "3px", position: "absolute", right: "11%", top: "2%" }}
            >
              <Icon icon={closeFill} width={20} height={20} />
            </IconButton>
            <IconButton
              // onClick={() => handlePrimaryImage(file.image)}
              onClick={() => handlePrimaryFile(file)}
              color="white"
              sx={{ ml: "3px", position: "absolute", right: "11%", bottom: "2%" }}
            >
              {<StarIcon width={20} height={20} />}
            </IconButton>
          </Grid>
        ))}
      {/* <List disablePadding className={clsx({ list: hasFile })} sx={{ mt: 3 }}>
    <AnimatePresence>
      {formik.values.images &&
        formik.values.images.map((file, index) => (
          <ListItem key={file.image.name} component={motion.div} className="listItem">
            <ListItemIcon>
              <Icon icon={fileFill} width={32} height={32} />
            </ListItemIcon>

            <ListItemText
              className="encap"
              primary={file.image.name ? file.image.name : ''}
            // secondary={fData(file.image.size) ? fData(file.image.size) : ''}
            // primaryTypographyProps={{
            //     variant: 'body2'
            // }}
            />
            {mintType == 'directMint' && <QuantitySelector formik={formik} fileArray={formik.values.images} index={index} />}

            <IconButton color="error" edge="end" size="small" onClick={() => handleRemoveFile(file.image, index)}>
              <Icon icon={closeFill} width={28} height={28} />
            </IconButton>
          </ListItem>
        ))}
    </AnimatePresence>
  </List> */}
    </Grid>
  );
};
