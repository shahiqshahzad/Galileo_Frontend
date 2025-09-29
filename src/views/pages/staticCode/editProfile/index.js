import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Box,
  CardMedia,
  Typography,
  Input,
  CircularProgress
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { editProfileRequest } from "../../../../redux/auth/actions";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useTheme } from "@mui/styles";
import User1 from "assets/images/profile/img-user.png";
import Cover from "assets/images/profile/img-profile-bg.png";
import closed from "assets/images/closed.png";
import edited from "assets/images/edited.png";
import { gridSpacing } from "store/constant";
import Avatar from "ui-component/extended/Avatar";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const uploadUrl = `${process.env.REACT_APP_API_URL}/users/uploadImage`;
  const [bannerImageLoader, setBannerImageLoader] = useState(false);
  const [profileImageLoader, setProfileImageLoader] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const theme = useTheme();
  const color = theme.palette.mode === "light" ? "black" : "white";
  let InputProps = {
    style: { borderRadius: 0, background: "inherit", border: "1px solid #757575" }
  };
  let inputStyles = {
    "& fieldset": { border: "none" },
    ".MuiInputBase-input": {
      padding: "10px",
      color: color
    }
  };
  const [isUpdate, setIsUpdate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsUpdate(true);
    } else {
      setIsUpdate(false);
    }
  }, [user]);

  const handleProfileImage = () => {
    document.getElementById("profileImgInput").click();
  };
  const handleBannerImage = () => {
    document.getElementById("bannerImgInput").click();
  };
  const handleBannerImageChange = async (event) => {
    const file = event.target.files[0];
    const fileType = file?.type?.split("/")[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    } else if (fileType !== "image") {
      toast.error("Unsupported file type. Only images are allowed.");
      return;
    }
    setBannerImageLoader(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      formik.setValues({
        ...formik.values,
        bannerImg: response?.data?.data?.image
      });
      setBannerImageLoader(false);
    } catch (error) {
      toast.error(error.response?.data?.data?.message);
      setBannerImageLoader(false);
    }
  };
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    const fileType = file?.type?.split("/")[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit");
      return;
    } else if (fileType !== "image") {
      toast.error("Unsupported file type. Only images are allowed.");
      return;
    }

    setProfileImageLoader(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      formik.setValues({
        ...formik.values,
        profileImg: response.data.data.image
      });
      setProfileImageLoader(false);
    } catch (error) {
      toast.error(error.response.data.data.message);
      setProfileImageLoader(false);
    }
  };
  const validationSchema = Yup.object({
    isUpdate: Yup.boolean().default(isUpdate),
    firstName: Yup.string()
      .trim()
      .required("First Name is required!")
      .max(20, "First Name must be at most 20 characters"),
    lastName: Yup.string().trim().required("Last Name is required!").max(20, "Last Name must be at most 20 characters"),
    profileImg: Yup.mixed()
      .when(["isUpdate"], {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.mixed()
      })
      .test("image size", "Choose image less than 5 mb", (value) => {
        if (typeof value === "string") {
          return true;
        } else if (value instanceof File) {
          return value.size <= 5_000_000;
        } else {
          return true;
        }
      }),

    bannerImg: Yup.mixed()
      .when(["isUpdate"], {
        is: true,
        then: Yup.mixed(),
        otherwise: Yup.mixed()
      })
      .test("image size", "Choose image less than 5 mb", (value) => {
        if (typeof value === "string") {
          return true;
        } else if (value instanceof File) {
          return value.size <= 5_000_000;
        } else {
          return true;
        }
      })
  });
  const handleBannerImagecancel = () => {
    formik.setValues({
      ...formik.values,
      bannerImg: ""
    });
  };

  const handleProfileImagecancel = () => {
    formik.setValues({
      ...formik.values,
      profileImg: ""
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user ? user.firstName : "",
      lastName: user ? user.lastName : "",
      profileImg: user?.UserProfile?.profileImg || "",
      bannerImg: user?.UserProfile?.bannerImg || ""
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("address", "");
      formData.append("description", "Web3 and RWA enthusiast");
      formData.append("bannerImg", values.bannerImg);
      formData.append("profileImg", values.profileImg);

      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      dispatch(editProfileRequest(object));
    }
  });
  return (
    <>
      <Grid
        container
        spacing={gridSpacing}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        <Grid item xs={12} md={12} lg={12} xl={12} mx={1}>
          <Grid container>
            <h1 style={{ display: "flex" }}>
              <ArrowBackIosIcon
                onClick={() => {
                  navigate("/home");
                }}
                sx={{ color: "#2F53FF" }}
              />
            </h1>
            <Typography variant="h2" display="flex" justifyContent="center" alignItems="center">
              Edit Profile
            </Typography>
          </Grid>
          <Box sx={{ position: "relative" }}>
            <Input
              id="bannerImgInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleBannerImageChange}
            />
            <Box sx={{ position: "absolute", right: "5%", top: "20px", cursor: "pointer" }}>
              <CardMedia component="img" alt="Add-banner-image" image={edited} onClick={() => handleBannerImage()} />
            </Box>
            {Boolean(formik.values.bannerImg) && (
              <Box sx={{ position: "absolute", right: "5%", top: "50px", cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  alt="remove-banner-image"
                  image={closed}
                  onClick={() => handleBannerImagecancel()}
                />
              </Box>
            )}
            {bannerImageLoader && (
              <Box sx={{ position: "absolute", right: "50%", top: "120px" }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
          <CardMedia
            component="img"
            image={formik.values.bannerImg || Cover}
            sx={{ borderRadius: "1px", overflow: "hidden", mb: 3, height: "288px" }}
          />
          <Grid container>
            <Grid item xs={12} md={3} lg={2} sx={{ position: "relative", height: "85px" }}>
              <Grid
                item
                style={{
                  margin: "-90px 0 0 auto",
                  marginLeft: { md: "30px", xl: "30px" },
                  [theme.breakpoints.down("lg")]: {
                    margin: "-70px auto 0"
                  },
                  [theme.breakpoints.down("md")]: {
                    margin: "-60px auto 0",
                    borderRadius: "85px"
                  }
                }}
              >
                <Grid item sx={{ float: "right", position: "relative" }}>
                  <Avatar
                    alt=""
                    src={formik.values.profileImg || User1}
                    sx={{
                      border: "2px solid gray",
                      borderRadius: "85px",
                      width: { xs: 72, sm: 100, md: 170 },
                      height: { xs: 72, sm: 100, md: 170 }
                    }}
                  />
                  {profileImageLoader && (
                    <Box sx={{ position: "absolute", top: "38%", right: "38%" }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Box sx={{ position: "absolute", top: { md: "-78%", lg: "-103%" }, right: "0%" }}>
                <Input
                  id="profileImgInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleProfileImageChange}
                />
                <CardMedia
                  component="img"
                  image={edited}
                  alt="add-profile-image"
                  onClick={() => handleProfileImage()}
                  sx={{ cursor: "pointer" }}
                />
              </Box>

              {Boolean(formik.values.profileImg) && (
                <Box sx={{ position: "absolute", top: { md: "-40%", lg: "-64%" }, right: "0%", cursor: "pointer" }}>
                  <CardMedia component="img" image={closed} onClick={handleProfileImagecancel} />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={6} ml={3} mt={-1}>
              <Typography variant="h2" sx={{ fontWeight: "500", fontFamily: theme?.typography.appText }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "18px", color: "#757575", fontFamily: theme?.typography.appText }}
              >
                {user?.email}
              </Typography>
            </Grid>
          </Grid>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} justifyContent="center" mt={1}>
              <Grid item xs={12} md={5} sm={12}>
                <InputLabel
                  sx={{ color: color, fontSize: "20px", fontFamily: theme?.typography.appText, fontWeight: "400" }}
                >
                  First Name
                </InputLabel>
                <TextField
                  sx={{ ...inputStyles, marginTop: "5px" }}
                  InputProps={{ ...InputProps }}
                  fullWidth
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid item xs={12} md={5} sm={12}>
                <InputLabel
                  sx={{ color: color, fontSize: "20px", fontFamily: theme?.typography.appText, fontWeight: "400" }}
                >
                  Last Name
                </InputLabel>
                <TextField
                  sx={{ ...inputStyles, marginTop: "5px" }}
                  InputProps={{ ...InputProps }}
                  fullWidth
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={10} mb={7} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    background: "linear-gradient(90deg, #2F57FF 0%, #2FA3FF 100%)",
                    boxShadow: "none",
                    fontSize: "18px",
                    fontWeight: "400",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2F57FF 0%, #2FA3FF 100%)"
                    }
                  }}
                >
                  Update profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default EditProfile;
