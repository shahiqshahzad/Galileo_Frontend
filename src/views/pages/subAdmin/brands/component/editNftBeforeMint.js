/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useTheme } from "@emotion/react";
import closeFill from "@iconify-icons/eva/close-fill";
import { Icon } from "@iconify/react";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

import axios, { isCancel } from "axios";

import {
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Slide,
  Switch,
  TextField,
  Tooltip,
  ListItem
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { editNft } from "redux/nftManagement/actions";
import * as Yup from "yup";
import { ErrorMessage } from "utils/ErrorMessage";

import AnimateButton from "ui-component/extended/AnimateButton";

import { Country } from "country-state-city";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { Icons } from "../../../../../shared/Icons/Icons.js";
import { EditNftMedia } from "./editNftMedia.js";
import QuantitySelector from "views/pages/brandAdmin/nftManagement/component/quantitySelector.js";
import { FulfillmentDetails } from "views/pages/brandAdmin/nftManagement/component/addNft/FulfullmentDetails/FulfillmentDetails.js";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function EditReuqestBeforeMintDialog({
  nftInfo,
  type,
  search,
  page,
  limit,
  loader,
  setLoader,
  open,
  setOpen
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [handleToggle, setHandleToggle] = useState(false);
  const [fieldDataArray, setFieldDataArray] = useState([]);
  const [fileDataArray, setFileDataArray] = useState([]);
  const [proofArray, setProofArray] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [newUploadedFiles, setNewUploadedFiles] = useState([]);
  const [newPrimaryFile, setPrimaryFile] = useState(null);
  const [currencyType, setCurrencyType] = useState(nftInfo?.currencyType);
  const [threeDModelUrl, setThreeDModelUrl] = useState(null);
  const [threeDFileName, setThreeDFileName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [threeDModel, set3dModel] = useState(null);
  const [isRemoveVideo, setIsRemoveVideo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [animationUrl, setAnimationUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploadProgressvideo, setUploadProgressvideo] = useState(0);
  const [videoModel, setVideoModel] = useState(null);
  const [uploadErrorforVideo, setUploadErrorforVideo] = useState(null);
  const [nftStatus, setNftStatus] = useState("NFT");
  const [nftDetailsData, setNftDetailsData] = useState();
  const [shipmentMethod, setShipmentMethod] = useState();
  const [shipmentMethodPayload, setShipmentMethodPayload] = useState({
    flatRateShippingCost: null,
    noExternalCostForMultipleCopies: false,
    weight: null,
    height: null,
    length: null,
    breadth: null,
    warehouseAddressId: null,
    supportedCarrier: null,
    modeOfShipment: { label: "Cheapest", value: "CHEAPEST" },
    shippingCostAdjustment: 0,
    isPurchaseAllowed: false,
    fallBackShippingAmount: null
  });
  const [isEdit, setIsEdit] = useState(false);

  let progressInterval;
  let updateProof = nftInfo?.Proof?.find((value) => value?.Proofs[0]?.proof);
  const [proof, setProof] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(nftInfo?.NFTImages);

  const user = useSelector((state) => state.auth.user);
  const { categoryAddressesList } = useSelector((state) => state.addresses);

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
    if (fileDataArray.length === 0) {
      isValid = false;
      toast.error("Proof of Authenticity is required");
    }
    if (!newPrimaryFile && !primaryImage) {
      isValid = false;
      toast.error("Primary Image is required");
    }

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
      }
    });

    return isValid;
  };

  const validationSchema = Yup.object({
    nftName: Yup.string().required("NFT Name is required!").max(120, "NFT Name can not exceed 120 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid NFT name'),
    nftDescription: Yup.string()
      .required("NFT Description is required!")
      .max(1000, "Invalid NFT description can not exceed 1000 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid NFT description'),
    nftPrice: Yup.number()
      .min(0.000001, "Price should not less than zero")
      .required("NFT Price is required")
      .typeError("Invalid Price"),
    images: Yup.mixed()
  });

  const handleEditNft = () => {
    // Initialize data object to store NFT details
    let data = {};
    // Flag to track validation errors
    let isError = false;

    // Check if shipment method is Free Shipping
    if (shipmentMethod.value === "FS") {
      // Populate data for Free Shipping
      data = { ...nftDetailsData, shippingCalculationMethod: "FS" };

      // Check if shipment method is Flat Rate Shipping
    } else if (shipmentMethod.value === "FRS") {
      // Check if shipment cost is provided for Flat Rate Shipping
      if (!shipmentMethodPayload.flatRateShippingCost) {
        isError = true;
        toast.error("Please add the shipment cost");
      } else {
        // Populate data for Flat Rate Shipping
        data = {
          ...nftDetailsData,
          shippingCalculationMethod: "FRS",
          flatRateShippingCost: shipmentMethodPayload.flatRateShippingCost,
          noExternalCostForMultipleCopies: shipmentMethodPayload.noExternalCostForMultipleCopies
        };
      }

      // Check if shipment cost is provided for Carrier Calculated Shipping
    } else if (shipmentMethod.value === "CCS") {
      // Required fields for Carrier Calculated Shipping
      const fieldDisplayNames = {
        weight: "Weight",
        height: "Height",
        length: "Length",
        breadth: "Breadth",
        warehouseAddressId: "Shipment Address",
        // supportedCarrier: "Supported Carrier",
        modeOfShipment: "Mode of Shipment",
        shippingCostAdjustment: "Shipping Cost Adjustment"
      };
      if (shipmentMethodPayload.isPurchaseAllowed) {
        fieldDisplayNames.fallBackShippingAmount = "Fallback Shipping Amount";
      }
      const requiredFields = Object.keys(fieldDisplayNames);
      // Filter out fields with null or empty values
      const missingFields = requiredFields.filter(
        (field) => shipmentMethodPayload[field] === null || shipmentMethodPayload[field] === ""
      );

      // Check if any required field is missing
      if (missingFields.length > 0) {
        isError = true;
        const errorMessage = `Error: The following fields are required - ${missingFields
          .map((field) => fieldDisplayNames[field])
          .join(", ")}.`;
        toast.error(errorMessage);
      } else {
        // Populate data for Carrier Calculated Shipping
        data = {
          ...nftDetailsData,
          shippingCalculationMethod: "CCS",
          weight: shipmentMethodPayload.weight,
          height: shipmentMethodPayload.height,
          length: shipmentMethodPayload.length,
          breadth: shipmentMethodPayload.breadth,
          warehouseAddressId: shipmentMethodPayload.warehouseAddressId.value,
          modeOfShipment: shipmentMethodPayload.modeOfShipment.value,

          shippingCostAdjustment: shipmentMethodPayload.shippingCostAdjustment,
          isPurchaseAllowed: shipmentMethodPayload.isPurchaseAllowed,
          fallBackShippingAmount: shipmentMethodPayload.fallBackShippingAmount
        };
        if (shipmentMethodPayload?.supportedCarrier?.value) {
          data.supportedCarrier = shipmentMethodPayload.supportedCarrier.value;
        }
      }
    }

    // If there are no validation errors, set loader and dispatch NFT addition
    if (!isError) {
      // setOpen(false);
      setLoader(true);
      dispatch(editNft(data));
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: nftInfo,
    validationSchema,
    onSubmit: (values) => {
      let previousUploadedItems = fileDataArray.filter((data) => {
        if (typeof data.fieldValue === "string") return data;
      });
      let file = values.images[0].image;
      let isFile = file instanceof File;

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
      let newUploaded = proofArray.filter((data) => {
        if (typeof data.id !== "string") return data;
      });

      let arrayId = newUploaded.map((data) => {
        return data.id;
      });
      let arrayProof = newUploaded.map((data) => {
        return data?.Proofs;
      });

      if (isValid) {
        setNftStatus("Fulfillment");

        setNftDetailsData({
          id: nftInfo.id,
          name: values.nftName,
          price: values.nftPrice,
          description: values.nftDescription,
          quantity: values.quantity,
          asset: isFile ? values.images[0].image : null,
          isFile: isFile,
          currencyType: currencyType,
          mintType: nftInfo.mintType,
          metaDataArray: fieldDataArray,
          fileNameArray: fileNameArray,
          fileArray: fileArray,
          previousUploadedItems: previousUploadedItems,
          type: type,
          page: page,
          limit: limit,
          search: search,
          categoryId: nftInfo.CategoryId,
          brandId: nftInfo.brandId,
          primary: primaryImage,
          secondary: uploadedImages,
          primaryEdit: newPrimaryFile,
          secondaryEdit: newUploadedFiles,
          threeDModelUrl: threeDModelUrl ?? "",
          threeDFileName: threeDFileName ?? "",
          videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
          isRemoveVideo: isRemoveVideo,
          role: user.role,
          handleClose: handleClose,
          // brandId: user.BrandId
          setLoader: () => setLoader(false),

          // values for fulfillment detail
          shippingCalculationMethod: nftInfo?.shippingCalculationMethod,
          flatRateShippingCost: nftInfo?.flatRateShippingCost,
          noExternalCostForMultipleCopies: nftInfo?.noExternalCostForMultipleCopies,
          weight: nftInfo?.weight,
          height: nftInfo?.height,
          length: nftInfo?.length,
          breadth: nftInfo?.breadth,
          warehouseAddressId: nftInfo?.warehouseAddressId,
          supportedCarrier: nftInfo?.supportedCarrier,
          modeOfShipment: nftInfo?.modeOfShipment,

          shippingCostAdjustment: nftInfo?.shippingCostAdjustment,
          isPurchaseAllowed: nftInfo?.isPurchaseAllowed,
          fallBackShippingAmount: nftInfo?.fallBackShippingAmount
        });
      }
    }
  });

  const handleRemoveFile = (file) => {
    if (primaryImage === file.asset) {
      setPrimaryImage(null);
    }
    const removeFile = uploadedImages.filter((item) => item !== file && { ...item });
    setUploadedImages(removeFile);
  };
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
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    onDrop: handleDrop,
    multiple: true
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setNftStatus("NFT");
    setShipmentMethod();
    setIsEdit(false);
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
  const handleProofFile = (event, index) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(event.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, JPG, or PDF.");
    } else if (event.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB!");
    } else {
      let array = [...fieldDataArray];
      array[index].proofFile = event;
      array[index].Proofs = null;

      setFieldDataArray(array);
    }
  };

  useEffect(() => {
    if (!isEdit) {
      setFieldDataArray(nftInfo.fieldDataArray);
      setFileDataArray(nftInfo.fileDataArray);
      setCurrencyType(nftInfo.currencyType);
      setThreeDModelUrl(nftInfo.threeDModelUrl);
      setAnimationUrl(nftInfo?.animation_url);
      setUploadedImages(nftInfo.NFTImages);
      setThreeDFileName(nftInfo?.threeDFileName);
      setPrimaryImage(nftInfo?.asset);
      setNewUploadedFiles([]);
      setPrimaryFile(null);

      const shippingMethods = {
        FS: "Free Shipping",
        FRS: "Flat Rate Shipping",
        CCS: "Carrier Calculated Shipping"
      };

      const shipmentMethodData = {
        value: nftInfo?.shippingCalculationMethod,
        label: shippingMethods[nftInfo?.shippingCalculationMethod] || ""
      };

      if (!shipmentMethod?.value) {
        setShipmentMethod(shipmentMethodData);
      }

      const {
        flatRateShippingCost,
        noExternalCostForMultipleCopies,
        weight,
        height,
        length,
        breadth,
        warehouseAddressId,
        shippingCostAdjustment,
        isPurchaseAllowed,
        fallBackShippingAmount
      } = nftInfo || {};

      const shipmentPayloadData = {
        flatRateShippingCost,
        noExternalCostForMultipleCopies,
        weight,
        height,
        length,
        breadth,
        warehouseAddressId: null,
        shippingCostAdjustment,
        isPurchaseAllowed,
        fallBackShippingAmount,
        modeOfShipment: { label: "Cheapest", value: "CHEAPEST" }
      };

      const address = categoryAddressesList?.find((item) => item.id === warehouseAddressId);
      if (address) {
        shipmentPayloadData.warehouseAddressId = { label: address.tag, value: address.id };
      }

      setShipmentMethodPayload(shipmentPayloadData);
      setIsEdit(true);
    }
  }, [nftInfo, open, isEdit]);

  useEffect(() => {}, [fileDataArray]);
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
      }
      set3dModel(acceptedFiles);
      const uploadUrl = `${process.env.REACT_APP_API_URL}/users/uploadImage`;
      try {
        setIsUploading(true);
        const CancelToken = axios.CancelToken;

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

  const cancelVideoUpload = () => {
    setVideoModel(null);
  };

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

  const resetVideoModel = () => {
    formik.setFieldValue("videoModel", "");

    setVideoUrl(null);
    setAnimationUrl(null);
    setVideoModel(null);
    setIsRemoveVideo(true);
    setIsUploadingVideo(false);
    setUploadProgressvideo(0);
    setUploadErrorforVideo(false);
  };

  const downloadMetaDataProofFile = (index, proofLink) => {
    const downloadLink = document.createElement("a");
    downloadLink.download = "downloaded_file";
    downloadLink.href = proofLink;
    downloadLink.click();
  };

  const downloadMetaDataProof = async (index, proofLink) => {
    const response = await fetch(proofLink);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download";
    document.body.appendChild(a);
    a.click();
  };

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

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
        PaperProps={{ sx: { backgroundColor: "#010101" } }}
      >
        <DialogTitle id="alert-dialog-slide-title1" className="adminname">
          {nftStatus === "Fulfillment" ? "Fulfillment Details" : "Edit Product"}
        </DialogTitle>

        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <DialogActions
            sx={{
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              marginX: "20px",
              padding: "0",
              backgroundColor: theme.palette.mode === "dark" ? "#181C1F" : "white",
              borderRadius: "10px"
            }}
          >
            <Button
              type="submit"
              sx={{
                ":hover": {
                  border: "none"
                },
                color: theme.palette.mode === "dark" ? "white" : nftStatus === "NFT" ? "white" : "black",
                my: 1,
                ml: 1,
                padding: { md: "6px 50px", lg: "6px 140px" },
                borderRadius: "8px",
                border: "none"
              }}
              variant={nftStatus === "NFT" ? "contained" : "outlined"}
              className="buttons "
              size="large"
            >
              Product Details
            </Button>
            <Button
              className="buttons"
              size="large"
              type="submit"
              variant={nftStatus === "Fulfillment" ? "contained" : "outlined"}
              sx={{
                ":hover": {
                  border: "none"
                },
                color: theme.palette.mode === "dark" ? "white" : nftStatus === "Fulfillment" ? "white" : "black",
                my: 1,
                ml: 1,
                padding: { md: "6px 50px", lg: "6px 140px" },
                borderRadius: "8px",
                border: "none"
              }}
            >
              Fulfillment Details
            </Button>
          </DialogActions>
        </Grid>

        <DialogContent>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            {nftStatus === "NFT" ? (
              <>
                {" "}
                <Grid container mt={1}>
                  <Grid item xs={4} md={4} lg={4}>
                    <TextField
                      className="textfieldStyle"
                      id="nftName"
                      name="nftName"
                      label="NFT Name"
                      fullWidth
                      inputProps={{ maxLength: 120 }}
                      value={formik.values.nftName}
                      onChange={formik.handleChange}
                      error={formik.touched.nftName && Boolean(formik.errors.nftName)}
                      helperText={formik.touched.nftName && formik.errors.nftName}
                      autoComplete="given-name"
                      variant="standard"
                    />
                    <ErrorMessage textLength={formik.values.nftName?.length} length={120} />
                  </Grid>

                  <Grid item xs={4} md={4} lg={4} pl={2} pr={2}>
                    <TextField
                      className="textfieldStyle"
                      id="nftPrice"
                      name="nftPrice"
                      label="NFT Price"
                      fullWidth
                      value={formik.values.nftPrice}
                      onChange={formik.handleChange}
                      error={formik.touched.nftPrice && Boolean(formik.errors.nftPrice)}
                      helperText={formik.touched.nftPrice && formik.errors.nftPrice}
                      autoComplete="given-name"
                      variant="standard"
                    />
                  </Grid>
                  <Grid xs={4} md={4} lg={4} mt={2}>
                    <TextField
                      className="textfieldStyle"
                      id="type"
                      // type="number"
                      name="type"
                      fullWidth
                      value={nftInfo?.currencyType}
                      variant="standard"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} mt={1}>
                    <TextField
                      className="textfieldStyle"
                      multiline
                      maxRows={2}
                      id="nftDescription"
                      name="nftDescription"
                      label="NFT Description"
                      fullWidth
                      inputProps={{ maxLength: 1000 }}
                      value={formik.values.nftDescription}
                      onChange={formik.handleChange}
                      error={formik.touched.nftDescription && Boolean(formik.errors.nftDescription)}
                      helperText={formik.touched.nftDescription && formik.errors.nftDescription}
                      autoComplete="given-name"
                      variant="standard"
                    />
                    <ErrorMessage textLength={formik.values.nftDescription?.length} length={1000} />
                  </Grid>
                  <Grid item xs={12} mt={1}>
                    <ListItem sx={{ paddingX: 0, my: 1 }}>
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
                        <QuantitySelector formik={formik} />
                      </Box>
                    </ListItem>

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
                            Proofs: null
                          }
                        ]);
                      }}
                    >
                      Add more fields
                    </Button>
                  </Grid>
                </Grid>
                {fieldDataArray?.length !== 0 && (
                  <Grid container spacing={4} mt={1}>
                    {fieldDataArray?.map((data, index) => {
                      if (data.trait_type !== "Serial ID" && data.trait_type !== "Redeemed") {
                        return (
                          <React.Fragment key={index}>
                            <Grid item p={"0 !important"} xs={2} md={2} mt={-0.4}>
                              <TextField
                                sx={{ m: 6, width: "80%", borderRadius: "2%" }}
                                className="w-100"
                                variant="standard"
                                id="outlined-select-budget"
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
                                label="Metadata Name"
                                inputProps={{ maxLength: 200 }}
                                value={data.trait_type}
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
                                  label="Text"
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
                                  onChange={(e) => {
                                    if (e.target.value.length <= 200) {
                                      handleFieldValueChange(e.target.value, index);
                                    }
                                  }}
                                  variant="standard"
                                  fullWidth
                                  inputProps={{ min: 0, maxLength: 200 }}
                                />
                                <ErrorMessage textLength={data?.value?.length} length={200} />
                              </Grid>
                            )}
                            {data.display_type === "Date" && (
                              <Grid item xs={2} md={2} mt={2} overflow={"hidden"} className="my-1 w-100">
                                <DatePicker
                                  showIcon
                                  label="Select date"
                                  value={new Date(data.value)}
                                  selected={new Date(data.value)}
                                  onChange={(e) => {
                                    handleFieldValueChange(e, index);
                                  }}
                                />
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
                              <Grid item xs={2} md={2}>
                                <Select
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
                                      border: "none",
                                      borderBottom:
                                        theme.palette.mode === "dark" ? "1px solid #bdc8f0" : "1px solid #000",
                                      borderRadius: "0px"
                                    }),
                                    singleValue: (provided, state) => ({
                                      ...provided,
                                      color: "white"
                                    }),
                                    option: (provided, state) => ({
                                      ...provided,
                                      border: "0.5px solid grey",
                                      backgroundColor:
                                        theme.palette.mode === "dark"
                                          ? state.isSelected
                                            ? "#2F53FF"
                                            : "#181C1F"
                                          : state.isSelected
                                            ? "#2F53FF"
                                            : "#fff",
                                      color:
                                        theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black"
                                    }),
                                    menu: (base) => ({
                                      ...base,
                                      borderRadius: 0,
                                      marginTop: 0,
                                      background: "black",
                                      color: "white"
                                    })
                                  }}
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
                              {fieldDataArray[index]?.Proofs?.length ? (
                                <>
                                  <Box
                                    as="div"
                                    sx={{ cursor: "pointer", height: "fit-content" }}
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
                                    sx={{ cursor: "pointer", height: "fit-content" }}
                                    onClick={() =>
                                      downloadMetaDataProof(index, fieldDataArray[index]?.Proofs[0]?.decryptedProof)
                                    }
                                  >
                                    <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                                      <span>{Icons.downloadProofDocument}</span>
                                    </Tooltip>
                                  </Box>
                                </>
                              ) : (
                                fieldDataArray[index]?.proofFile && (
                                  <>
                                    <Box
                                      as="div"
                                      sx={{ cursor: "pointer", height: "fit-content" }}
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
                                      sx={{ cursor: "pointer", height: "fit-content" }}
                                      onClick={() =>
                                        downloadMetaDataProofFile(
                                          index,
                                          URL.createObjectURL(fieldDataArray[index]?.proofFile)
                                        )
                                      }
                                    >
                                      <Tooltip
                                        className="fontsize"
                                        title="Download Proof Document"
                                        placement="top"
                                        arrow
                                      >
                                        <span>{Icons.downloadProofDocument}</span>
                                      </Tooltip>
                                    </Box>
                                  </>
                                )
                              )}
                              <Box as="div" sx={{ height: "fit-content" }}>
                                <Tooltip className="fontsize" title="Upload Proof Document" placement="top" arrow>
                                  <label style={{ cursor: "pointer" }} htmlFor={`imgr${index}`}>
                                    {Icons.uploadProofDocuemnt}
                                  </label>
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
                            <Grid item xs={2} mt={2} md={3}>
                              <Tooltip className="fontsize" title="Allow update by NFT owner" placement="top" arrow>
                                <Switch
                                  value={data?.isEditable}
                                  checked={data?.isEditable}
                                  onChange={(e) => handleChange(e, index)}
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
                        );
                      }
                      return null;
                    })}
                  </Grid>
                )}
                {updateProof && (
                  <Grid container mt={1}>
                    <Grid xs={12} mt={2}>
                      <Button
                        className="fieldbutton"
                        variant="contained"
                        sx={{ float: "left", padding: { md: " 6px 38px", lg: "6px 38px" } }}
                        onClick={() => {
                          setProof(true);
                        }}
                      >
                        Update Proof
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid container>
                  <Grid item xs={12} mt={1} pr={3}>
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
                          <React.Fragment key={index}>
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
                                <a
                                  target="_blank"
                                  href={data?.fieldValue}
                                  style={{ color: "#4198e3" }}
                                  rel="noreferrer"
                                >
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
                          </React.Fragment>
                        ))}
                      </Grid>
                    </>
                  )}
                  <EditNftMedia
                    threeDModelUrl={threeDModelUrl}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    cancelUpload={cancelUpload}
                    threeDModel={threeDModel}
                    resetThreeDModel={resetThreeDModel}
                    uploadError={uploadError}
                    dropZone={dropZone}
                    animationUrl={animationUrl}
                    isUploadingVideo={isUploadingVideo}
                    uploadProgressvideo={uploadProgressvideo}
                    cancelVideoUpload={cancelVideoUpload}
                    videoModel={videoModel}
                    resetVideoModel={resetVideoModel}
                    uploadErrorforVideo={uploadErrorforVideo}
                    dropZonevideo={dropZonevideo}
                    threeDFileName={threeDFileName}
                    handleToggle={handleToggle}
                    setHandleToggle={setHandleToggle}
                    getRootProps={getRootProps}
                    getInputProps={getInputProps}
                    isDragActive={isDragActive}
                    isDragAccept={isDragAccept}
                    isDragReject={isDragReject}
                    uploadedImages={uploadedImages}
                    handleRemoveFile={handleRemoveFile}
                    handlePrimary={handlePrimary}
                    newPrimaryFile={newPrimaryFile}
                    newUploadedFiles={newUploadedFiles}
                    handleRemoveUploadedFile={handleRemoveUploadedFile}
                    handlePrimaryFile={handlePrimaryFile}
                  />
                </Grid>{" "}
              </>
            ) : (
              <FulfillmentDetails
                theme={theme}
                formik={formik}
                getCurrency={nftInfo?.currencyType}
                shipmentMethod={shipmentMethod}
                setShipmentMethod={setShipmentMethod}
                shipmentMethodPayload={shipmentMethodPayload}
                setShipmentMethodPayload={setShipmentMethodPayload}
              />
            )}
          </form>
        </DialogContent>
        <Divider />
        <Grid container justifyContent={"end"}>
          {loader ? (
            <DialogActions sx={{ display: "block", margin: "10px 5px 0px 5px", justifyContent: "center" }}>
              <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
                <Grid item>
                  <CircularProgress disableShrink size={"4rem"} />
                </Grid>
              </Grid>

              <Button
                className="buttons"
                variant="Text"
                sx={{ width: "100%", margin: "0px 0px 10px 0px", color: "#2196f3" }}
                size="large"
              >
                Updating the product...
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <AnimateButton>
                <Button
                  className="buttons"
                  size="large"
                  type="submit"
                  variant="outlined"
                  sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                  onClick={() => {
                    if (nftStatus === "NFT") {
                      handleClose();
                    } else {
                      setNftStatus("NFT");
                    }
                  }}
                  disableElevation
                >
                  {nftStatus === "NFT" ? "Cancel" : "Back"}
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUploading || isUploadingVideo}
                  sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                  onClick={() => {
                    if (nftStatus === "NFT") {
                      // On NFT deatils tab checking if all the required values are entered
                      formik.handleSubmit();
                    } else if (shipmentMethod) {
                      handleEditNft();
                    } else {
                      toast.error("Please select a shipment method");
                    }
                  }}
                  className="buttons"
                  size="large"
                  disableElevation
                >
                  {nftStatus === "NFT" ? "Next" : "Apply Changes"}
                </Button>
              </AnimateButton>
            </DialogActions>
          )}
        </Grid>
      </Dialog>
    </>
  );
}
