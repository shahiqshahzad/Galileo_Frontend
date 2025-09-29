import React from "react";
import { Box, Card, CardActionArea, CardContent, Divider, Grid, Tooltip, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllLandingPageData } from "redux/landingPage/actions";
import { gridSpacing } from "store/constant";

const SimilarProducts = ({ nftList }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CategoryId = nftList?.nft?.CategoryId;

  const landingPageData = useSelector((state) => state.landingPageReducer.landingPageData?.newNfts);
  const categoryIds = landingPageData?.filter((value) => value?.CategoryId === CategoryId && value?.CategoryId);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllLandingPageData());
  }, []);

  return (
    <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "15px" }}>
      <Grid item xs={12} lg={12} md={12}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography
              color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
              className="productfigmastyl"
              variant="h2"
              mt={4}
              component="div"
              sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
            >
              Similar Products
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {landingPageData?.length > 1 && categoryIds.length > 1 ? (
        <Grid item xs={12}>
          <Grid container justifyContent="left" spacing={gridSpacing} sx={{ textAlign: "center" }}>
            {landingPageData.map(
              (data, i) =>
                data?.CategoryId == CategoryId &&
                data.id != id && (
                  <React.Fragment key={i}>
                    <Grid item md={2} sm={6}>
                      <Card
                        onClick={() => {
                          navigate("/productDetails/" + data.id, {
                            state: {
                              nft: data
                            }
                          });
                        }}
                        sx={{
                          color: theme.palette.mode === "dark" ? "white" : "#404040",
                          background: theme.palette.mode === "dark" ? "#181C1F" : "white",
                          maxWidth: 365,
                          width: "105%",
                          borderRadius: "4px !important"
                        }}
                      >
                        <CardActionArea>
                          <CardMedia component="img" height="200" image={data?.asset} />
                          <CardContent sx={{ padding: "6%" }}>
                            <Grid container>
                              <Grid item xs={12} sx={{ textAlign: "left" }}>
                                <Tooltip placement="bottom-start" title={data.name}>
                                  <Typography
                                    variant="h5"
                                    fontSize="18px"
                                    color={theme.palette.mode === "dark" ? "white" : "#404040"}
                                    textTransform="capitalize"
                                    fontFamily={theme?.typography.appText}
                                  >
                                    {data.name.length > 15 ? `${data.name.slice(0, 15)}..` : data.name}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                              <Grid item xs={12}>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                              </Grid>
                              <Grid item xs={12} sx={{ textAlign: "left" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                  <Box>
                                    <Typography variant="body2" fontFamily={theme?.typography.appText} fontSize="9px">
                                      {data?.quantity !== "0" ? `${data?.quantity} Items` : "1 Items"}
                                    </Typography>
                                    <Typography
                                      variant="h5"
                                      textTransform="capitalize"
                                      fontFamily={theme?.typography.appText}
                                      mt="1px"
                                      fontSize="14px"
                                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                                    >
                                      {data.Brand?.name.length > 12
                                        ? `${data.Brand?.name.slice(0, 12)}..`
                                        : data.Brand?.name}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" fontFamily={theme?.typography.appText} fontSize="9px">
                                      {data?.currencyType}
                                    </Typography>
                                    <Typography
                                      variant="h5"
                                      fontSize="14px"
                                      mt={"1px"}
                                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                                    >
                                      {data?.salePrice
                                        ? Number(data?.salePrice).toFixed(2)
                                        : data?.price
                                          ? Number(data?.price).toFixed(2)
                                          : 0}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </React.Fragment>
                )
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography
            className="fontfamily"
            variant="h3"
            mt={1}
            component="div"
            sx={{
              textAlign: { xs: "center", md: "left", sm: "center", color: " #9498AA" },
              textTransform: "none"
            }}
          >
            No similar products found
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default SimilarProducts;
