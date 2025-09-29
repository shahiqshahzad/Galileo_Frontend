import { Box, Card, CardActionArea, CardContent, Divider, Grid, Tooltip, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useTheme } from "@mui/material/styles";
import TetherIcon from "assets/images/icons/tether_icon.svg";
import { useNavigate } from "react-router-dom";
const ComingSoonCategories = ({ data, nfts }) => {
  const theme = useTheme();
  return (
    <Grid
      item
      xs={12}
      mt={3}
      ml={4}
      sx={{
        color: theme.palette.mode === "dark" ? "white" : "black",
        textDecoration: "none",

        mr: {
          xs: nfts && nfts?.length > 5 ? 1 : 0,
          md: nfts && nfts?.length > 5 ? 3 : 2,
          lg: nfts && nfts?.length > 5 ? 2 : 2
        }
      }}
      md={nfts && nfts?.length > 5 ? 12 : 1.7}
      lg={nfts && nfts?.length > 5 ? 12 : 1.7}
      xl={nfts && nfts?.length > 5 ? 12 : 2}
      sm={nfts && nfts?.length > 5 ? 12 : 3}
    >
      <Card
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "#404040",
          background: theme.palette.mode === "dark" ? "#181C1F" : "white",
          borderRadius: "3px"
        }}
      >
        <CardActionArea>
          <CardMedia component="img" height="190" image={data?.brandImageURL} />
          <CardContent style={{ padding: "5% 6% 3% 6%" }}>
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "left" }}>
                <Tooltip placement="bottom-start" title={data.name}>
                  <Typography
                    variant="h5"
                    fontSize="12px"
                    color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    textTransform="capitalize"
                    fontFamily={theme?.typography.appText}
                  >
                    {data.brandName > 14 ? `${data.brandName.slice(0, 14)}..` : data.brandName}
                  </Typography>
                </Tooltip>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" fontFamily={theme?.typography.appText} fontSize="9px">
                      {data?.category}
                    </Typography>
                    <Typography
                      variant="h5"
                      textTransform="capitalize"
                      fontFamily={theme?.typography.appText}
                      mt="1px"
                      fontSize="12px"
                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    >
                      {data.Brand?.name?.length > 12 ? `${data?.Brand?.name.slice(0, 12)}..` : data?.Brand?.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default ComingSoonCategories;
