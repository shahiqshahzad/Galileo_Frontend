import { Box, Typography } from "@mui/material";

export const PriceWithCurrency = ({ price, currencyType, theme, label, style }) => {
  return (
    <Box
      sx={{
        ...style,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "no-wrap",
        gap: "1rem"
      }}
    >
      <Typography
        sx={{
          fontFamily: theme?.typography.appText,
          fontWeight: "400",
          fontSize: "20px",
          lineHeight: "20px",
          letterSpacing: 0,
          textAlign: "left",
          color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography
          sx={{
            fontFamily: theme?.typography.appText,
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "20px",
            letterSpacing: 0,
            textAlign: "left",
            color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
          }}
        >
          {price}
        </Typography>
        <Typography
          sx={{
            fontFamily: theme?.typography.appText,
            fontWeight: "700",
            fontSize: "20px",
            lineHeight: "20px",
            letterSpacing: 0,
            textAlign: "left",
            background: "linear-gradient(97.63deg, #657DE0 0%, #66EAE2 108.44%, #62C4E2 108.45%)",
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
            paddingLeft: 0.5,
            color: "#ffffff"
          }}
        >
          {currencyType}
        </Typography>
      </Box>
    </Box>
  );
};
