import React from "react";
import Select from "react-select";
import { ErrorMessage } from "utils/ErrorMessage";
import { Grid, TextField, Box, Tooltip, IconButton, MenuItem } from "@mui/material";
import { Switch } from "@mui/material";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import closeFill from "@iconify-icons/eva/close-fill";

import { Icons } from "shared/Icons/Icons.js";
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

export const EditNftMetaData = ({
  fieldDataArray,
  setFieldDataArray,
  handleSelect,
  handletrait_typeChange,
  handleFieldValueChange,
  handleCheckboxChange,
  Country,
  isValidFileType,
  handleChange,
  handleproof,
  handleRemoveField
}) => {
  const downloadMetaDataProof = async (index, proofLink) => {
    const response = await fetch(proofLink);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "downloaded_file.jpg";
    document.body.appendChild(a);
    a.click();
  };

  const handleProofFile = (event, index) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(event?.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, JPG, or PDF.");
    } else if (event.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB!");
    } else {
      let data = [...fieldDataArray];
      data[index].proofFile = event;
      data[index].Proofs = null;
      setFieldDataArray(data);
    }
  };
  const downloadMetaDataProofFile = (index, proofLink) => {
    const downloadLink = document.createElement("a");
    downloadLink.download = "downloaded_file.png";
    downloadLink.href = proofLink;
    downloadLink.click();
  };
  return (
    <div>
      {fieldDataArray.length !== 0 && (
        <>
          {fieldDataArray.map((data, index) => {
            return (
              <Grid container spacing={4} mt={1} key={index}>
                <Grid xs={2} md={2} mt={-0.4}>
                  <TextField
                    sx={{ m: 6, width: "80%", borderRadius: "2%" }}
                    className="w-100"
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
                    // value={drop}
                    // onChange={metadataDropDown}
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
                    onChange={(e) => {
                      handletrait_typeChange(e.target.value, index);
                    }}
                    variant="standard"
                    fullWidth
                  />
                  <ErrorMessage textLength={data?.trait_type?.length} length={200} />
                </Grid>
                {data.display_type === "Text" && (
                  <Grid item xs={2} md={2}>
                    <TextField
                      className="textfieldStyle"
                      id="field_value"
                      name="field_value"
                      label="Text"
                      inputProps={{ maxLength: 200 }}
                      value={data.value}
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
                  <Grid item xs={2} md={2}>
                    <TextField
                      className="textfieldStyle"
                      id="Number"
                      name="Number"
                      label="Number"
                      type="number"
                      inputProps={{ min: 0, maxLength: 200 }}
                      value={data.value}
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
                    <Grid item xs={2} md={3} mt={2} className="my-1 w-100">
                      <DatePicker
                        showIcon
                        label="Select date"
                        value={new Date(data.value)}
                        selected={new Date(data.value)}
                        onChange={(e) => {
                          handleFieldValueChange(e, index);
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
                      value={data.value}
                      onChange={(e) => {
                        handleFieldValueChange(e.target.value, index);
                      }}
                      variant="standard"
                    />
                    <input
                      type="checkbox"
                      checked={fieldDataArray[index].primaryLocation}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Grid>
                )}

                {data.display_type === "Location" && (
                  <Grid item xs={2} md={2}>
                    <Select
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
                        // formik.setFieldValue("country", item?.phonecode);
                        let data = structuredClone(fieldDataArray[index]);
                        data.countryCode = item.isoCode;
                        fieldDataArray[index] = data;
                        setFieldDataArray([...fieldDataArray]);
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={2} md={2} mt={3} sx={{ display: "flex", justifyContent: "space-between" }}>
                  {fieldDataArray[index]?.Proofs?.length || fieldDataArray[index]?.Proofs ? (
                    <>
                      <Box
                        as="div"
                        onClick={() => window.open(fieldDataArray[index]?.Proofs[0]?.decryptedProof, "_blank")}
                      >
                        <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                          <span>{Icons.viewProofDocument}</span>
                        </Tooltip>
                      </Box>
                      <Box
                        as="div"
                        onClick={() => downloadMetaDataProof(index, fieldDataArray[index]?.Proofs[0]?.decryptedProof)}
                      >
                        <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                          <span>{Icons.downloadProofDocument}</span>
                        </Tooltip>
                      </Box>
                    </>
                  ) : (
                    fieldDataArray[index]?.proofFile &&
                    isValidFileType(fieldDataArray[index]?.proofFile) && (
                      <>
                        <Box
                          as="div"
                          onClick={() => window.open(URL.createObjectURL(fieldDataArray[index]?.proofFile), "_blank")}
                        >
                          <Tooltip className="fontsize" title="Attach proof document" placement="top" arrow>
                            <span>{Icons.viewProofDocument}</span>
                          </Tooltip>
                        </Box>
                        <Box
                          as="div"
                          onClick={() =>
                            downloadMetaDataProofFile(index, URL.createObjectURL(fieldDataArray[index]?.proofFile))
                          }
                        >
                          <Tooltip className="fontsize" title="Download Proof Document" placement="top" arrow>
                            <span>{Icons.downloadProofDocument}</span>
                          </Tooltip>
                        </Box>
                      </>
                    )
                  )}

                  <Box as="div">
                    <Tooltip className="fontsize" title="Upload Proof Document" placement="top" arrow>
                      <label htmlFor={`imgrupload${index}`}> {Icons.uploadProofDocuemnt}</label>
                    </Tooltip>
                    <input
                      id={`imgrupload${index}`}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) => handleProofFile(e.target.files[0], index)}
                      onClick={(e) => {
                        e.target.value = null;
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={2} mt={2} md={3}>
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
                        onChange={(e) => handleproof(e, index)}
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
              </Grid>
            );
          })}
        </>
      )}
    </div>
  );
};
