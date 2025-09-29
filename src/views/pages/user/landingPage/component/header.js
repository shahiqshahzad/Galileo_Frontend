import React, { useEffect, useRef, useState } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import "@fontsource/public-sans";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import firstBanner from "assets/images/banners/first-banner.png";
import firstLogo from "assets/images/banners/first-logo.svg";
import banner1 from "assets/images/banners/Thomas-Bambini-1.png";
import banner3 from "assets/images/banners/Briston-Watches-3.png";
import banner4 from "assets/images/banners/HOE-4.png";
import bristonIcon from "assets/images/banners/briston-icon.svg";
import hoeIcon from "assets/images/banners/hoe-icon.svg";
import thomasIcon from "assets/images/banners/thomas-bambini-icon.svg";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Icons } from "../../../../../shared/Icons/Icons";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const Header = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const goToPrevious = () => {
    if (carouselRef.current) {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = bannersArray.length - 1;
      carouselRef.current.goToSlide(newIndex);
      setCurrentIndex(newIndex);
      setIsCompleted(false);
      setProgress(0);
    }
  };
  const goToNext = () => {
    if (carouselRef.current) {
      let newIndex = currentIndex + 1;
      if (newIndex >= bannersArray.length) newIndex = 0;
      carouselRef.current.goToSlide(newIndex);
      setCurrentIndex(newIndex);
      setIsCompleted(false);
      setProgress(0);
    }
  };
  const customNavigateSlider = (index) => {
    if (carouselRef.current) {
      carouselRef.current.goToSlide(index);
      setCurrentIndex(index);
      setIsCompleted(false);
      setProgress(0);
    }
  };
  let bannersArray = [
    {
      id: 1,
      title: "Become a Seller",
      subText: "Grow your business on the Galileo Marketplace",
      buttonText: "Discover more",
      link: `https://zfrmz.eu/GjBsL7QVKPWcDF7H5HCc`,
      image: firstBanner,
      icon: firstLogo
    },
    {
      id: 2,
      title: "Join the Exclusive Group",
      subText: "Own Briston Watches Today",
      buttonText: "Discover more",
      url: `/brand/1`,
      image: banner3,
      icon: bristonIcon
    },
    {
      id: 3,
      title: "Embrace Creativity",
      subText: "Explore the Artistry of Thomas Bambini",
      buttonText: "Discover more",
      url: `/brand/12`,
      image: banner1,
      icon: thomasIcon
    },
    {
      id: 4,
      title: "#1 Top Seller Brand in the Galileo Marketplace",
      subText: "Curated Eternal Treasures that Redefine Elegance and Heritage",
      buttonText: "Discover more",
      url: `/brand/2`,
      image: banner4,
      icon: hoeIcon
    }
  ];

  useEffect(() => {
    if (isCompleted) return;

    if (!carouselRef.current) return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);

          // Ensure carouselRef.current and its properties are available
          if (carouselRef.current) {
            let totalSlides = bannersArray.length;
            let nextSlide = (currentIndex + 1) % totalSlides;
            carouselRef.current.goToSlide(nextSlide);
            setCurrentIndex(nextSlide);
            setProgress(0);
          }

          return oldProgress; // Prevent further updates
        }
        const diff = 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 300);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, currentIndex]);
  return (
    <Carousel
      ref={carouselRef}
      responsive={responsive}
      draggable={false}
      arrows={false}
      showDots={false}
      autoPlay={false}
      keyBoardControl={false}
      transitionDuration={500}
      containerClass="carousel-container carousel-margin"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {bannersArray.map((item, i) => (
        <React.Fragment key={i}>
          <Stack
            direction="row"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (item?.link) {
                window.open(item.link, "_blank");
              } else {
                navigate(item?.url);
              }
            }}
          >
            <Box
              width="50%"
              sx={{
                backgroundImage: `url(${item.image}) !important`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100% !important",
                height: "460px !important"
              }}
            />
            <Box width="50%" sx={{ backgroundColor: "black" }} display="grid" pl={5}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: "50px",
                  fontWeight: "600",
                  fontFamily: '"Public Sans", sans-serif',
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end"
                }}
              >
                <img style={{ width: "150px", marginBottom: "10px" }} src={item.icon} alt={`brand-icons-${i}`} />
                {item.title}
                <Box
                  ml={1}
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Public Sans", sans-serif',
                      display: "inline-block",
                      fontSize: "16px"
                    }}
                  >
                    {item.subText}
                  </Typography>
                  <ArrowRightAltIcon
                    sx={{
                      color: "#d7dcec",
                      fontSize: "28px"
                    }}
                  />
                </Box>
              </Typography>
              <Box mb={5} sx={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                <Box sx={{ display: "flex", gap: "5px", justifyContent: "space-between", alignItems: "center" }}>
                  {bannersArray.map((progressBar, index) => (
                    <LinearProgress
                      variant="determinate"
                      key={index}
                      value={progress}
                      max="100"
                      onClick={(e) => {
                        e.stopPropagation();
                        customNavigateSlider(index);
                      }}
                      className={currentIndex === index ? "active MuiLinearProgress-bar-c" : "MuiLinearProgress-bar"}
                      sx={{
                        width: "70px",
                        cursor: "pointer",
                        bgcolor: "gray",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "transparent"
                        },
                        "& .MuiLinearProgress-bar-c": {
                          backgroundColor: "white"
                        },

                        "&.active .MuiLinearProgress-bar": {
                          backgroundColor: "white"
                        }
                      }}
                    />
                  ))}
                </Box>
                <Box mr={5}>
                  <Box mr={5} sx={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
                    <Typography
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      {Icons.sliderPreviousIcon}
                    </Typography>
                    <Typography
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      sx={{ cursor: "pointer" }}
                    >
                      {Icons.sliderForwardIcon}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </React.Fragment>
      ))}
    </Carousel>
  );
};

export default Header;
