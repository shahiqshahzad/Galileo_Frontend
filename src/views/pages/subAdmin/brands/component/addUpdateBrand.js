import { forwardRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Divider,
  InputLabel
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addBrand, updateBrand } from "../../../../../redux/brand/actions";
import AnimateButton from "ui-component/extended/AnimateButton";
import FileInput from "../../../../../shared/component/FileInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateBrandDialog({ brandData, page, limit, search, open, setOpen }) {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (brandData.id == null) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  }, [brandData]);

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    name: Yup.string().required("Brand Name is required!").max(42, "Brand Name can not exceed 42 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Brand name'),
    location: Yup.string().required("Location is required!").max(42, "Location can not exceed 42 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Location'),
    description: Yup.string().required("Brand is required!").max(400, "Brand can not exceed 400 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Description'),
    image: Yup.mixed()
      .when(["isUpdate"], {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.mixed().required("Image is required")
      })
      .test("image size", "this image is too large", (value) => !value || (value && value.size <= 1_000_000))
  });
  const errorHandler = (values) => {
    if (values.image) {
      if (
        values.image.name.split(".").pop() === "jpg" ||
        values.image.name.split(".").pop() === "png" ||
        values.image.name.split(".").pop() === "jpeg "
      ) {
        return true;
      } else {
        toast.error("Upload the files with these extensions: jpg, png, jpeg");
        return false;
      }
    }
    return true;
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: brandData,
    validationSchema,
    onSubmit: (values) => {
      const isValid = errorHandler(values);
      if (isValid) {
        if (brandData.id == null) {
          dispatch(
            addBrand({
              name: values.name,
              description: values.description,
              location: values.location,
              image: values.image,
              page: page,
              limit: limit,
              search: search,
              handleClose: handleClose
            })
          );
        } else {
          dispatch(
            updateBrand({
              brandId: brandData.id,
              name: values.name,
              description: values.description,
              location: values.location,
              image: values.image,
              page: page,
              limit: limit,
              search: search,
              id: user.id,
              handleClose: handleClose
            })
          );
        }
      }
    }
  });
  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="createDialog dialog"
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="adminname">
          {brandData.id == null ? "Create Brand" : "Update Brand"}
        </DialogTitle>

        <DialogContent>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Grid container>
              <Grid item xs={12} md={12} lg={12}>
                <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                  Name
                </InputLabel>
                <TextField
                  className="field"
                  id="name"
                  name="name"
                  variant="standard"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                  Location
                </InputLabel>
                <TextField
                  className="field"
                  id="location"
                  name="location"
                  variant="standard"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                  Description
                </InputLabel>
                <TextField
                  className="field"
                  id="description"
                  name="description"
                  variant="standard"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2} sx={{ ml: { md: "-15px", lg: "-15px" } }}>
                <FileInput
                  className="textfieldStyle"
                  variant="standard"
                  formik={formik}
                  accept="image/*"
                  fieldName="image"
                  placeHolder="Add Brand Image"
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
          <AnimateButton>
            <Button
              type="submit"
              className="buttons"
              size="large"
              variant="contained"
              sx={{
                width: "92%",
                margin: "0px 0px 10px 8px",
                background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
              }}
              onClick={() => {
                formik.handleSubmit();
              }}
              disableElevation
            >
              {brandData.id == null ? "Create" : "Update"}
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              variant="outlined"
              sx={{ width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
              onClick={handleClose}
              className="buttons"
              size="large"
            >
              Cancel
            </Button>
          </AnimateButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
