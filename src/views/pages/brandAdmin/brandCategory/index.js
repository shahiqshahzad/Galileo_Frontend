import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gridSpacing } from "store/constant";
import BrandCategoryTable from "./component/brandCategoryTable";
import { Grid, Pagination, OutlinedInput, InputAdornment, Typography } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { getAllBrandCategories } from "../../../../redux/brandCategory/actions";
import MainCard from "ui-component/cards/MainCard";
import HeadingCard from "shared/Card/HeadingCard";

const Categories = () => {
  const dispatch = useDispatch();
  const brandCategoriesList = useSelector((state) => state.brandCategoryReducer.brandCategoriesList);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    dispatch(
      getAllBrandCategories({
        brandId: user.BrandId,
        search: search,
        page: page,
        limit: limit
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);
  return (
    <>
      <HeadingCard title=" Category Management" />

      <MainCard
        className="tableShadow"
        title={
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Typography
                className="mainheading"
                variant="h1"
                component="h2"
                sx={{ marginLeft: { lg: "48px", md: "48px" } }}
              >
                Categories
              </Typography>
            </Grid>
            <Grid item xs={12} lg={4}>
              <OutlinedInput
                id="input-search-list-style1"
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="1rem" />
                  </InputAdornment>
                }
                size="small"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        }
        content={false}
      >
        <BrandCategoryTable brandCategoriesList={brandCategoriesList} />

        <>
          <Grid item xs={12} sx={{ p: 3 }}>
            <Grid container justifyContent="center" spacing={gridSpacing}>
              <Grid item>
                <Pagination
                  color="primary"
                  showFirstButton
                  showLastButton
                  page={page}
                  count={brandCategoriesList.pages}
                  onChange={(event, newPage) => {
                    setPage(newPage);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      </MainCard>
    </>
  );
};

export default Categories;
