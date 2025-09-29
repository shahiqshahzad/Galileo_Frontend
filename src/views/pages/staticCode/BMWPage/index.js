import { Grid, Tooltip, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import "@fontsource/public-sans";
// import LanguageIcon from "@mui/icons-material/Language";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import StarSharpIcon from "@mui/icons-material/StarSharp";
// import ChatBubbleOutlineSharpIcon from "@mui/icons-material/ChatBubbleOutlineSharp";
// import ShareSharpIcon from "@mui/icons-material/ShareSharp";
// import { IconBrandDiscord, IconBrandMedium } from "@tabler/icons";
// import EmailIcon from "@mui/icons-material/Email";
// import styles from "./companypage.module.css";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bmwPage } from "redux/landingPage/actions";
import { Box } from "@mui/system";
import { useState } from "react";
import PropTypes from "prop-types";
import NewCard from "views/pages/user/commonComponent/newCard";
import { LoaderComponent } from "utils/LoaderComponent";
const CompanyPage = () => {
  const BrandId = useParams().id;
  const theme = useTheme();
  const dispatch = useDispatch();
  const bmwData = useSelector((state) => state.landingPageReducer.bmwData);
  const isShowAll = useSelector((state) => state.auth?.dropdown?.isShowAll);

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
            <Typography>{children}</Typography>
          </Box>
        )}
      </Grid>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(bmwPage({ BrandId: BrandId, isShowAll: isShowAll, setLoading: setLoading }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BrandId, isShowAll, setLoading]);
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh"
          }}
        >
          <LoaderComponent justifyContent={"center"} alignItems={"center"} />
        </div>
      ) : (
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
          <Grid
            container-fluid="true"
            sx={{ margin: "0", padding: "0", display: { xs: "block", sm: "block", md: "flex" }, marginBottom: "40px" }}
          >
            <Grid item md={12} xs={12} sx={{ mt: 2 }}>
              <Grid container>
                <Grid item xs={12} md={3} sx={{ paddingRight: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "left", marginLeft: "20px" }}>
                    <div style={{ paddingTop: "-25px", paddingRight: "1rem" }}>
                      <img
                        alt="bmww"
                        src={bmwData?.image}
                        style={{
                          borderRadius: "100px",
                          marginTop: "-5px",
                          height: "92px",
                          width: "92px",
                          border: "3px solid #2196f3"
                        }}
                      />
                    </div>

                    <div>
                      <h1
                        className="font-company-page"
                        style={{ lineHeight: "normal", fontFamily: theme?.typography.appText }}
                      >
                        {bmwData?.name}
                      </h1>
                      <Tooltip placement="bottom" sx={{ cursor: "pointer" }} title={bmwData?.location}>
                        <h3
                          sx={{ color: " #CDCDCD", fontFamily: theme?.typography.appText }}
                          className="location-style"
                          style={{ lineHeight: "normal" }}
                        >
                          {bmwData?.location?.slice(0, 16)}
                        </h3>
                      </Tooltip>
                    </div>
                  </div>
                </Grid>
                {/* <Grid item xs={10} md={4} sx={{ background: " ", ml: 1, pl: 4, mt: 2 }}>
              <Grid container sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <Grid item xs={2} className={styles.statsCover}>
                  <div className={styles.stats}>{itemsNb}</div>
                  {itemsNb === 1 ? <div>Item</div> : <div>Items</div>}
                </Grid>
                <Grid item xs={2} className={styles.statsCover} title="Coming Soon">
                  <div className={styles.stats}>32k</div>
                  <div>Likes</div>
                </Grid>
                <Grid item xs={2} title="Coming Soon">
                  <div className={styles.stats}>420</div>
                  <div>Bidding</div>
                </Grid>
                <Grid item xs={2} title="Coming Soon">
                  <div className={styles.stats}>870k</div>
                  <div>Followers</div>
                </Grid>
              </Grid>
            </Grid> */}

                {/* <Grid item xs={12} md={3} sx={{ marginLeft: "15%", mt: 2 }}>
              <Grid
                container
                style={{ display: "flex", justifyContent: "flex-end", marginRight: "7%", float: "right" }}
              >
                {brandSocials?.instagram ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <InstagramIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.twitter ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <TwitterIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.facebook ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <FacebookIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.linkedin ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <LinkedInIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.discord ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <IconBrandDiscord />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.medium ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.medium}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <IconBrandMedium />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.telegram ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <TelegramIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.email ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a href={`mailto:${brandSocials?.email}`} rel="noopener noreferrer" style={{ color: blueColor }}>
                      <EmailIcon />
                    </a>
                  </Grid>
                ) : null}
                {brandSocials?.website ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a
                      href={brandSocials?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: blueColor }}
                    >
                      <LanguageIcon />
                    </a>
                  </Grid>
                ) : null}

                {brandSocials?.phoneNumber ? (
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <a href={`tel:${brandSocials?.phoneNumber}`} rel="noopener noreferrer" style={{ color: blueColor }}>
                      <LocalPhoneIcon />
                    </a>
                  </Grid>
                ) : null}
                <div style={{ borderLeft: "1px solid #7E7D7D", marginLeft: "0.5rem" }}></div>
                <Tooltip placement="top" title="Coming Soon">
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <StarSharpIcon style={{ color: blueColor }} />
                  </Grid>
                </Tooltip>
                <Tooltip placement="top" title="Coming Soon">
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <ChatBubbleOutlineSharpIcon style={{ color: blueColor }} />
                  </Grid>
                </Tooltip>
                <Tooltip placement="top" title="Coming Soon">
                  <Grid item sx={{ marginLeft: "0.5rem" }}>
                    <ShareSharpIcon style={{ color: blueColor }} />
                  </Grid>
                </Tooltip>
              </Grid>
              <Grid item xs={8} md={12} style={{ justifyContent: "" }}>
                <Tooltip placement="top" title="Coming Soon">
                  <Button variant="contained" sx={{ mt: 2, width: "50%", float: "right", mr: 2 }}>
                    Follow
                  </Button>
                </Tooltip>
              </Grid>
            </Grid> */}

                <Grid container-fluid="true" xs={12} sx={{ paddingRight: "7%", paddingLeft: "22px" }}>
                  <Tooltip placement="top">
                    <p className="des-font">{bmwData?.description}</p>
                  </Tooltip>
                </Grid>
              </Grid>

              <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                className="app-text"
                sx={{ paddingRight: "3.5%", paddingLeft: "22px" }}
              >
                <Tab component={Link} to="#" label="For Sale" {...a11yProps(0)} />
                <Tab component={Link} to="#" label="Sold" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={value} index={0}>
                <Grid container>
                  {bmwData?.Nfts?.filter((dd) => dd.isSold === false).length > 0 ? (
                    bmwData?.Nfts?.filter((dd) => dd.isSold === false)?.map((item) => (
                      <NewCard data={{ ...item, Brand: { name: bmwData?.name } }} />
                    ))
                  ) : (
                    <Typography mx={2} mt={4} className="app-text">
                      No Items Found
                    </Typography>
                  )}

                  <Grid item md={12} xs={12}></Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Box>
                  <Grid container sx={{ width: "100%" }}>
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
                      {bmwData?.Nfts?.filter((dd) => dd.isSold === true).length > 0 ? (
                        bmwData?.Nfts?.filter((dd) => dd.isSold === true)?.map((item) => (
                          <NewCard data={{ ...item, Brand: { name: bmwData?.name } }} />
                        ))
                      ) : (
                        <Typography mx={2} mt={4} className="app-text">
                          No Items Found
                        </Typography>
                      )}
                    </Grid>

                    <Grid item md={12} xs={12}></Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </Grid>
          </Grid>

          <Grid
            container-fluid="true"
            sx={{
              display: {
                xs: "block",
                sm: "block",
                md: "flex"
              },
              background: theme.palette.mode === "dark" ? "black" : "#f3f3f3"
            }}
          >
            <Grid item md={1} xs={12}></Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default CompanyPage;
