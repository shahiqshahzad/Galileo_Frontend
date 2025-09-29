/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { forwardRef, useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import Select from "react-select";
import { ErrorMessage } from "utils/ErrorMessage";
import StarIcon from "shared/Icons/stars";
import CircleStarIcon from "shared/Icons/filledStar";
import * as Yup from "yup";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Divider,
  Box,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { Switch } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import ImageUpload from "assets/images/icons/upload-image.svg";
// import StarIcon from "@mui/icons-material/Star";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { editRequestNft } from "redux/nftManagement/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateProofDialog from "./updateProofDialog";
import closeFill from "@iconify-icons/eva/close-fill";
import { motion, AnimatePresence } from "framer-motion";
import fileFill from "@iconify-icons/eva/file-fill";
import VComponent from "./videoPreview";
import AnimateButton from "ui-component/extended/AnimateButton";
import resetIcon from "assets/images/icons/resetIcon.svg";

import { Country } from "country-state-city";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import axios, { CancelToken, isCancel } from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import CloseIconn from "@mui/icons-material/Close";
import uploadErrorIcon from "assets/images/icons/uploadError.svg";
import { Icons } from "../../../../../shared/Icons/Icons.js";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function EditReuqestNftDialog({
  nftInfo,
  categoryId,
  type,
  search,
  page,
  limit,
  loader,
  setLoader,
  open,
  setOpen,
  bulkId,
  editAndApprove
}) {
  const dispatch = useDispatch();
  const [fieldDataArray, setFieldDataArray] = useState([]);
  const [fileDataArray, setFileDataArray] = useState([]);
  const [proofArray, setProofArray] = useState([]);
  const [metaDataFileArray, setMetaDataFileArray] = useState([]);
  const [metaDataIdArray, setMetaDataIdArray] = useState();
  const [uploadedImages, setUploadedImages] = useState(nftInfo?.NFTImages);
  const [primaryImage, setPrimaryImage] = useState(nftInfo?.asset);
  const [newUploadedFiles, setNewUploadedFiles] = useState([]);
  const [newPrimaryFile, setPrimaryFile] = useState(null);
  let updateProof = nftInfo?.Proof?.find((value) => value?.Proofs[0]?.proof);
  const [proof, setProof] = useState(false);
  const [threeDModelUrl, setThreeDModelUrl] = useState(null);
  const [threeDFileName, setThreeDFileName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [threeDModel, set3dModel] = useState(null);
  const [isRemoveVideo, setIsRemoveVideo] = useState(false);
  const [animationUrl, setAnimationUrl] = useState(null);
  const [uploadErrorforVideo, setUploadErrorforVideo] = useState(null);
  const [videoModel, setVideoModel] = useState(null);
  const [uploadProgressvideo, setUploadProgressvideo] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [videoUrl, setVideoUrl] = useState(null);
  const [handleToggle, setHandleToggle] = useState(false);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  let progressInterval;

  const handleError = (fieldDataArray, fileDataArray) => {
    let isValid = true;
    if (fieldDataArray.length === 0) {
      isValid = false;
      toast.error("Metadata is required");
    }

    fieldDataArray.map((array) => {
      if (array.trait_type === "") {
        isValid = false;
        toast.error(`Metadata name cannot be empty`);
      } else if (array.value === "") {
        isValid = false;
        toast.error(`Metadata value cannot be empty`);
      }
    });
    // }

    fileDataArray.map((array) => {
      if (array.fieldName === "") {
        isValid = false;
        toast.error(`File name field is mandatory`);
      } else if (array.fieldValue == null) {
        isValid = false;
        toast.error(`Attach proof of authenticity`);
      } else if (array.value?.size / 1000000 > 5) {
        isValid = false;
        toast.error(`Please attach a less than 5 mb proof of authenticity`);
      } else if (
        uploadedImages.length === 0 &&
        newUploadedFiles.length === 0 &&
        primaryImage === null &&
        newPrimaryFile === null
      ) {
        toast.error("Please upload a NFT Image");
        isValid = false;
      } else if (primaryImage === null && newPrimaryFile === null) {
        toast.error("please upload Primary Image");
        isValid = false;
      }
    });

    // }

    return isValid;
  };
  const validationSchema = Yup.object({});
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: nftInfo,
    validationSchema,
    onSubmit: (values) => {
      if (isUploading) {
        toast.error("Please wait for the 3D model to be uploaded");
        return;
      }
      // upload video
      if (isUploadingVideo) {
        toast.error("Please wait for the video to be uploaded");
        return;
      }
      let previousUploadedItems = fileDataArray.filter((data) => {
        if (typeof data.fieldValue === "string") return data;
      });

      let newUploadedItems = fileDataArray.filter((data) => {
        if (typeof data.fieldValue !== "string") return data;
      });

      let fileArray = newUploadedItems.map((data) => {
        return data.fieldValue;
      });
      let fileNameArray = newUploadedItems.map((data) => {
        return data.fieldName;
      });

      let isValid = handleError(fieldDataArray, fileDataArray, values);
      // eslint-disable-next-line no-unused-vars
      let newUploaded = proofArray.filter((data) => {
        if (typeof data.id !== "string") return data;
      });

      if (isValid) {
        setLoader(true);
        setOpen(false);

        if (categoryId) {
          dispatch(
            editRequestNft({
              id: nftInfo.id,
              metaDataIdArray: metaDataIdArray ? metaDataIdArray : "",
              metaDataFileArray: metaDataFileArray ? metaDataFileArray : "",
              metaDataArray: fieldDataArray,
              fileNameArray: fileNameArray,
              fileArray: fileArray,
              previousUploadedItems: previousUploadedItems,
              type: type,
              page: page,
              limit: limit,
              search: search,
              categoryId: categoryId,
              primary: primaryImage,
              secondary: uploadedImages,
              primaryEdit: newPrimaryFile,
              secondaryEdit: newUploadedFiles,
              brandId: nftInfo.brandId,
              threeDModelUrl: threeDModelUrl ?? "",
              threeDFileName: threeDModelUrl ? threeDFileName : "",
              videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
              isRemoveVideo: isRemoveVideo,
              handleClose: handleClose,
              setLoader: () => setLoader(false),
              editAndApprove,
              ipfsUrl: nftInfo?.ipfsUrl
            })
          );
        } else {
          dispatch(
            editRequestNft({
              id: nftInfo.id,
              metaDataIdArray: metaDataIdArray ? metaDataIdArray : "",
              metaDataFileArray: metaDataFileArray ? metaDataFileArray : "",
              metaDataArray: fieldDataArray,
              fileNameArray: fileNameArray,
              fileArray: fileArray,
              previousUploadedItems: previousUploadedItems,
              bulkId: bulkId,
              brandId: nftInfo.brandId,
              primary: primaryImage,
              secondary: uploadedImages,
              primaryEdit: newPrimaryFile,
              secondaryEdit: newUploadedFiles,
              threeDModelUrl: threeDModelUrl ?? "",
              threeDFileName: threeDModelUrl ? threeDFileName : "",
              videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
              isRemoveVideo: isRemoveVideo,
              handleClose: handleClose,
              setLoader: () => setLoader(false),
              editAndApprove,
              ipfsUrl: nftInfo?.ipfsUrl,
              categoryId: nftInfo?.categoryId
            })
          );
        }
      }
    }
  });
  const handleDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedImages = [...newUploadedFiles];
      acceptedFiles.map(async (acceptedFile) => {
        let data = { image: acceptedFile };
        newUploadedImages = [...newUploadedImages, data];
      });
      // formik.setFieldValue('NFTImages', newUploadedImages);
      // if (!primaryImage) {
      //   setPrimaryImage(newUploadedImages[0].image);
      // }
      setNewUploadedFiles(newUploadedImages);
    },

    [formik.setFieldValue, newUploadedFiles]
  );
  const MAX_SIZE = 5 * 1024 * 1024;

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
  const handleClose = () => {
    setOpen(false);
    setLoader(false);
    formik.resetForm();
  };

  const handletrait_typeChange = (value, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].trait_type = value;
    setFieldDataArray(array);
  };
  const handleFieldValueChange = (value, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].value = value;
    setFieldDataArray(array);
  };

  const handleChange = (event, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].isEditable = event.target?.checked;
    setFieldDataArray(array);
  };

  const handleproof = (event, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].proofRequired = event.target?.checked;
    setFieldDataArray(array);
  };

  const handleRemoveField = (index) => {
    let array = structuredClone([...fieldDataArray]);
    array.splice(index, 1);
    setFieldDataArray(array);
  };

  const handleFileFieldNameChange = (value, index) => {
    let array = structuredClone(fileDataArray);
    array[index].fieldName = value;
    setFileDataArray(array);
  };
  const handleFileFieldValChange = (value, index) => {
    let array = structuredClone(fileDataArray);
    array[index].fieldValue = value;
    setFileDataArray(array);
  };

  const handleFileRemoveField = (index) => {
    let array = structuredClone(fileDataArray);
    array.splice(index, 1);
    setFileDataArray(array);
  };
  const handleRemoveUploadedFile = (file) => {
    const check = newUploadedFiles.filter((item) => item !== file && { ...item });
    setNewUploadedFiles(check);
  };
  const handleDropFor3d = useCallback(
    async (acceptedFiles) => {
      // formik.setFieldValue('threeDModel', acceptedFiles);
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
        setThreeDFileName(acceptedFiles[0].name);
        setThreeDModelUrl(response.data.data.image);

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

    [threeDModelUrl]
  );
  const dropZone = useDropzone({
    accept: {
      "model/gltf-binary": [".glb"],
      "model/3d-graphics": [".3ds"]
    },
    onDrop: handleDropFor3d,
    multiple: false
  });
  // video upload
  const handleDropForvideo = useCallback(
    async (acceptedFiles) => {
      formik.setFieldValue("videoModel", acceptedFiles);
      if (acceptedFiles.some((file) => file.size > 100 * 1024 * 1024)) {
        toast.error("File size exceeds 100MB!");
        // alert('File size exceeds 100MB!');
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

  const cancelUpload = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Upload canceled by user");
    }
  };
  // upload video
  const cancelVideoUpload = () => {
    setVideoModel(null);
  };
  const resetThreeDModel = () => {
    setThreeDModelUrl(null);
    setThreeDFileName(null);
    set3dModel(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(false);
  };
  // upload video
  const resetVideoModel = () => {
    setVideoUrl(null);
    setAnimationUrl(null);
    setVideoModel(null);
    setIsRemoveVideo(true);
    setIsUploadingVideo(false);
    setUploadProgressvideo(0);
    setUploadErrorforVideo(false);
  };

  const downloadMetaDataProof = async (index, proofLink) => {
    const response = await fetch(proofLink);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "downloaded_file.jpg";
    document.body.appendChild(a);
    a.click();
  };
  const downloadMetaDataProofFile = (index, proofLink) => {
    const downloadLink = document.createElement("a");
    downloadLink.download = "downloaded_file.png";
    downloadLink.href = proofLink;
    downloadLink.click();
  };
  const handleProofFile = (event, index) => {
    let array = [...fieldDataArray];
    array[index].proofFile = event;
    array[index].Proofs = [];
    setFieldDataArray(array);
  };
  const handleRemoveFile = (file) => {
    if (primaryImage === file.asset) {
      setPrimaryImage(null);
    }
    const removeFile = uploadedImages.filter((item) => item !== file && { ...item });
    setUploadedImages(removeFile);
  };
  useEffect(() => {
    setFieldDataArray(nftInfo.fieldDataArray);
    setFileDataArray(nftInfo.fileDataArray);
    setProofArray(nftInfo.fieldDataArray);
    setPrimaryImage(nftInfo.asset);
    setUploadedImages(nftInfo.NFTImages);
    setThreeDModelUrl(nftInfo.threeDModelUrl);
    setThreeDFileName(nftInfo.threeDFileName);
    setAnimationUrl(nftInfo?.animation_url);
    setNewUploadedFiles([]);
    setPrimaryFile(null);
  }, [nftInfo, open]);

  useEffect(() => {}, [fileDataArray]);
  useEffect(() => {}, [fieldDataArray]);
  useEffect(() => {}, [proofArray]);

  // <<<New edit metadata********************************************************************************                                     ***********>
  const handleSelect = (event, index) => {
    let array = [...fieldDataArray];
    array[index].display_type = event.target?.value;
    setFieldDataArray(array);
  };
  const dropdown = [
    {
      value: "Text",
      label: "Text"
    },
    {
      value: "Number",
      label: "Number"
    },
    {
      value: "Date",
      label: "Date"
    },
    {
      value: "Location",
      label: "Location"
    }
  ];
  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = fieldDataArray.map((item, i) => {
      if (i === index) {
        return { ...item, primaryLocation: true };
      }
      return { ...item, primaryLocation: false };
    });
    setFieldDataArray([...updatedCheckboxes]);
  };
  const handlePrimary = (ImageId) => {
    if (newPrimaryFile) {
      const recent = [...newUploadedFiles, newPrimaryFile];
      setNewUploadedFiles(recent);
      setPrimaryFile(null);
    }
    setUploadedImages((prev) => prev.map((item) => (item.isPrimary === true ? { ...item, isPrimary: false } : item)));
    setUploadedImages((prev) => prev.map((item) => (item.id === ImageId ? { ...item, isPrimary: true } : item)));
    setPrimaryImage(ImageId);
    formik.setFieldValue(uploadedImages);
  };

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
  useEffect(() => {
    if (isUploading) {
      progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress < 90 ? prevProgress + 1 : prevProgress;

          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [isUploading]);
  useEffect(() => {
    if (uploadProgress === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgress]);
  // upload video
  useEffect(() => {
    if (isUploadingVideo) {
      progressInterval = setInterval(() => {
        setUploadProgressvideo((prevProgress) => {
          const newProgress = prevProgress < 90 ? prevProgress + 1 : prevProgress;

          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval);
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [isUploadingVideo]);
  useEffect(() => {
    if (uploadProgressvideo === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgressvideo]);

  return (
    <>
      <UpdateProofDialog
        open={proof}
        setOpen={setProof}
        proofArray={proofArray}
        updateProof={updateProof}
        setProofArray={setProofArray}
        metaDataFileArray={metaDataFileArray}
        setMetaDataFileArray={setMetaDataFileArray}
        setMetaDataIdArray={setMetaDataIdArray}
      />
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        // className="brandDialog Nftdialog"
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="adminname">
          Edit Details
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container mt={1}>
              <Grid xs={12} mt={2}>
                <Button
                  className="fieldbutton"
                  variant="contained"
                  sx={{ float: "left", padding: { md: " 6px 38px", lg: "6px 38px" } }}
                  onClick={() => {
                    setFieldDataArray([
                      ...fieldDataArray,
                      {
                        display_type: "Text",
                        trait_type: "",
                        value: "",
                        countryCode: "",
                        isEditable: false,
                        proofRequired: false,
                        primaryLocation: false,
                        Proofs: []
                      }
                    ]);
                  }}
                >
                  Add Properties
                </Button>
              </Grid>
            </Grid>

            {fieldDataArray.length !== 0 && (
              <>
                <Grid container spacing={4} mt={1}>
                  {fieldDataArray.map(
                    (data, index) =>
                      data.trait_type !== "Serial ID" &&
                      data.trait_type !== "Redeemed" && (
                        <React.Fragment key={index}>
                          <Grid xs={2} md={2} mt={-0.4}>
                            <TextField
                              sx={{
                                m: 6,
                                width: "80%",
                                borderRadius: "2%",
                                marginTop: "31px"
                              }}
                              InputLabelProps={{ sx: { paddingTop: "6px" } }}
                              className="w-100"
                              // className="textfieldStyle"
                              variant="standard"
                              id="outlined-select-budget"
                              label={"Select Type"}
                              select
                              fullWidth
                              value={data.display_type}
                              onChange={(e) => {
                                handleSelect(e, index);
                                if (e.target.value === "Date") {
                                  let data = fieldDataArray[index];
                                  data.value = new Date();
                                  fieldDataArray[index] = data;
                                  setFieldDataArray([...fieldDataArray]);
                                } else {
                                  let data = fieldDataArray[index];
                                  data.value = "";
                                  fieldDataArray[index] = data;
                                  setFieldDataArray([...fieldDataArray]);
                                }
                              }}
                              // value={drop}
                              // onChange={metadataDropDown}
                            >
                              {dropdown.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={2} md={2}>
                            <TextField
                              id="field_name"
                              className="textfieldStyle"
                              name="field_name"
                              label={"Property Name"}
                              value={data.trait_type}
                              inputProps={{ maxLength: 200 }}
                              onChange={(e) => {
                                handletrait_typeChange(e.target.value, index);
                              }}
                              variant="standard"
                              fullWidth
                            />
                            <ErrorMessage textLength={data?.trait_type?.length} length={200} />
                          </Grid>
                          {data.display_type === "Text" && (
                            <Grid item xs={2} md={2}>
                              <TextField
                                className="textfieldStyle"
                                id="field_value"
                                name="field_value"
                                label={"Value"}
                                value={data.value}
                                inputProps={{ maxLength: 200 }}
                                onChange={(e) => {
                                  handleFieldValueChange(e.target.value, index);
                                }}
                                variant="standard"
                                fullWidth
                              />
                              <ErrorMessage textLength={data?.value?.length} length={200} />
                            </Grid>
                          )}
                          {data.display_type === "Number" && (
                            <Grid item xs={2} md={2}>
                              <TextField
                                className="textfieldStyle"
                                id="Number"
                                name="Number"
                                label="Number"
                                type="number"
                                value={data.value}
                                inputProps={{ min: 0, maxLength: 200 }}
                                onChange={(e) => {
                                  if (e.target.value.length <= 200) {
                                    handleFieldValueChange(e.target.value, index);
                                  }
                                }}
                                variant="standard"
                                fullWidth
                              />
                              <ErrorMessage textLength={data?.value?.length} length={200} />
                            </Grid>
                          )}
                          {data.display_type === "Date" && (
                            <Grid item xs={2} md={3} mt={2}>
                              <Box as="div" sx={{ width: "50%" }}>
                                <DatePicker
                                  showIcon
                                  label="Select date"
                                  value={new Date(data.value)}
                                  selected={new Date(data.value)}
                                  onChange={(e) => {
                                    handleFieldValueChange(e, index);
                                  }}
                                />
                              </Box>
                            </Grid>
                          )}
                          {data.display_type === "Location" && (
                            <Grid item xs={2} md={1}>
                              <TextField
                                className="textfieldStyle"
                                id="Postal Code"
                                name="Postal Code"
                                label="Postal Code"
                                value={data.value}
                                onChange={(e) => {
                                  handleFieldValueChange(e.target.value, index);
                                }}
                                variant="standard"
                                // fullWidth
                              />
                              <input
                                type="checkbox"
                                checked={fieldDataArray[index].primaryLocation}
                                onChange={() => handleCheckboxChange(index)}
                              />
                            </Grid>
                          )}

                          {data.display_type === "Location" && (
                            <Grid
                              item
                              xs={2}
                              md={2}
                              //  sx={{ m: 2, width: '45%', borderRadius: '2%' }}
                            >
                              {/* <TextField
                            className="textfieldStyle"
                            id="Number"
                            name="Number"
                            label="country Code"
                            value={data?.countryCode}
                            onChange={(e) => {
                              handlecountryCodeChange(e.target.value, index);
                            }}
                            variant="standard"
                            fullWidth
                          /> */}
                              <Select
                                // styles={style}
                                // className="selectFieldDesign"
                                // label={selectedCode}
                                placeholder="select  Country"
                                options={Country?.getAllCountries()}
                                getOptionLabel={(options) => {
                                  return options["name"] ? options["name"] : options["label"];
                                }}
                                getOptionValue={(options) => {
                                  return options["name"] ? options["name"] : options["value"];
                                }}
                                value={
                                  fieldDataArray[index]?.countryCode
                                    ? {
                                        value: fieldDataArray[index]?.countryCode,
                                        label: fieldDataArray[index]?.countryCode
                                      }
                                    : ""
                                }
                                onChange={(item) => {
                                  // formik.setFieldValue("country", item?.phonecode);
                                  let data = structuredClone(fieldDataArray[index]);
                                  data.countryCode = item.isoCode;
                                  fieldDataArray[index] = data;
                                  setFieldDataArray([...fieldDataArray]);
                                }}
                              />
                            </Grid>
                          )}
                          <Grid item xs={2} md={2} mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
                            {fieldDataArray[index].proofFile ? (
                              <>
                                <Box
                                  as="div"
                                  onClick={() =>
                                    window.open(URL.createObjectURL(fieldDataArray[index]?.proofFile), "_blank")
                                  }
                                >
                                  <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                                    <span>{Icons.viewProofDocument}</span>
                                  </Tooltip>
                                </Box>
                                <Box
                                  as="div"
                                  onClick={() =>
                                    downloadMetaDataProofFile(
                                      index,
                                      URL.createObjectURL(fieldDataArray[index]?.proofFile)
                                    )
                                  }
                                >
                                  <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                                    <span>{Icons.downloadProofDocument}</span>
                                  </Tooltip>
                                </Box>
                              </>
                            ) : (
                              fieldDataArray[index]?.Proofs.length !== 0 && (
                                <>
                                  <Box
                                    as="div"
                                    onClick={() =>
                                      window.open(fieldDataArray[index]?.Proofs[0]?.decryptedProof, "_blank")
                                    }
                                  >
                                    <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                                      <span>{Icons.viewProofDocument}</span>
                                    </Tooltip>
                                  </Box>
                                  <Box
                                    as="div"
                                    onClick={() =>
                                      downloadMetaDataProof(index, fieldDataArray[index]?.Proofs[0]?.decryptedProof)
                                    }
                                  >
                                    <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                                      <span>{Icons.downloadProofDocument}</span>
                                    </Tooltip>
                                  </Box>
                                </>
                              )
                            )}

                            <Box as="div">
                              <Tooltip className="fontsize" title="Upload Proof Document" placement="top" arrow>
                                <label htmlFor={`imgr${index}`}> {Icons.uploadProofDocuemnt}</label>
                              </Tooltip>
                              <input
                                id={`imgr${index}`}
                                type="file"
                                accept="image/*,.pdf"
                                style={{ display: "none" }}
                                onChange={(e) => handleProofFile(e.target.files[0], index)}
                                onClick={(e) => {
                                  e.target.value = null;
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={3} mt={2} md={2.5}>
                            <Tooltip className="fontsize" title="Allow update by NFT owner" placement="top" arrow>
                              <Switch
                                value={data?.isEditable}
                                checked={data?.isEditable}
                                onChange={(e) => handleChange(e, index)}
                                // inputProps={{ 'aria-label': 'controlled' }}
                              />
                            </Tooltip>
                            {data?.isEditable === true && (
                              <Tooltip
                                className="fontsize"
                                title="Accept proof on update of metadata"
                                placement="top"
                                arrow
                              >
                                <Switch
                                  value={data.proofRequired}
                                  checked={data.proofRequired}
                                  onChange={(e) => handleproof(e, index)}
                                  // inputProps={{ 'aria-label': 'controlled' }}
                                />
                              </Tooltip>
                            )}
                            <IconButton
                              color="error"
                              edge="end"
                              size="small"
                              onClick={() => {
                                handleRemoveField(index);
                              }}
                            >
                              <Icon icon={closeFill} width={28} height={28} />
                            </IconButton>
                          </Grid>
                        </React.Fragment>
                      )
                  )}
                </Grid>
              </>
            )}
            {/* {updateProof && (
              <Grid container mt={1}>
                <Grid xs={12} mt={2}>
                  <Button
                    className="fieldbutton"
                    variant="contained"
                    sx={{ float: 'left', padding: { md: ' 6px 38px', lg: '6px 38px' } }}
                    onClick={() => {
                      setProof(true);
                    }}
                  >
                    Update Proof
                  </Button>
                </Grid>
              </Grid>
            )} */}
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
                  <Grid container spacing={2} mt={1}>
                    {fileDataArray?.map((data, index) => (
                      <>
                        <Grid item xs={3}>
                          <TextField
                            id="field_name"
                            name="field_name"
                            label="File Name"
                            value={data?.fieldName}
                            inputProps={{ maxLength: 200 }}
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
                          // <Grid item xs={3} mt={3}>
                          //   <input
                          //     style={{ display: 'inlineBlock' }}
                          //     type="file"
                          //     id="avatar"
                          //     name="avatar"
                          //     accept="image/*,.pdf"
                          //     // value={data?.fieldValue}
                          //     onChange={(event) => {
                          //       handleFileFieldValChange(event.currentTarget.files[0], index);
                          //     }}
                          //   />
                          // </Grid>
                          <Grid item mt={3} xs={4} md={3} style={{ display: "flex" }}>
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
                                // handleFileFieldValueChange(event.currentTarget.files[0], index);
                              }}
                              style={{ display: "none" }}
                            />
                            <p sx={{ display: "inline-block" }} id={`file-name-${index}`}></p>
                          </Grid>
                        )}
                        {/* {/ <div style={{marginTop:"3%", marginLeft:"2%"}}><b>Previous file: </b > <a target="_blank" href={data.fieldValue}>{data.fieldValue}</a>
                        </div > /} */}
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
                      </>
                    ))}
                  </Grid>
                </>
              )}
              <Typography variant="subtitle1" className="" sx={{ marginY: "10px" }}>
                3D Model
              </Typography>
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
                          <Grid
                            container
                            textAlign={"center"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={"5px"}
                          >
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
                            <Box
                              textAlign="center"
                              component="img"
                              alt="Select File"
                              src={ImageUpload}
                              sx={{ height: 48 }}
                            />
                            <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                              <Typography
                                variant="subtitle"
                                sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}
                              >
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
                      sx={{
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
                            <Grid
                              container
                              textAlign={"center"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              gap={"5px"}
                            >
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
                              <Box
                                textAlign="center"
                                component="img"
                                alt="Select File"
                                src={ImageUpload}
                                sx={{ height: 48 }}
                              />
                              <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                                <Typography
                                  variant="subtitle"
                                  sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}
                                >
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
                <Grid item xs={3} lg={3} mt={2} key={file.UserId} sx={{ position: "relative" }}>
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
                    {file.isPrimary ? <CircleStarIcon width={20} height={20} /> : <StarIcon width={20} height={20} />}
                  </IconButton>
                </Grid>
              ))}
              {newPrimaryFile && (
                <Grid item xs={3} lg={3} mt={2} sx={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(newPrimaryFile.image)}
                    alt={"primaryImage"}
                    width="90%"
                    height="200px"
                  />
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
                newUploadedFiles.map((file) => (
                  <Grid item xs={3} lg={3} mt={2} key={file?.UserId} sx={{ position: "relative" }}>
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
            </Grid>
          </form>
        </DialogContent>
        <Divider />

        <Grid container>
          <DialogActions sx={{ width: "100%", justifyContent: "flex-end" }}>
            {loader ? (
              <AnimateButton>
                <Button
                  // type="submit"
                  variant="text"
                  sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                  // onClick={() => {
                  //   formik.handleSubmit();
                  // }}
                  className="buttons"
                  size="large"
                  disableElevation
                >
                  <CircularProgress disableShrink size={"3rem"} />
                </Button>
              </AnimateButton>
            ) : (
              <>
                <AnimateButton>
                  <Button
                    className="buttons"
                    size="large"
                    type="submit"
                    variant="outlined"
                    sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                    onClick={handleClose}
                    color="primary"
                    disableElevation
                  >
                    Cancel
                  </Button>
                </AnimateButton>
                <AnimateButton>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      my: 1,
                      ml: 1,
                      padding: { md: "6px 50px", lg: "6px 50px" },
                      background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                    }}
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    className="buttons"
                    size="large"
                    disableElevation
                  >
                    Save
                  </Button>
                </AnimateButton>
              </>
            )}
          </DialogActions>
        </Grid>
      </Dialog>
    </>
  );
}
