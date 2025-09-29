import * as Yup from "yup";
import { convertHtmlToText } from "./functions";

export const taxStatusArray = [
  { label: "Collect taxes", value: "taxable" },
  { label: "Do not collect taxes", value: "non-taxable" }
];

export const taxClassArray = [
  { label: "Standard", value: "standard" },
  { label: "Reduced", value: "reduced" },
  { label: "Zero", value: "exempt" }
];

export const taxCalculationArray = [
  { label: "Galileo System (Quadreno)", value: "quadreno", description: "Configure Manually" }
];

export const dropdown = [
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
  }
  //   {
  //     value: "Location",
  //     label: "Location"
  //   }
];

export const toolbarOptions = {
  options: ["inline", "blockType", "list", "textAlign"],
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline", "strikethrough"]
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3"]
  },
  list: {
    inDropdown: false,
    options: ["unordered", "ordered", "indent", "outdent"]
  },
  textAlign: {
    inDropdown: false,
    options: ["left", "center", "right", "justify"]
  }
};

export const defaultInitialValues = {
  nftName: "",
  nftDescription: "",
  longDescription: "",
  multiCategoriesId: [],
  productTags: [],
  salePrice: "",
  taxStatus: { label: "Collect taxes", value: "taxable" },
  taxClass: { label: "Standard", value: "standard" },
  taxCalculationMethod: { label: "Galileo System (Quadreno)", value: "quadreno", description: "Configure Manually" },
  taxRate: "",
  directBuyerAddress: "",
  nftPrice: "",
  quantity: 1,
  images: [],
  threeDModel: null,
  videoModel: "",
  autoRedeem: process.env.REACT_APP_ENVIRONMENT !== "development",
  isSoldByGalileo: false
};

export const validationSchema = (isEdit, checked) =>
  Yup.object({
    nftName: Yup.string()
      .max(300, "NFT Name cannot exceed 300 characters")
      .when([], {
        is: () => isEdit,
        then: Yup.string().required("NFT Name is required!").max(300, "NFT Name cannot exceed 300 characters"),
        otherwise: Yup.string()
      }),
    nftDescription: Yup.string()
      .when([], {
        is: () => isEdit,
        then: Yup.string().required("NFT Description is required!"),
        otherwise: Yup.string()
      })
      .test("is-max-length", "NFT description cannot exceed 800 characters", function (value) {
        let text = convertHtmlToText(value || "");
        let length = text?.length - 3;
        if (length < 801) {
          return true;
        }
        return false;
      }),
    longDescription: Yup.string().test(
      "is-max-length-long",
      "NFT description cannot exceed 1500 characters",
      function (value) {
        let text = convertHtmlToText(value || "");
        let length = text?.length - 3;

        if (length < 1501) {
          return true;
        }
        return false;
      }
    ),
    quantity: Yup.number().when([], {
      is: () => isEdit,
      then: Yup.number()
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .max(150, "Quantity cannot exceed 150")
        .integer("Quantity must be a whole number"),
      otherwise: Yup.number()
    }),
    directBuyerAddress: Yup.string()
      .min(26, "Minimum length 26 characters")
      .max(42, "Must be exactly 42 characters")
      .when([], {
        is: () => checked,
        then: Yup.string().required("Wallet address is required!")
      }),
    nftPrice: Yup.number().when([], {
      is: () => isEdit,
      then: Yup.number()
        .required("NFT Price is required")
        .min(0.01, "Minimum price should be 0.01")
        .max(10000000, "Maximum price allowed is 10 million")
        .typeError("Invalid Price"),
      otherwise: Yup.number()
    }),
    salePrice: Yup.number()
      .nullable()
      .min(0.01, "Minimum price should be 0.01")
      .max(10000000, "Maximum price allowed is 10 million")
      .typeError("Invalid Price")
      .test("is-less-than-nftPrice", "Sale Price must be less than Regular Price", function (value, context) {
        if (value === null || value === undefined || value === "") {
          return true; // Pass validation if salePrice is not provided
        }
        return value < context.parent.nftPrice;
      })
  });
