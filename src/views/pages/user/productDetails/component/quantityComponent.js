import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuantityComponent = ({ quantity, setQuantity, bulkcount }) => {
  const increaseQuantity = () => {
    if (quantity <= bulkcount - 1) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else {
      toast.error("The quantity must not exceed the available stock.");
      return;
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  return (
    <div>
      <Button
        onClick={decreaseQuantity}
        variant="outlined"
        className="quantity-button"
        disabled={quantity <= 1 ? true : false}
      >
        <RemoveIcon />
      </Button>
      <span style={{ margin: "0 15px" }}>{quantity}</span>
      <Button
        onClick={increaseQuantity}
        disabled={quantity >= bulkcount ? true : false}
        variant="outlined"
        className="quantity-button"
      >
        <AddIcon />
      </Button>
      {/*     <div style={{ marginTop: '20px' }}>
        <Button onClick={buyNow} variant="contained" color="primary">
          Buy Now
        </Button>
      </div>
      {totalQuantity > 0 && <div style={{ marginTop: '20px' }}>Total items to buy: {totalQuantity}</div>}*/}
    </div>
  );
};

export default QuantityComponent;
