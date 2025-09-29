import { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers, utils } from "ethers";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
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
  CircularProgress
} from "@mui/material";
import FactoryAbi from "../../../../../../contractAbi/Factory.json";
import FactoryAddress from "../../../../../../contractAbi/Factory-address.js";
import "react-toastify/dist/ReactToastify.css";
import { SNACKBAR_OPEN } from "store/actions";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateBrandCategoryDialog({ open, setOpen, brandCategoryData, page, limit, search }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const categoryArray = useSelector((state) => state.brandCategoryReducer.categoriesDropdownList);
  const [category, setCategory] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loader, setLoader] = useState(false);

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

  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window?.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      // toast.error('No crypto wallet found. Please install it.');
    }

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
    else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
    } else {
      return true;
    }
  };

  const handleContractDeployment = async () => {
    if (await checkWallet()) {
      setLoader(true);
      let brandName = brandCategoryData?.brand.name;
      let categoryName;
      // eslint-disable-next-line array-callback-return
      categoryArray.categories.map((data) => {
        if (data.value === category) {
          categoryName = data.label;
        }
      });
      // eslint-disable-next-line no-useless-concat
      const contractName = "Galileo" + " " + brandName + " " + categoryName;
      const symbol = "G" + brandName?.substring(0, 1) + categoryName?.substring(0, 1);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factoryAddr = new ethers.Contract(FactoryAddress.address, FactoryAbi, signer);

      let res = await (
        await factoryAddr.deployMintingContract(contractName, symbol).catch((error) => {
          setOpen(false);
          setLoader(false);
          console.log("error", error);
        })
      )?.wait();
      let addr = res?.events[2]?.args[0];
      if (res) {
        dispatch(
          addBrandCategory({
            brandId: brandCategoryData.brandId,
            categoryId: category,
            profitPercentage: formik.values.profitPercentage,
            contractAddress: addr,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose,
            setLoader
          })
        );
      }
    }
  };

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    profitPercentage: Yup.number()
      .min(1, "Profit Percentage should not be less than one")
      .max(99, "Profit Percentage should not exceed 99")
      .required("Profit Percentage is required")
      .typeError("Invalid Profit Percentage")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: brandCategoryData,
    validationSchema,
    onSubmit: (values) => {
      if (!isUpdate) {
        handleContractDeployment();
      } else {
        dispatch(
          updateBrandCategory({
            brandId: brandCategoryData.brandId,
            categoryId: brandCategoryData.categoryId,
            profitPercentage: values.profitPercentage,
            page: page,
            limit: limit,
            search: search,
            handleClose: handleClose
          })
        );
      }
    }
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setLoader(false);
  };

  useEffect(() => {
    dispatch(getAllCategoriesDropdown({ brandId: brandCategoryData.brandId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog
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
          {!isUpdate ? "Assign Category " : " Update Profit "}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <>
                {!isUpdate && (
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
                )}

                <Grid item xs={12} pt={2}>
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
                  />
                </Grid>
              </>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
          {loader ? (
            <CircularProgress />
          ) : (
            <>
              <AnimateButton>
                <Button
                  variant="contained"
                  className="buttons"
                  sx={{
                    width: "92%",
                    margin: "0px 0px 10px 8px",
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
                  sx={{ my: 1, ml: 0, width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
                  onClick={handleClose}
                  color="secondary"
                  size="large"
                >
                  Cancel
                </Button>
              </AnimateButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
