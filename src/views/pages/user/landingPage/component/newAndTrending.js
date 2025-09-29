import { Button, Grid, Typography } from "@mui/material";
import NewCard from "../../commonComponent/newCard";
import { useTheme } from "@mui/material/styles";

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { LoaderComponent } from "utils/LoaderComponent";
import InfiniteScroll from "react-infinite-scroll-component";

const NewAndTrendingNfts = ({
  loading,
  setLoading,
  nfts,
  totalNewNftPages,
  newNftPage,
  handlePageChange,
  statusCode,
  setStatusCode,
  totalCount
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const pageRef = useRef(1);

  const handleChange = () => {
    pageRef.current = pageRef.current + 1;
    handlePageChange(pageRef.current, "newAndTrending");
  };
  return (
    <Grid container-fluid="true" mb={"15px"}>
      <Grid item xs={12} lg={12} md={12} sx={{ mt: "15px", ml: "15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignsItem: "end", width: "98%" }}>
              <Typography
                className="app-text"
                color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
                sx={{
                  fontSize: "22px",
                  textAlign: { xs: "center", md: "left", sm: "center" },
                  marginLeft: { md: "18px" },
                  textTransform: "capitalize"
                }}
                onClick={() => {
                  if (nfts?.length > 0) {
                    navigate("/marketplace");
                  }
                }}
              >
                New & Trending
              </Typography>
              <Button
                sx={{
                  marginBottom: "-6px",
                  borderRadius: "26px",
                  color: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
                  fontWeight: "600"
                }}
                variant="outlined"
                onClick={() => {
                  if (nfts?.length > 0) {
                    navigate("/marketplace");
                  }
                }}
              >
                View All
              </Button>
            </Box>
            <Box
              sx={{
                position: "relative",
                marginTop: "10px",
                marginLeft: "15px",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "169px",
                  height: "6px",
                  backgroundImage: "linear-gradient(to right, #2F53FF, #2FC1FF)",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px"
                }
              }}
            />
            <Box as="div" sx={{ width: "97%", borderBottom: "0.5px solid #CDCDCD80", marginLeft: "15px" }}></Box>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item md={12} xs={12}> */}
      {loading === true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <>
          <InfiniteScroll
            next={handleChange}
            hasMore={totalCount === nfts?.length ? false : true}
            dataLength={nfts?.length ? nfts?.length : 0}
            loader={<h4>Loading</h4>}
            style={{ overflow: "hidden" }}
          >
            <Grid container ml={1.5}>
              {nfts && nfts?.length ? (
                nfts.map((product, index) => <NewCard key={index} data={product} />)
              ) : (
                <Grid mt={4} container>
                  <Typography className="noDataNew fontfamily">No results found.</Typography>
                </Grid>
              )}
            </Grid>
          </InfiniteScroll>
          {/* </Grid> */}
        </>
      )}
    </Grid>
  );
};

export default NewAndTrendingNfts;
