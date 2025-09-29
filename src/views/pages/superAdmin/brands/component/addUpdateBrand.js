import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  InputLabel,
  CircularProgress
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
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
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
    description: Yup.string().required("Description is required!"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Description'),
    image: Yup.mixed()
      .when(["isUpdate"], {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.mixed().required("Image is required")
      })

      .test("image size", "Choose image less than 5 mb", (value) => !value || (value && value.size <= 5_000_000)),
    instagram: Yup.string(),
    medium: Yup.string(),
    telegram: Yup.string(),
    website: Yup.string().url("Website must be a valid URL"),
    facebook: Yup.string(),
    twitter: Yup.string(),
    linkedin: Yup.string(),
    email: Yup.string().email("Email must be a valid email"),
    phoneNumber: Yup.string(),
    discord: Yup.string()
  });
  const errorHandler = (values) => {
    if (values.image) {
      if (
        values.image.name.split(".").pop() === "jpg" ||
        values.image.name.split(".").pop() === "png" ||
        values.image.name.split(".").pop() === "jpeg"
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
    initialValues: {
      ...brandData,
      instagram: brandData.instagram || "",
      medium: brandData.medium || "",
      telegram: brandData.telegram || "",
      website: brandData.website || "",
      facebook: brandData.facebook || "",
      twitter: brandData.twitter || "",
      linkedin: brandData.linkedin || "",
      email: brandData.email || "",
      phoneNumber: brandData.phoneNumber || "",
      discord: brandData.discord || ""
    },
    validationSchema,
    onSubmit: (values) => {
      const isValid = errorHandler(values);
      if (isValid) {
        setLoading(true);
        if (brandData?.id == null) {
          dispatch(
            addBrand({
              name: values.name,
              description: values.description,
              location: values.location,
              image: values.image,
              instagram: values.instagram,
              medium: values.medium,
              telegram: values.telegram,
              website: values.website,
              facebook: values.facebook,
              twitter: values.twitter,
              linkedin: values.linkedin,
              email: values.email,
              phoneNumber: values.phoneNumber,
              discord: values.discord,
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
              instagram: values.instagram,
              medium: values.medium,
              telegram: values.telegram,
              website: values.website,
              facebook: values.facebook,
              twitter: values.twitter,
              linkedin: values.linkedin,
              email: values.email,
              phoneNumber: values.phoneNumber,
              discord: values.discord,
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
    formik.resetForm();
    setLoading(false);
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
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="website" className="textfieldStyle">
                  Website
                </InputLabel>
                <TextField
                  className="field"
                  id="website"
                  name="website"
                  variant="standard"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  error={formik.touched.website && Boolean(formik.errors.website)}
                  helperText={formik.touched.website && formik.errors.website}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="phoneNumber" className="textfieldStyle">
                  Phone Number
                </InputLabel>
                <TextField
                  className="field"
                  id="phoneNumber"
                  name="phoneNumber"
                  variant="standard"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="email" className="textfieldStyle">
                  E-mail
                </InputLabel>
                <TextField
                  className="field"
                  id="email"
                  name="email"
                  variant="standard"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="instagram" className="textfieldStyle">
                  Instagram
                </InputLabel>
                <TextField
                  className="field"
                  id="instagram"
                  name="instagram"
                  variant="standard"
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                  error={formik.touched.instagram && Boolean(formik.errors.instagram)}
                  helperText={formik.touched.instagram && formik.errors.instagram}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="facebook" className="textfieldStyle">
                  Facebook
                </InputLabel>
                <TextField
                  className="field"
                  id="facebook"
                  name="facebook"
                  variant="standard"
                  value={formik.values.facebook}
                  onChange={formik.handleChange}
                  error={formik.touched.facebook && Boolean(formik.errors.facebook)}
                  helperText={formik.touched.facebook && formik.errors.facebook}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="twitter" className="textfieldStyle">
                  Twitter
                </InputLabel>
                <TextField
                  className="field"
                  id="twitter"
                  name="twitter"
                  variant="standard"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                  error={formik.touched.twitter && Boolean(formik.errors.twitter)}
                  helperText={formik.touched.twitter && formik.errors.twitter}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="discord" className="textfieldStyle">
                  Discord
                </InputLabel>
                <TextField
                  className="field"
                  id="discord"
                  name="discord"
                  variant="standard"
                  value={formik.values.discord}
                  onChange={formik.handleChange}
                  error={formik.touched.discord && Boolean(formik.errors.discord)}
                  helperText={formik.touched.discord && formik.errors.discord}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="medium" className="textfieldStyle">
                  Medium
                </InputLabel>
                <TextField
                  className="field"
                  id="medium"
                  name="medium"
                  variant="standard"
                  value={formik.values.medium}
                  onChange={formik.handleChange}
                  error={formik.touched.medium && Boolean(formik.errors.medium)}
                  helperText={formik.touched.medium && formik.errors.medium}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="telegram" className="textfieldStyle">
                  Telegram
                </InputLabel>
                <TextField
                  className="field"
                  id="telegram"
                  name="telegram"
                  variant="standard"
                  value={formik.values.telegram}
                  onChange={formik.handleChange}
                  error={formik.touched.telegram && Boolean(formik.errors.telegram)}
                  helperText={formik.touched.telegram && formik.errors.telegram}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} pt={2}>
                <InputLabel htmlFor="linkedin" className="textfieldStyle">
                  LinkedIn
                </InputLabel>
                <TextField
                  className="field"
                  id="linkedin"
                  name="linkedin"
                  variant="standard"
                  value={formik.values.linkedin}
                  onChange={formik.handleChange}
                  error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
                  helperText={formik.touched.linkedin && formik.errors.linkedin}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <Divider />
        {loading ? (
          <>
            <DialogActions sx={{ display: "block" }}>
              <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
                <Grid item>
                  <CircularProgress disableShrink size={"4rem"} />
                </Grid>
              </Grid>

              {/* <Button className="buttons" variant="Text" sx={{ width: '100%', margin: '0 auto', color: '#2196f3' }} size="large">
              Please wait for Assigning Category...
            </Button> */}
            </DialogActions>
          </>
        ) : (
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
        )}
      </Dialog>
    </>
  );
}
