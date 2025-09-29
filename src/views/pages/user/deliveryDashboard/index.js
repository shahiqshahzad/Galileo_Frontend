import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/styles";
import DeliveryDashboard from "./component/DeliveryDashboard";

import { getAllProducts } from "redux/deliveryDashboard/actions";

const DeliverD = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.delivery.productList);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getAllProducts({ walletAddress: user?.walletAddress }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid
      item
      md={11}
      lg={11}
      xs={12}
      style={{
        marginTop: "15px",
        maxWidth: "90%",
        margin: "0 auto",
        background: "tranparent",
        color: theme.palette.mode === "dark" ? "white" : "#404040"
      }}
    >
      <DeliveryDashboard productList={productList} />
    </Grid>
  );
};

export default DeliverD;
