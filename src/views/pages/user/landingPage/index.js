/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Box, Typography } from "@mui/material";
import Header from "./component/header";
import NewAndTrendingNfts from "./component/newAndTrending";
import Categories from "./component/categories";
import FeaturedCreators from "./component/featuredCreators";
import { getAllCategories, getAllTrending, getAllgalileo, getAllBrands } from "redux/landingPage/actions";
import PromotedDialog from "./component/promptedDialog";
import ResoldByGalileoNfts from "./component/ResoldByGalileoNfts";
import SearchIcon from "assets/images/icons/search_icon_items.svg";
import ScrollToTop from "react-scroll-up";
import { Icons } from "../../../../shared/Icons/Icons";

const LandingPage = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [newNftPage, setNewNftPage] = useState(1);
  const [galileoNftPage, setGalileoNftPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [resoldloading, setResoldLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const trending = useSelector((state) => state.landingPageReducer.trending);
  const categories = useSelector((state) => state.landingPageReducer.categories);
  const galileo = useSelector((state) => state.landingPageReducer.galileo);
  const brands = useSelector((state) => state.landingPageReducer.brands);

  const isShowAll = useSelector((state) => state?.auth?.dropdown?.isShowAll);
  useEffect(() => {
    dispatch(
      getAllCategories({
        // gPage: galileoNftPage,
        // nPage: newNftPage,
        // size: 12,
        // isShowAll: isShowAll,
        setLoading: setLoading
      })
    );
    dispatch(
      getAllTrending({
        page: newNftPage,
        size: 12,
        isShowAll: isShowAll,
        setNftLoading: setNftLoading
      })
    );
    dispatch(
      getAllgalileo({
        page: galileoNftPage,
        size: 12,
        isShowAll: isShowAll,
        setLoading: setResoldLoading
      })
    );
    dispatch(
      getAllBrands({
        // gPage: galileoNftPage,
        // nPage: newNftPage,
        // size: 12,
        isShowAll: isShowAll,
        setLoading: setLoading
      })
    );
  }, [isShowAll, setLoading, setResoldLoading, setNftLoading]);

  const userClickedLater = localStorage.getItem("userClickedLater", true);

  const [isConditionMet, setIsConditionMet] = useState(false);

  useEffect(() => {
    if (
      user?.role === "User" &&
      user?.UserKyc === null &&
      !isConditionMet &&
      !userClickedLater &&
      user?.isKycPopupShownToUser === false
    ) {
      setOpen(true);
      setIsConditionMet(true);
    }
  }, [user, isConditionMet]);

  const handlePageChange = (value, type) => {
    // let newNPageNum = newNftPage;
    // let galileoPageNum = galileoNftPage;

    if (type === "newAndTrending") {
      setNewNftPage(value);
      dispatch(
        getAllTrending({
          // gPage: galileoNftPage,
          page: value,
          size: 12,
          isShowAll: isShowAll,
          setNftLoading: setNftLoading,
          previousData: trending?.newNfts ? trending?.newNfts : []
        })
      );
    } else {
      setGalileoNftPage(value);

      dispatch(
        getAllgalileo({
          page: value,
          // nPage: newNftPage,
          size: 12,
          isShowAll: isShowAll,
          setLoading: setResoldLoading
        })
      );
    }

    // setGalileoNftPage(galileoPageNum);
    // setNewNftPage(newNPageNum);
  };

  let totalNewNftPages = trending?.newNftsPages || 1;
  let totalGalileoNftPages = galileo?.galileoPages || 1;

  return (
    <div style={{ paddingLeft: "2rem" }}>
      <PromotedDialog setOpen={setOpen} open={open} />
      <Grid item md={12} xs={12} lg={12} xl={12}>
        <Grid container-fluid="true">
          <Grid item md={12} xs={12}>
            <Header />
          </Grid>
          {categories?.length === 0 &&
          trending?.newNfts?.length === 0 &&
          galileo?.brands?.length === 0 &&
          brands?.galileoNfts?.length === 0 ? (
            <>
              <Grid container justifyContent={"center"}>
                <Grid
                  item
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  xs={12}
                  md={11.5}
                  lg={11.5}
                  sx={{
                    mt: 4,
                    mb: 4,
                    background: "#22282C",
                    borderRadius: "5px",
                    height: "200px",
                    textAlign: "center"
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                    <Typography
                      variant="h3"
                      mt={1}
                      component="div"
                      className="app-text"
                      sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
                    >
                      No items found
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item md={12} xs={12}>
                <Categories categories={categories} loading={loading} />
              </Grid>
              <Grid item md={12} xs={12} mt={2}>
                <FeaturedCreators brands={brands} loading={loading} />
              </Grid>

              <Grid item md={12} xs={12}>
                <ResoldByGalileoNfts
                  nfts={galileo?.galileoNfts || []}
                  galileoNftPage={galileoNftPage}
                  totalGalileoNftPages={totalGalileoNftPages}
                  handlePageChange={handlePageChange}
                  loading={resoldloading}
                  setLoading={setResoldLoading}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <NewAndTrendingNfts
                  nfts={trending?.newNfts}
                  totalNewNftPages={totalNewNftPages}
                  totalCount={trending?.totalCount}
                  newNftPage={newNftPage}
                  handlePageChange={handlePageChange}
                  loading={nftLoading}
                  setLoading={setNftLoading}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <ScrollToTop style={{ position: "sticky", display: "flex", justifyContent: "end" }} showUnder={160}>
        {Icons.scrollToTopIcon}
      </ScrollToTop>
    </div>
  );
};

export default LandingPage;
