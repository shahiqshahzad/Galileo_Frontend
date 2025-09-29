/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Slide
} from "@mui/material";
import { useFormik } from "formik";
import "react-dropzone-uploader/dist/styles.css"; // Import the styles
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNft } from "redux/nftManagement/actions";
import AnimateButton from "ui-component/extended/AnimateButton";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "@mui/material/styles";
import { setNotification } from "shared/helperMethods/setNotification";
import { AddNftMedia } from "./addNftMedia";
import { NftAddMetaData } from "./nftAddMetaData";
import { AddNftAuthenticityFiles } from "./addNftAuthenticityFiles";
import { FulfillmentDetails } from "./FulfullmentDetails/FulfillmentDetails";
import { AddNftDetail } from "./addNftDetail";
import { ethers } from "ethers";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddNft({
  open,
  setOpen,
  // GeneralSetting,
  getchainId,
  getCurrency,
  contractAddress,
  categoryId,
  search,
  page,
  limit,
  nftType,
  createdBy,
  refurbishedSalesStatus
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [nftDetailsData, setNftDetailsData] = useState();
  const [mintType, setMintType] = useState("directMint");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [threeDModel, set3dModel] = useState(null);
  const [videoModel, setVideoModel] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(true);

  const [fieldDataArray, setFieldDataArray] = useState([]);
  const [type, setType] = useState(getCurrency);
  const [loader, setLoader] = useState(false);
  const [fileDataArray, setFileDataArray] = useState([]);

  const [isFormSubmitBol, setIsFormSubmitBol] = useState(false);
  const [authFileNameBol, setAuthFileNameBol] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressvideo, setUploadProgressvideo] = useState(0);
  const [threeDModelUrl, setThreeDModelUrl] = useState(null);
  const [threeDFileName, setThreeDFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [nftStatus, setNftStatus] = useState("NFT");
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

  let progressInterval;
  const handleType = (event) => {
    setType(event.target.value);
  };

  const [checked, setChecked] = useState(false);
  const handleError = (fieldDataArray, fileDataArray, values) => {
    let isValid = true;

    if (fieldDataArray.length === 0) {
      isValid = false;
      toast.error("Metadata is required");
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
      setIsFormSubmitBol(false);
    }
    fieldDataArray.map((array) => {
      if (array.trait_type === "") {
        isValid = false;
        toast.error(`Metadata name cannot be empty`);
      } else if (array.value === "") {
        isValid = false;
        toast.error(`Metadata value cannot be empty`);
      } else if (array.display_type === "Number" && array.value < 0) {
        isValid = false;
        toast.error("Negative values are not allowed");
      }
    });
    if (fileDataArray.length === 0) {
      isValid = false;
      toast.error("Proof of Authenticity is required");
      setFileDataArray([
        ...fileDataArray,
        {
          trait_type: "",
          value: null
        }
      ]);
      setAuthFileNameBol(false);
    }
    fileDataArray.map((array) => {
      if (array.trait_type === "") {
        isValid = false;
        toast.error(`File name field is mandatory`);
      } else if (array.value == null) {
        isValid = false;
        toast.error(`Attach proof of authenticity`);
      } else if (array.value?.size / 1000000 > 5) {
        isValid = false;
        toast.error(`Please attach a less than 5 mb proof of authenticity`);
      }
    });
    if (values.images.length === 0) {
      toast.error("Please upload a NFT Image");
      isValid = false;
    } else if (values.images[0].image.size / 1000000 > 5) {
      toast.error("Please upload a image less than 5 mb");
      isValid = false;
    } else if (
      values.images[0].image.name.split(".").pop() !== "jpg" &&
      values.images[0].image.name.split(".").pop() !== "jpeg" &&
      values.images[0].image.name.split(".").pop() !== "png" &&
      values.images[0].image.name.split(".").pop() !== "PNG" &&
      values.images[0].image.name.split(".").pop() !== "JPG" &&
      values.images[0].image.name.split(".").pop() !== "JPEG"
    ) {
      toast.error("Upload the files with these extensions: jpg, png, gif");
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

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = fieldDataArray.map((item, i) => {
      if (i === index) {
        return { ...item, primaryLocation: true };
      }
      return { ...item, primaryLocation: false };
    });
    setFieldDataArray([...updatedCheckboxes]);
  };

  const validationSchema = Yup.object({
    nftName: Yup.string().required("NFT Name is required!").max(120, "NFT Name can not exceed 120 characters"),
    nftDescription: Yup.string()
      .required("NFT Description is required!")
      .max(1000, "Invalid NFT description can not exceed 1000 characters"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1")
      .max(150, "Quantity cannot exceed 150")
      .integer("Quantity must be a whole number"),
    directBuyerAddress:
      checked === true &&
      Yup.string()
        .required("Wallet address  is required!")
        .min(26, "Minimum length 26 character ")
        .max(42, "Must be exactly 42 characters"),
    nftPrice: Yup.number()
      .min(0.01, "Minimum price should be 0.01")
      .required("NFT Price is required")
      .max(10000000, "Maximum price allowed is 10 million")
      .typeError("Invalid Price")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nftName: "",
      nftDescription: "",
      directBuyerAddress: "",
      nftPrice: "",
      quantity: 1,
      images: [],
      threeDModel: null,
      videoModel: "",
      autoRedeem: process.env.REACT_APP_ENVIRONMENT !== "development",
      isSoldByGalileo: false
    },
    validationSchema,
    onSubmit: (values) => {
      if (isUploading) {
        setNotification("warning", "Please wait for the upload to complete!");
        return;
      }
      if (isUploadingVideo) {
        setNotification("warning", "Please wait for the upload to complete!");
        return;
      }
      let arrayData = fieldDataArray.map((item) => {
        const { phone, ...obj } = item;
        return obj;
      });
      let fileArray = fileDataArray.map((data) => {
        return data.value;
      });
      let fileNameArray = fileDataArray.map((data) => {
        return data.trait_type;
      });
      let isValid = handleError(fieldDataArray, fileDataArray, values);

      if (isValid === true) {
        const valid = ethers.utils.isAddress(values.directBuyerAddress);
        if (valid || values.directBuyerAddress === "") {
          setNftStatus("Fulfillment");
          const filterImage = values.images.filter((img) => img.image !== primaryImage);
          setNftDetailsData({
            categoryId: categoryId,
            mintType: mintType,
            metaDataArray: arrayData,
            fileNameArray: fileNameArray,
            fileArray: fileArray,
            name: values.nftName,
            price: values.nftPrice,
            description: values.nftDescription,
            directBuyerAddress: values.directBuyerAddress ? values.directBuyerAddress : "",
            // currencyType: getCurrency,
            autoRedeem: values.autoRedeem,
            isSoldByGalileo: values.isSoldByGalileo,
            quantity: values.quantity,
            asset: primaryImage,
            secondaryImage: filterImage,
            videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
            type: nftType,
            page: page,
            limit: limit,
            search: search,
            currencySymbol: getCurrency,
            chainId: getchainId,
            requesterAddress: user.walletAddress,
            contractAddress: contractAddress,
            handleClose: handleClose,
            brandId: user.BrandId,
            isDirectTransfer: values.directBuyerAddress === "" ? false : true,
            threeDModelUrl: threeDModelUrl ?? "",
            threeDFileName: threeDModelUrl ? threeDFileName : "",
            setLoader: setLoader,
            createdBy
          });
        } else {
          toast.error(`Wallet Address invalid !`);
        }
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
      setLoader(true);
      dispatch(addNft(data));
    }
  };

  useEffect(() => {
    if (formik.isSubmitting === true) {
      setIsFormSubmitBol(true);
      setAuthFileNameBol(true);
    }
  }, [formik]);

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setMintType("directMint");
    setType(getCurrency);
    setUploadedImages([]);
    setFieldDataArray([]);
    setPrimaryImage(true);
    setLoader(false);
    setFileDataArray([]);
    setIsUploading(false);
    setIsUploadingVideo(false);
    set3dModel(null);
    setVideoModel(null);
    setUploadProgress(0);
    setUploadProgressvideo(0);
    setShipmentMethodPayload({
      flatRateShippingCost: null,
      noExternalCostForMultipleCopies: false,
      weight: null,
      height: null,
      length: null,
      breadth: null,
      warehouseAddressId: null,
      supportedCarrier: null,
      modeOfShipment: null,
      shippingCostAdjustment: 0,
      isPurchaseAllowed: false,
      fallBackShippingAmount: null
    });
    setNftStatus("NFT");
    setShipmentMethod();
  };

  const walletadded = (checked) => {
    setChecked(checked);
  };

  const useStyles = makeStyles({
    "@global": {
      "*::-webkit-scrollbar": {
        width: "0.4em"
      },
      "*::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px gray"
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: "gray"
      },
      ".react-datepicker__view-calendar-icon input": {
        background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
        color: theme.palette.mode === "dark" ? "#bdc8f0" : "#000",
        border: "none",
        borderBottom:
          theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.7)" : "1px solid rgba(0, 0, 0, 0.42)",
        marginTop: "1px"
      }
    }
  });

  const classes = useStyles();

  const cancelVideoUpload = () => {
    setVideoModel(null);
  };

  useEffect(() => {
    if (isUploading) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isUploadingVideo) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (uploadProgress === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgress]);

  useEffect(() => {
    if (uploadProgressvideo === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgressvideo]);

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
          {nftStatus === "Fulfillment" ? "Fulfillment Details" : "New Product"}
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
              // onClick={() => {
              //   setNftStatus('NFT');
              //   // mintChangeHandlerDirect();
              // }}
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
              // onClick={() => {
              //   setNftStatus('Fulfillment');
              //   // mintChangeHandlerLazy();
              // }}
            >
              Fulfillment Details
            </Button>
          </DialogActions>
        </Grid>

        <DialogContent>
          {nftStatus === "NFT" ? (
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
              <AddNftDetail
                formik={formik}
                useStyles={useStyles}
                mintType={mintType}
                walletadded={walletadded}
                theme={theme}
                checked={checked}
                classes={classes}
                handleType={handleType}
                type={type} //currently not working but may be later , it will be used!
                getCurrency={getCurrency} //it's working for currency get
                refurbishedSalesStatus={refurbishedSalesStatus}
              />

              <NftAddMetaData
                handleCheckboxChange={handleCheckboxChange}
                theme={theme}
                fieldDataArray={fieldDataArray}
                isFormSubmitBol={isFormSubmitBol}
                setFieldDataArray={setFieldDataArray}
                setIsFormSubmitBol={setIsFormSubmitBol}
              />
              <AddNftAuthenticityFiles
                fileDataArray={fileDataArray}
                setFileDataArray={setFileDataArray}
                authFileNameBol={authFileNameBol}
                setAuthFileNameBol={setAuthFileNameBol}
              />
              <AddNftMedia
                primaryImage={primaryImage}
                isUploading={isUploading}
                cancelVideoUpload={cancelVideoUpload}
                uploadProgress={uploadProgress}
                threeDModel={threeDModel}
                isUploadingVideo={isUploadingVideo}
                uploadProgressvideo={uploadProgressvideo}
                formik={formik}
                theme={theme}
                set3dModel={set3dModel}
                uploadedImages={uploadedImages}
                checked={checked}
                videoModel={videoModel}
                setUploadedImages={setUploadedImages}
                setPrimaryImage={setPrimaryImage}
                setIsUploadingVideo={setIsUploadingVideo}
                setIsUploading={setIsUploading}
                setUploadProgress={setUploadProgress}
                setThreeDModelUrl={setThreeDModelUrl}
                setThreeDFileName={setThreeDFileName}
                setVideoModel={setVideoModel}
                setUploadProgressvideo={setUploadProgressvideo}
              />
              <Grid item xs={12} mt={2} md={12}>
                <Box>
                  Note: The location with primary location as checked will be displayed for this product in the NFT
                  tracker tool
                </Box>
              </Grid>
            </form>
          ) : (
            <FulfillmentDetails
              theme={theme}
              formik={formik}
              getCurrency={getCurrency}
              shipmentMethod={shipmentMethod}
              setShipmentMethod={setShipmentMethod}
              shipmentMethodPayload={shipmentMethodPayload}
              setShipmentMethodPayload={setShipmentMethodPayload}
            />
          )}
        </DialogContent>
        <Divider />
        <Grid container sx={{ display: "flex", justifyContent: "flex-end" }}>
          <DialogActions>
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
                  Registering the product...
                </Button>
              </DialogActions>
            ) : (
              <Box sx={{ display: "flex" }}>
                <AnimateButton>
                  <Button
                    className="buttons"
                    size="large"
                    type="submit"
                    variant="outlined"
                    sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                    color="primary"
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
                    // type="submit"
                    size="large"
                    disableElevation
                    className="buttons"
                    variant="contained"
                    sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
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
                  >
                    {nftStatus === "NFT" ? "Next" : "Add"}
                  </Button>
                </AnimateButton>
              </Box>
            )}
          </DialogActions>
        </Grid>
      </Dialog>
    </>
  );
}
