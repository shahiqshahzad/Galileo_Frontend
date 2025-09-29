/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { getAllMarketplaceCategories, getSearch, updateAllMarketplaceCategories } from "redux/marketplace/actions";
import { Icons } from "../../../shared/Icons/Icons";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Stack } from "@mui/system";

import SearchProducts from "./components/SearchProducts";
import { useTheme } from "@mui/styles";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BrandCard from "./components/BrandCard";
import { gridSpacing } from "store/constant";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0"
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));

const SearchResults = () => {
  const theme = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");
  const dispatch = useDispatch();
  const marketplaceCategoriesRedux = useSelector((state) => state.marketplaceReducer.marketplaceCategories);
  const [marketplaceCategories, setMarketplaceCategories] = useState(marketplaceCategoriesRedux);
  const isShowAll = useSelector((state) => state.auth?.dropdown?.isShowAll);

  const marketPlaceSearch = useSelector((state) => state.marketplaceReducer.marketPlaceSearch);
  const [checked, setChecked] = useState([0]);
  const [page, setPage] = useState(1);
  const [bPage, setBpage] = useState(1);
  const [limit] = useState(12);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryIds, setCategoryIds] = useState([]);
  const [brandIds, setBrandIds] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState("");
  const [filterChips, setFilterChips] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loader, setLoading] = useState(true);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [anchorEl, setAnchorEl] = useState(null);
  const openSortOptions = Boolean(anchorEl);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const closeHandler = () => {
    setToggleDrawer(false);
    setToggleDropDown("");
  };

  const filterButtonStyle = {
    backgroundColor: "#46494C",
    color: "white",
    fontWeight: "200"
  };

  const filterChipsByCategoryAndBrand = (category, brand) => {
    const filteredChips = filterChips.filter((chip) => {
      const categoryMatch = chip.categoryId !== category.id || chip.brandId !== brand.id;

      return categoryMatch;
    });

    return filteredChips;
  };

  const handleBrandToggle = (category, brand, event) => {
    const existsInFilterChips = filterChips.some(
      (chip) => chip.categoryId === category.id && chip.brandId === brand.id
    );

    if (existsInFilterChips) {
      const filteredChips = filterChipsByCategoryAndBrand(category, brand);
      setFilterChips(filteredChips);
      setCategoryIds((prev) => prev.filter((chip) => chip !== category.id));
      setBrandIds((prev) => prev.filter((chip) => chip !== brand.id));

      const updatedCategories = marketplaceCategories.categories.map((myCategory) => {
        if (myCategory.id === category.id) {
          const updatedBrands = myCategory.brands.map((myBrand) => {
            if (myBrand.id === brand.id) {
              return {
                ...myBrand,
                checked: event.target.checked
              };
            }
            return myBrand;
          });
          return {
            ...myCategory,
            brands: updatedBrands
          };
        }
        return myCategory;
      });

      dispatch(updateAllMarketplaceCategories({ categories: updatedCategories }));
    } else {
      setFilterChips((prev) => [
        ...prev,
        {
          category: category.name,
          categoryId: category.id,
          brandName: brand.name,
          brandId: brand.id
        }
      ]);
      setCategoryIds((prev) => [...prev, category.id]);
      setBrandIds((prev) => [...prev, brand.id]);

      const updatedCategories = marketplaceCategories.categories.map((myCategory) => {
        if (myCategory.id === category.id) {
          const updatedBrands = myCategory.brands.map((myBrand) => {
            if (myBrand.id === brand.id) {
              return {
                ...myBrand,
                checked: event.target.checked
              };
            }
            return myBrand;
          });
          return {
            ...myCategory,
            brands: updatedBrands
          };
        }
        return myCategory;
      });

      dispatch(updateAllMarketplaceCategories({ categories: updatedCategories }));
    }
  };
  const handleBrandPage = (event, value) => {
    setBpage(value);
  };
  const handleNftPage = (evenet, value) => {
    setPage(value);
  };
  const clearFilterChip = (clickedChip, clickedChipIndex) => {
    const updatedChips = filterChips.filter((chip) => {
      return chip.brandId !== clickedChip.brandId || chip.categoryId !== clickedChip.categoryId;
    });
    const updatedBrandIds = [...brandIds];
    updatedBrandIds.splice(clickedChipIndex, 1);
    setBrandIds(updatedBrandIds);
    const updatedCategoryIds = [...categoryIds];
    updatedCategoryIds.splice(clickedChipIndex, 1);
    setBrandIds(updatedBrandIds);
    setCategoryIds(updatedCategoryIds);
    setFilterChips(updatedChips);

    const updatedCategories = marketplaceCategories.categories.map((myCategory) => {
      if (myCategory.id === clickedChip.categoryId) {
        const updatedBrands = myCategory.brands.map((myBrand) => {
          if (myBrand.id === clickedChip.brandId) {
            return {
              ...myBrand,
              checked: false
            };
          }
          return myBrand;
        });
        return {
          ...myCategory,
          brands: updatedBrands
        };
      }
      return myCategory;
    });

    dispatch(updateAllMarketplaceCategories({ categories: updatedCategories }));
  };
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setMarketplaceCategories(marketplaceCategoriesRedux);
      return;
    }

    const query = e.target.value.toLowerCase();
    const filteredCategories = marketplaceCategoriesRedux.categories
      .map((category) => {
        const matchedBrands = category.brands.filter((brand) => {
          return brand.name.toLowerCase().includes(query);
        });

        if (category.name.toLowerCase().includes(query) || matchedBrands.length > 0) {
          return { ...category, brands: matchedBrands };
        }
        return null;
      })
      .filter((category) => category !== null);

    setMarketplaceCategories({ categories: filteredCategories });
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSort = (order) => {
    setAnchorEl(null);
    setOrder(order);
    setSort("price");
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (location.state) {
      setCategoryId(location.state.category.id);
    }
    dispatch(getAllMarketplaceCategories(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    setMarketplaceCategories(marketplaceCategoriesRedux);
  }, [marketplaceCategoriesRedux]);

  useEffect(() => {
    dispatch(
      getSearch({
        value: searchQuery,
        isShowAll: isShowAll,
        page: page,
        limit: limit,
        categoryId: categoryId,
        categoryIds: categoryIds,
        brandIds: brandIds,
        bPage,
        sort,
        order,
        setLoading
      })
    );
  }, [searchQuery, page, limit, categoryId, categoryIds, brandIds, bPage, order, sort, isShowAll]);

  return (
    <>
      <Drawer
        open={toggleDrawer}
        onClose={closeHandler}
        ModalProps={{
          BackdropProps: {
            style: { backgroundColor: "transparent" }
          }
        }}
      >
        <Box container sx={{ width: "300px" }}>
          <List>
            <ListItem sx={{ marginTop: "3rem", marginBottom: "1.5rem" }}>
              <Paper
                component="form"
                sx={{
                  p: "0 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  background: "#46494C",
                  borderRadius: "50px",
                  border: "1px solid #646769"
                }}
              >
                <div style={{ paddingTop: "7px", paddingRight: "5px", paddingBottom: "5px", paddingLeft: "10px" }}>
                  {Icons.filterSearchIcon}
                </div>
                <TextField
                  variant="standard"
                  placeholder="Search"
                  inputProps={{
                    style: { color: "white" },
                    onKeyPress: handleKeyPress
                  }}
                  onChange={(e) => handleSearch(e)}
                  sx={{
                    padding: "0",
                    margin: "0",
                    width: "100%",
                    border: "none",
                    ".MuiInputBase-input": {
                      paddingBottom: "5px"
                    },
                    ".MuiInputBase-root": {
                      border: "none",
                      "&.MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before": {
                        border: "none"
                      },
                      "&::hover": {
                        border: "none"
                      },
                      "&::before": {
                        border: "none"
                      },
                      "&::after": {
                        border: "none"
                      },
                      "& input::placeholder": {
                        color: "#FFFFFF"
                      }
                    }
                  }}
                />
              </Paper>
            </ListItem>
            {marketplaceCategories?.categories?.length > 0 &&
              marketplaceCategories.categories
                .filter((category) => category.brands.length !== 0)
                .map((category, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{ cursor: "pointer" }}
                      onClick={() => setToggleDropDown((prev) => (prev === category.name ? "" : category.name))}
                    >
                      <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>{category.name}</ListItemText>
                      <Badge
                        badgeContent={category.brands.length > 0 ? category.brands.length : "0"}
                        sx={{
                          "& .MuiBadge-badge": {
                            color: "white",
                            backgroundColor: "#46494C",
                            fontSize: "12px"
                          },
                          marginRight: "12px"
                        }}
                      />
                      {toggleDropDown === category.name ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={toggleDropDown === category.name}>
                      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                        {category.brands.map((value, index) => (
                          <ListItem key={index} sx={{ margin: "0px", padding: "0px", marginLeft: "1rem" }}>
                            <ListItemButton
                              role={undefined}
                              onClick={handleToggle(value)}
                              sx={{
                                margin: "0px",
                                padding: "0px",
                                "&:hover": {
                                  backgroundColor: "transparent"
                                },
                                ".MuiTouchRipple-root": {
                                  display: "none"
                                }
                              }}
                            >
                              <ListItemIcon sx={{ margin: "0px", padding: "0px" }}>
                                <Checkbox
                                  edge="start"
                                  // checked={checked.indexOf(value) !== -1}
                                  checked={value.checked}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ "aria-labelledby": value }}
                                  onChange={(e) => handleBrandToggle(category, value, e)}
                                />
                              </ListItemIcon>
                              <ListItemText id={value} primary={`${value.name}`} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                ))}
          </List>
        </Box>
      </Drawer>
      <Grid
        item
        md={12}
        lg={11}
        xs={12}
        style={{
          background: "tranparent",
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        <Grid container sx={{ display: { xs: "block", sm: "block", md: "flex" }, marginBottom: "40px" }}>
          <Grid item md={12} xs={12} sx={{ mt: 2, paddingLeft: 1, paddingRight: 2 }}>
            <Grid container>
              <Grid item md={10}>
                <Button
                  style={filterButtonStyle}
                  variant="contained"
                  color="info"
                  startIcon={Icons.FilterIconMarketPlace}
                  onClick={() => setToggleDrawer(true)}
                >
                  Filter
                </Button>
                {filterChips.map((chip, index) => (
                  <Chip
                    label={`${chip.category}: ${chip.brandName}`}
                    onDelete={() => clearFilterChip(chip, index)}
                    sx={{ borderRadius: "2px", ml: "6px" }}
                  />
                ))}
              </Grid>
              <Grid item md={2}>
                <Stack width="100%" direction="row" justifyContent="flex-end">
                  <Button
                    id="demo-customized-button"
                    aria-controls={openSortOptions ? "demo-customized-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSortOptions ? "true" : undefined}
                    variant="outlined"
                    sx={{
                      color: theme.palette.mode === "dark" ? "white" : "#404040",
                      borderColor: "#646769",
                      "&:hover": { borderColor: "#646769" }
                    }}
                    disableElevation
                    onClick={handleSortClick}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    {sort === "price" && order === "ASC"
                      ? "Price low to high"
                      : sort === "price" && order === "DESC"
                        ? "Price high to low"
                        : "Sort"}
                  </Button>
                  <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                      "aria-labelledby": "demo-customized-button"
                    }}
                    anchorEl={anchorEl}
                    open={openSortOptions}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleCloseSort("ASC")} disableRipple>
                      Price low to high
                    </MenuItem>
                    <Divider sx={{ margin: "0 !important" }} />
                    <MenuItem onClick={() => handleCloseSort("DESC")} disableRipple>
                      Price high to low
                    </MenuItem>
                  </StyledMenu>
                </Stack>
              </Grid>
              <Grid item md={12}>
                <Stack direction="row" spacing={2} alignItems="center" mt={4}>
                  <Typography variant="h2">Products</Typography>
                  <Typography variant="body2">
                    {marketPlaceSearch?.totalNftCount
                      ? `${marketPlaceSearch.nfts.length} items found `
                      : "0 item found"}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={12} xs={12}>
                <SearchProducts marketplaceNfts={marketPlaceSearch} />
              </Grid>
              {marketPlaceSearch?.nfts?.length > 0 && (
                <Grid container justifyContent="flex-end" mt={2} mr={1}>
                  <Pagination
                    count={marketPlaceSearch?.totalNftPages}
                    onChange={handleNftPage}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </Grid>
              )}

              {/* -----------Brands List------------------------- */}
              <Grid item md={12}>
                <Stack direction="row" spacing={2} alignItems="center" mt={4}>
                  <Typography variant="h2">Brands Results</Typography>
                  {/* <Typography variant="body2">
                    {marketPlaceSearch?.totalBrandCount
                      ? `${marketPlaceSearch?.totalBrandCount} items found `
                      : "0 item found"}
                  </Typography> */}
                </Stack>
              </Grid>

              <Grid item md={12} xs={12}>
                <Grid container-fluid="true" spacing={gridSpacing} sx={{ paddingRight: "0%" }}>
                  <Grid item xs={12}>
                    {marketPlaceSearch?.brand?.length > 0 ? (
                      <Grid
                        container
                        justifyContent="left"
                        spacing={gridSpacing}
                        sx={{ mt: 2, textAlign: "center", paddingRight: "1%" }}
                      >
                        {marketPlaceSearch?.brand?.map((item, i) => (
                          <BrandCard key={i} data={item} />
                        ))}
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            className="fontfamily"
                            variant="h3"
                            component="div"
                            sx={{
                              mt: { md: 8, lg: 8 },
                              textAlign: { xs: "center", md: "center", sm: "center", color: " #9498AA" }
                            }}
                          >
                            No results found
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {marketPlaceSearch?.brand?.length > 0 && (
                <Grid container justifyContent="flex-end" mt={2} mr={1}>
                  <Pagination
                    count={marketPlaceSearch?.totalBrandPages}
                    onChange={handleBrandPage}
                    page={bPage}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchResults;
