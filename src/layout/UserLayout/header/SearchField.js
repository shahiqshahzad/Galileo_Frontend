import React, { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import { styled, useTheme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRecentSearchNft,
  getRecentSearch,
  getSearch,
  getSearchSuccess,
  recentSearchNft
} from "redux/marketplace/actions";
import { debounce } from "lodash";

import { Icons } from "../../../shared/Icons/Icons";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import { removeAllRecentData, removeRecentDataById } from "utils/utilFunctions";

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "relative",
  height: "45vh",
  width: "100%",
  zIndex: "9999",
  margin: "0",
  overflowY: "auto",
  background: `${theme.palette.mode === "dark" ? "#181C1F" : "#ffffff"}`,
  padding: "1rem",
  color: `${theme.palette.mode === "dark" ? "#ffffff" : "#333333"}`,
  "&::-webkit-scrollbar": {
    width: "0.4em"
  },
  "&::-webkit-scrollbar-track": {
    "-webkit-box-shadow": "inset 0 0 6px gray"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "gray"
  }
}));

const StyledListHeading = styled(Box)(({ theme }) => ({
  zIndex: "9",
  width: "100%",
  display: "flex",
  padding: "0.5rem 0 0 1rem",
  color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`
}));

const StyledList = styled(Box)(({ theme }) => ({
  zIndex: "9",
  width: "100%",
  display: "flex",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
  "& > img": {
    zIndex: "9",
    marginRight: 12,
    flexShrink: 0,
    height: "44px",
    width: "44px",
    borderRadius: "50%"
  },
  "&:hover": {
    background: `${theme.palette.mode === "dark" ? "#4E5356" : "#ccc"}`
  }
}));

const SearchField = () => {
  const ref = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [matchingRecentSearch, setMatchingRecentSearch] = useState([]);

  const token = useSelector((state) => state.auth?.token);
  const searchResults = useSelector((state) => state.marketplaceReducer.marketPlaceSearch);
  const recentSearch = useSelector((state) => state.marketplaceReducer.marketPlaceRecentSearch);
  const isShowAll = useSelector((state) => state.auth?.dropdown?.isShowAll);

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleFocus = (e) => {
    const { value } = e.target;
    if (value.length >= 3) {
      setIsOpen(true);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    if (value.length >= 3) {
      setLoading(true);
      setIsOpen(true);
      dispatch(
        getSearch({
          value,
          setLoading,
          page: "",
          limit: "",
          bPage: "",
          bPageSize: "",
          categoryIds: [],
          brandsIds: [],
          sort: "createdAt",
          order: "DESC",
          isShowAll: isShowAll
        })
      );
      dispatch(getRecentSearch({ isShowAll: isShowAll }));
    } else {
      dispatch(getSearchSuccess([]));
      if (!recentSearch?.length) {
        setIsOpen(false);
      }
    }
  };

  const handleOnClickNft = (nftData, id) => {
    navigate(`productDetails/${id}`);
    dispatch(
      recentSearchNft({
        id,
        nftData: { ...nftData, id, searchId: id, searchType: "Nft" },
        nft: "Nft",
        isShowAll: isShowAll
      })
    );
    setIsOpen(false);
    dispatch(getSearchSuccess([]));
    if (ref?.current?.value) {
      ref.current.value = "";
    }
  };

  const handleOnClickBrand = (nftData, id) => {
    navigate(`brand/${id}`);
    dispatch(
      recentSearchNft({
        id,
        nftData: { ...nftData, id, searchId: id, searchType: "Brand" },
        nft: "Brand",
        isShowAll: isShowAll
      })
    );
    setIsOpen(false);
    dispatch(getSearchSuccess([]));
    if (ref?.current?.value) {
      ref.current.value = "";
    }
  };
  const handleKeyPress = (e) => {
    const { value } = e.target;
    if (value.length >= 1) {
      if (e.key === "Enter") {
        navigate(`searchresults?search=${value}&isShowAll=${isShowAll === "isShowAll" ? true : false}`);
        setIsOpen(false);
        if (ref?.current?.value) {
          ref.current.value = "";
        }
      }
    }
  };
  const handleRecentSearch = (searchType, id) => {
    if (searchType === "Nft") {
      navigate(`productDetails/${id}`);
    } else {
      navigate(`brand/${id}`);
    }
    setIsOpen(false);
    if (ref?.current?.value) {
      ref.current.value = "";
    }
  };
  const debouncedOnChanged = debounce(handleSearch, 300);

  useEffect(() => {
    if (!recentSearch?.length) {
      setMatchingRecentSearch([]);
      return;
    }

    if (ref.current.value?.length >= 3 && searchText.length >= 3) {
      const matchingData = recentSearch.filter((item) => item?.name?.toLowerCase().includes(searchText.toLowerCase()));
      setMatchingRecentSearch(matchingData);
    } else {
      setMatchingRecentSearch(recentSearch);
    }
  }, [recentSearch, searchText]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        {/* ====================== SearchBar ====================== */}
        <Paper
          sx={{
            p: "0 4px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            color: `${theme.palette.mode === "dark" ? "#ffffff" : "black"}`,
            background: `${theme.palette.mode === "dark" ? "#010101" : "#ffffff"}`
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="menu">
            <SearchIcon sx={{ color: "#2F53FF" }} />
          </IconButton>
          {/* using this input bcz TextField was autofilling email on reload */}
          <input
            className="HeaderFonts"
            ref={ref}
            placeholder="search"
            onFocus={(e) => handleFocus(e)}
            onKeyDown={(e) => handleKeyPress(e)}
            onChange={(e) => debouncedOnChanged(e)}
            onClick={() => {
              dispatch(getRecentSearch({ setLoading, setIsOpen, isShowAll: isShowAll }));
            }}
            style={{
              width: "100%",
              border: "none",
              paddingTop: "8px",
              paddingBottom: "8px",
              background: "transparent",
              outline: "none",
              color: "currentcolor"
            }}
          />
        </Paper>
        {/* ====================== Search Results ====================== */}
        {isOpen && (
          <Box sx={{ marginTop: "1rem", borderRadius: "4px" }}>
            <StyledStack component="ul" padding={"10px"}>
              {/* ====================== Recent Search ====================== */}
              {loading ? (
                <StyledListHeading component="li">
                  <Stack sx={{ width: "260px" }} direction="row" alignItems={"center"} justifyContent={"space-between"}>
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#2196f3"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </Stack>
                </StyledListHeading>
              ) : (
                <>
                  {matchingRecentSearch?.length < 1 &&
                    searchResults?.brand?.length < 1 &&
                    searchResults?.nfts?.length < 1 && (
                      <StyledListHeading component="li" sx={{ width: "260px" }}>
                        {Icons.searchIconCustom}
                        <Typography
                          variant="h2"
                          ml={1}
                          sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                          gutterBottom
                        >
                          No result found
                        </Typography>
                      </StyledListHeading>
                    )}
                  {matchingRecentSearch?.length > 0 ? (
                    <>
                      <StyledListHeading component="li">
                        <Stack
                          sx={{ width: "100%" }}
                          direction="row"
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Typography
                            variant="h2"
                            sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                            gutterBottom
                          >
                            Recent
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: "#2F57FF", textDecoration: "underline", cursor: "pointer" }}
                            gutterBottom
                            onClick={() => {
                              setLoading(true);
                              if (token) {
                                dispatch(deleteRecentSearchNft({ setLoading, isShowAll: isShowAll }));
                              } else {
                                removeAllRecentData(dispatch, setLoading);
                              }
                              if (!searchResults?.brand?.length && !searchResults?.nfts?.length) {
                                setIsOpen(false);
                              }
                            }}
                          >
                            Clear all
                          </Typography>
                        </Stack>
                      </StyledListHeading>
                      <Stack sx={{ backgroundColor: "#64696B", borderRadius: "5px" }}>
                        {matchingRecentSearch.map((search, index) => {
                          return (
                            <StyledList key={index} component="div" zIndex={9} sx={{ cursor: "pointer" }}>
                              <img loading="lazy" srcSet={search.image} src={search.image} alt="thumnail" />
                              <Stack
                                sx={{ width: "100%" }}
                                direction="row"
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <Stack
                                  direction="column"
                                  spacing={0.05}
                                  width={"100%"}
                                  onClick={() => handleRecentSearch(search.searchType, search.searchId)}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                    gutterBottom
                                  >
                                    {search.name}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                    gutterBottom
                                  >
                                    {search.nftCount ? ` ${+search.nftCount} items` : "0 item"}
                                  </Typography>
                                </Stack>
                                <Stack
                                  onClick={() => {
                                    setLoading(true);
                                    if (token) {
                                      dispatch(
                                        deleteRecentSearchNft({ id: search.id, setLoading, isShowAll: isShowAll })
                                      );
                                    } else {
                                      removeRecentDataById(search.id, dispatch, setLoading);
                                    }
                                    if (
                                      !searchResults?.brand?.length &&
                                      !searchResults?.nfts?.length &&
                                      recentSearch?.length === 1
                                    ) {
                                      setIsOpen(false);
                                    }
                                  }}
                                >
                                  <CloseIcon sx={{ color: "#b9b9b9" }} />
                                </Stack>
                              </Stack>
                            </StyledList>
                          );
                        })}
                      </Stack>
                    </>
                  ) : null}
                  {/* ====================== Brand Search Results ====================== */}
                  {searchResults?.brand?.length > 0 && (
                    <>
                      <StyledListHeading component="li">
                        <Typography
                          variant="h2"
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
                            fontSize: "1rem",
                            fontWeight: 200,
                            fontFamily: "Dm Sans"
                          }}
                          gutterBottom
                        >
                          Brands
                        </Typography>
                      </StyledListHeading>
                      {searchResults.brand.map((search) => {
                        return (
                          <StyledList
                            component="li"
                            zIndex={9}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOnClickBrand(search, search.brandId)}
                          >
                            <img loading="lazy" srcSet={search.image} src={search.image} alt="thumnail" />
                            <Stack
                              sx={{ width: "100%" }}
                              direction="row"
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Stack direction="column" spacing={0.05}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                  gutterBottom
                                >
                                  {search.name}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                  gutterBottom
                                >
                                  {search.nftCount} items
                                </Typography>
                              </Stack>
                            </Stack>
                          </StyledList>
                        );
                      })}
                    </>
                  )}
                  {/* ====================== PNFT Search Results ====================== */}
                  {searchResults?.nfts?.length > 0 && (
                    <>
                      <StyledListHeading component="li">
                        <Typography
                          variant="h2"
                          sx={{
                            color: theme.palette.mode === "dark" ? "#ffffff" : "#333333",
                            fontSize: "1rem",
                            fontWeight: 200,
                            fontFamily: "Dm Sans"
                          }}
                          gutterBottom
                        >
                          Products
                        </Typography>
                      </StyledListHeading>
                      {searchResults.nfts.map((search) => {
                        return (
                          <StyledList
                            component="li"
                            zIndex={9}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOnClickNft(search, search.nftId)}
                          >
                            <img loading="lazy" srcSet={search.image} src={search.image} alt="thumnail" />
                            <Stack
                              sx={{ width: "100%" }}
                              direction="row"
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <Stack direction="column" spacing={0.05}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                  gutterBottom
                                >
                                  {search.name}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: theme.palette.mode === "dark" ? "#ffffff" : "#333333" }}
                                  gutterBottom
                                >
                                  {search.nftCount} items
                                </Typography>
                              </Stack>
                              <Typography variant="subtitle2">
                                {search?.salePrice
                                  ? Number(search?.salePrice).toFixed(2)
                                  : search?.price
                                    ? Number(search?.price).toFixed(2)
                                    : 0}

                                {search?.currencyType}
                              </Typography>
                            </Stack>
                          </StyledList>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </StyledStack>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchField;
