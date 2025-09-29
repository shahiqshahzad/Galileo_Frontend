import { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
import { addSubAdmin, updateSubAdmin } from "redux/subAdmin/actions";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import { ethers } from "ethers";
import Escrow from "contractAbi/GalileoEscrow.js";

import {
  Button,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Divider,
  Grid,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BLOCKCHAIN from "../../../../../constants";
import axios from "utils/axios";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet } from "utils/utilFunctions";
import { useActiveAccount } from "thirdweb/react";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateSubAdminDialog({ open, setOpen, subAdminData, page, limit, search, setSubAdminData }) {
  const account = useActiveAccount();
  const { provider, signer } = useWeb3();
  const dispatch = useDispatch();
  const { brandCategories } = useSelector((state) => state.brandCategoryReducer.brandCategoriesAdminList);
  const userToken = useSelector((state) => state.auth.token);
  const headers = { headers: { Authorization: `Bearer ${userToken}` } };

  const [isUpdate, setIsUpdate] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [brandCategoryId, setBrandCategoryId] = useState(0);
  const [loader, setLoader] = useState(false);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (subAdminData.id === null) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  }, [subAdminData]);

  const handleBrandCategoryChange = (e) => {
    setContractAddress(e.target.value.contractAddress);
    setBrandCategoryId(e.target.value.id);
  };

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    adminEmail: Yup.string().email("Enter valid email").max(255).required("Email is required!"),
    walletAddress: Yup.string().required("Wallet Address is required!")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: subAdminData,
    validationSchema,
    onSubmit: async (values) => {
      if (await checkWallet(provider, dispatch, account, user.walletAddress)) {
        if (subAdminData.id === null) {
          if (brandCategoryId === 0) {
            toast.error("Please choose a category");
          } else {
            try {
              setLoader(true);
              const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
              // const escrow = new ethers.Contract(Escrow.address, Escrow.abi, signer);
              await (await nfts.grantRole(BLOCKCHAIN.SUB_ADMIN_ROLE, values.walletAddress)).wait();
              // await (await escrow.grantRole(BLOCKCHAIN.ESCROW_ROLE, values.walletAddress)).wait();

              dispatch(
                addSubAdmin({
                  email: values.adminEmail,
                  walletAddress: values.walletAddress,
                  brandCategory: brandCategoryId,
                  hasMintingAccess: true,
                  page: page,
                  limit: limit,
                  search: search,
                  handleClose: handleClose,
                  setLoader
                })
              );
            } catch (error) {
              toast.error(`${error.reason}`);
              setLoader(false);
              // setOpen(false);
            }
            //    toast.success("Please wait for confirmation Transaction !");
          }
        } else {
          dispatch(
            updateSubAdmin({
              id: subAdminData.id,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.adminEmail,
              password: values.adminPassword,
              walletAddress: subAdminData.walletAddress,
              page: page,
              limit: limit,
              search: search,
              handleClose: handleClose
            })
          );
        }
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
    setLoader(false);
    setSubAdminData({
      id: null,
      firstName: "",
      lastName: "",
      adminEmail: "",
      adminPassword: "",
      walletAddress: "",
      role: "",
      isActive: ""
    });
    formik.resetForm();
  };
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}admin/get-wallet-address?email=${formik.values.adminEmail}`,
        headers
      );
      if (data?.data?.user) {
        formik.setFieldValue("walletAddress", data.data?.user?.walletAddress);
      }
    } catch (error) {
      formik.setFieldValue("walletAddress", "");
      toast.error(error?.response?.data?.data?.message);
    }
  };

  useEffect(() => {
    const fetchTimeOut = setTimeout(() => {
      if (subAdminData?.id === null && formik.values.adminEmail && validateEmail(formik.values.adminEmail)) {
        fetchData();
      }
    }, 600);
    if (formik.values.adminEmail === "") {
      formik.setFieldValue("walletAddress", "");
    }
    return () => {
      clearTimeout(fetchTimeOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.adminEmail]);

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="adminDialog dialog"
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="form-dialog-title" className="adminname">
          {subAdminData.id === null ? "Create Admin" : " Update Admin"}
        </DialogTitle>

        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <>
                <Grid item xs={12} md={12} lg={12} pt={2}>
                  <InputLabel className="textfieldStyle" htmlFor="outlined-adornment-password-login">
                    Email
                  </InputLabel>
                  <TextField
                    className="field"
                    variant="standard"
                    name="adminEmail"
                    value={formik.values.adminEmail}
                    onChange={formik.handleChange}
                    error={formik.touched.adminEmail && Boolean(formik.errors.adminEmail)}
                    helperText={formik.touched.adminEmail && formik.errors.adminEmail}
                    fullWidth
                  />
                </Grid>

                {subAdminData?.id === null && (
                  <>
                    <Grid item xs={12} md={12} lg={12} pt={2}>
                      <InputLabel className="textfieldStyle" htmlFor="">
                        Wallet Address
                      </InputLabel>
                      <TextField
                        className="field"
                        variant="standard"
                        name="walletAddress"
                        placeholder="This field would be auto-filled"
                        value={formik.values.walletAddress}
                        onChange={formik.handleChange}
                        error={formik.touched.walletAddress && Boolean(formik.errors.walletAddress)}
                        helperText={formik.touched.walletAddress && formik.errors.walletAddress}
                        fullWidth
                        autoComplete=""
                        disabled
                      />
                    </Grid>
                    <Grid item xs={6} md={12} lg={12} pt={2}>
                      <InputLabel className="textfieldStyle" htmlFor="">
                        Select Category
                      </InputLabel>
                      <TextField
                        variant="standard"
                        className="responsiveSelectfield textfieldStyle field"
                        id="outlined-select-budget"
                        select
                        fullWidth
                        // label="Select Category"
                        // value={category}
                        onChange={handleBrandCategoryChange}
                      >
                        {brandCategories?.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data.Category?.name} ({data.Brand?.name})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                )}
              </>
            </Grid>
          </form>
        </DialogContent>
        <Divider />

        <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
          <AnimateButton>
            <Button
              className="buttons"
              variant="contained"
              disabled={loader}
              sx={{
                width: "92%",
                margin: "0px 0px 10px 8px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
              type="submit"
              size="large"
              disableElevation
              onClick={() => formik.handleSubmit()}
            >
              {loader ? (
                <Grid container justifyContent="center" sx={{ width: "50%" }}>
                  <Grid item display={"flex"}>
                    <CircularProgress disableShrink size={"1.9rem"} />
                  </Grid>
                </Grid>
              ) : subAdminData.id === null ? (
                "Create "
              ) : (
                "Update "
              )}
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              className="buttons"
              variant="outlined"
              sx={{ width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
              onClick={handleClose}
              color="secondary"
              size="large"
            >
              Cancel
            </Button>
          </AnimateButton>
        </DialogActions>
        {/* )} */}
      </Dialog>
    </>
  );
}
