/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";
import { Button, Grid, Typography, Pagination, MenuItem, TextField } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import AddNft from "./component/addNft/addNft";
import { getAllNft } from "../../../../redux/nftManagement/actions";
import NftCard from "./component/nftcard";
import CircularProgress from "@mui/material/CircularProgress";
import { getAllCategoryAddresses } from "redux/addresses/actions";
import { getAllBrandCategories } from "redux/brandCategory/actions";
const typeArray = [
  {
    value: "all",
    label: "All NFT'S"
  },
  {
    value: "directMint",
    label: "Minted NFTS"
  },
  {
    value: "lazyMint",
    label: "Lazy Minted NFT'S"
  },

  {
    value: "draft",
    label: "Draft NFTS"
  },
  {
    value: "rejected",
    label: "Rejected NFTS"
  },

  {
    value: "edit_requests",
    label: "Edit Requests"
  }
];

const NftManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { categoryId, brandId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [addNftOpen, setAddNftOpen] = useState(false);
  // const GeneralSetting = location?.state?.nft?.BrandCategorySettings[0]?.GeneralSetting;
  const user = useSelector((state) => state.auth.user);

  //testing api==============================================>

  const brandCategoriesList = useSelector((state) => state.brandCategoryReducer.brandCategoriesList);
  const currency =
    brandCategoriesList?.brandCategories !== undefined &&
    brandCategoriesList?.brandCategories.find((value) => value?.CategoryId === categoryId);
  const CurrencyFetch =
    currency?.BrandCategorySettings !== undefined && currency?.BrandCategorySettings.find((value) => value);

  const handleType = (event) => {
    setType(event.target.value);
    setLimit(12);
    setSearch("");
    setPage(1);
  };

  useEffect(() => {
    if (status !== null && status === "rejected") {
      setType("rejected");
    }
  }, [status, brandId]);

  useEffect(() => {
    dispatch(
      getAllBrandCategories({
        brandId: user?.BrandId,
        search: search,
        page: page,
        limit: limit
      })
    );
  }, [search, page, limit]);

  useEffect(() => {
    dispatch(
      getAllNft({
        categoryId: categoryId,
        search: search,
        page: page,
        limit: limit,
        type: type,
        brandId: brandId
      })
    );
  }, [search, page, limit, type, brandId, categoryId]);

  useEffect(() => {
    // dispatch(getSupportedCarriers());
    dispatch(getAllCategoryAddresses({ categoryId, brandId }));
  }, []);

  const nftList = useSelector((state) => state.nftReducer.nftList);

  return (
    <>
      <AddNft
        // GeneralSetting={GeneralSetting}
        getCurrency={CurrencyFetch?.GeneralSetting?.currencySymbol}
        getchainId={CurrencyFetch?.GeneralSetting?.chainId}
        open={addNftOpen}
        setOpen={setAddNftOpen}
        contractAddress={nftList?.contractAddress ? nftList?.contractAddress : ""}
        categoryId={categoryId}
        search={search}
        page={page}
        limit={limit}
        nftType={type}
      />
      <MainCard
        className="Adminheading"
        title={
          <Grid container sx={{ display: "flex" }}>
            <Grid item md={8} xs={12}>
              <Typography
                variant="h1"
                component="h2"
                className="headingcard"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                  marginLeft: { lg: "-20px", md: "-20px" }
                }}
              >
                Categories
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Button
                className="buttonSize"
                sx={{ float: { xs: "left", md: "right" }, marginTop: { xs: "10px", md: "0px" } }}
                variant="contained"
                size="large"
                onClick={() => {
                  navigate("/categories");
                }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        }
        content={false}
      ></MainCard>
      <MainCard
        className="yellow tableShadow"
        title={
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Typography
                className="mainheading"
                variant="h1"
                component="h2"
                sx={{ marginLeft: { lg: "48px", md: "48px" }, marginTop: { md: "6px" } }}
              >
                NFT Management
              </Typography>
            </Grid>
            <Grid item xs={6} lg={2}>
              <TextField
                className="selectField selectstyle"
                id="outlined-select-budget"
                select
                fullWidth
                value={type}
                onChange={handleType}
                variant="standard"
              >
                {typeArray.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} lg={2} textAlign="start">
              <Button
                className="buttonSize"
                sx={{ marginLeft: { lg: "-16px", md: "-16px" } }}
                variant="contained"
                size="large"
                onClick={() => {
                  setAddNftOpen(true);
                }}
              >
                Add NFT
              </Button>
            </Grid>
          </Grid>
        }
        content={false}
      >
        <Grid container>
          {nftList && nftList.nfts && nftList.nfts.rows && nftList.nfts.rows !== undefined ? (
            <>
              {nftList.nfts.rows.length > 0 ? (
                <>
                  <Grid container spacing={gridSpacing} mt={2} sx={{ padding: "0px 16px" }}>
                    {nftList.nfts.rows &&
                      nftList.nfts.rows.map((nft, index) => {
                        return (
                          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                            <NftCard
                              className="tableShadow"
                              nftData={nft}
                              categoryId={categoryId}
                              search={search}
                              page={page}
                              limit={limit}
                              type={type}
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                  <Grid item xs={12} sx={{ p: 3 }}>
                    <Grid container justifyContent="center" spacing={gridSpacing}>
                      <Grid item>
                        <Pagination
                          page={page}
                          color="primary"
                          showFirstButton
                          showLastButton
                          count={nftList && nftList.pages}
                          onChange={(event, newPage) => {
                            setPage(newPage);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Grid item>
                  <Typography className="statustypo" style={{ padding: "20px 20px 20px 70px", fontWeight: "500" }}>
                    No Data Available
                  </Typography>
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
                <Grid item>
                  <CircularProgress disableShrink size={"4rem"} />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </MainCard>
    </>
  );
};

export default NftManagement;
