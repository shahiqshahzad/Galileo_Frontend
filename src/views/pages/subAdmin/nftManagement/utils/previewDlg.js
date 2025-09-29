import React, { forwardRef } from "react";
import { Dialog, Slide, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import longDescImage from "assets/images/previewImages/long_desc.jpg";
import inventoryImage from "assets/images/previewImages/Inventory.jpg";
import salePriceImage from "assets/images/previewImages/sale_price.jpg";
// import shortDescImage from "assets/images/previewImages/short_desc.jpg";
import propertiesImage from "assets/images/previewImages/properties.jpg";
import regularPriceImage from "assets/images/previewImages/regular_price.jpg";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export const AddProductPreviewDialog = ({ open, handleClose, selectedPreview = 0 }) => {
  const previewData = [
    {
      title: "Long Description",
      image: longDescImage,
      subText:
        "Provide a detailed and comprehensive description of the product, covering all features and additional details."
    },
    {
      title: "Regular Price",
      image: regularPriceImage,
      subText: "Enter the standard price of the product before any discounts."
    },
    {
      title: "Sale Price",
      image: salePriceImage,
      subText:
        "Enter the discounted price of the product. If this is set, this amount will be used as the sale price for the item."
    },
    {
      title: "Inventory",
      image: inventoryImage,
      subText:
        "Manage the stock levels of your product. Ensure this is updated regularly to reflect available quantities."
    },
    {
      title: "Properties",
      image: propertiesImage,
      subText:
        "Specify the product's attributes, such as size, color, and material. These specifications will be displayed to users in a tabular format for enhanced readability."
    }
  ];

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      className="adminDialog dialog"
      maxWidth="lg"
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description1"
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "72vw !important",
          maxWidth: "72vw !important",
          maxHeight: "fit-content !important",
          overflowY: "visible"
        }
      }}
    >
      <Stack sx={{ paddingX: "1em", width: "70vw", alignItems: "center" }}>
        <Typography sx={{ alignSelf: "flex-start", color: "white", fontSize: "30px", mb: 1 }}>
          {previewData[selectedPreview].title}
        </Typography>
        <img src={previewData[selectedPreview].image} alt="preview" style={{ width: "68vw" }} />
        <Typography sx={{ alignSelf: "flex-start", color: "white", mt: "1rem" }}>
          {previewData[selectedPreview].subText}
        </Typography>
      </Stack>
    </Dialog>
  );
};
