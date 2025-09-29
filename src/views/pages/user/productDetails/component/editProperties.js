/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, Button, Dialog, DialogActions, Slide, TextField, InputLabel } from "@mui/material";
// import { updateProperty } from "redux/brand/actions";
// assets
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Country } from "country-state-city";
// import FileInput from "shared/component/FileInput";
import { editRequestMetadata, metaDataUpdateToken } from "redux/nftManagement/actions";

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

// ===============================|| UI DIALOG - FULL SCREEN ||=============================== //

export default function EditPropertiesNew({ open, setOpen, id, buyerNft, nftList }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const nftid = nftList?.nft?.id;

  var [proofAry, setProofAry] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldDataArray, setFieldDataArray] = useState([]);
  const tokenUri = useSelector((state) => state.nftReducer.nft_token);

  useEffect(() => {
    if (tokenUri.tokenUri) {
      (async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nft = new ethers.Contract(nftList?.nft?.contractAddress, NFTAbi.abi, signer);
        const owner = await nft.ownerOf(nftList?.nft?.NFTTokens[0].tokenId);
        await (
          await nft.updateUri(nftList.nft?.NFTTokens[0].tokenId, tokenUri.tokenUri, owner).catch((error) => {
            toast.error(error.reason);
          })
        )
          .wait()
          .then((data) => {
            dispatch(
              metaDataUpdateToken({
                nftId: nftid,
                tokenUri: tokenUri
              })
            );
          });
        handleClose();
      })();
    }
  }, [tokenUri.tokenUri]);

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
    }

    // eslint-disable-next-line array-callback-return
    fieldDataArray.map((array) => {
      if (array.trait_type === "") {
        isValid = false;
        toast.error("Metadata name cannot be empty");
      } else if (array.value === "") {
        isValid = false;
        toast.error("Metadata value cannot be empty");
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
      // eslint-disable-next-line no-unused-vars
      let isValid = handleError(fieldDataArray);
      setLoader(true);
      dispatch(
        editRequestMetadata({
          fieldDataChange: fieldDataArray,
          proofAry,
          nftId: nftid,
          handleClose,
          setLoader
        })
      );
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

      if (tokenUri.tokenUri) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nft = new ethers.Contract(nftList?.nft?.contractAddress, NFTAbi.abi, signer);
        const owner = await nft.ownerOf(nftList?.nft?.NFTTokens[0].tokenId);
        await (
          await nft.updateUri(nftList.nft?.NFTTokens[0].tokenId, tokenUri.tokenUri, owner).catch((error) => {
            toast.error(error.reason);
          })
        )
          .wait()
          .then((data) => {
            dispatch(
              metaDataUpdateToken({
                nftId: nftid,
                tokenUri: tokenUri
              })
            );
          });
      }

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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth={"lg"}
        sx={{ width: "100%", margin: "0 auto", maxHeight: "500px" }}
      >
        <DialogActions sx={{ pr: 2.5 }}>
          <Button
            className="buttonSize"
            size="large"
            sx={{ color: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
          >
            <CloseIcon />
          </Button>
        </DialogActions>
        <Grid container sx={{ pr: 2.5, pl: 2.5 }}>
          <Grid item xs={12} md={12} lg={12} sx={{ p: 2.5 }}>
            <form noValidate onSubmit={formik.handleSubmit}>
              {fieldDataArray.length !== 0 && (
                <>
                  <Grid container spacing={4} mt={1}>
                    {fieldDataArray.map(
                      (data, index) =>
                        data?.display_type &&
                        data?.isEditable && (
                          <React.Fragment key={index}>
                            <Grid xs={6} md={3}>
                              <TextField
                                fullWidth
                                className="w-100"
                                variant="standard"
                                value={data.display_type}
                                // id="outlined-select-budget"
                                sx={{ m: 5.6, width: "80%" }}
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
                            <Grid item xs={6} md={3}>
                              <TextField
                                fullWidth
                                id="field_name"
                                name="field_name"
                                variant="standard"
                                label="Metadata Name"
                                value={data.trait_type}
                                className="textfieldStyle"
                              />
                            </Grid>
                            {data.display_type === "Text" && (
                              <Grid item xs={2} md={2}>
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
                              <Grid item xs={2} md={2}>
                                <TextField
                                  className="textfieldStyle"
                                  fullWidth
                                  id="Number"
                                  name="Number"
                                  type="number"
                                  label="Number"
                                  value={data.value}
                                  variant="standard"
                                  onChange={(e) => handleFieldValueChange(e.target.value, index)}
                                />
                              </Grid>
                            )}
                            {data.display_type === "Date" && (
                              <>
                                <Grid item xs={2} md={2} className="my-2 w-100" sx={{ margin: 3 }}>
                                  <DatePicker
                                    showIcon
                                    label="Select date"
                                    value={new Date(data.value)}
                                    selected={new Date(data.value)}
                                    onChange={(e) => handleFieldValueChange(e, index)}
                                  />
                                </Grid>
                              </>
                            )}
                            {data.display_type === "Location" && (
                              <Grid item xs={2} md={1}>
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
                            )}

                            {data.display_type === "Location" && (
                              <Grid item xs={2} md={2}>
                                <Select
                                  theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 0,
                                    colors: {
                                      ...theme.colors,
                                      neutral80: "white"
                                    }
                                  })}
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      background: "#023950"
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
                            )}
                            <Grid item xs={2} md={2}>
                              {data?.proofRequired && (
                                <>
                                  <InputLabel sx={{ fontSize: "10px" }} htmlFor="outlined-adornment-password-login">
                                    Add Proof
                                  </InputLabel>
                                  <TextField
                                    id="file"
                                    type="file"
                                    name="file"
                                    label="file"
                                    // value={data.value}
                                    variant="standard"
                                    className="textfieldStyle"
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
          <DialogActions sx={{ mt: -4, pr: 2.5 }}>
            <CircularProgress sx={{ color: "blue", ml: 3 }} />
          </DialogActions>
        ) : (
          <>
            <DialogActions sx={{ mt: -4, pr: 2.5 }}>
              <Button
                size="large"
                type="submit"
                color="secondary"
                variant="outlined"
                className="buttonSize"
                sx={{ color: theme.palette.success.dark }}
                onClick={() => formik.handleSubmit()}
              >
                Update
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
