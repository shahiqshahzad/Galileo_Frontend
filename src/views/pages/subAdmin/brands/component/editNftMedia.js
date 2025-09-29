import React from "react";
import closeFill from "@iconify-icons/eva/close-fill";
import { Icon } from "@iconify/react";
// import StarIcon from "@mui/icons-material/Star";
import StarIcon from "shared/Icons/stars";
import CircleStarIcon from "shared/Icons/filledStar";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import CloseIconn from "@mui/icons-material/Close";
import { Box, Button, Grid, IconButton, Typography, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ImageUpload from "assets/images/icons/upload-image.svg";
import fileFill from "@iconify-icons/eva/file-fill";
import VComponent from "views/pages/brandAdmin/nftManagement/component/videoPreview";
import uploadErrorIcon from "assets/images/icons/uploadError.svg";
import resetIcon from "assets/images/icons/uploadError.svg";
import clsx from "clsx";
import { CardImage } from "utils/CardImage";

export const EditNftMedia = ({
  threeDModelUrl,
  isUploading,
  uploadProgress,
  cancelUpload,
  threeDModel,
  resetThreeDModel,
  uploadError,
  dropZone,
  animationUrl,
  isUploadingVideo,
  uploadProgressvideo,
  cancelVideoUpload,
  videoModel,
  resetVideoModel,
  uploadErrorforVideo,
  dropZonevideo,
  threeDFileName,
  handleToggle,
  setHandleToggle,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  uploadedImages,
  handleRemoveFile,
  handlePrimary,
  newPrimaryFile,
  newUploadedFiles,
  handleRemoveUploadedFile,
  handlePrimaryFile
}) => {
  return (
    <>
      <Grid item lg={3} mt={2}>
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
          {/* <img
            src={file instanceof File ? URL.createObjectURL(file.image) : file.asset}
            alt={file.UserId}
            width="90%"
            height="200px"
          /> */}
          <CardImage
            src={file instanceof File ? URL.createObjectURL(file.image) : file.asset}
            alt={file.UserId}
            className={"add-nft-container"}
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
        newUploadedFiles.map((file, i) => (
          <Grid item xs={3} lg={3} mt={2} key={i} sx={{ position: "relative" }}>
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
      <Grid item xs={12} lg={12} mt={2} sx={{ backgroundColor: "#181C1F" }}>
        <>
          {!threeDModelUrl && (
            <Grid
              sx={{
                border: "2px dashed  #646769",
                borderRadius: "5px",
                paddingBottom: "1rem",
                paddingTop: "1rem"
              }}
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
      </Grid>
      {!animationUrl && (
        <Grid
          sx={{
            backgroundColor: "#181C1F",
            border: "2px dashed  #646769",
            borderRadius: "5px",
            paddingBottom: "1rem",
            paddingTop: "1rem"
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
      <AnimatePresence>
        {animationUrl && (
          <Grid item xs={12} lg={12} sx={{ position: "relative", mt: 2 }}>
            <VComponent vid={animationUrl} handleToggle={handleToggle} setHandleToggle={setHandleToggle} />

            <IconButton
              className="closevideoSuperAdmin"
              color="error"
              edge="end"
              size="small"
              onClick={resetVideoModel}
              sx={{ position: "absolute", top: "12px", left: "23%" }}
            >
              <Icon icon={closeFill} width={24} height={24} />
            </IconButton>
          </Grid>
        )}
      </AnimatePresence>
    </>
  );
};
