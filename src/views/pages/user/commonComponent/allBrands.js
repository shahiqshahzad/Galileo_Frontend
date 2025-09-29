/* eslint-disable no-useless-concat */
import { useTheme } from "@mui/material/styles";
import { Card, Grid, CardActionArea, CardContent, Divider } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";

const BmwCard = ({ item }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Grid
      item
      md={2}
      lg={2}
      sm={6}
      xs={12}
      onClick={() => {
        navigate("/brand/" + item.id, {});
      }}
      sx={{
        color: theme.palette.mode === "dark" ? "white" : "black",
        textDecoration: "none"
      }}
    >
      <Grid style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
        <Card
          sx={{
            color: theme.palette.mode === "dark" ? "white" : "#404040",
            background: theme.palette.mode === "dark" ? "#181C1F" : "white",
            maxWidth: 365,
            width: "105%",
            // boxShadow: '1px 2px 6px #d3d3d3',
            borderRadius: "3px"
          }}
        >
          <CardActionArea>
            <CardMedia component="img" height="200" sx={{ objectFit: "scale-down" }} image={item?.image} />
            <CardContent sx={{ padding: "6%" }}>
              <Grid container>
                <Grid item xs={8} sx={{ textAlign: "left", textTransform: "capitalize" }}>
                  <span className="cardHeading " style={{ fontSize: "100%", wordBreak: "break-all" }}>
                    {item?.name}
                  </span>
                </Grid>
              </Grid>

              <Divider sx={{ mt: 2, mb: 2 }} />
              <Grid>
                <Grid item md={12} xs={12} className="overflow" sx={{ marginTop: { xs: "10px", md: "0" } }}>
                  <span
                    className="app-text"
                    sx={{ marginLeft: "2%", color: theme.palette.mode === "dark" ? " #a99d9d " : "#404040" }}
                  >
                    {item?.nftCount > 1 ? item?.nftCount + " " + "Items" : item?.nftCount + " " + "Item"}
                  </span>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BmwCard;
