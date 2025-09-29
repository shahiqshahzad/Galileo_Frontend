import React, { useState } from "react";
import { Grid } from "@mui/material";
import { gridSpacing } from "store/constant";

import History1 from "./history1";

import Attribute from "./attribute";
import { Pagination } from "@mui/material";

const TrackAtribute = ({ tracking }) => {
  const basicData = [
    {
      id: "basic1",
      title: "Attribute"
    }
  ];
  const history1 = [
    {
      id: "basic1",
      title: "History 1"
    }
  ];

  const cardsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = tracking?.historyArray?.slice(indexOfFirstCard, indexOfLastCard);

  let createdBy;
  let createdByUser;
  let createdAt;
  let activityTrack = tracking?.activity?.filter((value) => value.event === "Mint Bulk" || value.event === "Mint");
  if (tracking?.beforeMarketplaceHistory?.handleUpdateUris[0]) {
    createdBy = tracking?.beforeMarketplaceHistory?.handleUpdateUris[0]?.updater;
    createdByUser = tracking?.beforeMarketplaceHistory?.handleUpdateUris[0]?.updaterUser;
    createdAt = tracking?.beforeMarketplaceHistory?.handleUpdateUris[0]?.blockTimestamp * 1000;
  } else {
    createdBy = tracking?.nftOwner;
    createdByUser = activityTrack[0]?.minterUser;
    createdAt = tracking?.nft?.createdAt;
  }

  // const filterLocation = tracking.nft.NFTMetaData.find((d) => d.display_type === 'Location' && d.primaryLocation === true);

  return (
    <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "0 15px" }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} sx={{ padding: "0 15px 0 02px" }}>
          <Grid item xs={12} md={12} sx={{ display: { xs: "none", md: "block" } }}>
            <Attribute
              tracking={tracking?.nft?.NFTMetaData}
              history={tracking?.historyArray}
              data={basicData}
              createdBy={createdBy}
              createdByUser={createdByUser}
              createdAt={createdAt}
            />
          </Grid>
          {tracking !== undefined &&
            tracking?.historyArray &&
            currentCards.map((card) => (
              <>
                <Grid mt={2} mb={2} item xs={12} md={12} sx={{ display: { xs: "none", md: "block" } }}>
                  <History1
                    tracking={card?.historyArray}
                    updater={card?.updater}
                    updaterUser={card?.updaterUser}
                    blockTimestamp={card?.blockTimestamp}
                    Proof={card?.proofOfAuthenticityArray}
                    data={history1}
                    history={card?.historyNo}
                  />
                </Grid>
              </>
            ))}
          {tracking?.historyArray?.length > 5 && (
            <Pagination
              sx={{
                float: "right",
                ".MuiPaginationItem-page.Mui-selected": {
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#000",
                    opacity: 0.8
                  }
                }
              }}
              count={Math.ceil(tracking?.historyArray?.length / cardsPerPage)}
              onChange={(event, value) => setCurrentPage(value)}
              page={currentPage}
            />
          )}
        </Grid>
        {/* <Grid item xs={12} sm={6} md={6}>
          <Form location={filterLocation} />
        </Grid> */}
      </Grid>
    </Grid>
  );
};
export default TrackAtribute;
