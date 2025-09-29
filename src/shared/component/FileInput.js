import { useRef } from "react";
import { Fragment } from "react";
import { Grid, Typography, IconButton, Tooltip } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

// Props needed for component formik ,correctOption, setCorrectOption , optionValue , formikFieldName , PlaceHOLDER
const FileInput = ({ formik, fieldName, placeHolder, accept, fontSize = "3.0rem" }) => {
  const fileRef1 = useRef();

  return (
    <>
      <Grid item className="displayFlex">
        <Fragment>
          <Tooltip placement="top" title={accept === "image/*" ? "Add Image" : "Add File"}>
            <IconButton color="primary" aria-label="delete" size="large" onClick={() => fileRef1.current.click()}>
              <AddCircleOutlinedIcon sx={{ fontSize: fontSize }} />
            </IconButton>
          </Tooltip>

          <input
            hidden
            ref={fileRef1}
            type="file"
            className="chooseFileInput"
            accept={accept}
            onChange={(event) => {
              formik.setFieldValue(fieldName, event.currentTarget.files[0]);

              // Reset the value of the file input to allow selecting the same file again
              event.currentTarget.value = null;
            }}
          />
          <Grid className="displayFlex" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {formik?.values[`${fieldName}`]?.name?.length < 40 ? (
              <Typography variant="h5">{formik.values[`${fieldName}`]?.name}</Typography>
            ) : (
              <Typography variant="h5">{formik.values[`${fieldName}`]?.name?.substring(0, 40)}</Typography>
            )}
            {formik?.values[`${fieldName}`] && (
              <Typography variant="h5" ml={2}>
                {`${
                  (formik?.values[fieldName]?.size / 1000000).toFixed(2) === "NaN"
                    ? "Remove Image"
                    : "(" + (formik?.values[`${fieldName}`]?.size / 1000000).toFixed(2) + "  mb)"
                }`}
              </Typography>
            )}

            {formik.values[`${fieldName}`] ? (
              <Tooltip placement="top" ml={2} title={accept === "image/*" ? "Clear Image" : "Clear Audio"}>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  size="large"
                  onClick={() => {
                    formik.setFieldValue(fieldName, null);
                    fileRef1.current.value = null;
                  }}
                >
                  <CloseOutlinedIcon sx={{ fontSize: "1.5rem" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Typography variant="h5">{placeHolder}</Typography>
            )}
          </Grid>
        </Fragment>
      </Grid>

      <Grid item>
        <p className={"fileError"}>
          {formik.touched[`${fieldName}`] && Boolean(formik.errors[`${fieldName}`])
            ? formik.errors[`${fieldName}`]
            : ""}
        </p>
      </Grid>
    </>
  );
};

export default FileInput;
