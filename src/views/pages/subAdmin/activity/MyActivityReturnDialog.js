import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import GalileoMulticall from "../../../../contractAbi/GalileoMulticall.js";
import GalileoEscrow from "../../../../contractAbi/GalileoEscrow.js";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getMyActivitySubAdminDetail, updateReturnMyActivitySubAdmin } from "redux/subAdmin/actions";
import CircularProgress from "@mui/material/CircularProgress";
import { BLOCK_EXPLORER_URL, BLOCKCHAIN_ACTIONS } from "utils/constants";
import { useTheme } from "@mui/material/styles";
import { activityStatusLoaderSuccess, getBrandActivityDetail } from "redux/brandActivityDashboard/actions.js";
import { loggerApi } from "utils/loggerApi.js";
import { useWeb3 } from "utils/MagicProvider";
import { useSDK } from "@metamask/sdk-react";
import { checkWallet } from "utils/utilFunctions";
import { useActiveAccount } from "thirdweb/react";


const useStyles = makeStyles((theme) => ({
  text: {
    fontSize: "16px",
    color: "#fff",
    fontWeight: "400",
    wordBreak: "break-all",
    textAlign: "justify",
    fontFamily: theme?.typography.appText,
    marginBottom: theme.spacing(1)
  },
  serialIdText: {
    fontSize: "16px",
    color: "#2F53FF",
    fontWeight: "300",
    wordBreak: "break-all",
    textAlign: "justify",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(0.8)
  }
}));

