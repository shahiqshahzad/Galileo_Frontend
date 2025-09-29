// material-ui
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Grid, Typography, Box, ButtonGroup, Tooltip } from "@mui/material";
import TruncatedText from "utils/TruncatedText";
import React from "react";
import { Icons } from "shared/Icons/Icons";
import MarketplaceAddress from "../../../../contractAbi/Marketplace-address.js";

import Avatar from "ui-component/extended/Avatar";
import { useState } from "react";
import { gridSpacing } from "store/constant";
import "react-toastify/dist/ReactToastify.css";
import { ProofsDropdown } from "./ProofsDropdown";
import { Stack } from "@mui/system";
import CarouselCard from "./carousal";
import VComponent from "./video";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import moment from "moment";
import FullImage from "./fullImage";
import InfoIcon from "assets/images/icons/Vector.svg";

import expandPicIcon from "assets/images/image-action-icons/expand-pic.svg";
import videoIcon from "assets/images/image-action-icons/video.svg";
import pictureIcon from "assets/images/image-action-icons/picture.svg";
import videoSelectedIcon from "assets/images/image-action-icons/video-selected.svg";
import imageSelectedIcon from "assets/images/image-action-icons/image-selected.svg";
import galileoLogo from "assets/images/galileo_logo.png";
import { BLOCK_EXPLORER_URL } from "utils/constants";
// =============================|| LANDING - FEATURE PAGE ||============================= //

