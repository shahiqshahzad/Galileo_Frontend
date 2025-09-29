import React, { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material/styles";
import { Grid, Button, Dialog, DialogActions, Slide, TextField, InputLabel, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "react-select";
import checkUserKyc from "utils/checkKYC";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Country } from "country-state-city";
import { editRequestMetadata } from "redux/nftManagement/actions";
import AnimateButton from "ui-component/extended/AnimateButton";
import { Box } from "@mui/system";

// slide animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = Yup.object({
  firstName: Yup.string(),
  // .required('First Name is required!').max(25, 'First Name can not exceed 20 characters'),
  // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid First name'),
  lastName: Yup.string()
  // .required('Last Name is required!').max(25, 'Last Name can not exceed 20 characters')
  // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Last name'),
  // file: Yup.mixed().required('File is required!')
  // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Last name'),
});

export default function EditPropertiesNew({ open, setOpen, id, buyerNft, nftList }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const nftid = nftList?.nft?.id;

  const user = useSelector((state) => state?.auth?.user);
  var [proofAry, setProofAry] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldDataArray, setFieldDataArray] = useState([]);

  // useEffect(() => {
  //   if (tokenUri.tokenUri) {
  //     (async () => {
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();
  //       const nft = new ethers.Contract(nftList?.nft?.contractAddress, NFTAbi.abi, signer);
  //       await nft
  //         .updateUri(nftList.nft?.NFTTokens[0].tokenId, tokenUri.tokenUri)
  //         .then((d) => {
  //           dispatch(
  //             metaDataUpdateToken({
  //               nftId: nftid,
  //               tokenUri: tokenUri
  //             })
  //           );
  //         })
  //         .catch((error) => {
  //           toast.error(error.reason);
  //           dispatch(cancelUriToken());
  //         });

  //       handleClose();
  //     })();
  //   }
  // }, [tokenUri.tokenUri]);

  useEffect(() => {
    if (nftList?.nft?.NFTMetaData?.length) {
      setFieldDataArray([...nftList?.nft?.NFTMetaData]);
    }
  }, [nftList]);

  const handleError = (fieldDataArray) => {
    let isValid = true;
    if (fieldDataArray.length === 0) {
      isValid = false;
      toast.error("Metadata is required");
      setLoader(false);
    }

    // eslint-disable-next-line array-callback-return
    fieldDataArray.map((array) => {
      if (array.trait_type === "") {
        isValid = false;
        toast.error("Metadata name cannot be empty");
        setLoader(false);
      } else if (array.value === "") {
        isValid = false;
        toast.error("Metadata value cannot be empty");
        setLoader(false);
      } else if (
        (array.trait_type === "Number" && array.value < 0) ||
        (array.trait_type === "number" && array.value < 0)
      ) {
        isValid = false;
        toast.error("Negative values are not allowed");
        setLoader(false);
      }
      // else if (array.proofRequired && array.Proofs.length === 0) {
      //   isValid = false;
      //   toast.error('Proof is required');
      // }
    });

    return isValid;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { firstName: "", lastName: "", file: "" },
    validationSchema,
    onSubmit: async (values) => {
      const validateKyc = checkUserKyc(user?.UserKyc);
      if (!validateKyc) {
        return;
      }
      setLoader(true);
      let isValid = handleError(fieldDataArray);
      if (isValid) {
        dispatch(
          editRequestMetadata({
            fieldDataChange: fieldDataArray,
            proofAry,
            nftId: nftid,
            handleClose,
            setLoader
          })
        );
      }
      // if (true) {
      //   setLoader(true);

      //   setTimeout(() => {
      //     const singleNft = async () => {
      //       let data = values.file;
      //       const fileResult = await client.add(data);

      //       let fileUrl = `https://galileoprotocol.infura-ipfs.io/ipfs/${fileResult.path}`;

      //       let image = nftList.nft.ipfsUrl;
      //       let price = nftList.nft.price;
      //       let name = nftList.nft.name;
      //       let description = nftList.nft.description;
      //       let projectName = 'Galelio';
      //       let categoryName = nftList.nft.Category.name;
      //       let brandName = nftList.nft.Brand.name;
      //       let metaData = nftList.nft.NFTMetaData;
      //       let poa = nftList.nft.NFTMetaFiles;
      //       let external_url = nftList.nft.NFTMetaFiles[0].fieldValue;

      //       let attributes = [];

      //       for (let i = 0; i < nftList.nft.NFTMetaData.length; i++) {
      //         attributes.push({
      //           trait_type: nftList.nft.NFTMetaData[i].trait_type,
      //           value: nftList.nft.NFTMetaData[i].value
      //         });
      //       }

      //       attributes.push({
      //         trait_type: values.trait_type,
      //         value: values.value,
      //         proof: fileUrl
      //       });

      //       console.log('attributes', attributes);

      //       const result = await client.add(
      //         JSON.stringify({
      //           projectName,
      //           brandName,
      //           categoryName,
      //           image,
      //           name,
      //           description,
      //           price,
      //           attributes,
      //           poa,
      //           external_url
      //         })
      //       );
      //       console.log('result ipfs', result);

      //       const tokenUri = `https://galileoprotocol.infura-ipfs.io/ipfs/${result.path}`;

      // console.log('tokenUri after result', tokenUri.tokenUri);
      // if (tokenUri.tokenUri) {
      //   const provider = new ethers.providers.Web3Provider(window.ethereum);
      //   const signer = provider.getSigner();
      //   const address = await signer.getAddress();
      //   const nft = new ethers.Contract(nftList?.nft?.contractAddress, NFTAbi.abi, signer);
      //   await (
      //     await nft.updateUri(nftList.nft?.NFTTokens[0].tokenId, tokenUri.tokenUri).catch((error) => {
      //       toast.error(error.reason);
      //       console.log(error);
      //     })
      //   )
      //     .then((data) => {
      //       dispatch(
      //         metaDataUpdateToken({
      //           nftId: nftid,
      //           tokenUri: tokenUri
      //         })
      //       );
      //     })
      //     .catch((err) => console.log(err));
      // }

      //           // dispatch(
      //           //   updateProperty({
      //           //     id: id,
      //           //     walletAddress: user?.walletAddress,
      //           //     NFTTokenId: nftList.nft?.NFTTokens[0].id,
      //           //     NftId: nftid,
      //           //     nftid: nftid,
      //           //     fieldName: values?.firstName,
      //           //     fieldValue: values?.lastName,
      //           //     file: values?.file,
      //           //     handleClose: handleClose
      //           //   })
      //           // );
      //         })
      //         .catch((error) => {
      //           toast.error(error.reason);
      //           setLoader(false);
      //         });
      //     };

      //     singleNft();
      //   }, 2000);
      // }
    }
  });

  const handleFileChangeValue = (e, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].fileName = e.target.files[0].name;
    setProofAry((p) => [...p, e.target.files[0]]);
    setFieldDataArray(array);
  };

  const handleClose = () => {
    formik.resetForm();
    setLoader(false);
    setOpen(false);
  };

  // const handleSelect = (e, index) => {
  //   let data = structuredClone(fieldDataArray[index]);
  //   if (e.target.value === "Date") {
  //     data.value = new Date();
  //     data.display_type = e.target?.value;
  //     fieldDataArray[index] = data;
  //     setFieldDataArray([...fieldDataArray]);
  //   } else {
  //     data.value = "";
  //     data.display_type = e.target?.value;
  //     fieldDataArray[index] = data;
  //     setFieldDataArray([...fieldDataArray]);
  //   }
  // };

  const handleFieldValueChange = (value, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].value = value;
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

  return (
    <div>
      <Dialog open={open} TransitionComponent={Transition} maxWidth={"md"} sx={{ width: "100%", margin: "0 auto" }}>
        {/* <DialogActions sx={{ pr: 2.5 }}>
          <Button className="buttonSize" size="large" sx={{ color: theme.palette.error.dark }} onClick={handleClose} color="secondary">
            <CloseIcon />
          </Button>
        </DialogActions> */}
        <Grid container>
          <Grid item xs={12} md={12} lg={12} sx={{ p: 3 }}>
            <Typography variant="h2" ml={1} fontSize={"28px"}>
              Update Metadata
            </Typography>

            <form noValidate onSubmit={formik.handleSubmit}>
              {fieldDataArray.length !== 0 && (
                <>
                  <Grid container spacing={4} mt={1}>
                    {fieldDataArray.map(
                      (data, index) =>
                        data?.display_type &&
                        data?.isEditable && (
                          <React.Fragment key={index}>
                            <Grid xs={6} sm={2}>
                              <TextField
                                fullWidth
                                className="w-100 "
                                disabled={true}
                                variant="standard"
                                value={data.display_type}
                                inputProps={{ disabled: true }}
                                sx={{ m: 6, width: "80%" }}
                                // onChange={(e) => {
                                //   handleSelect(e, index);
                                // }}
                              >
                                {/* {dropdown.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))} */}
                              </TextField>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                              <TextField
                                fullWidth
                                id="field_name"
                                name="field_name"
                                variant="standard"
                                label="Metadata Name"
                                value={data.trait_type}
                                className="textfieldStyle"
                                disabled={true}
                              />
                            </Grid>
                            {data.display_type === "Text" && (
                              <Grid item xs={6} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Text"
                                  id="field_value"
                                  name="field_value"
                                  value={data.value}
                                  variant="standard"
                                  className="textfieldStyle"
                                  onChange={(e) => handleFieldValueChange(e.target.value, index)}
                                />
                              </Grid>
                            )}
                            {data.display_type === "Number" && (
                              <Grid item xs={6} sm={4}>
                                <TextField
                                  className="textfieldStyle"
                                  fullWidth
                                  id="Number"
                                  name="Number"
                                  type="number"
                                  label="Number"
                                  value={data.value}
                                  inputProps={{ min: 0 }}
                                  variant="standard"
                                  onChange={(e) => handleFieldValueChange(e.target.value, index)}
                                />
                              </Grid>
                            )}
                            {data.display_type === "Date" && (
                              <>
                                <Grid item xs={6} sm={4} mt={2.2} className="">
                                  <DatePicker
                                    showIcon
                                    calendarClassName="custom-datepicker-calendar"
                                    wrapperClassName="custom-datepicker-wrapper"
                                    popperClassName="custom-datepicker-popper"
                                    label="Select date"
                                    value={new Date(data.value)}
                                    selected={new Date(data.value)}
                                    customInput={
                                      <input
                                        className="react-datepicker__input"
                                        style={{
                                          width: "100%",
                                          background: theme.palette.mode === "dark" ? "#22282C" : "#fff",
                                          color: theme.palette.mode === "dark" ? "#fff" : "black"
                                        }}
                                      />
                                    }
                                    onChange={(e) => handleFieldValueChange(e, index)}
                                  />
                                </Grid>
                              </>
                            )}
                            {data.display_type === "Location" && (
                              <>
                                <Grid item xs={3} sm={2}>
                                  <TextField
                                    id="Postal Code"
                                    name="Postal Code"
                                    label="Postal Code"
                                    value={data.value}
                                    variant="standard"
                                    className="textfieldStyle"
                                    onChange={(e) => handleFieldValueChange(e.target.value, index)}
                                  />
                                  <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(index)}
                                    checked={fieldDataArray[index].primaryLocation}
                                  />
                                </Grid>
                                <Grid item xs={3} sm={2} mt={1}>
                                  <Select
                                    theme={(theme) => ({
                                      ...theme,
                                      borderRadius: 0,
                                      colors: {
                                        ...theme.colors,
                                        neutral80: "#bdc8f0"
                                      }
                                    })}
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        background: theme.palette.mode === "dark" ? "#181C1F" : "#fff"
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        borderRadius: 0,
                                        marginTop: 0,
                                        color: "black"
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
                                      let data = structuredClone(fieldDataArray[index]);
                                      data.countryCode = item.isoCode;
                                      fieldDataArray[index] = data;
                                      setFieldDataArray([...fieldDataArray]);
                                    }}
                                  />
                                </Grid>
                              </>
                            )}
                            <Grid item xs={6} sm={3}>
                              {data?.proofRequired && (
                                <>
                                  <InputLabel
                                    sx={{
                                      fontSize: "16px",
                                      background: theme.palette.mode === "dark" ? "#22282C" : "#fff",
                                      border: theme.palette.mode === "dark" ? "" : "1px solid black",
                                      height: "60%",
                                      textAlign: "center",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: theme.palette.mode === "dark" ? "#fff" : "#000"
                                    }}
                                    htmlFor={`proof-file-${index}`}
                                  >
                                    {data.fileName ? data.fileName : "Upload File"}
                                  </InputLabel>
                                  <TextField
                                    id={`proof-file-${index}`}
                                    type="file"
                                    name="file"
                                    label="file"
                                    // value={data.value}
                                    sx={{ display: "none" }}
                                    inputProps={{
                                      accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                                    }}
                                    variant="standard"
                                    onChange={(e) => handleFileChangeValue(e, index)}
                                  />
                                  {/* <FileInput
                                    formik={formik}
                                    onChange={(e) => handleFieldValueChange(e.target.values, index)}
                                    accept=".pdf"
                                    fieldName="file"
                                    variant="standard"
                                    fontSize="1.5rem"
                                    className="textfieldStyle"
                                  /> */}
                                </>
                              )}
                            </Grid>
                          </React.Fragment>
                        )
                    )}
                  </Grid>
                </>
              )}
            </form>
          </Grid>
        </Grid>
        {loader ? (
          <DialogActions sx={{ mt: -4, pr: 2.5, width: "90%" }}>
            <CircularProgress sx={{ color: "blue", ml: 3 }} />
          </DialogActions>
        ) : (
          <>
            <Box container sx={{ display: "flex", justifyContent: "flex-end", width: "90%" }}>
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
                  sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                  onClick={() => formik.handleSubmit()}
                  className="buttons"
                  size="large"
                  disableElevation
                >
                  Update
                </Button>
              </AnimateButton>
            </Box>
          </>
        )}
      </Dialog>
    </div>
  );
}
