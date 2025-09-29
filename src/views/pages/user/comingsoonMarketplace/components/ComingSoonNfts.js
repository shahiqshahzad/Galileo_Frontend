import CardMedia from "@mui/material/CardMedia";
import { Card, Grid, CardActionArea, CardContent, Divider, Box, Tooltip, Typography, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ComingSoonNfts = ({ data }) => {
  const theme = useTheme();

  return (
    <Grid
      item
      md={2}
      lg={2}
      sm={6}
      xs={12}
      sx={{
        color: theme.palette.mode === "dark" ? "white" : "black",
        textDecoration: "none",
        position: "relative"
      }}
    >
      <Card
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "#404040",
          background: theme.palette.mode === "dark" ? "#181C1F" : "white",
          borderRadius: "3px"
        }}
      >
        <CardActionArea>
          <CardMedia component="img" height="190" image={data?.productImageURL} />
          <CardContent sx={{ padding: "5% 6% 3% 6%" }}>
            <Grid container>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Avatar alt="Remy Sharp" src={data.brandImageURL} sx={{ width: 30, height: 30 }} />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      textTransform="capitalize"
                      fontFamily={theme?.typography.appText}
                      mt="1px"
                      fontSize="12px"
                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    >
                      {data?.productName.length > 12 ? `${data?.productName.slice(0, 12)}..` : data?.productName}
                    </Typography>
                    <Typography
                      textTransform="capitalize"
                      fontFamily={theme?.typography.appText}
                      fontSize="8px"
                      fontWeight="200"
                      variant="body2"
                      color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    >
                      {data.brandName.length > 12 ? `${data?.brandName.slice(0, 12)}..` : data?.brandName}
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

export default ComingSoonNfts;