const Product = ({ tracker }) => {
  const displaylocation = tracker?.nft?.NFTMetaData?.find((value) => value.display_type === "Location");
  const theme = useTheme();
  const [imageOpen, setImageOpen] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [defaultValue, setDefaultValue] = useState(true);
  const [slidershow, setSlidershow] = useState(false);
  const [videoshow, setVideo] = useState(false);
  const [imageIndex, setimageIndex] = useState(0);
  const [handleToggle, setHandleToggle] = useState(false);

  const Slides = () => {
    setVideo(false);
    setDefaultValue(false);
    setSlidershow(true);
  };
  const VideoAnimation = () => {
    setSlidershow(false);
    setDefaultValue(false);
    setVideo(true);
  };

  return (
    <>
      {/*  // <MapNFTDialog setOpen={setMapOpen} open={mapOpen} tracker={tracker?.nft?.NFTMetaData} /> */}
      <FullImage
        setOpen={setImageOpen}
        open={imageOpen}
        image={tracker?.nft?.NFTImages}
        imageIndex={imageIndex}
        setimageIndex={setimageIndex}
      />
      <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "15px" }}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6} sm={12}>
              <Stack as="div" sx={{ position: "relative" }}>
                {defaultValue === true && (
                  <CarouselCard image={tracker?.nft?.NFTImages} imageIndex={imageIndex} setimageIndex={setimageIndex} />
                )}
                {slidershow === true && (
                  <CarouselCard image={tracker?.nft?.NFTImages} imageIndex={imageIndex} setimageIndex={setimageIndex} />
                )}
                {videoshow === true && (
                  <VComponent
                    vid={tracker?.nft?.animation_url}
                    handleToggle={handleToggle}
                    setHandleToggle={setHandleToggle}
                  />
                )}
                <Box component={"div"} sx={{ display: "flex", position: "absolute", top: "4%", right: "3%" }}>
                  {tracker?.nft?.animation_url && (
                    <ButtonGroup
                      sx={{
                        background: "white",
                        padding: "3px",
                        height: "42px",
                        boxShadow: "0px 5px 20px 0px #DDDDDD"
                      }}
                    >
                      {tracker?.nft?.animation_url &&
                        (slidershow === true || defaultValue === true ? (
                          <button
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "3px",
                              border: "none",
                              backgroundColor: "white",
                              cursor: "pointer",
                              borderRadius: "4px"
                            }}
                            onClick={() => Slides()}
                          >
                            <img src={imageSelectedIcon} style={{ width: "35px", height: "35px" }} alt="" />
                          </button>
                        ) : (
                          <button
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "none",
                              backgroundColor: "white",
                              cursor: "pointer",
                              borderRadius: "4px"
                            }}
                            onClick={() => Slides()}
                          >
                            <img src={pictureIcon} style={{ width: "25px" }} alt="" />
                          </button>
                        ))}
                      {videoshow === true ? (
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            border: "none",
                            backgroundColor: "white",
                            cursor: "pointer",
                            borderRadius: "4px"
                          }}
                          onClick={() => VideoAnimation()}
                        >
                          <img src={videoSelectedIcon} style={{ width: "35px", height: "35px" }} alt="" />
                        </button>
                      ) : (
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "none",
                            backgroundColor: "white",
                            cursor: "pointer",
                            borderRadius: "4px"
                          }}
                          onClick={() => VideoAnimation()}
                        >
                          <img src={videoIcon} style={{ width: "25px" }} alt="" />
                        </button>
                      )}
                    </ButtonGroup>
                  )}
                  {videoshow === true ? (
                    <ButtonGroup
                      sx={{
                        background: "white",
                        marginLeft: "10px",
                        height: "42px",
                        boxShadow: "0px 5px 20px 0px #DDDDDD"
                      }}
                    >
                      <button
                        onClick={() => setHandleToggle(true)}
                        style={{
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        <img src={expandPicIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                      </button>
                    </ButtonGroup>
                  ) : (
                    <ButtonGroup
                      sx={{
                        background: "white",
                        marginLeft: "10px",
                        borderRadius: "none",
                        height: "42px",
                        boxShadow: "0px 5px 20px 0px #DDDDDD"
                      }}
                    >
                      <button
                        onClick={() => setImageOpen(true)}
                        style={{
                          border: "none",
                          cursor: "pointer"
                        }}
                      >
                        <img src={expandPicIcon} style={{ width: "25px", marginTop: "3px" }} alt="" />
                      </button>
                    </ButtonGroup>
                  )}
                </Box>

                {videoshow === false && (
                  <Stack
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                    as="div"
                    sx={{ position: "absolute", right: "3%", bottom: { xs: "6.8%", md: "4.5%" }, zIndex: "999" }}
                  >
                    <img src={InfoIcon} height={"20px"} width={"20px"} alt="infoooo" />
                  </Stack>
                )}
                {isShown && (
                  <Stack as="div" sx={{ position: "absolute", right: { xs: "12%", md: "8%" }, bottom: "2%" }}>
                    <Card sx={{ minWidth: 275, width: "205px", height: "110px", backgroundColor: "white" }}>
                      <CardContent>
                        <Box mt={-1} sx={{ display: "flex", alignItems: "center" }}>
                          {tracker?.nft?.NFTImages[imageIndex]?.User && (
                            <Avatar
                              alt="User name"
                              sx={{ border: "1px solid #5498CB", width: "34px", height: "34px" }}
                              src={tracker?.nft?.NFTImages[imageIndex]?.User?.UserProfile?.profileImg}
                            />
                          )}
                          <Typography className="icon-text" sx={{ marginLeft: 1 }}>
                            {tracker?.nft?.NFTImages[imageIndex]?.User?.firstName}
                          </Typography>
                        </Box>
                        <Typography mt={1.5} className="image-changed" variant="body2">
                          Image Changed
                        </Typography>
                        <Typography mt={0.5} className="date-time-on-hover" variant="body2">
                          {moment(tracker?.nft?.NFTImages[imageIndex]?.createdAt).format("ddd DD MMM YYYY [at] h:mmA")}
                        </Typography>
                        <ArrowRightIcon
                          style={{ color: "white", position: "absolute", right: "-8%", bottom: "2%", fontSize: "42px" }}
                        />
                      </CardContent>
                    </Card>
                  </Stack>
                )}
              </Stack>
            </Grid>

            <Grid item md={6} sm={12} sx={{ paddingLeft: { xs: "24px !important", md: "24px !important" } }}>
              <Grid item md={12} sm={12}>
                <Grid container spacing={2}>
                  <Grid ml={2} item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar
                          alt="User 1"
                          src={tracker?.nft?.isSoldByGalileo ? galileoLogo : tracker?.nft?.Brand?.image}
                          sx={{
                            width: { xs: "38.692px", md: "48.692px" },
                            height: { xs: "38.692px", md: "48.692px" },
                            background: "#ede9e9"
                          }}
                        />
                      </Grid>
                      <Grid item xs zeroMinWidth sx={{ textDecoration: "none" }}>
                        <Typography
                          align="left"
                          className="BrandCustom"
                          sx={{ color: theme.palette.mode === "dark" ? "#2196f3" : "#252222" }}
                        >
                          {tracker?.nft?.Brand?.name ? tracker?.nft?.Brand?.name : "Brand Name"}
                        </Typography>
                        <Typography
                          align="left"
                          className="creator-custom"
                          sx={{ color: theme.palette.mode === "dark" ? "#cdcdcd" : "#4a4848" }}
                        >
                          {tracker?.nft?.Category?.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      align="left"
                      className="Lux-custom"
                      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      {tracker?.nft?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className="productBMW">
                    {/*  <Typography className="productBMW" variant="body2">
                        {tracking?.nft?.description ? tracking?.nft?.description : 'NFT'}
                      </Typography> */}
                    {tracker?.nft?.description && <TruncatedText text={tracker?.nft?.description} limit={300} />}
                  </Grid>

                  <Grid item xs={12} sx={{ display: "flex" }} mt={2}>
                    <Grid item xs={6} md={4}>
                      <Typography
                        className="owner-title"
                        sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                      >
                        Current Owner
                      </Typography>
                      <Grid item xs={12} md={12} sx={{ display: "flex", ml: tracker?.nftOwner?.fullName ? 2 : 1 }}>
                        {tracker?.nftOwner?.fullName && (
                          <Avatar
                            alt="User 1"
                            src={tracker?.nftOwner?.picUrl}
                            sx={{
                              border: "1px solid #5498CB",
                              width: { xs: "30px", md: "34px" },
                              height: { xs: "30px", md: "34px" },
                              objectFit: "fill"
                            }}
                          />
                        )}

                        <Typography
                          align="left"
                          sx={{
                            display: { xs: "none", md: "block" },
                            ml: { xs: 1, md: 1 },
                            color: theme.palette.mode === "dark" ? "#9498aa" : "#252222"
                          }}
                          className="owner-name"
                        >
                          {tracker?.nftOwner === MarketplaceAddress?.address
                            ? "Galileo Market Place"
                            : tracker?.nftOwner?.fullName
                              ? tracker?.nftOwner?.fullName
                              : tracker?.nftOwner?.slice(0, 5) + "..." + tracker?.nftOwner?.slice(38, 42)}
                        </Typography>
                        <Typography
                          align="left"
                          sx={{ display: { md: "none" }, ml: { xs: 1, md: 1 } }}
                          className="owner-name"
                        >
                          {tracker?.nftOwner?.fullName
                            ? tracker?.nftOwner?.fullName
                            : tracker?.nftOwner?.walletAddress?.slice(0, 5) +
                              "..." +
                              tracker?.nftOwner?.walletAddress?.slice(38, 42)}
                        </Typography>
                        <Typography
                          sx={{
                            ml: { md: 1 },
                            display: "flex",
                            textAlign: "center",
                            alignItems: "center",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            window.open(
                              `${BLOCK_EXPLORER_URL}address/${tracker?.nftOwner === MarketplaceAddress?.address ? MarketplaceAddress?.address : tracker?.nftOwner?.walletAddress}`,
                              "_blank"
                            );
                          }}
                        >
                          {Icons?.fileOpen}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item md={0.5}></Grid>
                    {displaylocation && (
                      <Grid
                        // onClick={() => setMapOpen(true)} currently map is not working, in future we need it.
                        item
                        xs={4}
                        md={4}
                        lg={3}
                        sx={{
                          display: "flex",
                          borderRadius: "8px",
                          background: "#C7C7C7",
                          justifyContent: "center",
                          alignItems: "center",
                          height: { md: "55px", xs: "44px" },
                          cursor: "pointer",
                          mt: "10px"
                        }}
                      >
                        <Typography>
                          {/*   <LocationOnIcon
                              sx={{ color: '#4A4848', fontSize: '24px', cursor: 'pointer' }}
                              onClick={() => setMapOpen(true)}
                            /> */}
                          {Icons?.MapOpen}
                        </Typography>

                        <Tooltip sx={{}} placement="top" title={displaylocation?.trait_type}>
                          <Typography className="view-map" color="#8b8585">
                            {displaylocation?.trait_type}
                          </Typography>
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12} mb={5}>
                    <Box
                      sx={{ borderRadius: "4px", width: { md: "97%" }, margin: { md: "0 auto" }, textAlign: "left" }}
                    >
                      {tracker?.nft?.NFTMetaFiles && <ProofsDropdown proofs={tracker?.nft?.NFTMetaFiles} />}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={1} sm={12}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Product;
