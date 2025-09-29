import { forwardRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  InputLabel,
  TextField,
  Grid,
  DialogTitle,
  DialogActions,
  Slide,
  CircularProgress
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import AnimateButton from "ui-component/extended/AnimateButton";
import { addCategory, updateCategory } from "redux/categories/actions";
import FileInput from "../../../../../shared/component/FileInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AddUpdateCategory({ open, setOpen, categoryData, page, limit, search }) {
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (categoryData.id == null) {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  }, [categoryData]);

  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    name: Yup.string().required("Category Name is required!").max(200, "Category Name can not exceed 200 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Category name'),
    description: Yup.string()
      .required("Description is required!")
      .max(400, "Description can not exceed 400 characters"),
    // .matches(/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/, 'Invalid Description'),
    image: Yup.mixed()
      .when(["isUpdate"], {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.mixed().required("Image is required")
      })

      .test("image size", "Choose image less than 5 mb", (value) => !value || (value && value.size <= 5_000_000))
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
    initialValues: categoryData,
    validationSchema,
    onSubmit: async (values) => {
      const isValid = errorHandler(values);
      if (isValid) {
        setLoader(true);
        if (categoryData.id == null) {
          await dispatch(
            addCategory({
              name: values.name,
              description: values.description,
              image: values.image,
              page: page,
              limit: limit,
              search: search,
              handleClose: handleClose,
              setLoader
            })
          );
        } else {
          await dispatch(
            updateCategory({
              categoryId: categoryData.id,
              name: values.name,
              description: values.description,
              image: values.image,
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
    setLoader(false);

    formik.resetForm();
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="createDialog dialog"
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="form-dialog-title" className="adminname">
          {categoryData.id == null ? "Create Category " : " Update Category "}
        </DialogTitle>

        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <InputLabel htmlFor="outlined-adornment-password-login" className="textfieldStyle">
                Name
              </InputLabel>
              <TextField
                id="name"
                className="field"
                name="name"
                variant="standard"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                autoComplete="given-name"
                disabled={loader ? true : false}
              />

              <InputLabel
                sx={{ marginTop: "15px" }}
                htmlFor="outlined-adornment-password-login"
                className="textfieldStyle"
              >
                Description
              </InputLabel>
              <TextField
                variant="standard"
                className="field"
                id="description"
                name="description"
                multiline
                maxRows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                fullWidth
                autoComplete="given-name"
                disabled={loader ? true : false}
              />
            </Grid>

            <Grid item xs={12} pt={2} sx={{ ml: { md: "-15px", lg: "-15px" } }}>
              <FileInput
                className="textfieldStyle"
                formik={formik}
                accept="image/*"
                fieldName="image"
                placeHolder="Add Category Image"
                variant="standard"
              />
            </Grid>
          </form>
        </DialogContent>
        {loader ? (
          <>
            <DialogActions
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 10px 0px 20px" }}
            >
              <CircularProgress disableShrink size={"4rem"} />
            </DialogActions>
          </>
        ) : (
          <>
            <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px" }}>
              <AnimateButton>
                <Button
                  sx={{
                    width: "92%",
                    margin: "0px 0px 10px 8px",
                    background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                  }}
                  className="buttons"
                  variant="contained"
                  type="submit"
                  size="large"
                  onClick={formik.handleSubmit}
                >
                  {categoryData.name !== "" ? "Update " : "Create "}
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  className="buttons"
                  variant="outlined"
                  sx={{ width: "95%", margin: "0px 0px 10px 0px", color: "#4044ED" }}
                  onClick={handleClose}
                  size="large"
                >
                  Cancel
                </Button>
              </AnimateButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
