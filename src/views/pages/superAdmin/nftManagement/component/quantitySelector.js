import { Typography, TextField } from "@mui/material";
const QuantitySelector = ({ formik, fileArray, index }) => {
  const handleChange = (value) => {
    fileArray[index].quantity = value;
    formik.setFieldValue("images", fileArray);
  };

  return (
    <>
      <div style={{ display: "flex", marginRight: "10px" }}>
        <Typography style={{ marginTop: "12px", marginRight: "5px" }}>Quantity : </Typography>

        <TextField
          type="number"
          className="quantityField"
          id="outlined-select-currency-native"
          value={fileArray[index].quantity}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default QuantitySelector;
