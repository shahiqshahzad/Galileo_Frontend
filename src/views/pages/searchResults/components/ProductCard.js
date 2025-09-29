import { useNavigate } from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import { Card, Grid, CardActionArea, CardContent, Divider, Box, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ProductCard = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid
      item
      md={2}
      lg={2}
      sm={6}
      xs={12}
      sx={{ color: theme.palette.mode === "dark" ? "white" : "black", textDecoration: "none", position: "relative" }}
    >
      <Card
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "#404040",
          background: theme.palette.mode === "dark" ? "#181C1F" : "white",
          borderRadius: "3px"
        }}
      >
        <CardActionArea
          onClick={() => {
            navigate("/productDetails/" + data.nftId, {
              state: {
                nft: data
              }
            });
          }}
        >
          <CardMedia component="img" height="200" image={data?.image} />
          <CardContent sx={{ padding: "6%" }}>
            <Grid container>
              <Grid item xs={8} className="encap" sx={{ textAlign: "left" }}>
                <Tooltip placement="bottom-start" title={data.name}>
                  <Typography
                    variant="h5"
                    fontSize="18px"
                    textTransform="capitalize"
                    fontFamily={theme?.typography.appText}
                    color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {data.name}
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
                      {data?.nftCount !== "0" ? `${data?.nftCount} Items` : "1 Item"}
                    </Typography>
                    <Typography
                      variant="h5"
                      textTransform="capitalize"
                      fontFamily={theme?.typography.appText}
                      mt="1px"
                      fontSize="14px"
                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    >
                      {data?.brandName > 12 ? `${data?.brandName(0, 12)}..` : data?.brandName}
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
  );
};

export default ProductCard;
