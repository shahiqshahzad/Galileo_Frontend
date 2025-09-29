import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { supportRequest } from "redux/auth/actions";
import { setLoader } from "../../../../redux/auth/actions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "12px 12px"
  }
}));
export default function SupportModal({ open, setOpen }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };
  const validate = (values) => {
    const errors = {};

    if (!values.subject) {
      errors.subject = "Subject is required";
    }

    if (!values.description) {
      errors.description = "Description is required";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      subject: "",
      description: ""
    },
    validate,
    onSubmit: async (values) => {
      await dispatch(setLoader(true));
      dispatch(
        supportRequest({
          subject: values.subject,
          query: values.description,
          handleClose: handleClose
        })
      );
    }
  });
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <InputLabel
              sx={{ color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="buttonStyling"
              htmlFor="outlined-adornment-email-login"
            >
              Subject{" "}
            </InputLabel>
            <TextField
              fullWidth
              id="subject"
              name="subject"
              placeholder="Subject"
              variant="outlined"
              InputProps={{
                classes: {
                  input: classes.input
                }
              }}
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
            />
            <InputLabel
              sx={{ marginTop: "10px", color: theme.palette.mode === "dark" ? "white" : "#404040" }}
              className="buttonStyling"
              htmlFor="outlined-adornment-email-login"
            >
              Description{" "}
            </InputLabel>
            <TextField
              fullWidth
              multiline
              id="description"
              name="description"
              placeholder="Description"
              variant="outlined"
              InputProps={{
                classes: {
                  input: classes.input
                }
              }}
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ marginTop: "15px" }}>
              <Button onClick={handleClose} variant="outlined" className="app-text">
                Close
              </Button>
              <Button type="submit" variant="contained" className="app-text">
                Submit
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
