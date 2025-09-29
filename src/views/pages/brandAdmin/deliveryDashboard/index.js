import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getDeliveryDashboard } from "redux/deliveryDashboard/actions";
import DeliveryDashboard from "./component/deliveryDashboard";
import MainCard from "ui-component/cards/MainCard";
import HeadingCard from "shared/Card/HeadingCard";

const Delivered = () => {
  const dispatch = useDispatch();
  const deliveryList = useSelector((state) => state.delivery.deliveryList);
  const user = useSelector((state) => state.auth.user);

  const [search] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    dispatch(
      getDeliveryDashboard({
        brand: user.BrandId
        // search: search,
        // page: page,
        // limit: limit
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);

  return (
    <>
      <HeadingCard title=" Delivery Dashboard" />

      <MainCard className=" tableShadow" sx={{ borderRadius: "5px !important", boxShadow: "none" }} content={false}>
        <DeliveryDashboard deliveryList={deliveryList} user={user} />

        <>
          {/*  <Grid item xs={12} sx={{ p: 3 }}>
                        <Grid container justifyContent="center" spacing={gridSpacing}>
                            <Grid item>
                                <Pagination
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                    page={page}
                                    count={1}
                                    onChange={(event, newPage) => {
                                        setPage(newPage);
                                    }}
                                />
                            </Grid>
                           
                        </Grid>
                    </Grid> */}
        </>
      </MainCard>
    </>
  );
};

export default Delivered;
