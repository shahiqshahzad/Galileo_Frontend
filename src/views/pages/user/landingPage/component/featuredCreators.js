import { Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "@fontsource/public-sans";
import React from "react";
import Slider from "react-slick";
import BrandCard from "../../commonComponent/brandCard";
import { Box } from "@mui/system";
import { Icons } from "shared/Icons/Icons";
import { LoaderComponent } from "utils/LoaderComponent";

const FeaturedCreators = ({ brands, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: false,
    arrows: true, // Ensure arrows are enabled
    slidesToShow: 9,
    slidesPerRow: 2,
    slidesToScroll: 9,
    prevArrow: (
      <div
        style={{
          height: "30px",
          width: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "absolute",
          // left: "-10%",
          // top: "50%",
          transform: "translateY(-50%)",
          marginLeft: "-10px"
        }}
      >
        {Icons.comingsoonSliderActivityPrev}
      </div>
    ),
    nextArrow: (
      <div
        style={{
          height: "30px",
          width: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: "10px"
        }}
      >
        {Icons.comingsoonSliderActivityNext}
      </div>
    ),
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

  return (
    <Grid container-fluid="true">
      <Grid item md={12} ml={4}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignsItem: "end", width: "98%" }}>
          <Typography
            color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
            sx={{
              fontSize: "22px",
              textAlign: { xs: "center", md: "left", sm: "center" },
              textTransform: "capitalize"
            }}
            onClick={() => {
              if (brands?.length !== 0) {
                navigate("/allbrands");
              }
            }}
          >
            Brands
          </Typography>
          {brands?.length > 18 && (
            <Button
              sx={{
                marginBottom: "-6px",
                borderRadius: "26px",
                color: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
                fontWeight: "600"
              }}
              variant="outlined"
              onClick={() => {
                if (brands?.length > 0) {
                  navigate("/allbrands");
                }
              }}
            >
              View All
            </Button>
          )}
        </Box>
        <Box
          sx={{
            position: "relative",
            marginTop: "10px",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "73px",
              height: "6px",
              backgroundImage: "linear-gradient(to right, #2F53FF, #2FC1FF)",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px"
            }
          }}
        />
        <Box as="div" sx={{ width: "97%", borderBottom: "0.5px solid #CDCDCD80", marginLeft: "1px" }}></Box>
      </Grid>
      {loading === true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <Grid item md={12} xs={12}>
          <Grid container ml={brands && brands?.length > 5 ? 2 : 2}>
            {brands?.length > 18 ? (
              <Slider className="slider" {...settings}>
                {brands.map((item, i) => (
                  <BrandCard key={i} data={item} brands={brands} />
                ))}
              </Slider>
            ) : brands?.length > 0 ? (
              brands.map((item, i) => <BrandCard key={i} data={item} brands={brands} />)
            ) : (
              <Grid mt={4} container>
                <Typography className="noDataNew fontfamily">No results found.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default FeaturedCreators;
