import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { addToCart } from "redux/marketplace/actions";
import { Link } from "react-router-dom";

export default function RecommendedProduct({ nft, loader }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ NftId: nft?.id }));
  };

  return (
    <Box sx={{ my: 2 }}>
      <Card
        sx={{
          display: "flex",
          borderRadius: 0,
          backgroundColor: `${theme.palette.mode === "dark" ? "transparent" : "white"}`,
          height: "6.438rem"
        }}
      >
        <Link to={`/productDetails/${nft.id}`}>
          <CardMedia
            component="img"
            sx={{ width: "7rem", height: "6.438rem" }}
            image={nft?.asset}
            alt="Live from space album cover"
          />
        </Link>
        <Box sx={{ display: "flex", flexDirection: "column", color: "#ffffff" }}>
          <CardContent
            orientation="horizontal"
            sx={{
              pt: 0,
              pb: "0 !important",
              height: "6.438rem",
              padding: "0 0 0 0.5rem",
              backgroundColor: `${theme.palette.mode === "dark" ? "transparent" : "white"}`
            }}
          >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div>
                <Link style={{ textDecoration: "none" }} to={`/productDetails/${nft.id}`}>
                  <Typography
                    sx={{
                      fontFamily: theme?.typography.appText,
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "19.6px",
                      letterSpacing: 0,
                      textAlign: "left",
                      color: `${theme.palette.mode === "dark" ? "white" : "black"}`
                    }}
                  >
                    {nft.name}
                  </Typography>
                </Link>
                <Box sx={{ display: "flex", alignItems: "center", pl: 0, mb: 1 }}>
                  {/* <StyledRating name="read-only" value={4} readOnly /> */}
                  {/* <Typography
                    sx={{
                      fontFamily: 'Public Sans, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      lineHeight: '12.93px',
                      letterSpacing: 0,
                      textAlign: 'left',
                      color: '#2194FF',
                      pl: 0.5
                    }}
                  >
                    133
                  </Typography> */}
                </Box>
              </div>

              <Box sx={{ display: "flex", alignItems: "center", pl: 0 }}>
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "21.15px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#657DE0",
                    pr: 0.5
                  }}
                >
                  $
                </Typography>
                <Typography
                  sx={{
                    fontFamily: theme?.typography.appText,
                    fontWeight: "600",
                    fontSize: "18px",
                    lineHeight: "21.15px",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
                    pr: 1
                  }}
                >
                  {nft?.price ? Number(nft.price).toFixed(2) : 0}
                </Typography>
                <Button
                  variant="outlined"
                  size="md"
                  aria-label="Add to cart"
                  sx={{
                    color: "#FFFFFF",
                    background:
                      "linear-gradient(0deg, #181C1F, #181C1F),linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
                    fontFamily: theme?.typography.appText,
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "12px",
                    textAlign: "center",
                    alignSelf: "center",
                    border: "1px solid #FFFFFF1A",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    width: "87px",
                    height: "28px",
                    padding: "8px"
                  }}
                  onClick={handleAddToCart}
                  disabled={loader}
                >
                  Add to cart
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
