import { useTheme, styled } from "@mui/material/styles";
import { Box, Container, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { gridSpacing } from "store/constant";
import widget1 from "assets/images/watch.png";

const HeaderAnimationImage = styled("img")({
  maxWidth: "100%",
  filter: "drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))"
});

const ComingSoon = () => {
  const theme = useTheme();

  return (
    <Grid item md={12} xs={12} lg={11} xl={11}>
      <Grid container-fluid="true">
        <Grid item md={12} xs={12} sx={{ border: "2px solid transparent" }}>
          <Container>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={gridSpacing}
              sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}
            >
              <Grid item xs={12} md={8} lg={8}>
                <Grid
                  container
                  spacing={gridSpacing}
                  sx={{ pr: 10, [theme.breakpoints.down("lg")]: { pr: 0, textAlign: "center" } }}
                >
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, translateY: 550 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 30
                      }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontFamily: theme?.typography.appText,
                          fontStyle: "normal !important",
                          fontWeight: "600",

                          fontSize: { xs: "2.25rem", sm: "3rem", md: "78px", lg: "78px" },
                          lineHeight: { xs: "1", sm: "1", md: "84px", lg: "84px" },

                          color: theme.palette.mode === "dark" ? "#FFFFFF" : "black"
                        }}
                      >
                        This Page is
                        <Box component="span" sx={{ ml: 2, color: theme.palette.primary.main }}>
                          Coming Soon
                        </Box>
                      </Typography>
                    </motion.div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4} lg={4} sx={{ display: { xs: "none", md: "flex" } }}>
                <Box
                  sx={{
                    width: "290px",
                    animation: "10s slideY linear infinite"
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 30,
                      delay: 0.2
                    }}
                  >
                    <HeaderAnimationImage src={widget1} alt="watch" />
                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ComingSoon;
