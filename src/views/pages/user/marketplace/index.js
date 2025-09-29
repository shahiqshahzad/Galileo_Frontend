/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
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
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/system";
import NFTS from "./component/nfts";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  getAllMarketplaceCategories,
  getAllMarketplaceNftsByCategory,
  updateAllMarketplaceCategories
} from "redux/marketplace/actions";
import { Icons } from "../../../../shared/Icons/Icons";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import SearchNormalIcon from "../../../../assets/images/icons/search-normal.svg";
import Divider from "@mui/material/Divider";
import { LoaderComponent } from "utils/LoaderComponent";
const Marketplace = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const location = useLocation();
  let categoryfiltered = location.state?.categoryfiltered;
  const marketplaceCategoriesRedux = useSelector((state) => state.marketplaceReducer.marketplaceCategories);
  const [marketplaceCategories, setMarketplaceCategories] = useState(marketplaceCategoriesRedux);
  const marketplaceNfts = useSelector((state) => state.marketplaceReducer.marketplaceNfts);
  const isShowAll = useSelector((state) => state.auth?.dropdown?.isShowAll);
  const [checked, setChecked] = useState([0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryIds, setCategoryIds] = useState([]);
  const [brandIds, setBrandIds] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState("");
  const [filterChips, setFilterChips] = useState([]);

  const [statusCode, setStatusCode] = useState();

  const closeHandler = () => {
    setToggleDrawer(false);
    setToggleDropDown("");
  };
  const handleToggle = (value) => () => {
    setStatusCode();
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
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
      const categoryIndex = categoryIds.findIndex((x) => x.id === category.id && x.categoryName === category.name);
      const brandIndex = brandIds.findIndex((x) => x.id === brand.id && x.brandName === brand.name);
      setCategoryIds(categoryIds.filter((cat, i) => i !== categoryIndex));
      setBrandIds(brandIds.filter((brand, i) => i !== brandIndex));

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
      setCategoryIds((prev) => [...prev, { id: category.id, categoryName: category.name }]);
      setBrandIds((prev) => [...prev, { id: brand.id, brandName: brand.name }]);

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

  const clearFilterChip = (clickedChip, clickedChipIndex) => {
    const updatedChips = filterChips.filter((chip) => {
      return chip.brandId !== clickedChip.brandId || chip.categoryId !== clickedChip.categoryId;
    });
    let updatedBrandIds = [...brandIds];
    updatedBrandIds.splice(clickedChipIndex, 1);
    let updatedCategoryIds = [...categoryIds];
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

  // const handleSearch = (e) => {
  //   if (e.target.value === '') {
  //     setMarketplaceCategories(marketplaceCategoriesRedux);
  //     return;
  //   }
  //   const query = e.target.value.toLowerCase();
  //   const filteredCategories = marketplaceCategoriesRedux.categories.filter((category) => {
  //     return category.name.toLowerCase().includes(query) || category.brands.some((brand) => { return brand.name.toLowerCase().includes(query) })
  //   });
  //   setMarketplaceCategories({ categories: filteredCategories });
  // };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      dispatch(getAllMarketplaceCategories());
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    dispatch(getAllMarketplaceCategories());
  }, []);

  useEffect(() => {
    if (location.state) {
      setCategoryId(location.state.category.id);
    }
  }, []);
  useEffect(() => {
    const newBrandIds = brandIds.map((item) => item.id);
    const newCategoryIds = categoryIds.map((item) => item.id) || [];

    categoryfiltered &&
      dispatch(
        getAllMarketplaceNftsByCategory({
          search: search,
          page: page,
          limit: limit,
          categoryId: categoryId,
          categoryIds: categoryId === 0 ? newCategoryIds : categoryId > 0 && [categoryId, ...newCategoryIds],
          isShowAll: isShowAll,
          setStatusCode: setStatusCode
        })
      );

    dispatch(
      getAllMarketplaceNftsByCategory({
        search: search,
        page: page,
        limit: limit,
        categoryId: categoryId,
        categoryIds: categoryId === 0 ? newCategoryIds : categoryId > 0 && [categoryId, ...newCategoryIds],
        brandIds: newBrandIds,
        isShowAll: isShowAll,
        setStatusCode: setStatusCode
      })
    );

    dispatch(
      getAllMarketplaceNftsByCategory({
        search: search,
        page: page,
        limit: limit,
        categoryId: categoryId,
        categoryIds: categoryId === 0 ? newCategoryIds : categoryId > 0 && [categoryId, ...newCategoryIds],
        brandIds: newBrandIds,
        isShowAll: isShowAll,
        setStatusCode: setStatusCode
      })
    );
  }, [page, limit, categoryId, categoryIds, brandIds, isShowAll, setStatusCode]);

  useEffect(() => {
    let tempCategories = [];

    if (marketplaceCategoriesRedux?.categories?.length > 0) {
      tempCategories = marketplaceCategoriesRedux.categories.map((category) => {
        // Map brands within each category and update 'checked' property
        const brands = category.brands.map((brand) => ({
          ...brand,
          checked: filterChips.some((chip) => chip.brandId === brand.id && chip.categoryId === category.id)
        }));

        // Return a new category object with updated brands
        return {
          ...category,
          brands
        };
      });
      setMarketplaceCategories({ categories: tempCategories });
    }
  }, [marketplaceCategoriesRedux]);

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
                  <img src={SearchNormalIcon} alt="" style={{ height: "20px", width: "20px" }} />
                </div>
                <TextField
                  className="app-text"
                  value={search}
                  variant="standard"
                  placeholder="Search by brand"
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
                  inputProps={{
                    style: { color: "white" },
                    onKeyPress: handleKeyPress
                  }}
                  onChange={(e) => handleSearch(e)}
                />
              </Paper>
            </ListItem>
            {marketplaceCategories?.categories?.length > 0 &&
              marketplaceCategories.categories
                .slice()
                .filter((category) => category.brands.length !== 0)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      sx={{ cursor: "pointer", paddingX: "24px" }}
                      onClick={() => setToggleDropDown((prev) => (prev === category.name ? "" : category.name))}
                    >
                      <ListItemText primaryTypographyProps={{ fontWeight: 600, fontFamily: theme?.typography.appText }}>
                        {category.name}
                      </ListItemText>
                      <Badge
                        badgeContent={category.brands.length > 0 ? category.brands.length : "0"}
                        sx={{
                          "& .MuiBadge-badge": {
                            color: "white",
                            backgroundColor: "#46494C",
                            fontSize: "12px",
                            fontFamily: theme?.typography.appText
                          },
                          marginRight: "12px"
                        }}
                      />
                      {toggleDropDown === category.name ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={toggleDropDown === category.name}>
                      <List sx={{ width: "100%", maxWidth: 360 }}>
                        {category.brands
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((value) => (
                            <ListItem key={value} sx={{ margin: "0px", paddingX: "24px", paddingY: 0 }}>
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
                                <ListItemText
                                  sx={{ fontFamily: theme?.typography.appText }}
                                  id={value}
                                  primary={`${value.name}`}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        <Divider variant="middle" orientation="horizontal" light />
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
        <Grid container sx={{ display: { xs: "block", sm: "block", md: "flex" }, marginBottom: "17px" }}>
          <Grid item md={12} xs={12} sx={{ mt: 2, paddingLeft: 1, paddingRight: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }} mb={2}>
              <ArrowBackIosIcon
                onClick={() => {
                  navigate("/home");
                }}
                sx={{ color: "#2F53FF", cursor: "pointer" }}
              />
              <Typography variant="h2" color="info" className="app-text">
                Marketplace
              </Typography>
            </Box>
            <Grid container>
              <Grid item md={12}>
                <Button
                  style={filterButtonStyle}
                  variant="contained"
                  color="info"
                  startIcon={Icons.FilterIconMarketPlace}
                  onClick={() => setToggleDrawer(true)}
                  className="app-text"
                >
                  Filter
                </Button>
                {filterChips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={`${chip.category}: ${chip.brandName}`}
                    onDelete={() => clearFilterChip(chip, index)}
                    sx={{ borderRadius: "2px", ml: "6px" }}
                  />
                ))}
              </Grid>
              <Grid item md={12} xs={12}>
                {/* <Tabs marketplaceCategories={marketplaceCategories} categoryId={categoryId} setCategoryId={setCategoryId} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {statusCode !== 200 ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <>
          <Grid item md={12} xs={12}>
            <NFTS marketplaceNfts={marketplaceNfts} categoryId={categoryId} />
          </Grid>
          {marketplaceNfts.pages > 1 && (
            <Grid sx={{ mt: 4, mb: 4, display: "flex", justifyContent: "right", gap: 2 }}>
              <Pagination
                page={page}
                count={marketplaceNfts.pages}
                onChange={(event, newPage) => {
                  setPage(newPage);
                  setStatusCode();
                }}
                variant="outlined"
                shape="rounded"
              />
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default Marketplace;
