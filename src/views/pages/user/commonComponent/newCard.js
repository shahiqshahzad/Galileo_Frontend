import { Avatar, Box, Card, CardActionArea, CardContent, Divider, Grid, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import galileoLogo from "assets/images/galileo_logo.png";
import { withStyles } from "@mui/styles";
import { CardImage } from "utils/CardImage";

const NewCard = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.mode === "dark" ? "#272F34" : "white",
      color: theme.palette.mode === "dark" ? "white" : "black",
      fontSize: "12px",
      fontWeight: "lighter",
      width: "14em",
      textAlign: "center"
    }
  }))(Tooltip);

  return (
    <Grid
      item
      lg={1.85}
      md={2.2}
      sm={3}
      xs={12}
      mt={3}
      ml={1.5}
      sx={{
        color: theme.palette.mode === "dark" ? "white" : "black",
        textDecoration: "none"
      }}
    >
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
          borderRadius: "3px",
          marginBottom: "10px",
          position: "relative"
        }}
      >
        {data?.isSoldByGalileo && (
          <Grid
            item
            sx={{
              position: "absolute",
              zIndex: 1,
              top: "10px",
              left: "10px",
              cursor: "pointer",
              border: "2px solid #5498CB",
              borderRadius: "30px"
            }}
          >
            <CustomTooltip placement="top-start" title={"Authenticated and resold by Galileo Protocol"}>
              <Avatar
                alt="sold by galileo"
                src={galileoLogo}
                sx={{ width: 35, height: 35, objectFit: "fill", background: "black" }}
              />
            </CustomTooltip>
          </Grid>
        )}
        <CardActionArea>
          <CardImage src={data?.asset} alt={data?.id} sx={{}} />

          <CardContent style={{ padding: "5% 6% 3% 6%" }}>
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "left" }}>
                <Tooltip placement="top-start" title={data?.name}>
                  <Typography
                    variant="h5"
                    fontSize="18px"
                    color={theme.palette.mode === "dark" ? "white" : "#404040"}
                    textTransform="capitalize"
                    fontFamily={theme?.typography.appText}
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
                      {data?.quantity !== "0" ? `${data?.quantity} Items` : "1 Item"}
                    </Typography>
                    <Tooltip placement="top-start" title={data?.Brand?.name}>
                      <Typography
                        variant="h5"
                        textTransform="capitalize"
                        fontFamily={theme?.typography.appText}
                        mt="1px"
                        fontSize="14px"
                        color={theme.palette.mode === "dark" ? "white" : "#404040"}
                      >
                        {data.Brand?.name?.length > 12 ? `${data?.Brand?.name.slice(0, 12)}..` : data?.Brand?.name}
                      </Typography>
                    </Tooltip>
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
                      className="app-text"
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

export default NewCard;
