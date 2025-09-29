import React from "react";
import BulkCard from "./bulkCard";
import { useParams } from "react-router-dom";
import { LoaderComponent } from "utils/LoaderComponent";

import { getAllBulkNft } from "redux/nftManagement/actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import ReduceSupplyDialog from "./reduceSupply";

const BulkNft = () => {
  const dispatch = useDispatch();
  const [reduceSuppyOpen, setReduceSuppyOpenOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const bulkId = useParams().bulkId;
  const categoryId = useParams().categoryId;
  const BrandId = useParams().BrandId;
  useEffect(() => {
    dispatch(
      getAllBulkNft({
        bulkId: bulkId
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bulknftList = useSelector((state) => state.nftReducer.bulknftList);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <ReduceSupplyDialog
        BrandId={BrandId}
        bulkId={bulkId}
        count={bulknftList?.length}
        categoryId={categoryId}
        loader={loader}
        setLoader={setLoader}
        open={reduceSuppyOpen}
        setOpen={setReduceSuppyOpenOpen}
      />

      <div>
        {user?.role === "Sub Admin" &&
          (loader ? (
            <LoaderComponent alignItems={"flex-end"} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: "5px", float: "right" }}
              onClick={() => {
                setReduceSuppyOpenOpen(true);
              }}
            >
              Reduce Supply
            </Button>
          ))}

        <BulkCard
          className="tableShadow"
          nftData={bulknftList}
          bulkId={bulkId}
          BrandId={BrandId}
          categoryId={categoryId}
        />
      </div>
    </>
  );
};

export default BulkNft;
