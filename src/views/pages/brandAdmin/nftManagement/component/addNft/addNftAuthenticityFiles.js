import React from "react";
import "react-circular-progressbar/dist/styles.css";
import closeFill from "@iconify-icons/eva/close-fill";
import { Icon } from "@iconify/react";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { ErrorMessage } from "utils/ErrorMessage";

export const AddNftAuthenticityFiles = ({ fileDataArray, setFileDataArray, authFileNameBol, setAuthFileNameBol }) => {
  const handleFileRemoveField = (index) => {
    let array = [...fileDataArray];
    array.splice(index, 1);
    setFileDataArray(array);
  };
  const handleFileFieldValueChange = (value, index) => {
    let array = [...fileDataArray];
    array[index].value = value;
    setFileDataArray(array);
  };
  const handleFiletrait_typeChange = (value, index) => {
    let array = [...fileDataArray];
    array[index].trait_type = value;
    setFileDataArray(array);
  };
  return (
    <Grid container xs={{ display: "flex", alignItems: "center" }}>
      <Grid xs={12} mt={2} ml={-1}>
        <Button
          className="fieldbutton"
          variant="contained"
          sx={{ float: "left" }}
          onClick={() => {
            setFileDataArray([
              ...fileDataArray,
              {
                trait_type: "",
                value: null
              }
            ]);
            setAuthFileNameBol(false);
          }}
        >
          Add Authenticity Files
        </Button>
      </Grid>
      {fileDataArray.length !== 0 && (
        <Grid container spacing={2} mt={1}>
          {fileDataArray.map((data, index) => (
            <>
              <Grid item xs={4} md={3}>
                <TextField
                  id="field_name"
                  name="field_name"
                  label="File Name"
                  value={data.trait_type}
                  inputProps={{ maxLength: 200 }}
                  error={data.trait_type === "" && authFileNameBol}
                  helperText={data.trait_type === "" && authFileNameBol && "File name is required!"}
                  onChange={(e) => {
                    handleFiletrait_typeChange(e.target.value, index);
                  }}
                  variant="standard"
                  fullWidth
                />
                <ErrorMessage textLength={data?.trait_type?.length} length={200} />
              </Grid>

              <Grid item md={4} style={{ display: "flex", marginTop: "10px" }}>
                <label htmlFor={`avatar-${index}`}>
                  <AddCircleOutlinedIcon color="primary" sx={{ fontSize: "2.5rem" }} />
                </label>
                <input
                  type="file"
                  id={`avatar-${index}`}
                  name={`avatar-${index}`}
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    const selectedFile = event?.currentTarget?.files[0];
                    if (selectedFile) {
                      handleFileFieldValueChange(selectedFile, index);
                      let name = selectedFile.name;
                      if (name.length > 20) {
                        name = name.slice(0, 20) + "...";
                      }
                      document.getElementById(`file-name-${index}`).textContent = name;
                    }
                  }}
                  style={{ display: "none" }}
                />
                <p sx={{ display: "inline-block" }} ms={1} id={`file-name-${index}`}></p>
              </Grid>
              <Grid item xs={2} mt={1.8} md={2}>
                <IconButton
                  color="error"
                  edge="end"
                  size="small"
                  onClick={() => {
                    handleFileRemoveField(index);
                  }}
                >
                  <Icon icon={closeFill} width={28} height={28} />
                </IconButton>
              </Grid>
              <Grid item mt={3} xs={2} md={2}></Grid>
            </>
          ))}
        </Grid>
      )}
    </Grid>
  );
};
