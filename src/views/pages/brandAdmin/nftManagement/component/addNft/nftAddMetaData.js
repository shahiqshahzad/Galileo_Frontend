import React from "react";
import Select from "react-select";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import Tooltip from "@mui/material/Tooltip";
import { Country } from "country-state-city";
import { Icons } from "shared/Icons/Icons.js";
import "react-dropzone-uploader/dist/styles.css";
import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import closeFill from "@iconify-icons/eva/close-fill";
import FormHelperText from "@mui/material/FormHelperText";
import { Box, Button, Grid, IconButton, MenuItem, Switch, TextField } from "@mui/material";
import { ErrorMessage } from "utils/ErrorMessage";
import { toast } from "react-toastify";

const dropdown = [
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
  },
  {
    value: "Location",
    label: "Location"
  }
];

export const NftAddMetaData = ({
  handleCheckboxChange,
  theme,
  fieldDataArray,
  isFormSubmitBol,
  setFieldDataArray,
  setIsFormSubmitBol
}) => {
  const handleFieldValueChange = (value, index) => {
    let array = [...fieldDataArray];
    array[index].value = value;
    setFieldDataArray(array);
  };

  const downloadMetaDataProof = (index, file) => {
    const proofLink = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.download = file.name;
    downloadLink.href = proofLink;
    downloadLink.click();
  };

  const handletrait_typeChange = (value, index) => {
    let array = [...fieldDataArray];
    array[index].trait_type = value;
    setFieldDataArray(array);
  };

  const handleRemoveField = (index) => {
    let array = [...fieldDataArray];
    array.splice(index, 1);
    setFieldDataArray(array);
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
    }
  };

  const handleChange = (event, index) => {
    let array = [...fieldDataArray];
    array[index].isEditable = event.target?.checked;
    setFieldDataArray(array);
  };

  const handleSelect = (event, index) => {
    let array = [...fieldDataArray];
    array[index].display_type = event.target?.value;
    setFieldDataArray(array);
  };

  const handleProof = (event, index) => {
    let array = structuredClone(fieldDataArray);
    array[index].proofRequired = event.target?.checked;
    setFieldDataArray(array);
  };
  return (
    <>
      <Grid xs={12} mt={2} ml={-1}>
        <Button
          className="fieldbutton"
          variant="contained"
          sx={{ float: "left", padding: { md: " 6px 38px", lg: "6px 38px" } }}
          onClick={() => {
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
          }}
        >
          Add Properties
        </Button>
      </Grid>
      {fieldDataArray.length !== 0 && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {fieldDataArray.map((data, index) => (
            <>
              <Grid xs={5} md={3} mt={-0.5}>
                <TextField
                  sx={{ ml: 1, my: 4, width: "80%", borderRadius: "2%" }}
                  className="w-100"
                  // className="textfieldStyle"
                  variant="standard"
                  id="outlined-select-budget"
                  select
                  fullWidth
                  value={data.display_type}
                  onChange={(e) => {
                    handleSelect(e, index);
                    if (e.target.value === "Date") {
                      let data = fieldDataArray[index];
                      data.value = new Date();
                      fieldDataArray[index] = data;
                      setFieldDataArray([...fieldDataArray]);
                    } else {
                      let data = fieldDataArray[index];
                      data.value = "";
                      fieldDataArray[index] = data;
                      setFieldDataArray([...fieldDataArray]);
                    }
                  }}
                >
                  {dropdown.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2} md={2}>
                <TextField
                  id="field_name"
                  className="textfieldStyle"
                  name="field_name"
                  label="Metadata Name"
                  value={data.trait_type}
                  inputProps={{ maxLength: 200 }}
                  error={data.trait_type === "" && isFormSubmitBol}
                  helperText={data.trait_type === "" && isFormSubmitBol && "Metadata name is required!"}
                  onChange={(e) => {
                    handletrait_typeChange(e.target.value, index);
                  }}
                  variant="standard"
                  fullWidth
                />
                <ErrorMessage textLength={data?.trait_type?.length} length={200} />
              </Grid>
              {data.display_type === "Text" && (
                <Grid item xs={3} md={3}>
                  <TextField
                    className="textfieldStyle"
                    id="field_value"
                    name="field_value"
                    label="Text"
                    value={data.value}
                    inputProps={{ maxLength: 200 }}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Metadata value is required!"}
                    onChange={(e) => {
                      handleFieldValueChange(e.target.value, index);
                    }}
                    variant="standard"
                    fullWidth
                  />
                  <ErrorMessage textLength={data?.value?.length} length={200} />
                </Grid>
              )}
              {data.display_type === "Number" && (
                <Grid item xs={3} md={3}>
                  <TextField
                    className="textfieldStyle"
                    id="Number"
                    name="Number"
                    label="Number"
                    type="number"
                    value={data.value}
                    inputProps={{ min: 0, maxLength: 200 }}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Metadata number is required!"}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        handleFieldValueChange(e.target.value, index);
                      }
                    }}
                    variant="standard"
                    fullWidth
                  />
                  <ErrorMessage textLength={data?.value?.length} length={200} />
                </Grid>
              )}
              {data.display_type === "Date" && (
                <>
                  <Grid item xs={2} md={3} mt={2.2} className="my-1 w-100">
                    <DatePicker
                      showIcon
                      label="Select date"
                      selected={data.value}
                      value={data.value}
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
                        // setStartDate(startDate);
                      }}
                    />
                  </Grid>
                </>
              )}
              {data.display_type === "Location" && (
                <Grid item xs={2} md={1}>
                  <TextField
                    className="textfieldStyle"
                    id="Postal Code"
                    name="Postal Code"
                    label="Postal Code"
                    type="number"
                    value={data.postalCode}
                    error={data.value === "" && isFormSubmitBol}
                    helperText={data.value === "" && isFormSubmitBol && "Metadata postal code is required!"}
                    onChange={(e) => {
                      handleFieldValueChange(e.target.value, index);
                    }}
                    variant="standard"
                    fullWidth
                  />
                  <Tooltip className="fontsize" title="Primary Location" placement="right" arrow>
                    <input
                      type="checkbox"
                      checked={fieldDataArray[index].primaryLocation}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Tooltip>
                  {/* {fieldDataArray[index].primaryLocation === false && isFormSubmitBol && <FormHelperText sx={{color:'#f44336'}}>Metadata primary location is required!</FormHelperText>} */}
                </Grid>
              )}
              {data.display_type === "Location" && (
                <Grid item xs={2} md={2} mt={0.4} sx={{ width: "50%", borderRadius: "2%" }}>
                  <Select
                    // styles={style}
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
                    // label={selectedCode}
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
                      // formik.setFieldValue("country", item?.phonecode);
                      let data = fieldDataArray[index];
                      let value = item.isoCode;
                      data.phone = { value: item.isoCode, label: item.name };
                      data.countryCode = value;
                      fieldDataArray[index] = data;
                      setFieldDataArray([...fieldDataArray]);
                      // setSelectedCode({value:item.phonecode, label: item.name});
                    }}
                  />
                  {data.countryCode === undefined && isFormSubmitBol && (
                    <FormHelperText sx={{ color: "#f44336" }}>Metadata country code is required!</FormHelperText>
                  )}
                </Grid>
              )}
              <Grid
                item
                xs={2}
                md={1.5}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                {fieldDataArray[index].proofFile && (
                  <>
                    <Box
                      as="div"
                      onClick={() => window.open(URL.createObjectURL(fieldDataArray[index].proofFile), "_blank")}
                    >
                      <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                        <span>{Icons.viewProofDocument}</span>
                      </Tooltip>
                    </Box>
                    <Box as="div" onClick={() => downloadMetaDataProof(index, fieldDataArray[index].proofFile)}>
                      <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                        <span>{Icons.downloadProofDocument}</span>
                      </Tooltip>
                    </Box>
                  </>
                )}

                <Box as="div">
                  <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                    <label htmlFor={`test${index}`}> {Icons.uploadProofDocuemnt}</label>
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

              <Grid item xs={2} mt={2} md={2.5}>
                <Tooltip className="fontsize" title="Allow update by NFT owner" placement="top" arrow>
                  <Switch
                    value={data?.isEditable}
                    checked={data?.isEditable}
                    onChange={(e) => handleChange(e, index)}
                    // inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Tooltip>
                {data?.isEditable === true && (
                  <Tooltip className="fontsize" title="Accept proof on update of metadata" placement="top" arrow>
                    <Switch
                      value={data.proofRequired}
                      checked={data.proofRequired}
                      onChange={(e) => handleProof(e, index)}
                      // inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Tooltip>
                )}
                <IconButton
                  color="error"
                  edge="end"
                  size="small"
                  onClick={() => {
                    handleRemoveField(index);
                  }}
                >
                  <Icon icon={closeFill} width={28} height={28} />
                </IconButton>
              </Grid>
            </>
          ))}
        </Grid>
      )}
    </>
  );
};
