import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Tooltip from "@mui/material/Tooltip";
import { Country } from "country-state-city";
import { Icons } from "shared/Icons/Icons.js";
import "react-dropzone-uploader/dist/styles.css";
import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import FormHelperText from "@mui/material/FormHelperText";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { ErrorMessage } from "utils/ErrorMessage";
import { toast } from "react-toastify";
import { Stack } from "@mui/system";
import { dropdown } from "../utils/constants";

export const Attributes = ({
  handleCheckboxChange,
  theme,
  fieldDataArray,
  isFormSubmitBol,
  setFieldDataArray,
  setIsFormSubmitBol,
  errorsArray,
  setErrorsArray,
  setShowPreviewDlg,
  setSelectedPreview
}) => {
  const CustomInput = ({ value, onClick }) => (
    <TextField
      value={value}
      onClick={onClick}
      placeholder="Value"
      sx={{
        width: "100%",
        border: "none",
        marginTop: "1px",
        borderRadius: "5px !important",
        background: "#252B2F",
        "& .MuiInputBase-input": {
          borderRadius: "5px",
          background: "#252B2F",
          border: "none",
          padding: "10.5px",
          color: "white"
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "none"
          },
          "&:hover fieldset": {
            border: "none"
          }
        },
        "& .MuiInput-underline:before": {
          borderBottom: "none"
        },
        "& .MuiInput-underline:after": {
          borderBottom: "none"
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottom: "none"
        }
      }}
      variant="standard"
      readOnly
    />
  );
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: "#252B2F",
      border: "none"
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: theme.palette.mode === "dark" ? "white" : "black"
    }),
    menu: (base) => ({
      ...base,
      marginTop: 5,
      border: "none",
      color: theme.palette.mode === "dark" ? "white" : "#181C1F",
      background: theme.palette.mode === "dark" ? "#252B2F" : "#f3f3f3"
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
            : "#252B2F"
          : state.isSelected
            ? "#2F53FF"
            : "white",
      color: theme.palette.mode === "dark" ? "white" : state.isSelected ? "white" : "black",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#252B2F"
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "grey"
    })
  };

  let InputProps = {
    style: { borderRadius: 0, background: "#252B2F" }
  };

  const textfieldStyle = {
    paddingY: "5px",
    paddingX: "10px",
    borderRadius: "5px",
    border: "none",
    background: "#252B2F",
    "& fieldset": { border: "none" },
    "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    }
  };

  const [selectedType, setSelectedType] = useState({
    value: "Text",
    label: "Text"
  });

  const handleFieldValueChange = (value, index) => {
    let array = [...fieldDataArray];
    array[index].value = value;
    setFieldDataArray(array);
    let errorsData = [...errorsArray];
    setErrorsArray(errorsData.filter((item) => item !== "Properties"));
  };

  const downloadMetaDataProof = (index, file) => {
    const proofLink = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.download = file.name;
    downloadLink.href = proofLink;
    downloadLink.click();
  };

  const downloadMetaDataProofLink = async (index, proofLink) => {
    const response = await fetch(proofLink);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download";
    document.body.appendChild(a);
    a.click();
  };

  const handletrait_typeChange = (value, index) => {
    let array = [...fieldDataArray];
    array[index].trait_type = value;
    setFieldDataArray(array);
    let errorsData = [...errorsArray];
    setErrorsArray(errorsData.filter((item) => item !== "Properties"));
  };

  const handleRemoveField = (index) => {
    let array = [...fieldDataArray];
    array.splice(index, 1);
    setFieldDataArray(array);
    let errorsData = [...errorsArray];
    setErrorsArray(errorsData.filter((item) => item !== "Properties"));
  };

  const handleProofFile = (event, index) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(event.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, JPG, or PDF.");
    } else if (event.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB!");
    } else {
      let array = [...fieldDataArray];
      array[index].proofFile = event;
      setFieldDataArray(array);
      let errorsData = [...errorsArray];
      setErrorsArray(errorsData.filter((item) => item !== "Properties"));
    }
  };

  return (
    <>
      <Stack sx={{ flexDirection: "row", gap: "5px", mb: 1 }}>
        <Typography sx={{ color: "white", fontWeight: 700, fontSize: "20px" }} className="HeaderFonts">
          Properties
        </Typography>
        <Tooltip title="Click to view more details" placement="top" arrow>
          <span
            style={{ cursor: "pointer", paddingTop: "1px" }}
            onClick={() => {
              setShowPreviewDlg(true);
              setSelectedPreview(4);
            }}
          >
            {Icons.eyeIcon}
          </span>
        </Tooltip>
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: "1rem" }}>
        <div style={{ width: "100%" }}>
          <Select
            components={{ IndicatorSeparator: () => null }}
            styles={selectStyles}
            variant="standard"
            placeholder="Select"
            options={dropdown}
            value={
              selectedType?.value
                ? {
                    value: selectedType?.value,
                    label: selectedType?.label
                  }
                : ""
            }
            onChange={(item) => setSelectedType(item)}
          />
        </div>
        <Button
          className="fieldbutton"
          variant="contained"
          sx={{ padding: "4px 20px" }}
          onClick={() => {
            if (selectedType?.value) {
              setFieldDataArray([
                ...fieldDataArray,
                {
                  display_type: selectedType?.value,
                  trait_type: "",
                  value: selectedType?.value === "Date" ? new Date() : "",
                  countryCode: "",
                  isEditable: false,
                  proofRequired: false,
                  primaryLocation: false,
                  Proofs: []
                }
              ]);
              setIsFormSubmitBol(false);
            }
          }}
        >
          Add
        </Button>
      </Stack>
      {fieldDataArray.length !== 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {fieldDataArray.map((data, index) => (
            <>
              <Grid item xs={3} md={3}>
                <TextField
                  className="textfieldStyle"
                  name="field_name"
                  value={data.trait_type}
                  placeholder="Name"
                  variant="outlined"
                  inputProps={{ maxLength: 200 }}
                  sx={{ ...textfieldStyle }}
                  InputProps={{ ...InputProps }}
                  error={data.trait_type === "" && isFormSubmitBol}
                  helperText={data.trait_type === "" && isFormSubmitBol && "Name is required!"}
                  onChange={(e) => {
                    handletrait_typeChange(e.target.value, index);
                  }}
                />
                <ErrorMessage textLength={data?.trait_type?.length} length={200} />
              </Grid>
              {data.display_type === "Text" && (
                <Grid item xs={3} md={3}>
                  <TextField
                    className="textfieldStyle"
                    name="field_value"
                    value={data.value}
                    placeholder="Value"
                    variant="outlined"
                    inputProps={{ maxLength: 200 }}
                    sx={{ ...textfieldStyle }}
                    InputProps={{ ...InputProps }}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Value is required!"}
                    onChange={(e) => {
                      handleFieldValueChange(e.target.value, index);
                    }}
                    fullWidth
                  />
                  <ErrorMessage textLength={data?.value?.length} length={200} />
                </Grid>
              )}
              {data.display_type === "Number" && (
                <Grid item xs={3} md={3}>
                  <TextField
                    className="textfieldStyle"
                    name="Number"
                    type="number"
                    value={data.value}
                    placeholder="Value"
                    variant="outlined"
                    inputProps={{ maxLength: 200 }}
                    sx={{ ...textfieldStyle }}
                    InputProps={{ ...InputProps }}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Number is required!"}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        handleFieldValueChange(e.target.value, index);
                      }
                    }}
                    fullWidth
                  />
                  <ErrorMessage textLength={data?.value?.length} length={200} />
                </Grid>
              )}
              {data.display_type === "Date" && (
                <Grid item xs={3} md={3} className="my-1 w-100">
                  <DatePicker
                    showIcon
                    customInput={<CustomInput />}
                    label="Select date"
                    selected={new Date(data.value)}
                    value={new Date(data.value)}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={
                      data.value === "" &&
                      isFormSubmitBol && (
                        <span style={{ color: "red", fontFamily: theme?.typography.appText }}>
                          Metadata date is required!
                        </span>
                      )
                    }
                    onChange={(e) => {
                      let data = fieldDataArray[index];
                      data.value = e;
                      fieldDataArray[index] = data;
                      setFieldDataArray([...fieldDataArray]);
                      let errorsData = [...errorsArray];
                      setErrorsArray(errorsData.filter((item) => item !== "Properties"));
                    }}
                  />
                </Grid>
              )}
              {data.display_type === "Location" && (
                <Grid item xs={3} md={3}>
                  <TextField
                    className="textfieldStyle"
                    name="Postal Code"
                    type="number"
                    value={data.postalCode}
                    placeholder="Value"
                    variant="outlined"
                    inputProps={{ maxLength: 200 }}
                    sx={{ ...textfieldStyle }}
                    InputProps={{ ...InputProps }}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Postal code is required!"}
                    onChange={(e) => {
                      handleFieldValueChange(e.target.value, index);
                    }}
                    fullWidth
                  />
                  <Tooltip className="fontsize" title="Primary Location" placement="right" arrow>
                    <input
                      type="checkbox"
                      checked={fieldDataArray[index].primaryLocation}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Tooltip>
                </Grid>
              )}
              {data.display_type === "Location" && (
                <Grid item xs={3} md={3} mt={0.4} sx={{ width: "50%", borderRadius: "2%" }}>
                  <Select
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        background: theme.palette.mode === "dark" ? "#181C1F" : "#fff",
                        border: "none",
                        borderBottom: theme.palette.mode === "dark" ? "1px solid #bdc8f0" : "1px solid #000",
                        borderRadius: "0px"
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: 0,
                        marginTop: 0,
                        color: theme.palette.mode === "dark" ? "#181C1F" : "black"
                      })
                    }}
                    className="selectFieldDesign"
                    variant="standard"
                    placeholder="Select The Country"
                    options={Country?.getAllCountries()}
                    getOptionLabel={(options) => {
                      return options["name"] ? options["name"] : options["label"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"] ? options["name"] : options["value"];
                    }}
                    value={
                      fieldDataArray[index]?.phone?.value
                        ? {
                            value: fieldDataArray[index]?.phone?.value,
                            label: fieldDataArray[index]?.phone?.label
                          }
                        : ""
                    }
                    onChange={(item) => {
                      let data = fieldDataArray[index];
                      let value = item.isoCode;
                      data.phone = { value: item.isoCode, label: item.name };
                      data.countryCode = value;
                      fieldDataArray[index] = data;
                      setFieldDataArray([...fieldDataArray]);
                    }}
                  />
                  {data.countryCode === undefined && isFormSubmitBol && (
                    <FormHelperText sx={{ color: "#f44336" }}>Metadata country code is required!</FormHelperText>
                  )}
                </Grid>
              )}
              <Grid item xs={3} md={3} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {fieldDataArray[index]?.Proofs?.length ? (
                  <>
                    <Box
                      as="div"
                      sx={{ cursor: "pointer", height: "fit-content" }}
                      onClick={() => window.open(fieldDataArray[index]?.Proofs[0]?.decryptedProof, "_blank")}
                    >
                      <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                        <span>{Icons.viewProofDocument}</span>
                      </Tooltip>
                    </Box>
                    <Box
                      as="div"
                      sx={{ cursor: "pointer", height: "fit-content" }}
                      onClick={() => downloadMetaDataProofLink(index, fieldDataArray[index]?.Proofs[0]?.decryptedProof)}
                    >
                      <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                        <span>{Icons.downloadProofDocument}</span>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  fieldDataArray[index].proofFile && (
                    <>
                      <Box
                        as="div"
                        onClick={() => window.open(URL.createObjectURL(fieldDataArray[index].proofFile), "_blank")}
                      >
                        <Tooltip className="fontsize" title="View proof document" placement="top" arrow>
                          <span>{Icons.viewProofDocument}</span>
                        </Tooltip>
                      </Box>
                      <Box as="div" onClick={() => downloadMetaDataProof(index, fieldDataArray[index].proofFile)}>
                        <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                          <span>{Icons.downloadProofDocument}</span>
                        </Tooltip>
                      </Box>
                    </>
                  )
                )}

                <Box as="div">
                  <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                    <label htmlFor={`test${index}`}> {Icons.uploadAttributeIcon}</label>
                  </Tooltip>
                  <input
                    id={`test${index}`}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleProofFile(e.target.files[0], index)}
                  />
                </Box>
              </Grid>

              <Grid item xs={3} md={3}>
                <Button
                  className="fieldbutton"
                  variant="contained"
                  sx={{
                    padding: "4px 20px",
                    background: "linear-gradient(97.63deg, #FF2F2F 0%, #FF4F4F 108.45%) !important"
                  }}
                  onClick={() => handleRemoveField(index)}
                >
                  Delete
                </Button>
              </Grid>
            </>
          ))}
        </Grid>
      )}
    </>
  );
};
