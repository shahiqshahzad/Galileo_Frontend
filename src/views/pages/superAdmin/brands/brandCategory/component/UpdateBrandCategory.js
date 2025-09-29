import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Switch,
  CircularProgress
} from "@mui/material";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { updateBrandCategoryToggle } from "redux/brandCategory/actions";

const UpdateBrandCategory = ({ open, modalHandler, brandCategoryData }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brandId: brandCategoryData?.BrandId,
      categoryId: brandCategoryData?.CategoryId,
      allowRefurbishedSales: brandCategoryData?.allowRefurbishedSales,
      isUpdateDeliveryStatus: brandCategoryData?.isUpdateDeliveryStatus
    },
    onSubmit: (values) => {
      dispatch(updateBrandCategoryToggle({ data: values, setLoader, modalHandler }));
    }
  });
  return (
    <>
      <Dialog
        sx={{
          "*::-webkit-scrollbar": {
            width: "0.3em"
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "gray"
          }
        }}
        aria-labelledby="form-dialog-title"
        className="adminDialog dialog"
        maxWidth="sm"
        open={open}
      >
        <DialogTitle id="form-dialog-title" className="assignheading">
          Update Category
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container>
              <Grid item xs={12} pt={2}>
                <Button
                  className="walletbutton adminname"
                  variant="text"
                  sx={{
                    color: "#fff"
                  }}
                >
                  Update delivery status
                </Button>
                <Switch
                  name="isUpdateDeliveryStatus"
                  onChange={formik.handleChange}
                  checked={formik.values.isUpdateDeliveryStatus}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} pt={2}>
                <Button
                  className="walletbutton adminname"
                  variant="text"
                  sx={{
                    color: "#fff"
                  }}
                >
                  Allow refurbished sales
                </Button>
                <Switch
                  name="allowRefurbishedSales"
                  onChange={formik.handleChange}
                  checked={formik.values.allowRefurbishedSales}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        {loader ? (
          <DialogActions sx={{ display: "block" }}>
            <Grid container justifyContent="center" sx={{ width: "50%", m: "15px auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>

            <Button
              className="buttons"
              variant="Text"
              sx={{ width: "100%", margin: "0 auto", color: "#2196f3" }}
              size="large"
            >
              Please wait for Updating Category...
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ display: "block", margin: "10px 10px 0px 20px", padding: "3px" }}>
            <>
              <AnimateButton>
                <Button
                  variant="contained"
                  className="buttons"
                  sx={{
                    width: "98%",
                    background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                  }}
                  type="submit"
                  size="large"
                  disableElevation
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  Update
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  className="buttons"
                  variant="outlined"
                  sx={{ width: "100%", color: "#4044ED", ml: "-7px", mt: 2 }}
                  onClick={() => modalHandler(false)}
                  color="secondary"
                  size="large"
                >
                  Cancel
                </Button>
              </AnimateButton>
            </>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default UpdateBrandCategory;
