import React from "react";
import BulkCard from "./bulkCard";
import { useParams } from "react-router-dom";

import { getAllBulkNft } from "redux/nftManagement/actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const BulkNft = () => {
  const dispatch = useDispatch();
  const bulkId = useParams().bulkId;

  useEffect(() => {
    dispatch(
      getAllBulkNft({
        bulkId: bulkId
        // categoryId: location?.state?.data?.CategoryId,
        // search: search,
        // page: page,
        // limit: limit,
        // type: type,
        // brandId: user.BrandId,
        // handleClose: handleClose,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bulknftList = useSelector((state) => state.nftReducer.bulknftList);
  return (
    <div>
      <BulkCard
        className="tableShadow"
        nftData={bulknftList}
        bulkId={bulkId}
        // categoryId={location.state.data.CategoryId}
        // search={search}
        // page={page}
        // limit={limit}
        // type={type}
      />
    </div>
  );
};

export default BulkNft;
