import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography, TextField } from "@mui/material";
import { rejectNft } from "redux/nftManagement/actions";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  txtFieldStyle: {
    "& .MuiInputBase-input": {
      padding: "10px",
      backgroundColor: theme.palette.mode === "dark" ? "#181c1f" : "white",
      color: theme.palette.mode === "dark" ? "#d7dcec" : "black"
    }
  },
  rejectBtnStyle: {
    "&:hover": {
      backgroundColor: "#F66868"
    },
    backgroundColor: "#F66868",
    fontFamily: theme?.typography.appText,
    fontWeight: 300
  }
}));

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function RejectReasonDialog({ open, setOpen, page, limit, search, setLoader, nftData, type }) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    formik.setFieldValue("rejectReason", event.target.value);
  };

  const validationSchema = Yup.object({
    rejectReason: Yup.string().required("Reject Reason is required")
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      rejectReason: type === "rejected" ? nftData?.rejectReason || "" : ""
    },
    validationSchema,
    onSubmit: (values) => {
      setLoader(true);
      dispatch(
        rejectNft({
          id: nftData.id,
          categoryId: nftData.CategoryId,
          brandId: nftData.BrandId,
          rejectReason: values.rejectReason,
          type: type,
          page: page,
          limit: limit,
          search: search,
          setLoader: () => setLoader(false)
        })
      );
      handleClose();
    }
  });
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth="sm"
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle>
          <Typography sx={{ fontFamily: "DM SANS", fontSize: "1.5rem", fontWeight: 600 }}>
            {type === "rejected" ? "Update delete reason" : "Do you confirm to delete the draft?"}{" "}
          </Typography>
        </DialogTitle>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              id="outlined-multiline-static"
              multiline
              fullWidth
              rows={4}
              placeholder="Enter your reason"
              name="rejectReason"
              className={classes.txtFieldStyle}
              value={formik.values.rejectReason}
              onChange={handleChange}
              error={formik.touched.rejectReason && Boolean(formik.errors.rejectReason)}
              helperText={formik.touched.rejectReason && formik.errors.rejectReason}
            />
          </DialogContent>
          <DialogActions sx={{ pr: 2.5 }}>
            <Button
              sx={{
                fontWeight: 300,
                color: theme.palette.mode === "dark" ? "#FFFFFF80" : "#333333",
                background: theme.palette.mode === "dark" ? "#181C1F" : "white"
                // color: theme.palette.error.dark,
                // borderColor: theme.palette.error.dark
              }}
              onClick={handleClose}
            >
              No
            </Button>
            <Button
              variant="contained"
              size="large"
              type="submit"
              className={classes.rejectBtnStyle}
              sx={{
                fontFamily: theme?.typography.appText,
                fontWeight: 300,
                background: `${type === "rejected" ? "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)" : "#F66868"}`
              }}
              onClick={() => {}}
            >
              {type === "rejected" ? "Update" : "Yes"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
