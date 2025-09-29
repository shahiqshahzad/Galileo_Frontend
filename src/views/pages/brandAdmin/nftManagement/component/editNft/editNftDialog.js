/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import axios, { CancelToken, isCancel } from "axios";
import cloneDeep from "lodash/cloneDeep";

import * as Yup from "yup";
import {
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Divider
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { editNft } from "redux/nftManagement/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AnimateButton from "ui-component/extended/AnimateButton";
import { Country } from "country-state-city";
import { EditNftMedia } from "./editNftMedia";
import { EditNftMetaData } from "./editNftMetaData";
import { EditNftDetail } from "./editNftDetail";
import { useTheme } from "@mui/material/styles";
import { FulfillmentDetails } from "../addNft/FulfullmentDetails/FulfillmentDetails";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
let modeOfShipmentArray = [
  { label: "Fastest", value: "FASTEST" },
  { label: "Cheapest", value: "CHEAPEST" },
  { label: "Best Value", value: "BESTVALUE" }
];

let shipmentMethodArray = [
  { label: "Flat Rate Shipping", value: "FRS" },
  { label: "Free Shipping", value: "FS" },
  { label: "Carrier Calculated Shipping", value: "CCS" }
];

export default function EditNftDialog({
  nftInfo,
  categoryId,
  type,
  search,
  page,
  limit,
  loader,
  setLoader,
  open,
  setOpen
}) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [mintType, setMintType] = useState("directMint");
  const [currencyType, setCurrencyType] = useState(nftInfo?.currencyType);
  const [fieldDataArray, setFieldDataArray] = useState([]);
  const [fileDataArray, setFileDataArray] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [threeDModelUrl, setThreeDModelUrl] = useState(null);
  const [threeDFileName, setThreeDFileName] = useState(null);
  const [isRemoveVideo, setIsRemoveVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [threeDModel, set3dModel] = useState(null);
  const [uploadErrorforVideo, setUploadErrorforVideo] = useState(null);
  const [videoModel, setVideoModel] = useState(null);
  const [uploadProgressvideo, setUploadProgressvideo] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [videoUrl, setVideoUrl] = useState(null);
  const [animationUrl, setAnimationUrl] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  let progressInterval;
  const [newUploadedFiles, setNewUploadedFiles] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [newPrimaryFile, setPrimaryFile] = useState(null);

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
    modeOfShipment: null,

    shippingCostAdjustment: null,
    isPurchaseAllowed: false,
    fallBackShippingAmount: null
  });

  const { addressesList, supportedCarriers } = useSelector((state) => state.addresses);

  useEffect(() => {
    if (!nftInfo) {
      return;
    }
    setPrimaryImage(nftInfo.asset);

    let warehouseAddressData = null;
    if (addressesList?.length) {
      warehouseAddressData = addressesList.find((item) => item.id === nftInfo.warehouseAddressId) || null;
    }
    let supportedCarrierData = null;
    if (supportedCarriers?.length) {
      supportedCarrierData = supportedCarriers.find((item) => item.object_id === nftInfo.supportedCarrier) || null;
    }
    const modeOfShipmentData = modeOfShipmentArray.find((item) => item.value === nftInfo.modeOfShipment) || null;
    const shipmentMethodData =
      shipmentMethodArray.find((item) => item.value === nftInfo.shippingCalculationMethod) || null;

    // setting the fulfillment details
    setShipmentMethod(shipmentMethodData);
    setShipmentMethodPayload({
      flatRateShippingCost: nftInfo.flatRateShippingCost,
      noExternalCostForMultipleCopies: nftInfo.noExternalCostForMultipleCopies,
      weight: nftInfo.weight,
      height: nftInfo.height,
      length: nftInfo.length,
      breadth: nftInfo.breadth,
      modeOfShipment: modeOfShipmentData,
      warehouseAddressId: warehouseAddressData
        ? { label: warehouseAddressData.tag, value: warehouseAddressData.id }
        : null,
      supportedCarrier: supportedCarrierData
        ? { label: supportedCarrierData.carrier_name, value: supportedCarrierData.object_id }
        : null
    });
  }, [nftInfo, addressesList, supportedCarriers, modeOfShipmentArray]);

  const handleCurrencyType = (event) => {
    setCurrencyType(event.target.value);
  };

  const [handleToggle, setHandleToggle] = useState(false);

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
          setThreeDModelUrl(null);
        } else {
          setIsUploading(false);
          setUploadError(true);
          setThreeDModelUrl(null);
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
  const cancelUpload = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Upload canceled by user");
    }
  };
  // upload video
  const cancelVideoUpload = () => {
    setVideoModel(null);
  };
  const handleError = (fieldDataArray, fileDataArray, values) => {
    let isValid = true;
    if (fieldDataArray.length === 0) {
      isValid = false;
      toast.error("Metadata is required");
    }

    // else  (fieldDataArray.length > 0) {

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
    if (fileDataArray.length === 0) {
      isValid = false;
      toast.error("Proof of Authenticity is required");
    }

    //    else (fileDataArray.length > 0) {
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
    // }

    if (values.images.length === 0) {
      toast.error("Please upload a NFT Image");
      isValid = false;
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
    } else if (values.images[0].image.size / 1000000 > 5) {
      toast.error("Please upload a image less than 5 mb");
      isValid = false;
    } else if (newUploadedFiles.some((file) => file.size / 1000000 > 5)) {
      toast.error("Please upload a image less than 5 mb");
      isValid = false;
    } else if (parseInt(values.images[0].quantity) <= 0) {
      toast.error("NFT Quantity should be atleast one");
      isValid = false;
    } else if (
      threeDModel &&
      threeDModel[0].name.split(".").pop() !== "glb" &&
      threeDModel[0].name.split(".").pop() !== "3ds" &&
      threeDModel[0].name.split(".").pop() !== "obj"
    ) {
      toast.error("Upload 3D model with these extensions: glb, 3ds");
      isValid = false;
    }
    const displaylocation = fieldDataArray.find((value) => value.display_type === "Location");
    const trueIndex = fieldDataArray.find((value) => value.primaryLocation === true);

    if (!trueIndex && displaylocation) {
      toast.error("Please select a primary Location for Tracking!");
      isValid = false;
    }

    return isValid;
  };
  const isValidFileType = (file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    return file && allowedTypes.includes(file.type);
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
    // .when(['isUpdate'], {
    //     is: true,
    //     then: Yup.mixed(),
    //     otherwise: Yup.mixed().required('Image is required')
    // })

    // .test('image size',
    //  'this image is too large', (value) => !value || (value && value.size <= 1_000_000))
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: nftInfo,
    validationSchema,
    onSubmit: (values) => {
      if (isUploading) {
        toast.error("Please wait for the 3D model to be uploaded");
        return;
      }
      if (isUploadingVideo) {
        toast.error("Please wait for the video to be uploaded");
        return;
      }
      let file = values.images[0].image;
      let isFile = file instanceof File;

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

      let isValid = handleError(fieldDataArray, fileDataArray, values, isFile);

      if (isValid) {
        setNftStatus("Fulfillment");

        setNftDetailsData({
          id: nftInfo.id,
          name: values.nftName,
          price: values.nftPrice,
          description: values.nftDescription,
          quantity: values.images[0].quantity,
          asset: isFile ? values.images[0].image : null,
          isFile: isFile,
          currencyType: currencyType,
          mintType: mintType,
          metaDataArray: fieldDataArray,
          fileNameArray: fileNameArray,
          fileArray: fileArray,
          previousUploadedItems: previousUploadedItems,
          type: type,
          page: page,
          limit: limit,
          search: search,
          categoryId: categoryId,
          brandId: nftInfo.brandId,
          threeDModelUrl: threeDModelUrl ?? "",
          threeDFileName: threeDModelUrl ? threeDFileName : "",
          videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
          isRemoveVideo: isRemoveVideo,
          primary: primaryImage,
          secondary: uploadedImages,
          primaryEdit: newPrimaryFile,
          secondaryEdit: newUploadedFiles,
          handleClose: handleClose,
          // brandId: user.BrandId
          setLoader: () => setLoader(false)
        });
      }
    }
  });

  const handleAddNft = () => {
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
        supportedCarrier: "Supported Carrier",
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
          supportedCarrier: shipmentMethodPayload.supportedCarrier.value,
          modeOfShipment: shipmentMethodPayload.modeOfShipment.value,

          shippingCostAdjustment: shipmentMethodPayload.shippingCostAdjustment,
          isPurchaseAllowed: shipmentMethodPayload.isPurchaseAllowed,
          fallBackShippingAmount: shipmentMethodPayload.fallBackShippingAmount
        };
      }
    }

    // If there are no validation errors, set loader and dispatch NFT addition
    if (!isError) {
      setLoader(true);
      setOpen(false);
      dispatch(editNft(data));
    }
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();

    // resetting fulfillment details
    setNftDetailsData();
    setShipmentMethodPayload({
      shippingCost: null,
      noExternalCostForMultipleCopies: false,
      weight: null,
      height: null,
      length: null,
      breadth: null,
      warehouseAddressId: null,
      supportedCarrier: null,
      modeOfShipment: null
    });
    setNftStatus("NFT");
    setShipmentMethod();
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

  useEffect(() => {
    setFieldDataArray(cloneDeep(nftInfo?.fieldDataArray));
    setFileDataArray(nftInfo?.fileDataArray);
    setMintType(nftInfo?.mintType);
    setCurrencyType(nftInfo?.currencyType);
    setThreeDModelUrl(nftInfo?.threeDModelUrl);
    setAnimationUrl(nftInfo?.animation_url);
    setUploadedImages(nftInfo?.NFTImages);
    setThreeDFileName(nftInfo?.threeDFileName);
    setPrimaryImage(nftInfo?.asset);
    setNewUploadedFiles([]);
    setPrimaryFile(null);
  }, [open]);

  const handleSelect = (event, index) => {
    let array = [...fieldDataArray];
    array[index].display_type = event.target?.value;
    setFieldDataArray(array);
  };

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = fieldDataArray.map((item, i) => {
      if (i === index) {
        return { ...item, primaryLocation: true };
      }
      return { ...item, primaryLocation: false };
    });
    setFieldDataArray([...updatedCheckboxes]);
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

  const handleRemoveUploadedFile = (file) => {
    const check = newUploadedFiles.filter((item) => item !== file && { ...item });
    setNewUploadedFiles(check);
  };

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
        <DialogTitle id="alert-dialog-slide-title1 " className="adminname">
          Edit NFT
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
              NFT Details
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
        {/* <Divider /> */}
        <DialogContent>
          {nftStatus === "NFT" ? (
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
              <EditNftDetail
                formik={formik}
                currencyType={currencyType}
                handleCurrencyType={handleCurrencyType}
                fieldDataArray={fieldDataArray}
                setFieldDataArray={setFieldDataArray}
              />

              <EditNftMetaData
                fieldDataArray={fieldDataArray}
                setFieldDataArray={setFieldDataArray}
                handleSelect={handleSelect}
                handletrait_typeChange={handletrait_typeChange}
                handleFieldValueChange={handleFieldValueChange}
                handleCheckboxChange={handleCheckboxChange}
                Country={Country}
                isValidFileType={isValidFileType}
                handleChange={handleChange}
                handleproof={handleproof}
                handleRemoveField={handleRemoveField}
              />

              <EditNftMedia
                setVideoUrl={setVideoUrl}
                isUploading={isUploading}
                cancelVideoUpload={cancelVideoUpload}
                uploadProgress={uploadProgress}
                threeDModel={threeDModel}
                isUploadingVideo={isUploadingVideo}
                uploadProgressvideo={uploadProgressvideo}
                uploadedImages={uploadedImages}
                videoModel={videoModel}
                fileDataArray={fileDataArray}
                setFileDataArray={setFileDataArray}
                threeDModelUrl={threeDModelUrl}
                newUploadedFiles={newUploadedFiles}
                setPrimaryFile={setPrimaryFile}
                setPrimaryImage={setPrimaryImage}
                setUploadedImages={setUploadedImages}
                handleRemoveUploadedFile={handleRemoveUploadedFile}
                newPrimaryFile={newPrimaryFile}
                primaryImage={primaryImage}
                resetVideoModel={resetVideoModel}
                setHandleToggle={setHandleToggle}
                handleToggle={handleToggle}
                animationUrl={animationUrl}
                dropZone={dropZone}
                resetThreeDModel={resetThreeDModel}
                threeDFileName={threeDFileName}
                handleFileRemoveField={handleFileRemoveField}
                handleFileFieldValChange={handleFileFieldValChange}
                handleFileFieldNameChange={handleFileFieldNameChange}
                uploadError={uploadError}
                uploadErrorforVideo={uploadErrorforVideo}
                setNewUploadedFiles={setNewUploadedFiles}
                formik={formik}
                cancelUpload={cancelUpload}
                setVideoModel={setVideoModel}
                setIsUploadingVideo={setIsUploadingVideo}
                setUploadProgressvideo={setUploadProgressvideo}
                setUploadErrorforVideo={setUploadErrorforVideo}
              />
            </form>
          ) : (
            <FulfillmentDetails
              theme={theme}
              shipmentMethod={shipmentMethod}
              setShipmentMethod={setShipmentMethod}
              shipmentMethodPayload={shipmentMethodPayload}
              setShipmentMethodPayload={setShipmentMethodPayload}
            />
          )}
        </DialogContent>
        <Divider />
        <Grid container>
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
            <DialogActions sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
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
                  color="primary"
                  disableElevation
                >
                  {nftStatus === "NFT" ? "Cancel" : "Back"}
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
                    if (nftStatus === "NFT") {
                      // On NFT deatils tab checking if all the required values are entered
                      formik.handleSubmit();
                    } else if (shipmentMethod) {
                      handleAddNft();
                    } else {
                      toast.error("Please select a shipment method");
                    }
                  }}
                  className="buttons"
                  size="large"
                  disableElevation
                >
                  {nftStatus === "NFT" ? "Next" : "Save"}
                </Button>
              </AnimateButton>
            </DialogActions>
          )}
        </Grid>
      </Dialog>
    </>
  );
}
