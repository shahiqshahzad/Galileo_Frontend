/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import "./styles.css";
import { Stack } from "@mui/system";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Icons } from "shared/Icons/Icons";
import { useTheme } from "@mui/material/styles";
import { Button, TextField, Tooltip, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "redux/categories/actions";
import { General } from "./general";
import { Media } from "./media";
import { Inventory } from "./inventory";
import RichTextEditor from "../Editor/Editor";
import {
  defaultInitialValues,
  taxCalculationArray,
  taxClassArray,
  taxStatusArray,
  validationSchema
} from "../utils/constants";

import "react-circular-progressbar/dist/styles.css";

import { useFormik } from "formik";
import "react-dropzone-uploader/dist/styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNft, editNft, UploadNftImagesSuccess } from "redux/nftManagement/actions";
import "react-datepicker/dist/react-datepicker.css";
import { setNotification } from "shared/helperMethods/setNotification";
import { FulfillmentDetails } from "../FulfullmentDetails/FulfillmentDetails";
import { Attributes } from "./attributes";
import { Proof } from "./proof";
import { getAllBrandCategories } from "redux/brandCategory/actions";
import { getAllCategoryAddresses } from "redux/addresses/actions";
import { convertHtmlToText, generateEditInitialValues, handleRequiredError } from "../utils/functions";
import { getnftData } from "redux/landingPage/actions";
import FullScreenLoader from "ui-component/FullScreenLoader";
import WarningIcon from "@mui/icons-material/Warning";
import { cloneDeep } from "lodash";
import { AddProductPreviewDialog } from "../utils/previewDlg";

let sidebarData = [
  {
    name: "General",
    icon: Icons.generalIcon
  },
  {
    name: "Media",
    icon: Icons.mediaIcon
  },
  {
    name: "Inventory",
    icon: Icons.inventoryIcon
  },
  {
    name: "Shipping",
    icon: Icons.shippingIcon
  },
  {
    name: "Properties",
    icon: Icons.attributesIcon
  },
  {
    name: "Authenticity Files",
    icon: Icons.authenticityIcon
  }
  // {
  //   name: "Get more options",
  //   icon: Icons.getMoreOptionsIcon
  // }
];

const AddProduct = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const nftId = useParams().nftId;
  const { isRequired, filter } = location.state || { isRequired: false, filter: "draft" };

  const user = useSelector((state) => state.auth.user);
  const categoryList = useSelector((state) => state.category.categoryList.categories);
  const nftList = useSelector((state) => state.nftReducer.nftList);
  const { categoryAddressesList } = useSelector((state) => state.addresses);
  const nftForEditData = useSelector((state) => state.landingPageReducer.nft?.nft);

  const brandCategories = useSelector((state) => state.brandCategoryReducer.brandCategoriesList?.brandCategories);
  const userCategory = brandCategories?.find((category) => category?.CategoryId === user?.CategoryId);
  const currencySetting = userCategory?.BrandCategorySettings?.find(
    (setting) => setting?.GeneralSetting?.settingType === "currency"
  );

  const contractAddress = nftList?.contractAddress || "";

  const refurbishedSalesStatus = userCategory?.allowRefurbishedSales;

  const getCurrency = currencySetting?.GeneralSetting?.currencySymbol;
  const getchainId = currencySetting?.GeneralSetting?.chainId;

  const [tagValue, setTagValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTab, setSelectedTab] = useState("General");
  const [selectedCategories, setSelectedCategories] = useState([]);

  let InputProps = {
    style: { borderRadius: 0, background: "black" }
  };

  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: "white"
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#D3D3D3"
    }
  };

  const textfieldStyle = {
    paddingY: "5px",
    paddingX: "20px",
    border: "0.94px solid #757575",
    background: "black",
    "& fieldset": { border: "none" },
    "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: "black",
      border: theme.palette.mode === "dark" ? "1px solid #757575" : "none"
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: theme.palette.mode === "dark" ? "white" : "black"
    }),
    menu: (base) => ({
      ...base,
      marginTop: 0,
      border: theme.palette.mode === "dark" ? "1px solid white" : "1px solid #181C1F",
      color: theme.palette.mode === "dark" ? "white" : "#181C1F",
      background: theme.palette.mode === "dark" ? "#181C1F" : "#f3f3f3"
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: "#2F53FF"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor:
        theme.palette.mode === "dark"
          ? state.isSelected
            ? "#2F53FF"
            : "#181C1F"
          : state.isSelected
            ? "#2F53FF"
            : "white",
      color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#2196f3"
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "grey"
    })
  };

  useEffect(() => {
    dispatch(
      getAllCategories({
        search: "",
        page: 1,
        limit: 100
      })
    );
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      let data = [...selectedTags];
      data.push(tagValue);
      setSelectedTags([...data]);
      setTagValue("");
    }
  };

  const [mintType, setMintType] = useState("directMint");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [threeDModel, set3dModel] = useState(null);
  const [videoModel, setVideoModel] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(true);

  const [fieldDataArray, setFieldDataArray] = useState([]);
  const [loader, setLoader] = useState(true);
  const [fileDataArray, setFileDataArray] = useState([]);
  const recentImagesState = useSelector((state) => state.nftReducer?.upload_nft_images);

  const [isFormSubmitBol, setIsFormSubmitBol] = useState(false);
  const [authFileNameBol, setAuthFileNameBol] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressvideo, setUploadProgressvideo] = useState(0);
  const [threeDModelUrl, setThreeDModelUrl] = useState(null);
  const [threeDFileName, setThreeDFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [shipmentMethod, setShipmentMethod] = useState();
  const [animationUrl, setAnimationUrl] = useState(null);
  const [handleToggle, setHandleToggle] = useState(false);
  const [isRemoveVideo, setIsRemoveVideo] = useState(false);
  const [newUploadedFiles, setNewUploadedFiles] = useState([]);
  const [newPrimaryFile, setPrimaryFile] = useState(null);
  const [errorsArray, setErrorsArray] = useState([]);
  const [showPreviewDlg, setShowPreviewDlg] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(0);

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

  const [checked] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (nftId) {
      dispatch(getnftData({ id: nftId, setFetchNftLoading: setLoader }));
    } else {
      setLoader(false);
    }
  }, [nftId]);

  const handleError = (fieldDataArray, fileDataArray, values) => {
    let isValid = true;
    let errorsArrayData = [];
    if (fieldDataArray.length === 0) {
      isValid = false;
      // toast.error("Metadata is required");
      errorsArrayData.push("Attributes");
      // setFieldDataArray([
      //   ...fieldDataArray,
      //   {
      //     display_type: "Text",
      //     trait_type: "",
      //     value: "",
      //     countryCode: "",
      //     isEditable: false,
      //     proofRequired: false,
      //     primaryLocation: false,
      //     Proofs: []
      //   }
      // ]);
      setIsFormSubmitBol(false);
    }
    fieldDataArray.map((array) => {
      if (array.trait_type === "" || array.value === "") {
        isValid = false;
        errorsArrayData.push("Properties");
        // toast.error(`Metadata cannot be empty`);
      }
      // else if (array.value == "") {
      //   isValid = false;
      //   // toast.error(`Metadata value cannot be empty`);
      //   errorsArrayData.push("Properties");
      // }
      else if (array.display_type === "Number" && array.value < 0) {
        isValid = false;
        // toast.error("Negative values are not allowed");
        errorsArrayData.push("Properties");
      }
    });
    if (fileDataArray.length === 0) {
      isValid = false;
      // toast.error("Proof of Authenticity is required");
      errorsArrayData.push("Authenticity Files");
      // setFileDataArray([
      //   ...fileDataArray,
      //   {
      //     trait_type: "",
      //     value: null
      //   }
      // ]);
      setAuthFileNameBol(false);
    }
    fileDataArray.map((array) => {
      if (array.fieldName === "") {
        isValid = false;
        errorsArrayData.push("Authenticity Files");
        // toast.error(`File name field is mandatory`);
      } else if (array.fieldValue == null || array.fieldValue == null) {
        isValid = false;
        errorsArrayData.push("Authenticity Files");
        // toast.error(`Attach proof of authenticity`);
      } else if (array.fieldValue?.size / 1000000 > 5) {
        isValid = false;
        errorsArrayData.push("Authenticity Files");
        // toast.error(`Please attach a less than 5 mb proof of authenticity`);
      }
    });
    let checkPrimaryImage = recentImagesState.some((img) => img.isPrimary);
    if (!checkPrimaryImage) {
      errorsArrayData.push("Media");
      // toast.error("Please upload a NFT Image");
      isValid = false;
    }
    // else if (values?.images[0]?.image?.size / 1000000 > 5) {
    //   errorsArrayData.push("Media");
    //   toast.error("Please upload a image less than 5 mb");
    //   isValid = false;
    // } else if (
    //   values?.images[0]?.image?.name?.split(".").pop() !== "jpg" &&
    //   values?.images[0]?.image?.name?.split(".").pop() !== "jpeg" &&
    //   values?.images[0]?.image?.name?.split(".").pop() !== "png" &&
    //   values?.images[0]?.image?.name?.split(".").pop() !== "PNG" &&
    //   values?.images[0]?.image?.name?.split(".").pop() !== "JPG" &&
    //   values?.images[0]?.image?.name?.split(".").pop() !== "JPEG"
    // ) {
    //   errorsArrayData.push("Media");
    //   toast.error("Upload the files with these extensions: jpg, png, gif");
    //   isValid = false;
    // }
    const displaylocation = fieldDataArray.find((value) => value.display_type === "Location");
    const trueIndex = fieldDataArray.find((value) => value.primaryLocation === true);

    if (!trueIndex && displaylocation) {
      // toast.error("Please select a primary Location for Tracking!");
      isValid = false;
    }

    if (!shipmentMethod?.value) {
      errorsArrayData.push("Shipping");
    }
    if (shipmentMethod?.value === "FRS" && !shipmentMethodPayload?.flatRateShippingCost) {
      errorsArrayData.push("Shipping");
    }

    if (shipmentMethod?.value === "CCS") {
      const fieldDisplayNames = {
        weight: "Weight",
        height: "Height",
        length: "Length",
        breadth: "Breadth",
        warehouseAddressId: "Shipment Address",
        modeOfShipment: "Mode of Shipment",
        shippingCostAdjustment: "Shipping Cost Adjustment"
      };
      if (shipmentMethodPayload.isPurchaseAllowed) {
        fieldDisplayNames.fallBackShippingAmount = "Fallback Shipping Amount";
      }
      const requiredFields = Object.keys(fieldDisplayNames);
      const missingFields = requiredFields.filter(
        (field) => shipmentMethodPayload[field] === null || shipmentMethodPayload[field] === ""
      );

      if (missingFields.length > 0 && isEdit) {
        errorsArrayData.push("Shipping");
      }
    }

    setErrorsArray(errorsArrayData);
    if (!isValid) {
      toast.error("Please fill all required fields");
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
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: nftId && nftForEditData ? generateEditInitialValues(nftForEditData) : defaultInitialValues,
    validationSchema: validationSchema(isEdit, checked),
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

      let multiCategoriesId = selectedCategories.map((data) => {
        return data.value;
      });

      let fileNameArray = fileDataArray.map((data) => {
        return data.trait_type;
      });

      let isValid = isEdit ? handleError(fieldDataArray, fileDataArray, values) : true;

      if (isValid === true) {
        // var WAValidator = require("wallet-address-validator");

        var valid = true;
        // var valid = WAValidator.validate(values.directBuyerAddress, "ETH");
        if (valid || values.directBuyerAddress === "") {
          // const filterImage = values.images.filter((img) => img.image !== primaryImage);
          let nftDetailsData = {
            categoryId: user?.CategoryId,
            mintType: mintType,
            metaDataArray: arrayData,
            fileNameArray: fileNameArray,
            fileArray: fileArray,
            name: values.nftName,
            price: values.nftPrice,
            description: values.nftDescription,
            directBuyerAddress: values.directBuyerAddress ? values.directBuyerAddress : "",
            longDescription: values.longDescription,
            salePrice: values.salePrice,
            taxStatus: values?.taxStatus?.value || "",
            taxClass: values.taxClass?.value || "",
            taxCalculationMethod: values.taxCalculationMethod?.value || "",
            taxRate: values.taxRate,
            multiCategoriesId,
            productTags: selectedTags,
            autoRedeem: values.autoRedeem,
            isSoldByGalileo: values.isSoldByGalileo,
            quantity: values.quantity,
            asset: primaryImage,
            secondaryImage: recentImagesState,
            videoFile: values?.videoModel?.[0] ? values?.videoModel?.[0] : "",
            type: user?.role === "Sub Admin" ? "draft" : "all",
            page: 1,
            limit: 12,
            search: "",
            currencySymbol: getCurrency,
            currencyType: getCurrency,
            chainId: getchainId,
            requesterAddress: user.walletAddress,
            contractAddress: contractAddress,
            handleClose: handleClose,
            brandId: user.BrandId,
            isDirectTransfer: values.directBuyerAddress === "" ? false : true,
            threeDModelUrl: threeDModelUrl ?? "",
            threeDFileName: threeDModelUrl ? threeDFileName : "",
            setLoader: setLoader,
            createdBy: "SubAdmin"
          };

          handleAddNft(nftDetailsData, values);
        } else {
          toast.error(`Wallet Address invalid !`);
        }
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      let errorsArrayData = [...errorsArray];

      if (formik?.errors?.nftPrice || formik?.errors?.nftDescription) {
        errorsArrayData.push("General");
      }

      if (formik?.errors?.quantity) {
        errorsArrayData.push("Inventory");
      }
      setErrorsArray(errorsArrayData);
    }
  }, [isEdit, formik.errors]);

  const handleAddNft = (nftDetailsData, values) => {
    // Initialize data object to store NFT details
    let data = { ...nftDetailsData, shippingCalculationMethod: "" };
    // Flag to track validation errors
    let isError = false;

    if (shipmentMethod?.value) {
      // Check if shipment method is Free Shipping
      if (shipmentMethod.value === "FS") {
        // Populate data for Free Shipping
        data = { ...nftDetailsData, shippingCalculationMethod: "FS" };

        // Check if shipment method is Flat Rate Shipping
      } else if (shipmentMethod.value === "FRS") {
        // Check if shipment cost is provided for Flat Rate Shipping
        if (!shipmentMethodPayload.flatRateShippingCost && isEdit) {
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
        if (missingFields.length > 0 && isEdit) {
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
            weight: shipmentMethodPayload.weight || "",
            height: shipmentMethodPayload.height || "",
            length: shipmentMethodPayload.length || "",
            breadth: shipmentMethodPayload.breadth || "",
            warehouseAddressId: shipmentMethodPayload.warehouseAddressId?.value || "",
            modeOfShipment: shipmentMethodPayload.modeOfShipment?.value || "",
            shippingCostAdjustment: shipmentMethodPayload.shippingCostAdjustment || "",
            isPurchaseAllowed: shipmentMethodPayload.isPurchaseAllowed || false,
            fallBackShippingAmount: shipmentMethodPayload.fallBackShippingAmount || ""
          };
          if (shipmentMethodPayload?.supportedCarrier?.value) {
            data.supportedCarrier = shipmentMethodPayload.supportedCarrier.value;
          }
        }
      }
    }

    // If there are no validation errors, set loader and dispatch NFT addition
    if (!isError) {
      setLoader(true);
      if (nftId) {
        let previousUploadedItems = fileDataArray.filter((data) => {
          if (typeof data.fieldValue === "string") return data;
        });
        let file = values?.images[0]?.image;
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

        const filterImage = newUploadedFiles.filter((img) => img.image !== newPrimaryFile?.image);

        data = {
          ...data,
          id: nftForEditData.id,
          role: user.role,
          fileNameArray: fileNameArray,
          fileArray: fileArray,
          isRemoveVideo: isRemoveVideo,
          primary: primaryImage,
          secondary: recentImagesState,
          previousUploadedItems: previousUploadedItems,
          asset: isFile ? values.images[0].image : null,
          isFile: isFile,
          primaryEdit: newPrimaryFile,
          secondaryEdit: filterImage,
          isSoldByGalileo: values.isSoldByGalileo
        };
        dispatch(editNft({ ...data }));
      } else {
        dispatch(addNft({ ...data }));
      }
    }
  };

  useEffect(() => {
    if (formik.isSubmitting === true && isEdit) {
      setIsFormSubmitBol(true);
      setAuthFileNameBol(true);
    }
  }, [formik, isEdit]);

  const handleClose = () => {
    formik.resetForm();
    setMintType("directMint");
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
    setShipmentMethod();
    setSelectedCategories([]);
    setSelectedTags([]);
    navigate(`/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=${filter || "draft"}`);
  };

  const cancelVideoUpload = () => {
    setVideoModel(null);
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
    if (uploadProgress === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgress]);

  useEffect(() => {
    if (uploadProgressvideo === 100) {
      clearInterval(progressInterval);
    }
  }, [uploadProgressvideo]);

  useEffect(() => {
    if (user?.role === "Sub Admin") {
      dispatch(
        getAllBrandCategories({
          brandId: user?.BrandId,
          search: "",
          page: 1,
          limit: 12
        })
      );
      // dispatch(getSupportedCarriers());
      dispatch(getAllCategoryAddresses({ categoryId: user?.CategoryId, brandId: user?.BrandId }));
    }
  }, []);

  useEffect(() => {
    if (nftId && nftForEditData) {
      setFieldDataArray(nftForEditData.NFTMetaData);
      setFileDataArray(nftForEditData.NFTMetaFiles);
      // setCurrencyType(nftForEditData.currencyType);
      setThreeDModelUrl(nftForEditData.threeDModelUrl);
      setAnimationUrl(nftForEditData?.animation_url);
      const filteredData = nftForEditData.NFTImages.map((item) => ({
        id: item.id,
        path: item.asset,
        isPrimary: item.isPrimary,
        useBackGroundRemoved: item.useBackGroundRemoved,
        backgroundRemovedPath: item.backgroundRemovedPath
      }));
      dispatch(UploadNftImagesSuccess(filteredData));
      setUploadedImages(filteredData);
      setThreeDFileName(nftForEditData?.threeDFileName);
      setPrimaryImage(nftForEditData?.asset);
      setSelectedTags(nftForEditData?.productTags);
      setPrimaryFile(null);

      formik.setFieldValue("isSoldByGalileo", nftForEditData?.isSoldByGalileo);
      formik.setFieldValue("nftDescription", convertHtmlToText(nftForEditData?.description || ""));
      formik.setFieldValue("longDescription", convertHtmlToText(nftForEditData?.longDescription || ""));

      const shippingMethods = {
        FS: "Free Shipping",
        FRS: "Flat Rate Shipping",
        CCS: "Carrier Calculated Shipping"
      };
      const shipmentMethodData = {
        value: nftForEditData?.shippingCalculationMethod,
        label: shippingMethods[nftForEditData?.shippingCalculationMethod] || ""
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
      } = nftForEditData || {};

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

      const taxClass = taxClassArray?.find((item) => item.value === nftForEditData?.taxClass);
      const taxStatus = taxStatusArray?.find((item) => item.value === nftForEditData?.taxStatus);
      const taxCalculationMethod = taxCalculationArray?.find(
        (item) => item.value === nftForEditData?.taxCalculationMethod
      );

      formik.setFieldValue("taxClass", taxClass);
      formik.setFieldValue("taxStatus", taxStatus);
      formik.setFieldValue("taxCalculationMethod", taxCalculationMethod);

      if (nftForEditData?.multiCategoriesId?.length) {
        let multiCategoriesData = nftForEditData?.multiCategoriesId.map((item) => {
          return { label: item.name, value: item.id };
        });
        setSelectedCategories(multiCategoriesData);
      }

      if (isRequired) {
        setIsEdit(true);
        handleRequiredError(
          nftForEditData.NFTMetaData,
          nftForEditData.NFTMetaFiles,
          generateEditInitialValues(nftForEditData),
          setIsFormSubmitBol,
          setAuthFileNameBol,
          shipmentMethodData,
          shipmentPayloadData,
          setErrorsArray,
          formik.errors,
          nftForEditData.NFTImages,
          filteredData
        );
      }
    }
  }, [nftId, nftForEditData]);

  const renderTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "General":
        return (
          <General
            formik={formik}
            getCurrency={getCurrency}
            errorsArray={errorsArray}
            setErrorsArray={setErrorsArray}
            setShowPreviewDlg={setShowPreviewDlg}
            setSelectedPreview={setSelectedPreview}
            refurbishedSalesStatus={refurbishedSalesStatus}
          />
        );
      case "Inventory":
        return (
          <Inventory
            errorsArray={errorsArray}
            setErrorsArray={setErrorsArray}
            formik={formik}
            setShowPreviewDlg={setShowPreviewDlg}
            setSelectedPreview={setSelectedPreview}
          />
        );
      case "Authenticity Files":
        return (
          <Proof
            nftId={nftId}
            errorsArray={errorsArray}
            fileDataArray={fileDataArray}
            setErrorsArray={setErrorsArray}
            authFileNameBol={authFileNameBol}
            setFileDataArray={setFileDataArray}
            setAuthFileNameBol={setAuthFileNameBol}
          />
        );
      case "Properties":
        return (
          <Attributes
            theme={theme}
            errorsArray={errorsArray}
            setErrorsArray={setErrorsArray}
            fieldDataArray={cloneDeep(fieldDataArray)}
            isFormSubmitBol={isFormSubmitBol}
            setFieldDataArray={setFieldDataArray}
            setIsFormSubmitBol={setIsFormSubmitBol}
            handleCheckboxChange={handleCheckboxChange}
            setShowPreviewDlg={setShowPreviewDlg}
            setSelectedPreview={setSelectedPreview}
          />
        );
      case "Shipping":
        return (
          <FulfillmentDetails
            theme={theme}
            formik={formik}
            errorsArray={errorsArray}
            getCurrency={getCurrency}
            shipmentMethod={shipmentMethod}
            setErrorsArray={setErrorsArray}
            setShipmentMethod={setShipmentMethod}
            shipmentMethodPayload={shipmentMethodPayload}
            setShipmentMethodPayload={setShipmentMethodPayload}
          />
        );
      case "Media":
        return (
          <Media
            errorsArray={errorsArray}
            setErrorsArray={setErrorsArray}
            primaryImage={primaryImage}
            isUploading={isUploading}
            cancelVideoUpload={cancelVideoUpload}
            uploadProgress={uploadProgress}
            threeDModel={threeDModel}
            isUploadingVideo={isUploadingVideo}
            uploadProgressvideo={uploadProgressvideo}
            formik={formik}
            theme={theme}
            animationUrl={animationUrl}
            setAnimationUrl={setAnimationUrl}
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
            handleToggle={handleToggle}
            setHandleToggle={setHandleToggle}
            threeDFileName={threeDFileName}
            threeDModelUrl={threeDModelUrl}
            setIsRemoveVideo={setIsRemoveVideo}
            nftId={nftId}
            newUploadedFiles={newUploadedFiles}
            setNewUploadedFiles={setNewUploadedFiles}
            newPrimaryFile={newPrimaryFile}
            setPrimaryFile={setPrimaryFile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loader && <FullScreenLoader />}
      <Stack sx={{ paddingLeft: "1.3rem" }}>
        <Stack
          sx={{
            position: "fixed",
            top: "84px",
            left: "10px",
            paddingLeft: "17rem",
            background: "black",
            zIndex: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "99%",
            paddingTop: "2rem",
            paddingBottom: "10px"
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <ArrowBackIosIcon
              onClick={() => navigate(-1)}
              sx={{ color: "white", height: "1.5rem", width: "1.5rem", cursor: "pointer" }}
            />
            <Typography sx={{ color: "white", fontSize: "22px", fontWeight: 600 }} className="HeaderFonts">
              {nftId ? "Edit Product" : "New Product"}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ height: "2.6rem", position: "relative" }}>
            <Typography sx={{ color: "white", display: "flex", position: "absolute", top: "-25px" }}>
              In need of help?{" "}
              <span
                onClick={() => window.open("https://youtu.be/4dY3tpxCW7M", "_blank")}
                style={{ color: "#2F61FF", display: "flex", paddingLeft: "5px", cursor: "pointer" }}
              >
                Watch this {Icons.wacthIcon}
              </span>
            </Typography>
            <Button
              className="app-text"
              variant="outlined"
              sx={{
                width: "150px",
                color: "#4044ED",
                border: "1.46px solid #4044ED"
              }}
              onClick={() => {
                dispatch(UploadNftImagesSuccess([]));
                navigate(`/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=draft`);
              }}
            >
              Cancel
            </Button>
            <Button
              className="app-text"
              variant="contained"
              sx={{ width: "150px", background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)" }}
              onClick={() => formik.handleSubmit()}
            >
              Save
            </Button>
          </Stack>
        </Stack>
        <Stack sx={{ flexDirection: "row", gap: "1em", marginTop: "4rem" }}>
          <Typography sx={{ color: "white" }}>Product Name</Typography>
        </Stack>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: "10px" }}>
          <div>
            <TextField
              name="nftName"
              placeholder="Enter product name"
              fullWidth
              sx={{ ...textfieldStyle, width: "30rem" }}
              InputProps={{ ...InputProps }}
              value={formik.values.nftName}
              onChange={formik.handleChange}
            />
            {formik?.errors["nftName"] ? (
              <Typography sx={{ color: "red" }}>{formik?.errors["nftName"]}</Typography>
            ) : (
              ""
            )}
          </div>
        </Stack>
        <Stack sx={{ mt: "1rem", backgroundColor: "#181c1f", padding: "1rem" }}>
          <Stack sx={{ flexDirection: "row", gap: "7px", alignItems: "center" }}>
            <span
              style={{
                cursor: "pointer",
                height: "30px",
                width: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "30px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
            >
              {Icons.proTipIcon}
            </span>
            <Typography sx={{ color: "white", fontWeight: 600 }}>
              Pro Tip:{" "}
              <span style={{ fontWeight: 500 }}>
                Items with a concise short description, a detailed long description, key properties, and high-quality
                images tend to attract more views and sell faster. It's that simple!
              </span>{" "}
            </Typography>{" "}
          </Stack>
        </Stack>
        <Stack sx={{ mt: "1rem", backgroundColor: "#181c1f", padding: "1rem" }}>
          <Stack sx={{ flexDirection: "row", gap: "10px", mb: "1em" }}>
            <Typography sx={{ color: "white" }}>Short Description</Typography>{" "}
            <Tooltip
              title="Briefly describe the main features of the product. This description will be shown alongside the product for quick viewing."
              placement="top"
              arrow
            >
              <span style={{ cursor: "pointer" }}>{Icons.questionMarkIcon}</span>
            </Tooltip>
          </Stack>
          <RichTextEditor
            formik={formik}
            name={"nftDescription"}
            description={nftForEditData?.description}
            errorsArray={errorsArray}
            setErrorsArray={setErrorsArray}
          />
        </Stack>
        <Accordion sx={{ mt: "1rem" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#2F53FF" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Stack sx={{ flexDirection: "row", gap: "1em" }}>
              <Typography sx={{ color: "white" }}>Long Description</Typography>{" "}
              <Tooltip title="Click to view more details" placement="top" arrow>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreviewDlg(true);
                    setSelectedPreview(0);
                  }}
                >
                  {Icons.eyeIcon}
                </span>
              </Tooltip>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <RichTextEditor
              formik={formik}
              name={"longDescription"}
              description={nftForEditData?.longDescription || ""}
            />
          </AccordionDetails>
        </Accordion>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", marginTop: "1rem" }}>
          <Stack sx={{ width: "48%" }}>
            <Typography
              sx={{ color: "white", fontSize: "16px", marginBottom: "4px", display: "flex", alignItems: "center" }}
            >
              Select Category
              <Tooltip
                title="Select the appropriate category for the product to ensure it is correctly placed in the store."
                placement="top"
                arrow
              >
                <span style={{ cursor: "pointer", marginLeft: "5px", paddingTop: "1px" }}>
                  {Icons.questionMarkIcon}
                </span>
              </Tooltip>
            </Typography>
            <Select
              components={{ IndicatorSeparator: () => null }}
              styles={selectStyles}
              isDisabled={selectedCategories.length === 1}
              variant="standard"
              placeholder="Select Category"
              options={
                categoryList?.length
                  ? categoryList
                      .filter((item) => !selectedCategories.some((selected) => selected.value === item.id))
                      .map((item) => {
                        return { label: item.name, value: item.id };
                      })
                  : []
              }
              value={""}
              onChange={(item) => {
                let data = [...selectedCategories];
                data.push(item);
                setSelectedCategories([...data]);
              }}
            />
            <Stack sx={{ flexDirection: "row", gap: "5px", mt: "10px" }}>
              {selectedCategories.length
                ? selectedCategories.map((item, i) => {
                    return (
                      <Stack
                        key={i}
                        sx={{
                          border: "1px solid #4044ED",
                          width: "fit-content",
                          padding: "10px",
                          flexDirection: "row",
                          gap: "10px",
                          alignItems: "center"
                        }}
                      >
                        <Typography sx={{ color: "white", fontSize: "15px" }}>{item.label}</Typography>
                        <span
                          style={{ cursor: "pointer", paddingTop: "3px" }}
                          onClick={() => {
                            let selectedData = selectedCategories.filter((it) => it.value !== item.value);
                            setSelectedCategories([...selectedData]);
                          }}
                        >
                          {Icons.crossIcon}
                        </span>
                      </Stack>
                    );
                  })
                : ""}
            </Stack>
          </Stack>
          <Stack sx={{ width: "48%" }}>
            <Stack>
              <Typography sx={{ color: "white", fontSize: "16px", marginBottom: "4px", display: "flex" }}>
                Product Tags
                <Tooltip
                  title="Add up to 3 tags to help index the product for the search feature. Tags should be relevant to the product for better search results."
                  placement="top"
                  arrow
                >
                  <span style={{ cursor: "pointer", marginLeft: "5px", paddingTop: "1px" }}>
                    {Icons.questionMarkIcon}
                  </span>
                </Tooltip>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Tags"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                sx={{ ...inputStyles }}
                InputProps={{
                  ...InputProps,
                  style: { ...InputProps.style, border: "1px solid #757575", borderRadius: "3px" }
                }}
                onKeyDown={handleKeyPress}
                disabled={selectedTags.length === 3}
              />
              <Stack sx={{ flexDirection: "row", gap: "5px", mt: "10px" }}>
                {selectedTags.length
                  ? selectedTags.map((item, i) => {
                      return (
                        <Stack
                          key={i}
                          sx={{
                            border: "1px solid #4044ED",
                            width: "fit-content",
                            padding: "10px",
                            flexDirection: "row",
                            gap: "10px",
                            alignItems: "center"
                          }}
                        >
                          <Typography sx={{ color: "white", fontSize: "15px" }}>{item}</Typography>
                          <span
                            style={{ cursor: "pointer", paddingTop: "3px" }}
                            onClick={() => {
                              let selectedData = selectedTags.filter((it) => it !== item);
                              setSelectedTags([...selectedData]);
                            }}
                          >
                            {Icons.crossIcon}
                          </span>
                        </Stack>
                      );
                    })
                  : ""}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            flexDirection: "row",
            background: "#181C1F",
            mt: "1rem",
            padding: "1rem",
            borderRadius: "5px",
            gap: "2rem",
            height: "fit-content",
            minHeight: "80vh"
          }}
        >
          <Stack
            sx={{
              width: "20%",
              background: "#252B2F",
              padding: "1rem",
              gap: "12px",
              borderRadius: "7px",
              height: "fit-content"
            }}
          >
            {sidebarData.map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <Stack
                    onClick={() => setSelectedTab(item.name)}
                    sx={{ flexDirection: "row", gap: "10px", cursor: "pointer" }}
                  >
                    <item.icon color={item.name === selectedTab ? "#2F8BFF" : "#98A2B2"} />
                    <Typography
                      sx={{
                        width: "80%",
                        fontSize: "16px",
                        color: item.name === selectedTab ? "#2F8BFF" : "#98A2B2"
                      }}
                    >
                      {item.name}
                    </Typography>
                    {errorsArray.includes(item.name) && <WarningIcon sx={{ width: 16, height: 16, color: "red" }} />}
                  </Stack>
                  {i !== sidebarData.length - 1 && <Stack sx={{ borderBottom: "1px solid #98A2B2" }} />}
                </React.Fragment>
              );
            })}
          </Stack>
          <Stack sx={{ width: selectedTab === "Authenticity Files" || selectedTab === "Media" ? "80%" : "50%" }}>
            {renderTabContent(selectedTab)}
          </Stack>
        </Stack>
      </Stack>
      <AddProductPreviewDialog
        open={showPreviewDlg}
        handleClose={() => setShowPreviewDlg(false)}
        selectedPreview={selectedPreview}
      />
    </>
  );
};

export default AddProduct;
