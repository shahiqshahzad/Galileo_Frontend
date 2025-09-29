import { Grid } from "@mui/material";
import { useTheme } from "@mui/styles";
import "@fontsource/public-sans";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { LoaderComponent } from "utils/LoaderComponent";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrands } from "redux/landingPage/actions";
import AllBrands from "../commonComponent/allBrands";
import { useNavigate } from "react-router-dom";

const CompanyPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const brand = useSelector((state) => state.landingPageReducer.brands);
  const isShowAll = useSelector((state) => state.auth?.dropdown?.isShowAll);

  useEffect(() => {
    dispatch(getAllBrands({ setLoading: setLoading, isShowAll }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoading, isShowAll]);
  return (
    <Grid
      mt={1.5}
      md={12}
      sx={{
        ml: { lg: -2 },
        background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
        color: theme.palette.mode === "dark" ? "white" : "#404040",
        p: 1,
        borderRadius: "4px"
      }}
    >
      <Grid container sx={{ alignItems: "center !important" }}>
        <h1 style={{ paddingLeft: "1.5%" }}>
          <ArrowBackIosIcon
            onClick={() => {
              navigate("/home");
            }}
            sx={{ color: "#2F53FF" }}
          />
        </h1>
        <h1 className="app-text">Featured creators</h1>
      </Grid>
      <Grid
        container-fluid="true"
        sx={{ margin: "0", padding: "0", display: { xs: "block", sm: "block", md: "flex" }, marginBottom: "40px" }}
      >
        <Grid item md={12} xs={12} sx={{}}>
          <Grid container sx={{ paddingLeft: "2%", width: "100%" }}>
            {loading === true ? (
              <LoaderComponent justifyContent={"center"} alignItems={"center"} />
            ) : (
              <Grid
                container
                sx={{
                  justifyContent: {
                    xs: "center",
                    sm: "center",
                    md: "left",
                    lg: "left",
                    xl: "left"
                  }
                }}
                spacing={2}
              >
                {brand?.map((item) => (
                  <AllBrands item={item} />
                ))}
              </Grid>
            )}
            <Grid item md={12} xs={12}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyPage;
