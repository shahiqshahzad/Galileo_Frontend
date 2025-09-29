import React from "react";
import ComingSoonCategories from "./components/ComingSoonCategories";
import { Grid, Pagination, Typography } from "@mui/material";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";
import Slider from "react-slick";
import ComingSoonNfts from "./components/ComingSoonNfts";
import { useState } from "react";
import { getcomingSoonMarketplace } from "redux/landingPage/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import { LoaderComponent } from "utils/LoaderComponent";
const ComingsoonMarketplace = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(12);
  const [loading, setLoading] = useState(true);

  const landingPageData = useSelector((state) => state.landingPageReducer.comingsoon_marketplace);
  const dispatch = useDispatch();
  const handleNftPage = (event, value) => {
    setPage(value);
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: false,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 2
        }
      },
      {
        breakpoint: 450,
        settings: {
          fade: true,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 2
        }
      },
      {
        breakpoint: 425,
        settings: {
          fade: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  useEffect(() => {
    dispatch(getcomingSoonMarketplace({ page, pageLimit, setLoading: setLoading }));
  }, [page, setLoading]);
  return (
    <>
      {loading == true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <Grid container-fluid="true">
          <Grid item md={12} ml={4}>
            <Typography
              className="app-text"
              color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
              mt={4}
              component="div"
              sx={{
                textAlign: { xs: "center", md: "left", sm: "center" },
                textTransform: "capitalize",
                fontSize: "38px",
                fontWeight: 600
              }}
            >
              Coming soon
            </Typography>
            <Typography
              color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
              component="div"
              mt={2}
              sx={{
                textAlign: { xs: "center", md: "left", sm: "center" },
                textTransform: "capitalize",
                fontSize: "22px",
                fontWeight: 600
              }}
            >
              Brands
            </Typography>
            <Box
              sx={{
                position: "relative",
                marginTop: "5px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "61.61px",
                  height: "5.66px",
                  backgroundImage: "linear-gradient(to right, #2F53FF, #2FC1FF)",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px"
                }
              }}
            ></Box>
            <Box as="div" sx={{ width: "97%", borderBottom: "0.5px solid #CDCDCD80" }}></Box>
          </Grid>

          <Grid item md={12} xs={12}>
            <Grid container>
              {landingPageData.comingSoonBrandsData?.length > 5 ? (
                <Slider className="slider" {...settings}>
                  {landingPageData.comingSoonBrandsData.map((item, i) => (
                    <ComingSoonCategories key={i} data={item} nfts={landingPageData.comingSoonBrandsData} />
                  ))}
                </Slider>
              ) : landingPageData.comingSoonBrandsData.length > 0 ? (
                landingPageData.comingSoonBrandsData.map((item, i) => (
                  <ComingSoonCategories key={i} data={item} nfts={landingPageData.comingSoonBrandsData} />
                ))
              ) : (
                <Typography variant="h2" m={2} pl={4} className="app-text">
                  {" "}
                  No brands Available
                </Typography>
              )}
            </Grid>
          </Grid>
          <Typography
            className="app-text"
            color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
            component="div"
            ml={4}
            mt={2}
            sx={{
              textAlign: { xs: "center", md: "left", sm: "center" },
              textTransform: "capitalize",
              fontSize: "22px",
              fontWeight: 700
            }}
          >
            Products
          </Typography>
          <Box
            sx={{
              position: "relative",
              marginTop: "5px",
              ml: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "90px",
                height: "5.66px",
                backgroundImage: "linear-gradient(to right, #2F53FF, #2FC1FF)",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px"
              }
            }}
          ></Box>
          <Box as="div" ml={4} sx={{ width: "95%", borderBottom: "0.5px solid #CDCDCD80" }}></Box>
          <Grid item md={12} xs={12} mx={4}>
            {landingPageData?.comingSoonNftsData?.nfts?.length > 0 ? (
              <Grid
                container
                justifyContent="left"
                spacing={gridSpacing}
                sx={{ mt: "1px", textAlign: "center", paddingRight: "1%" }}
              >
                {landingPageData.comingSoonNftsData.nfts.map((product, index) => (
                  <ComingSoonNfts key={index} data={product} />
                ))}
              </Grid>
            ) : (
              <Typography variant="h2" m={2}>
                {" "}
                No products Available
              </Typography>
            )}
          </Grid>
          <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} md={12} xs={12} mx={5} mt={2} mb={2}>
            <Pagination
              count={landingPageData.comingSoonNftsData?.pages}
              onChange={handleNftPage}
              page={page}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ComingsoonMarketplace;
