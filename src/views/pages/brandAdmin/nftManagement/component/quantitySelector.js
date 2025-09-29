import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";

const QuantitySelector = ({ formik }) => {
  const theme = useTheme();

  return (
    <>
      <Box
        xs={12}
        sx={{
          background: theme.palette.mode === "dark" ? "#202629" : "#fff",
          borderRadius: "5px",
          px: 2,
          py: 0.5,
          border: formik.touched.quantity && formik.errors.quantity ? "1px solid #ff4b4b" : "none"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            Quantity
          </Typography>
          <input
            type="number"
            max="150"
            min="1"
            // className="quantityField"
            style={{
              width: "65px",
              background: theme.palette.mode === "dark" ? "#2B3235" : "#fff",
              color: theme.palette.mode === "dark" ? "#d7dcec" : "#000",
              border: theme.palette.mode === "dark" ? "none" : "1px solid black",
              padding: "4px",
              borderRadius: "5px"
            }}
            name="quantity"
            sx={{ width: "50px", border: "none" }}
            id="outlined-select-currency-native quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
        </div>
      </Box>
      {formik.touched.quantity && formik.errors.quantity && (
        <Typography variant="p" sx={{ color: "#ff4b4b", margin: 0, marginTop: "10px", fontSize: "0.75rem" }}>
          {formik.errors.quantity}
        </Typography>
      )}
    </>
  );
};

export default QuantitySelector;
