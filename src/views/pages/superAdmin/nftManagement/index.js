/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { gridSpacing } from "store/constant";
import { Button, Grid, Typography, Pagination, MenuItem, TextField } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { getAllNftSuperAdmin, mintLoaderNft } from "../../../../redux/nftManagement/actions";
import NftCard from "./component/nftCard";
import CircularProgress from "@mui/material/CircularProgress";
import AddNft from "views/pages/brandAdmin/nftManagement/component/addNft/addNft";
import { getAllBrandCategories } from "redux/brandCategory/actions";
import { Stack } from "@mui/system";
import { getAllCategoryAddresses } from "redux/addresses/actions";
import { useSearchParams } from "react-router-dom";
import { getnftDataSuccess } from "redux/landingPage/actions";

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
    value: "rejected",
    label: "Rejected NFTS"
  },
  {
    value: "edit_requests",
    label: "Edit Requests"
  }
];

const subAdminTypeArray = [
  {
    value: "draft",
    label: "Draft Products"
  },
  {
    value: "listed",
    label: "Listed Products"
  },
  {
    value: "sold",
    label: "Sold Products"
  }
];

const NftManagement = () => {
  const { categoryId, brandId } = useParams();
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nftList = useSelector((state) => state.nftReducer.nftListSuperAdmin);
  const [type, setType] = useState(user?.role === "Sub Admin" ? "draft" : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [addNftOpen, setAddNftOpen] = useState(false);
  const [filterArray, setFilterArray] = useState(typeArray);

  const handleType = (event) => {
    let newType = event.target.value;
    navigate(`/nftManagement/${categoryId}/${brandId}?pageNumber=${page}&filter=${newType}`);
    setType(newType);
    setLimit(12);
    setSearch("");
    setPage(1);
  };

  useEffect(() => {
    if (user?.role === "Sub Admin") {
      const filter = searchParams.get("filter") || "draft";
      if (filter) {
        setType(filter);
      } else {
        setType("draft");
      }
      setFilterArray(subAdminTypeArray);
    }
  }, [user]);

  useEffect(() => {
    dispatch(
      getAllNftSuperAdmin({
        brandId: brandId,
        categoryId: categoryId,
        search: search,
        page: page,
        limit: limit,
        type: type
      })
    );
    if (user?.role === "Sub Admin") {
      dispatch(
        getAllBrandCategories({
          brandId: user?.BrandId,
          search: search,
          page: page,
          limit: limit
        })
      );
      // dispatch(getSupportedCarriers());
      dispatch(getAllCategoryAddresses({ categoryId, brandId }));
    }
  }, [search, page, limit, type]);

  useEffect(() => {
    return () => {
      dispatch(mintLoaderNft(false));
    };
  }, []);

  const brandCategoriesList = useSelector((state) => state.brandCategoryReducer.brandCategoriesList);
  const currency =
    brandCategoriesList?.brandCategories !== undefined &&
    brandCategoriesList?.brandCategories.find((value) => value?.CategoryId == categoryId);
  const CurrencyFetch =
    currency?.BrandCategorySettings !== undefined && currency?.BrandCategorySettings.find((value) => value);
  const refurbishedSalesStatus =
    brandCategoriesList?.brandCategories !== undefined &&
    brandCategoriesList?.brandCategories.find((value) => value?.CategoryId == categoryId);

  return (
    <>
      {/* <MainCard
        className="Adminheading"
        title={
          <Typography
            variant="h1"
            component="h2"
            className="headingcard"
            sx={{
              marginTop: "10px",
              fontWeight: 600,
              color: theme.palette.mode === "dark" ? "white" : "#000",
              marginLeft: { lg: "-20px", md: "-20px" }
            }}
          >
            Categories
          </Typography>
        }
        content={false}
      ></MainCard> */}
      <MainCard
        className="yellow tableShadow"
        title={
          <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography className="mainheading" variant="h1" component="h2" sx={{ marginLeft: "10px" }}>
              Product Management
            </Typography>

            <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <Stack width={"13rem"}>
                <TextField
                  className="selectField selectstyle"
                  id="outlined-select-budget"
                  select
                  fullWidth
                  value={type}
                  onChange={handleType}
                  variant="standard"
                >
                  {filterArray.map((option, index) => (
                    <MenuItem key={index} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack sx={{ flexDirection: "row", gap: "1rem" }}>
                {user?.role === "Sub Admin" && (
                  <Button
                    className="app-text"
                    variant="contained"
                    sx={{ paddingX: "15px" }}
                    size="large"
                    // onClick={() => setAddNftOpen(true)}
                    onClick={() => {
                      dispatch(getnftDataSuccess({}));
                      navigate("/addProduct");
                    }}
                  >
                    Add New
                  </Button>
                )}
                {user?.role === "Super Admin" && (
                  <Button
                    className="app-text"
                    variant="contained"
                    size="large"
                    onClick={() => {
                      navigate("/brands");
                    }}
                  >
                    Back
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        }
        content={false}
      >
        <Grid container sx={{ padding: "30px" }}>
          {nftList && nftList.nfts && nftList.nfts.rows && nftList.nfts.rows.length > 0 ? (
            <>
              <Grid container spacing={gridSpacing} mt={2}>
                {nftList.nfts.rows &&
                  nftList.nfts.rows.map((nft, index) => {
                    return (
                      <Grid key={nft?.id} item xs={12} sm={6} md={3.6} lg={3} xl={3}>
                        <NftCard
                          className="tableShadow"
                          nftData={nft}
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
                        navigate(`/nftManagement/${categoryId}/${brandId}?pageNumber=${newPage}&filter=${type}`);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item display={"flex"} justifyContent="center" sx={{ width: "100%", mt: 3, mb: 3 }}>
                {nftList?.nfts?.rows?.length === 0 ? (
                  <>
                    <h2 className="app-text">No data found</h2>
                  </>
                ) : (
                  <CircularProgress size={"5rem"} disableShrink />
                )}
              </Grid>
            </>
          )}
        </Grid>
      </MainCard>
      <AddNft
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
        createdBy={"SubAdmin"}
        refurbishedSalesStatus={refurbishedSalesStatus?.allowRefurbishedSales}
      />
    </>
  );
};

export default NftManagement;
