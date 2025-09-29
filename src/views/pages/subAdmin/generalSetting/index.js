import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
  Tab,
  Tabs
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { getAllCountriesList } from "redux/subAdmin/actions";
// import { Icons } from "../../../../shared/Icons/Icons";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Tags from "./multiCountriesSell";
import { addGeneralContactInfo, addGeneralSettingStatus, getAllgeneralSettingList } from "redux/subAdmin/actions";
import { allowPhoneNumberKeys } from "utils/utilFunctions";
const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [value, setValue] = useState(0);

  const generalInfo = useSelector((state) => state.subAdminReducer.generalInfoSetting);
  const getCountries = useSelector((state) => state.subAdminReducer?.countryList);

  const color = theme.palette.mode === "light" ? "black" : "white";
  const [statusModal, setStatusModal] = useState(false);

  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: color,
      fontFamily: theme?.typography.appText
    }
  };

  // const handleDelete = (status) => {
  //   dispatch(deleteStatusSubAdmin(status));
  // };
  const statusValidationSchema = Yup.object({
    status: Yup.string().trim().required().max(42).min(3)
  });

  function TabPanel({ children, value, index, ...other }) {
    return (
      <Grid
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box
            sx={{
              p: 1,
              pr: 2
            }}
          >
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </Grid>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: ""
    },
    validationSchema: statusValidationSchema,
    onSubmit: (values) => {
      dispatch(addGeneralSettingStatus({ status: values.status, setStatusModal, formik }));
    }
  });

  const contactInfoValidationSchema = Yup.object({
    email: Yup.string().required().email()
    // contactNumber: Yup.string()
    //   .matches(/^\+?[0-9]+$/, "Phone number must only contain digits")
    //   .min(10, "Phone number must be at least 10 digits")
    //   .max(15, "Phone number can be at most 15 digits")
    //   .required("Phone number is required")
  });

  const formikContact = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: generalInfo?.supportEmail,
      contactNumber: generalInfo?.contactNumber
    },
    validationSchema: contactInfoValidationSchema,
    onSubmit: (values) => {
      console.log(values, "value");
      dispatch(addGeneralContactInfo(values));
    }
  });

  useEffect(() => {
    dispatch(getAllgeneralSettingList({ setLoader }));
    dispatch(getAllCountriesList({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Dialog aria-labelledby="add-status-dialog" open={statusModal} maxWidth="sm" fullWidth={true}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="add-status-dialog" variant="h2" className="app-text">
          Add Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setStatusModal(false);
            formik.resetForm();
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <InputLabel sx={{ color: color, marginBottom: "2px" }} className="app-text">
              {" "}
              New Status
            </InputLabel>
            <TextField
              className="app-text"
              sx={{ ...inputStyles }}
              InputProps={{ ...InputProps }}
              fullWidth
              name="status"
              placeholder="Status"
              id="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={true}
              helperText={formik.touched.status && formik.errors.status}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" autoFocus variant="contained" className="app-text">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {loader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{
                  mb: 1,
                  ml: 1,
                  mt: 2,
                  width: "257px",
                  "& a": {
                    p: 1.5,
                    mr: 3.7,
                    minHeight: "1rem",
                    color: theme.palette.grey[600],
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme?.typography.appText
                  },
                  "& a.Mui-selected": {
                    color: theme.palette.primary.main,
                    borderTop: "2px solid #2196f3",
                    borderLeft: "2px solid #2196f3",
                    borderRight: "2px solid #2196f3",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "8px",
                    marginBottom: "none",
                    textDecoration: "none",
                    borderBottom: "none",
                    fontFamily: theme?.typography.appText
                  },
                  "& .MuiTabs-flexContainer": {
                    borderBottom: "2px solid #2196f3",
                    overflow: "hide"
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "transparent",
                    height: "0px"
                  }
                }}
                variant="standard"
              >
                <Tab component={Link} to="#" label="Brand Info" {...a11yProps(0)} />
                <Tab component={Link} to="#" label="Selling Options" {...a11yProps(1)} />
                {/* <Tab component={Link} to="#" label="Tax" {...a11yProps(2)} />
                <Tab component={Link} to="#" label="Shipping" {...a11yProps(3)} /> */}
              </Tabs>
            </Box>
            {/* <TabPanel value={value} index={0}> */}
            {value === 0 && (
              <Grid container>
                <Grid item xs={12} md={5} mt={1}>
                  <InputLabel className="app-text" sx={{ color: color, marginBottom: "5px" }}>
                    Support Email
                  </InputLabel>
                  <TextField
                    className="app-text"
                    sx={{ ...inputStyles }}
                    InputProps={{ ...InputProps }}
                    fullWidth
                    name="email"
                    placeholder="Enter Support Email"
                    value={formikContact.values.email}
                    onChange={formikContact.handleChange}
                    onBlur={formikContact.handleBlur}
                    error={formikContact.touched.email && Boolean(formikContact.errors.email)}
                    helperText={formikContact.touched.email && formikContact.errors.email}
                  />
                </Grid>
                <Grid item xs={0} md={7}></Grid>
                <Grid item xs={12} md={5} mt={1}>
                  <InputLabel className="app-text" sx={{ color: color, marginBottom: "5px" }}>
                    Mobile Number
                  </InputLabel>
                  <TextField
                    className="app-text"
                    sx={{ ...inputStyles }}
                    InputProps={{ ...InputProps }}
                    fullWidth
                    name="contactNumber"
                    type="text"
                    onKeyDown={allowPhoneNumberKeys}
                    placeholder="Enter Phone Number"
                    value={formikContact.values.contactNumber}
                    onChange={formikContact.handleChange}
                    // onBlur={formikContact.handleBlur}
                    // error={formikContact.touched.contactNumber && Boolean(formikContact.errors.contactNumber)}
                    // helperText={formikContact.touched.contactNumber && formikContact.errors.contactNumber}
                  />
                </Grid>
                <Grid item xs={0} md={7}></Grid>
                <Grid item xs={12} sx={{ position: "absolute", top: "8rem", right: "4rem" }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                      className="app-text"
                      type="submit"
                      variant="outlined"
                      sx={{
                        width: "150px",
                        color: "#4044ED",
                        border: "1.46px solid #4044ED"
                      }}
                      onClick={() => formikContact.resetForm()}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="app-text"
                      type="submit"
                      variant="contained"
                      sx={{
                        width: "150px",
                        background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                      }}
                      onClick={() => formikContact.handleSubmit()}
                    >
                      Save
                    </Button>
                  </Stack>
                </Grid>
                {/* <Grid container sx={{ marginTop: "20px" }}>
                  <Grid item xs={12}>
                    <Typography variant="h1" className="app-text">
                      Statuses
                    </Typography>
                  </Grid> */}
                {/* <Grid item xs={12} md={6}>
                    <List style={{ padding: 0, margin: 0, display: "flex" }}>
                      {statuses?.length
                        ? statuses.map((status, index) => (
                            <React.Fragment key={index}>
                              <ListItem
                                sx={{
                                  marginY: 1,
                                  borderRight: index !== statuses.length - 1 ? "1px solid white" : "none"
                                }}
                              >
                                <ListItemText primary={status} sx={{ whiteSpace: "nowrap" }} /> */}
                {/* Hide Remove status functionality  */}
                {/* <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          sx={{
                            backgroundColor: theme.palette.mode === "light" ? "#252B2F" : "#252B2F",
                            borderRadius: "8px",
                            width: "50px"
                          }}
                          onClick={() => handleDelete(status)}
                        >
                          // {Icons.deleteIcon}
                        </IconButton>
                      </ListItemSecondaryAction> */}
                {/* </ListItem>
                            </React.Fragment>
                          ))
                        : null}
                    </List>
                  </Grid> */}
                {/* <Grid item xs={12} mt={4}>
              <Stack direction="row" justifyContent="flex-end" spacing={5}>
                <Button type="submit" variant="contained" sx={{ width: "150px" }} onClick={() => setStatusModal(true)}>
                  Add New Status
                </Button>
              </Stack>
            </Grid> */}
                {/* </Grid> */}
              </Grid>
            )}
            {/* </TabPanel> */}
            <TabPanel value={value} index={1}>
              <Grid container>
                <Grid item xs={12} md={12} mt={1}>
                  {getCountries?.operationalCountries ? (
                    <Tags color={color} getCountries={getCountries} />
                  ) : (
                    <Box sx={{ display: "flex", m: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}></TabPanel>
            <TabPanel value={value} index={3}></TabPanel>
          </Stack>
        </>
      )}
    </React.Fragment>
  );
};

export default Index;