const MyActivityReturnDialog = ({ open, setOpen, nft }) => {
  const account = useActiveAccount();
  const LoggedInWalletAddress = useSelector((state) => state.auth.user.walletAddress);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  const [totalAssetPrice] = useState(nft.price * nft.quantity);
  const [loaderReturn, setLoaderReturn] = useState(false);
  const theme = useTheme();
  const { provider, signer } = useWeb3();

  const classes = useStyles();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     setMulticall(signer);
  //     const multicall = new ethers.Contract(GalileoMulticall.address, GalileoMulticall.abi, signer);
  //     setMulticall(multicall);
  //     let tokenIds = nft?.tokenIds.map((tokenId) => parseInt(tokenId));
  //     let result = await multicall.getBatchAssetData([nft?.contractAddress.trim()], [tokenIds]);
  //     result = result[0];
  //     let totalAssetPrice = 0;
  //     result.map((price) => {
  //       totalAssetPrice += (parseFloat(ethers.utils?.formatUnits(price.assetPrice.toString(), 6)));
  //     });
  //     console.log("-----", totalAssetPrice)
  //     setTotalAssetPrice(totalAssetPrice);
  //   };

  //   fetchData();
  // }, []);
  function isValidEthereumAddress(address) {
    if (!address || typeof address !== "string") {
      return false;
    }

    if (!address.startsWith("0x") || address.length !== 42) {
      return false;
    }

    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(address.substring(2));
  }

  const fetchAfterMakeDecision = () => {
    let payload = {
      orderId: nft?.orderNumber,
      setLoader: () => dispatch(activityStatusLoaderSuccess(false))
    };
    dispatch(getMyActivitySubAdminDetail(payload));
    dispatch(getBrandActivityDetail(payload));
  };

  const formik = useFormik({
    initialValues: {
      amount: true,
      checkbox: "full",
      price: totalAssetPrice,
      taxes: false,
      taxVal: "",
      ship: false,
      transferTo: true,
      transferToVal: "",
      otherWalletAddress: "",
      additional_note: ""
    },
    validationSchema: Yup.object().shape({
      amount: Yup.boolean().oneOf([true], "Amount is required"),
      checkbox: Yup.string().when("amount", {
        is: true,
        then: Yup.string()
      }),
      price: Yup.number().required("price is requires").max(totalAssetPrice),
      taxes: Yup.boolean(),
      ship: Yup.boolean(),
      additional_note: Yup.string().required("Additional Note is reuired").min(5).max(250),
      transferTo: Yup.string().oneOf(["transferTo", "invalidate"], "Transfer To is required"),
      TransferVal: Yup.string().when("amount", {
        is: true,
        then: Yup.string()
      }),
      otherWalletAddress: Yup.string()
        .required("Wallet address is required")
        .test("is-valid-ethereum-address", "Invalid Ethereum address", isValidEthereumAddress)
    }),
    onSubmit: async (values) => {
      // if(!provider){return;}
      // const signer = provider.getSigner();
      // const address = await signer.getAddress();

      // if (address === null) {
      //   toast.error("Please connect with your wallet");
      //   return;
      // } else if (address !== LoggedInWalletAddress) {
      //   dispatch({
      //     type: SNACKBAR_OPEN,
      //     open: true,
      //     message: "Please connect your registered Wallet Address",
      //     variant: "alert",
      //     alertSeverity: "info"
      //   });
      //   return;
      // }

      if (
        (await checkWallet(provider, dispatch, account, LoggedInWalletAddress)) ===
        null
      ) {
        return;
      }
      
      try {
        setLoaderReturn(true);
        const contractAddresses = [];
        const transferToAddress = [];
        const tokenIds = [];
        const userRefund = [];
        // const adminRefund = [];
        const relistPrice = [];
        const shippingOption = [];
        const taxesOption = [];
        const additional_note = [];
        // eslint-disable-next-line array-callback-return
        nft.serialIds.map((val) => {
          contractAddresses.push(nft?.contractAddress.trim());
          transferToAddress.push(values.otherWalletAddress);
          tokenIds.push(nft?.tokenIds);

          userRefund.push(ethers.utils.parseUnits((values.price / nft.quantity).toFixed(2).toString(), 6));
          // adminRefund.push(ethers.utils.parseUnits(((totalAssetPrice - values.price) / nft.quantity).toString(), 6));
          relistPrice.push(0);
          shippingOption.push(values.ship);
          taxesOption.push(values.taxes);
          additional_note.push(values.additional_note);
        });
        const multicall = new ethers.Contract(GalileoMulticall.address, GalileoMulticall.abi, signer);
        const escrow = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);
        console.log(values.ship, "values shipment");
        const dispatchRequest = {
          orderNumber: nft?.orderNumber,
          refundedAmount: values.price,
          refundedTax: values.taxes * nft.quantity,
          refundedShippingCost: values.ship * nft.quantity,
          orderId: nft?.id,
          refundedNote: values.additional_note,
          nftStatusAfterReturn: values.transferTo === "transferTo" ? "Returned and Refunded" : "invalidate",
          transferWalletAddress: values.otherWalletAddress,
          serialIds: nft?.serialIds,
          setOpen,
          skipTokenUriCheck: true,
          quantity: nft.quantity,
          price: nft.price,
          middleware: true,
          blockchainAction: BLOCKCHAIN_ACTIONS.MAKE_DECISION
        };
        const endpoint = "/brand/make-return-request-decision";
        const method = "POST";
        await loggerApi(endpoint, method, dispatchRequest);
        console.log(userRefund, "userRefund");
        const { hash: transactionHash, ...rest } = await multicall.makeDecision(
          contractAddresses,
          transferToAddress,
          nft?.tokenIds,
          userRefund,
          relistPrice,
          taxesOption,
          shippingOption,
          additional_note
        );

        delete dispatchRequest.middleware;
        delete dispatchRequest.blockchainAction;
        dispatchRequest.transactionHash = `${BLOCK_EXPLORER_URL}tx/${transactionHash}`;

        dispatch(updateReturnMyActivitySubAdmin(dispatchRequest));

        const frontEndReceipt = await rest.wait();
        const assetInfo = await escrow.getAssetData(nft?.contractAddress.trim(), nft?.tokenIds[0]);
        const requiredReceiptData = {
          transactionHash: frontEndReceipt?.transactionHash,
          status: frontEndReceipt?.status,
          logs: frontEndReceipt?.logs
        }
        dispatchRequest.frontEndReceipt = requiredReceiptData;
        dispatchRequest.referralFees = ethers.utils.formatUnits(assetInfo[1].toString(), 6) * nft.quantity;

        dispatchRequest.fetchAfterMakeDecision = fetchAfterMakeDecision;

        dispatch(updateReturnMyActivitySubAdmin(dispatchRequest));
      } catch (error) {
        setLoaderReturn(false);
        if (provider?.provider?.isMagic && !error?.reason) return;
        toast.error(error.reason);
      }
    }
  });
  return (
    <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={() => setOpen(false)}>
      <DialogTitle className="app-text">Item Details</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item md={5}>
            <Typography variant="body1" className={classes.text}>
              Name
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text}>
            {nft?.nftName}
          </Grid>
          <Grid item md={5}>
            <Typography variant="body1" className={classes.text}>
              Quantity
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text}>
            {nft?.quantity}
          </Grid>
          <Grid item md={5}>
            <Typography variant="body1" className={classes.text}>
              Serial IDs
            </Typography>
          </Grid>
          <Grid spacing={2} item md={7} className={classes.text} display="flex" flexWrap="wrap">
            {nft?.serialIds?.map((serialId, index) => (
              <Typography variant="body1" key={index} className={classes.serialIdText}>
                {serialId}
              </Typography>
            ))}
          </Grid>
          <Grid item md={5}>
            <Typography variant="body1" className={classes.text}>
              Price
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text}>
            {nft?.price ? Number(nft?.price).toFixed(2) : 0} {nft?.currency}
          </Grid>
          <Grid item md={5}>
            <Typography variant="body1" className={classes.text}>
              Amount
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text}>
            {nft?.price ? (Number(nft?.price) * Number(nft?.quantity)).toFixed(2) : 0} {nft?.currency}
          </Grid>
          <Grid item md={5} mt={0.2}>
            <Typography variant="body1" color="#fff" fontSize="15px">
              Total Shipping Charges
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text} mt={0.2}>
            {nft?.shippingCost ? Number(nft?.shippingCost * nft?.quantity).toFixed(2) : 0} {nft?.currency}
          </Grid>
          <Grid item md={5}>
            <Typography variant="body1" color="#fff" fontSize="15px">
              Total Taxes
            </Typography>
          </Grid>
          <Grid item md={7} className={classes.text}>
            {nft?.tax ? Number(nft?.tax).toFixed(2) : 0} {nft?.currency}
          </Grid>
          <Grid container mt={4}>
            <Grid item md={6}>
              <Typography variant="h3">Refund details</Typography>
            </Grid>
            <Grid item md={6} className={classes.text}>
              <Typography variant="subtitle2">Quantity : {nft?.quantity}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <Grid item md={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="amount"
                    checked={formik.values.amount}
                    onChange={(e) => {
                      formik.setFieldValue("amount", e.target.checked);
                      formik.setFieldValue("checkbox", "");
                      formik.setFieldValue("price", "");
                      formik.setFieldTouched("amount", true);
                    }}
                  />
                }
                label="Amount"
              />
              {formik.touched.amount && formik.errors.amount ? (
                <Typography variant="body2" color="error">
                  {formik.errors.amount}
                </Typography>
              ) : null}
            </Grid>
            {formik.values.amount && (
              <Grid container alignItems="center" ml={3}>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkbox"
                        value="full"
                        checked={formik.values.checkbox === "full"}
                        onChange={(e) => {
                          formik.setFieldValue("checkbox", e.target.value);
                          formik.setFieldValue("price", totalAssetPrice);
                        }}
                      />
                    }
                    label="Full"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="checkbox"
                        value="partial"
                        checked={formik.values.checkbox === "partial"}
                        onChange={(e) => {
                          formik.setFieldValue("checkbox", e.target.value);
                          formik.setFieldValue("price", "");
                        }}
                      />
                    }
                    label="Partial"
                  />
                </Grid>
                <Grid item xs={4} mt={-3.5}>
                  {formik.values.checkbox !== "full" && (
                    <TextField
                      id="price"
                      label={`Enter amount in ${nft?.currency}`}
                      variant="standard"
                      name="price"
                      size="small"
                      // disabled={totalAssetPrice == formik.values.price}
                      onChange={formik.handleChange}
                      value={formik.values.price}
                      error={formik.touched.price && Boolean(formik.errors.price)}
                      helperText={formik.touched.price && formik.errors.price}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  {formik.touched.checkbox && formik.errors.checkbox ? (
                    <Typography variant="body2" color="error">
                      {formik.errors.checkbox}
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
            )}
            <Grid item md={12}>
              <FormControlLabel
                control={<Checkbox name="taxes" checked={formik.values.taxes} onChange={formik.handleChange} />}
                label="Taxes"
              />
              {formik.touched.taxes && formik.errors.taxes ? (
                <Typography variant="body2" color="error">
                  {formik.errors.taxes}
                </Typography>
              ) : null}
            </Grid>

            <Grid item md={12}>
              <FormControlLabel
                control={<Checkbox name="ship" checked={formik.values.ship} onChange={formik.handleChange} />}
                label="Shipping"
              />
              {formik.touched.ship && formik.errors.ship ? (
                <Typography variant="body2" color="error">
                  {formik.errors.ship}
                </Typography>
              ) : null}
            </Grid>

            {/* ----------------------------------------- */}
            <Grid item md={12}>
              <Grid container>
                <Typography variant="h3" fontFamily={theme?.typography.appText}>
                  pNFT status
                </Typography>
                <Grid item md={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Transferto"
                        checked={formik.values.transferTo === "transferTo"}
                        value="transferTo"
                        onChange={(e) => {
                          formik.setFieldValue("transferTo", e.target.value);
                        }}
                      />
                    }
                    label="Transfer to"
                  />
                  {formik.touched.transferTo && formik.errors.transferTo ? (
                    <Typography variant="body2" color="error">
                      {formik.errors.transferTo}
                    </Typography>
                  ) : null}
                </Grid>
                {formik.values.transferTo === "transferTo" && (
                  <React.Fragment>
                    <Grid item md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="transferToVal"
                            value="buyer"
                            checked={formik.values.transferToVal === "buyer"}
                            onChange={(e) => {
                              formik.setFieldValue("transferToVal", e.target.value);
                              formik.setFieldValue("otherWalletAddress", nft?.user?.walletAddress);
                            }}
                          />
                        }
                        label="Buyer"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="transferToVal"
                            value="me"
                            checked={formik.values.transferToVal === "me"}
                            onChange={(e) => {
                              formik.setFieldValue("transferToVal", e.target.value);
                              formik.setFieldValue("otherWalletAddress", LoggedInWalletAddress);
                            }}
                          />
                        }
                        label="Me"
                      />
                    </Grid>
                    <Grid item md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="transferToVal"
                            value="other"
                            checked={formik.values.transferToVal === "other"}
                            onChange={(e) => {
                              formik.setFieldValue("transferToVal", e.target.value);
                              formik.setFieldValue("otherWalletAddress", "");
                            }}
                          />
                        }
                        label="Other"
                      />
                    </Grid>
                    <Grid item md={3} mt={-1.5}>
                      {formik.values.transferToVal === "other" && (
                        <TextField
                          id="otherWalletAddress"
                          label="Enter wallet address"
                          variant="standard"
                          name="otherWalletAddress"
                          size="small"
                          onChange={formik.handleChange}
                          value={formik.values.otherWalletAddress}
                          error={formik.touched.otherWalletAddress && Boolean(formik.errors.otherWalletAddress)}
                          helperText={formik.touched.otherWalletAddress && formik.errors.otherWalletAddress}
                        />
                      )}
                    </Grid>
                    {formik.touched.otherWalletAddress && formik.errors.otherWalletAddress ? (
                      <Typography variant="body2" color="error">
                        {formik.errors.otherWalletAddress}
                      </Typography>
                    ) : null}
                    <Typography variant="subtitle2" color="white">
                      Make sure to transfer the pNFT to the product owner
                    </Typography>
                  </React.Fragment>
                )}
                <Grid md={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Transferto"
                        value="invalidate"
                        checked={formik.values.transferTo === "invalidate"}
                        onChange={(e) => {
                          formik.setFieldValue("transferTo", e.target.value);
                          formik.setFieldValue("otherWalletAddress", "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
                        }}
                      />
                    }
                    label="Invalidate"
                  />
                </Grid>
                <Typography variant="subtitle2" color="white" className="app-text">
                  The invalidated pNFT cannot be used again, and is lost forever.
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="additional_note"
                label="Additional Note"
                variant="standard"
                name="additional_note"
                onChange={formik.handleChange}
                value={formik.values.additional_note}
                error={formik.touched.additional_note && Boolean(formik.errors.additional_note)}
                helperText={formik.touched.additional_note && formik.errors.additional_note}
              />
            </Grid>

            {!loaderReturn ? (
              <Grid item md={4} mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpen(false);
                    formik.resetForm();
                    formik.setErrors({});
                    setLoaderReturn(false);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            ) : null}
            <Grid item mt={2} md={8}>
              {loaderReturn ? (
                <Box ml={5}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="submit" variant="contained" className="app-text">
                    Initiate Refund
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MyActivityReturnDialog;
