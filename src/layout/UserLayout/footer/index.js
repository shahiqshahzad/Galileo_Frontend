import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { Grid, Link } from "@mui/material";

// project imports
import { gridSpacing } from "store/constant";

// assets
import galileo from "assets/images/galileo.png";
import galileoWhite from "assets/images/galileo-white.png";
import googlePlay from "assets/images/google.png";
import appleStore from "assets/images/App.png";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MediumIconLight from "assets/images/icons/medium_icon-light.svg";
import MediumIconDark from "assets/images/icons/medium_icon-dark.svg";
import EmailIcon from "@mui/icons-material/Email";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import styles from "./footer.module.css";
// styles
const FooterWrapper = styled("div")(({ theme }) => ({
  padding: "28px 0 0 0",
  color: "black",

  // background: '#f5f5f5',
  [theme.breakpoints.down("md")]: {
    textAlign: "center"
  }
}));

// ==============================|| LANDING - FOOTER PAGE ||============================== //

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const darkModeColor = "#f3f3f3";
  const lightModeColor = "#404040";

  return (
    <Grid>
      <FooterWrapper
        style={{
          background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
          color: theme.palette.mode === "dark" ? "white" : "#404040",
          paddingBottom: "28px"
        }}
      >
        <Grid container sx={{ display: { xs: "block", sm: "flex", md: "flex" } }} spacing={gridSpacing}>
          <Grid item xs={12} md={1} lg={1} xl={1} sm={12}></Grid>
          {/* <Grid item xs={12} md={1} lg={1} xl={1} sm={12}></Grid> */}
          <Grid item xs={12} md={3} lg={3} xl={3} sm={12} sx={{ marginTop: { md: "15px" } }}>
            {theme.palette.mode === "dark" ? (
              <img
                src={galileoWhite}
                onClick={() => {
                  navigate("/home");
                }}
                alt="Galileo White Logo"
                width="100"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img
                src={galileo}
                onClick={() => {
                  navigate("/home");
                }}
                alt="Galileo Dark Logo"
                width="100"
                style={{ cursor: "pointer" }}
              />
            )}
            <Grid style={{ marginTop: "5%" }}>
              <span className="footerDownloadTag" style={{ fontWeight: "bolder" }}>
                Download the app by clicking the link below:
              </span>
            </Grid>

            <Grid container sx={{ mt: 3 }}>
              <Grid item md={12} xs={12} sm={12} lg={4} xl={3} className="footersocalIcons">
                <img src={googlePlay} alt="Google Play" title="Coming Soon" width="110" />
              </Grid>
              <Grid item md={1} xs={12} lg={1} xl={1} sx={{ display: { xl: "flex", lg: "none", md: "none" } }}></Grid>
              <Grid item md={12} xs={12} sm={12} lg={7} xl={6}>
                <img src={appleStore} alt="Apple Store" title="Coming Soon" width="110" />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={2} sm={12}>
            <Grid>
              <h2 className="footerElement">Company</h2>
            </Grid>
            <Grid>
              <span className={styles.link}>
                <a
                  href="https://www.galileoprotocol.io/about-us"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                  }}
                >
                  About
                </a>
              </span>
            </Grid>
            <Grid className={styles.aboutLink}>
              <span className={styles.link}>
                <a
                  href="https://www.galileoprotocol.io/about-us#mission"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                  }}
                >
                  Mission
                </a>
              </span>
            </Grid>
            <Grid className={styles.aboutLink}>
              <span className={styles.link}>
                <a
                  href="https://www.galileoprotocol.io/about-us#team"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                  }}
                >
                  Team
                </a>
              </span>
            </Grid>
            <Grid className={styles.aboutLink}>
              <span className={styles.link}>
                <a
                  href="https://www.galileoprotocol.io/blog"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                  }}
                >
                  Blog
                </a>
              </span>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2} sm={12}>
            <Grid>
              <h2 className="footerElement">Service</h2>
            </Grid>
            <Grid>
              <Grid>
                <span className={styles.link}>
                  <Link
                    href="/faq"
                    underline="none"
                    textDecoration="none"
                    color={theme.palette.mode === "dark" ? darkModeColor : lightModeColor}
                  >
                    FAQ
                  </Link>
                </span>
              </Grid>
              <Grid className={styles.serviceLink}>
                <span className={styles.link}>
                  <a
                    href="https://www.galileoprotocol.io/contact"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: "none",
                      color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                    }}
                  >
                    Support
                  </a>
                </span>
              </Grid>
              <Grid className={styles.serviceLink}>
                <span className={styles.link}>
                  <Link
                    href="/privacy-policy"
                    underline="none"
                    textDecoration="none"
                    color={theme.palette.mode === "dark" ? darkModeColor : lightModeColor}
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </Grid>
              <Grid className={styles.serviceLink}>
                <span className={styles.link}>
                  <Link
                    href="/fees-and-taxes"
                    underline="none"
                    textDecoration="none"
                    color={theme.palette.mode === "dark" ? darkModeColor : lightModeColor}
                    target="_blank"
                  >
                    Fees & Taxes
                  </Link>
                </span>
              </Grid>
              <Grid className={styles.serviceLink}>
                <span className={styles.link}>
                  <Link
                    href="https://www.youtube.com/@galileoprotocol7510"
                    underline="none"
                    textDecoration="none"
                    color={theme.palette.mode === "dark" ? darkModeColor : lightModeColor}
                    target="_blank"
                  >
                    Tutorials
                  </Link>
                </span>
              </Grid>
              <Grid className={styles.serviceLink}>
                <span className={styles.link}>
                  <Link
                    href="https://galileo-protocol-tech-department.gitbook.io/galileo-protocol-beta-testing-helper-docs/"
                    underline="none"
                    textDecoration="none"
                    color={theme.palette.mode === "dark" ? darkModeColor : lightModeColor}
                    target="_blank"
                  >
                    User Manual
                  </Link>
                </span>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={2} sm={12}>
            <Grid>
              <h2 className="">Contact</h2>
            </Grid>
            <Grid>
              <Grid>
                <Grid
                  className={styles.contact}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "3%"
                  }}
                >
                  <LocalPhoneIcon sx={{ height: "1.3rem" }} />
                  <span className={styles.contactLink}>
                    <a
                      href="tel:+30 (695) 571 7183"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                      }}
                    >
                      +30 (695) 571 7183
                    </a>
                  </span>
                </Grid>

                <Grid
                  className={styles.contact}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "3%"
                  }}
                >
                  <EmailIcon sx={{ height: "" }} />
                  <span className={styles.contactLink}>
                    <a
                      href="mailto:hello@galileoprotocol.io"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                      }}
                    >
                      hello@galileoprotocol.io
                    </a>
                  </span>
                </Grid>
                <Grid
                  className={styles.contact}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "3%"
                  }}
                >
                  <SupportAgentIcon sx={{ height: "" }} />
                  <span className={styles.contactLink}>
                    <a
                      href="mailto:support@galileoprotocol.io"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                      }}
                    >
                      support@galileoprotocol.io
                    </a>
                  </span>
                </Grid>
                <Grid
                  className={styles.contact}
                  style={{
                    display: "flex",
                    // flexWrap: 'wrap',
                    marginTop: "3%"
                  }}
                >
                  <LocationOnIcon sx={{ height: "1.3rem" }} />
                  <span className={styles.contactLink}>
                    <a
                      href="https://goo.gl/maps/yhVhCvgdjYkgZX8A6"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor
                      }}
                    >
                      10 rue du Colisée<br></br>75008 Paris, FRANCE
                    </a>
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={2} sm={12}>
            <Grid>
              <h2 className="footerElement">Social Media</h2>
            </Grid>
            <Grid style={{ marginTop: "2px" }}>
              <span>
                <a
                  href="https://www.facebook.com/galileoprotocol?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor }}
                >
                  <FacebookIcon />
                </a>
              </span>
              <span className={styles.socialLink}>
                <a
                  href="https://twitter.com/galileoprotocol?s=21&t=iiPGK-CGsRoR8FDmDVz7Eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor }}
                >
                  <TwitterIcon />
                </a>
              </span>
              <span className={styles.socialLink}>
                <a
                  href="https://www.linkedin.com/company/galileo-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor }}
                >
                  <LinkedInIcon />
                </a>
              </span>
            </Grid>
            <Grid style={{ marginTop: "2px" }}>
              <span>
                <a
                  href="https://www.instagram.com/galileoprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor }}
                >
                  <InstagramIcon />
                </a>
              </span>
              <span className={styles.socialLink}>
                <a
                  href="https://t.me/galileoprotocolcommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.mode === "dark" ? darkModeColor : lightModeColor }}
                >
                  <TelegramIcon />
                </a>
              </span>
              <span className={styles.socialLink}>
                <a href="https://medium.com/@galileoprotocol" target="_blank" rel="noopener noreferrer">
                  <img src={theme.palette.mode === "dark" ? MediumIconLight : MediumIconDark} alt="Medium icon" />
                </a>
              </span>
            </Grid>
          </Grid>
        </Grid>
      </FooterWrapper>
    </Grid>
  );
};

export default Footer;
