import { Grid, Pagination, Typography } from "@mui/material";
import NewCard from "../../commonComponent/newCard";
import { useTheme } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import React from "react";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { LoaderComponent } from "utils/LoaderComponent";

const ResoldByGalileoNfts = ({ setLoading, loading, nfts, galileoNftPage, handlePageChange, totalGalileoNftPages }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (event, value) => {
    setLoading(true);
    handlePageChange(value, "galileoNft");
  };

  return (
    <Grid container-fluid="true" mb={"15px"}>
      <Grid item xs={12} lg={12} md={12} sx={{ mt: "15px", ml: "15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
              className="app-text"
              sx={{
                fontSize: "22px",
                cursor: "pointer",
                marginLeft: { md: "18px" },
                textTransform: "capitalize",
                textAlign: { xs: "center", md: "left", sm: "center" }
              }}
              onClick={() => {
                if (nfts?.length > 0) {
                  navigate("/marketplace");
                }
              }}
            >
              Resold By Galileo
            </Typography>
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
                  width: "184px",
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
      {loading === true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <>
          <Grid item md={12} xs={12}>
            <Grid container ml={1.5}>
              {nfts && nfts?.length ? (
                nfts.map((item, i) => <NewCard key={i} data={item} />)
              ) : (
                <Grid mt={4} container>
                  <Typography className="noDataNew fontfamily">No results found.</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          {totalGalileoNftPages > 1 ? (
            <Grid item sx={{ display: "flex", justifyContent: "flex-end" }} md={12} xs={12} mx={5} mt={2} mb={2}>
              <Pagination
                count={totalGalileoNftPages}
                onChange={handleChange}
                page={galileoNftPage}
                shape="rounded"
                color="primary"
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIosNewIcon, next: ArrowForwardIosIcon }}
                    {...item}
                    sx={{
                      borderRadius: "10px",
                      background: "#2a2a2a",
                      border: "2px solid #646769",

                      "&.Mui-selected": {
                        borderRadius: "10px",
                        border: "none !important",
                        background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#2F53FF",
                        height: "25px",
                        width: "25px"
                      }
                    }}
                  />
                )}
              />
            </Grid>
          ) : null}
        </>
      )}
    </Grid>
  );
};

export default ResoldByGalileoNfts;
