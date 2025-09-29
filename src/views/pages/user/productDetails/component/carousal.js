import React, { useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { makeStyles } from "@mui/styles";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";
import { useEffect } from "react";

const useStyles = makeStyles(() => ({
  dotListStyle: {
    "& .react-multi-carousel-dot button": {
      width: "14px",
      height: "4.44px",

      borderRadius: "0px",
      border: "none",

      marginBottom: "30px",
      background: "#616161ab",
      boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.05)"
    },

    "& .react-multi-carousel-dot--active button": {
      background: "#fff"
    },
    "& .react-multi-carousel-dot-list": {
      display: "flex",
      justifyContent: "center"
    },
    "& .react-multi-carousel-dot:nth-child(n+10) button": {
      display: "none" // Hide dots starting from the 10th dot-temprary solution
    }
  }
}));
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1025 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 465 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const CarouselCard = ({ image, setImageIndex }) => {
  const classes = useStyles();
  const imageRef = useRef(null);
  const images = image && [...image];
  useEffect(() => {
    setImageIndex(+imageRef?.current?.state?.currentSlide);
  });
  return (
    <>
      {image && (
        <Carousel
          ref={imageRef}
          swipeable={true}
          draggable={true}
          showDots={images && images.length > 1 ? true : false}
          arrows={true}
          responsive={responsive}
          ssr={true}
          infinite={false}
          autoPlay={false}
          autoPlaySpeed={1000}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          dotListClass={classes.dotListStyle}
          itemClass="carousel-item-padding-40-px"
        >
          {images?.map((item, index) => (
            <React.Fragment key={index}>
              {/* <ImageView src={item?.asset} height={"100%"} /> */}

              <Box
                sx={{
                  width: { xs: "100%", md: "612" },
                  height: { xs: "274px", md: "525px" },
                  background: "#262626",
                  borderRadius: 0
                }}
              >
                <CardMedia
                  key={index}
                  component="img"
                  sx={{
                    width: { xs: "100%", md: "612" },
                    height: { xs: "274px", md: "525px" },
                    objectFit: { md: "contain", xs: "contain" },
                    borderRadius: 0
                  }}
                  image={item?.asset}
                  alt={item?.id}
                />
              </Box>
            </React.Fragment>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default CarouselCard;
