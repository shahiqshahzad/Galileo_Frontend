/* eslint-disable array-callback-return */
import { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
import { Icon } from "@iconify/react";
import closeFill from "@iconify-icons/eva/close-fill";
import { getAllCurrencies } from "redux/generalSettingSuperadmin/actions";
import { updateBrandCategory, addBrandCategory, getAllCategoriesDropdown } from "redux/brandCategory/actions";
import {
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Switch
} from "@mui/material";
import FactoryAbi from "../../../../../../contractAbi/Factory.json";
import FactoryAddress from "../../../../../../contractAbi/Factory-address.js";
import NFTAbi from "../../../../../../contractAbi/NFT.json";
import GalileoEscrow from "contractAbi/GalileoEscrow";
import MarketplaceAddress from "contractAbi/Marketplace-address.js";
import MarketplaceAbi from "../../../../../../contractAbi/Marketplace.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BLOCKCHAIN from "../../../../../../constants";
import { useParams } from "react-router";
import axios from "utils/axios";
import { BrandCategoryAddress } from "./BrandCategoryAddress";
import { parseUnits } from "ethers/lib/utils";
import { checkWallet, preventSpecialKeys } from "utils/utilFunctions";
import { useWeb3 } from "utils/MagicProvider";
import { useActiveAccount } from "thirdweb/react";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateBrandCategoryDialog({ open, setOpen, brandCategoryData, page, limit, search }) {
  const { provider, signer } = useWeb3();
  const account = useActiveAccount();
  const LoggedInWalletAddress = useSelector((state) => state.auth.user.walletAddress);
  const dispatch = useDispatch();
  const params = useParams();
  const categoryArray = useSelector((state) => state.brandCategoryReducer.categoriesDropdownList);
  const currencyList = useSelector((state) => state.Currency.currencyList);
  const [chain, setChain] = useState("0");
  const [chaincurrencies, setChaincurrencies] = useState([]);
  let groupedChains = currencyList?.reduce((groups, item) => {
    const { chainId, ...rest } = item;
    if (!groups[chainId]) {
      groups[chainId] = [];
    }
    groups[chainId].push(rest);
    return groups;
  }, {});

  const setChainId = (chainId) => {
    setChaincurrencies(groupedChains[chainId]);
  };
  const [category, setCategory] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currenciesStatus, setCurrenciesStatus] = useState(0);
  const [selectedaddress, setSelectedaddress] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState(0);
  const [loader, setLoader] = useState(false);
  const [feeArray, setFeeArray] = useState([]);

  // sumOfPercentages =)
  const sumOfPercentages = feeArray.reduce((acc, item) => acc + parseInt(item.Percentage), 0);

  const handleRoyaltyfeeChange = (value, index) => {
    let array = [...feeArray];
    array[index].recipientInput = value;
    setFeeArray(array);
  };
  const handlePercentageChange = (value, index) => {
    let array = [...feeArray];
    array[index].Percentage = value;
    setFeeArray(array);
  };
  const RemoveRecipientPercentage = (index) => {
    let array = [...feeArray];
    array.splice(index, 1);
    setFeeArray(array);
  };

  useEffect(() => {
    if (brandCategoryData.categoryId === 0) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
    setCategory(brandCategoryData.categoryId);
  }, [brandCategoryData]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleChainIdChange = (event) => {
    setChain(event.target.value);
  };
  const handleCurrenciesChange = (event) => {
    setCurrenciesStatus(event.target.value);
  };

  const checkWallets = async () => {
    if ((await checkWallet(provider, dispatch, account, LoggedInWalletAddress)) === null) {
      return false;
    } else {
      return true;
    }
    // const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    // let connectWallet = await window?.ethereum._metamask.isUnlocked();

    // if ((window.ethereum && connectWallet) === false) {
    //   dispatch({
    //     type: SNACKBAR_OPEN,
    //     open: true,
    //     message: "No crypto wallet found. Please connect one",
    //     variant: "alert",
    //     alertSeverity: "info"
    //   });
    //   // toast.error('No crypto wallet found. Please install it.');
    // }
    // else if (window?.ethereum?.networkVersion !== '5') {
    //     dispatch({
    //         type: SNACKBAR_OPEN,
    //         open: true,
    //         message: 'Please change your Chain ID to Goerli',
    //         variant: 'alert',
    //         alertSeverity: 'info'
    //     });
    //     console.log('Please change your Chain ID to Goerli');
    // }
    // else if (utils?.getAddress(response[0]) !== user.walletAddress) {
    //   dispatch({
    //     type: SNACKBAR_OPEN,
    //     open: true,
    //     message: "Please connect your registered Wallet Address",
    //     variant: "alert",
    //     alertSeverity: "info"
    //   });
    // } else {
    //   return true;
    // }
  };

  const handleContractDeployment = async () => {
    let isValid = true;
    // let addressUSDT = chaincurrencies != undefined && chaincurrencies?.find((item) => item.currencySymbol == "USDT" && item
    // );
    // let addressUSDC = chaincurrencies != undefined && chaincurrencies?.find((item) => item.currencySymbol == "USDC" && item
    // );
    if (chain === "0") {
      return toast.error("please choose Chain Id!");
    } else if (currenciesStatus === "0") {
      return toast.error("please choose currency!");
    }

    if (category !== 0) {
      if (await checkWallets()) {
        if (formik?.values?.brandSymbol) {
          const isBrandSymbolExists = await axios.get(
            `brand/category/exisiting-brand-symbol/${formik?.values?.brandSymbol}`
          );
          if (isBrandSymbolExists?.data?.data?.alreadyExists) {
            return toast.error(isBrandSymbolExists?.data?.message);
          }
        }

        feeArray.map((array) => {
          const walletValidity = ethers.utils.isAddress(array.recipientInput);
          if (currenciesStatus === 0) {
            return toast.error("please choose Currency!");
          }
          if (chain === "0") {
            return toast.error("please select Chain Id!");
          }
          if (walletValidity === false) {
            isValid = false;
          }
        });

        if (!isValid) {
          return toast.error("invalid wallet!");
        }

        if (formik?.values?.RoyaltyfeesPercentage > 101) {
          return toast.error("RoyaltyfeesPercentage smaller then 100!");
        } else if (formik?.values?.RoyaltyfeesPercentage && feeArray?.length === 0) {
          return toast.error("Minimum 1 recipient is necessary!");
        } else if (formik?.values?.RoyaltyfeesPercentage && sumOfPercentages !== 100) {
          return toast.error("sum of the Recipient must be equal to 100!");
        }
        setLoader(true);

        let brandName = brandCategoryData?.brand.name;
        let categoryName;
        categoryArray.categories.map((data) => {
          if (data.value === category) {
            categoryName = data.label;
          }
        });
        // eslint-disable-next-line no-useless-concat
        const contractName = "Galileo" + " " + brandName + " " + categoryName;
        const symbol = "G" + brandName?.substring(0, 1) + categoryName?.substring(0, 1);
        // const signer = provider.getSigner();
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const factoryAddr = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, signer);
        // let profitAmount = ethers.utils.parseUnits(formik.values.profitPercentage.toString(),6);
        // eslint-disable-next-line no-unused-vars
        const s = await signer.getAddress();
        console.log("🚀 ~ handleContractDeployment ~ s:", s);

        let data = [
          [parseUnits("0", 6), parseUnits("2001", 6), parseUnits("15001", 6)],
          [parseUnits("2000", 6), parseUnits("15000", 6), parseUnits("10000000", 6)],
          [parseUnits("15", 6), parseUnits("12", 6), parseUnits("8", 6)]
        ];

        let daysInSeconds = formik.values.escrowLockDays ? Number(formik.values.escrowLockDays) * 86400 : 600;
        let res;
        let addr;
        try {
          console.log("Trying to deploy category");
          if (formik.values.useGas) {
            res = await factoryAddr.deployGalileoProtocol(
              contractName,
              symbol,
              formik.values.brandSymbol,
              daysInSeconds,
              MarketplaceAddress.address,
              selectedaddress,
              data,
              { gasLimit: 4000000, gasPrice: ethers.utils.parseUnits("30", "gwei") }
            );
          } else {
            res = await factoryAddr.deployGalileoProtocol(
              contractName,
              symbol,
              formik.values.brandSymbol,
              daysInSeconds,
              MarketplaceAddress.address,
              selectedaddress,
              data
            );
          }
          console.log("after factory try");

          res = await res?.wait();
          addr = res?.events[7]?.args[0];
        } catch (error) {
          console.log({ error });
          setOpen(false);
          setLoader(false);
          // if (!error?.reason) return;
          toast.error(error?.reason || error?.message || "Error while deploying category");
        }
        if (addr) {
          try {
            const nfts = new ethers.Contract(addr, NFTAbi.abi, signer);
            const escrow = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);
            await (await nfts.grantRole(BLOCKCHAIN.VALIDATOR_ROLE, BLOCKCHAIN.SIGNATURE_WALLET_ADDRESS)).wait();
            await (await escrow.grantRole(BLOCKCHAIN.MARKETPLACE_ROLE, addr)).wait();
            dispatch(
              addBrandCategory({
                brandId: brandCategoryData.brandId,
                categoryId: category,
                profitPercentage: 0,
                // profitPercentage: formik.values.profitPercentage,
                RoyaltyfeesPercentage: formik.values.RoyaltyfeesPercentage ? formik.values.RoyaltyfeesPercentage : 0,
                chainId: chain,
                currencySymbol: currencySymbol,
                feeArray: feeArray,
                brandSymbol: formik.values.brandSymbol,

                // address data
                registeredBusinnesName: formik.values.registeredBusinessName,
                vatNumber: formik.values.vatNumber,
                addressLine1: formik.values.addressLine1,
                addressLine2: formik.values.addressLine2,
                city: formik.values.city,
                state: formik.values.state,
                postalCode: formik.values.zip,
                country: formik.values.country,
                taxType: formik.values.taxType.value,
                isUpdateDeliveryStatus: formik.values.updateDeliveryStatus,
                refurbishedSales: formik.values.refurbishedSales,
                contractAddress: addr,
                page: page,
                limit: limit,
                search: search,
                handleClose: handleClose,
                setLoader
              })
            );
          } catch (error) {
            console.log(error, "///");
            toast.error(error?.reason || error?.message || "Error while granting role or dispatch");
          }
        }
      }
    } else {
      toast.error("Please choose a category");
    }
  };

  const handleUpdateContractDeployment = async () => {
    if (await checkWallets()) {
      setLoader(true);
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contractAddress = brandCategoryData.contractAddress;
      const marketplaceAddr = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

      let price = ethers.utils.parseUnits(formik.values.profitPercentage.toString(), 6);

      await (
        await marketplaceAddr.setPlatformFee(price).catch((error) => {
          setOpen(false);
          setLoader(false);
          if (provider?.provider?.isMagic && !error?.reason) return;
          toast.error(error.reason);
        })
      )?.wait();

      dispatch(
        updateBrandCategory({
          brandId: brandCategoryData.brandId,
          categoryId: brandCategoryData.categoryId,
          profitPercentage: 0,
          // profitPercentage: formik.values.profitPercentage,
          page: page,
          limit: limit,
          search: search,
          handleClose: handleClose
        })
      );
    }
  };

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    profitPercentage: Yup.number()
      .min(0, "Profit Percentage should not be less than 0")
      .max(99, "Profit Percentage should not exceed 99"),
    // .required("Profit Percentage is required")
    // .test("valid-decimal", "Enter a valid number with up to two decimal places", function (value) {
    //   if (value === undefined || value === null) return true;

    //   const decimalRegex = /^\d+(\.\d{1,2})?$/;
    //   return decimalRegex.test(String(value));
    // })
    // .typeError("Invalid Profit Percentage"),
    // RoyaltyfeesPercentage: Yup.number()
    // .min(0, 'Royalty fees Percentage should not be less than 0')
    // .max(1000, 'Royalty fees Percentage should not exceed 1000')
    // .required('Royalty fees Percentage is required')
    // .test('valid-decimal', 'Enter a valid number with up to two decimal places', function (value) {
    //   if (value === undefined || value === null) return true;

    //   const decimalRegex = /^\d+(\.\d{1,2})?$/;
    //   return decimalRegex.test(String(value));
    // })
    // .typeError('Invalid Royalty fees Percentage'),
    brandSymbol: !isUpdate
      ? Yup.string()
          .min(2, "Brand Symbol should not be less than two")
          .max(6, "Brand Symbol should not exceed 6")
          .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field")
          .required("Brand Symbol is required")
      : null,

    registeredBusinessName: isUpdate ? Yup.string() : Yup.string().required("Required"),
    vatNumber: isUpdate ? Yup.string() : Yup.string().required("Required"),
    addressLine1: isUpdate ? Yup.string() : Yup.string().required("Required"),
    addressLine2: Yup.string(),
    city: isUpdate ? Yup.string() : Yup.string().required("Required"),
    state: isUpdate ? Yup.string() : Yup.string().required("Required"),
    zip: isUpdate ? Yup.string() : Yup.string().required("Required"),
    country: isUpdate ? Yup.string() : Yup.string().required("Required"),
    taxType: isUpdate ? Yup.object() : Yup.object().required("Required"),
    escrowLockDays:
      process.env.REACT_APP_ENVIRONMENT === "development"
        ? Yup.string()
        : Yup.string()
            .test("min", "The minimum value is 1", (value) => parseFloat(value) >= 1)
            .test("max", "The maximum value is 45", (value) => parseFloat(value) <= 45)
            .required("Required")
  });

  const formik = useFormik({
    enableReinitialize: true,
    // initialValues: brandCategoryData,
    initialValues: isUpdate
      ? brandCategoryData
      : {
          brandSymbol: "",
          profitPercentage: "",
          RoyaltyfeesPercentage: "",
          registeredBusinessName: "",
          vatNumber: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          taxType: "",
          escrowLockDays: "",
          useGas: false,
          updateDeliveryStatus: false,
          refurbishedSales: false
        },
    validationSchema,
    onSubmit: (values) => {
      if (!isUpdate) {
        handleContractDeployment();
      } else {
        handleUpdateContractDeployment();
      }
    }
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setFeeArray([]);
    setLoader(false);
  };

  useEffect(() => {
    dispatch(getAllCategoriesDropdown({ brandId: params?.id }));
    dispatch(getAllCurrencies({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog
        sx={{
          "*::-webkit-scrollbar": {
            width: "0.3em"
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "gray"
          }
        }}
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="adminDialog dialog"
        maxWidth="sm"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="form-dialog-title" className="assignheading">
          {!isUpdate ? "Assign Category" : " Update Profit "}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <>
                {!isUpdate && (
                  <>
                    <Grid item xs={12} pt={2}>
                      <TextField
                        className="responsiveSelectfield textfieldStyle field"
                        id="outlined-select-budget"
                        select
                        fullWidth
                        label="Select Category"
                        value={category}
                        onChange={handleCategoryChange}
                        variant="standard"
                      >
                        <MenuItem value={0}>Choose Category</MenuItem>
                        {categoryArray &&
                          categoryArray.categories &&
                          categoryArray.categories.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} pt={2}>
                      <TextField
                        className="textfieldStyle field"
                        variant="standard"
                        id="brandSymbol"
                        name="brandSymbol"
                        label="Enter Brand Symbol"
                        value={formik.values.brandSymbol}
                        onChange={formik.handleChange}
                        error={formik.touched.brandSymbol && formik.errors.brandSymbol}
                        helperText={formik.touched.brandSymbol && formik.errors.brandSymbol}
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

                {/* <Grid item xs={12} pt={2}>
                  <TextField
                    className="textfieldStyle field"
                    variant="standard"
                    id="profitPercentage"
                    name="profitPercentage"
                    label="Enter Profit Percentage"
                    value={formik.values.profitPercentage}
                    onChange={formik.handleChange}
                    error={formik.touched.profitPercentage && Boolean(formik.errors.profitPercentage)}
                    helperText={formik.touched.profitPercentage && formik.errors.profitPercentage}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment pr={2}>%</InputAdornment>
                    }}
                    sx={{
                      "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
                        "-webkit-appearance": "none",
                        margin: 0
                      },
                      "& input[type=number]": {
                        "-moz-appearance": "textfield"
                      }
                    }}
                  />
                </Grid> */}
                {!isUpdate && (
                  <>
                    <Grid item xs={12} md={5.5} pt={3.5}>
                      <TextField
                        className="responsiveSelectfield textfieldStyle field"
                        id="outlined-select-budget"
                        select
                        fullWidth
                        // label="Currency/Symbol"
                        value={chain}
                        onChange={handleChainIdChange}
                        variant="standard"
                      >
                        <MenuItem value={0} disabled>
                          Chain Id
                        </MenuItem>
                        {groupedChains !== undefined &&
                          groupedChains &&
                          Object.keys(groupedChains).map((option, index) => (
                            <MenuItem
                              onClick={() => {
                                setChainId(option);
                              }}
                              key={index}
                              value={option}
                            >
                              {groupedChains[option][index].networkName}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item xs={12} md={5.5} pt={3.5}>
                      <TextField
                        className="responsiveSelectfield textfieldStyle field"
                        id="outlined-select-budget"
                        select
                        fullWidth
                        // label="Currency/Symbol"
                        value={currenciesStatus}
                        onChange={handleCurrenciesChange}
                        variant="standard"
                      >
                        <MenuItem value={0} disabled>
                          Currency/Symbol
                        </MenuItem>
                        {chaincurrencies?.map((item, index) => (
                          <MenuItem
                            onClick={() => {
                              setSelectedaddress(item?.address);
                              setCurrencySymbol(item?.currencySymbol);
                            }}
                            key={item.id}
                            value={item?.currencySymbol}
                          >
                            {item.currencySymbol}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} pt={2}>
                      <TextField
                        type="number"
                        className="textfieldStyle field"
                        variant="standard"
                        id="RoyaltyfeesPercentage"
                        name="RoyaltyfeesPercentage"
                        label="Royalty  fees Percentage"
                        value={formik.values.RoyaltyfeesPercentage}
                        onChange={formik.handleChange}
                        error={formik.touched.RoyaltyfeesPercentage && Boolean(formik.errors.RoyaltyfeesPercentage)}
                        helperText={formik.touched.RoyaltyfeesPercentage && formik.errors.RoyaltyfeesPercentage}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0 },
                          endAdornment: <InputAdornment pr={2}>%</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid container xs={{ display: "flex", alignItems: "center" }}>
                      <Grid xs={12} mt={2}>
                        <Button
                          className="fieldbutton"
                          variant="contained"
                          sx={{ float: "right" }}
                          onClick={() => {
                            setFeeArray([
                              ...feeArray,
                              {
                                recipientInput: "",
                                Percentage: ""
                              }
                            ]);
                          }}
                        >
                          Add Recipient
                        </Button>
                      </Grid>

                      <>
                        <Grid container mt={2}>
                          <Grid xs={12}>
                            <Button
                              className="walletbutton adminname"
                              variant="text"
                              sx={{
                                color: "#fff"
                              }}
                            >
                              Update delivery status
                            </Button>
                            <Switch
                              name="updateDeliveryStatus"
                              onChange={formik.handleChange}
                              checked={formik.values.updateDeliveryStatus}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} mt={1}>
                          {feeArray.map((data, index) => (
                            <>
                              <Grid item xs={12} pt={2} sx={{ display: "flex" }}>
                                <Grid item xs={5} mr={1}>
                                  <TextField
                                    id="field_name"
                                    name="field_name"
                                    label="Recipient"
                                    value={data.recipientInput}
                                    inputProps={{ maxLength: 200 }}
                                    onChange={(e) => {
                                      handleRoyaltyfeeChange(e.target.value, index);
                                    }}
                                    variant="standard"
                                    fullWidth
                                  />
                                </Grid>

                                <Grid item md={5}>
                                  <TextField
                                    id="field_name"
                                    name="field_name"
                                    label="Percentage"
                                    value={data.Percentage}
                                    inputProps={{ maxLength: 200 }}
                                    onChange={(e) => {
                                      handlePercentageChange(e.target.value, index);
                                    }}
                                    variant="standard"
                                    fullWidth
                                    InputProps={{
                                      endAdornment: <InputAdornment pr={2}>%</InputAdornment>
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={2} mt={1.8} md={2}>
                                  <IconButton
                                    color="error"
                                    edge="end"
                                    size="small"
                                    onClick={() => {
                                      RemoveRecipientPercentage(index);
                                    }}
                                  >
                                    <Icon icon={closeFill} width={28} height={28} />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                        </Grid>
                      </>
                    </Grid>
                    <Grid container mt={2}>
                      <Grid xs={12}>
                        <Button
                          className="walletbutton adminname"
                          variant="text"
                          sx={{
                            color: "#fff"
                          }}
                        >
                          Allow refurbished sales
                        </Button>
                        <Switch
                          name="refurbishedSales"
                          onChange={formik.handleChange}
                          checked={formik.values.refurbishedSales}
                        />
                      </Grid>
                    </Grid>
                    <Grid container mt={2}>
                      <Grid xs={12}>
                        <Button
                          className="walletbutton adminname"
                          variant="text"
                          sx={{
                            color: "#fff"
                          }}
                        >
                          Use gas
                        </Button>
                        <Switch name="useGas" onChange={formik.handleChange} checked={formik.values.useGas} />
                      </Grid>
                    </Grid>
                    <BrandCategoryAddress formik={formik} open={open} />
                    <Grid item xs={12} pt={2}>
                      <TextField
                        className="textfieldStyle field"
                        variant="standard"
                        type="number"
                        name="escrowLockDays"
                        inputProps={{ min: 0 }}
                        label="Escrow lock period in days"
                        onKeyDown={preventSpecialKeys}
                        value={formik.values.escrowLockDays}
                        onChange={formik.handleChange}
                        error={formik.touched.escrowLockDays && Boolean(formik.errors.escrowLockDays)}
                        helperText={formik.touched.escrowLockDays && formik.errors.escrowLockDays}
                        fullWidth
                        sx={{
                          "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
                            "-webkit-appearance": "none",
                            margin: 0
                          },
                          "& input[type=number]": {
                            "-moz-appearance": "textfield"
                          }
                        }}
                      />
                    </Grid>
                  </>
                )}
              </>
            </Grid>
          </form>
        </DialogContent>
        {loader ? (
          <DialogActions sx={{ display: "block" }}>
            <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>

            <Button
              className="buttons"
              variant="Text"
              sx={{ width: "100%", margin: "0 auto", color: "#2196f3" }}
              size="large"
            >
              Please wait for Assigning Category...
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px", padding: "3px" }}>
            <>
              <AnimateButton>
                <Button
                  variant="contained"
                  className="buttons"
                  sx={{
                    width: "98%",
                    background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                  }}
                  type="submit"
                  size="large"
                  disableElevation
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {!isUpdate ? "Create " : "Update "}
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  className="buttons"
                  variant="outlined"
                  sx={{ width: "100%", color: "#4044ED", ml: "-7px", mt: 2 }}
                  onClick={handleClose}
                  color="secondary"
                  size="large"
                >
                  Cancel
                </Button>
              </AnimateButton>
            </>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
