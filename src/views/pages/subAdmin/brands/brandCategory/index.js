import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";
import BrandCategoryTable from "./component/brandCategoryTable";
import { Button, Typography, Grid, Pagination, OutlinedInput, InputAdornment } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { getAllBrandCategoriesByAdmin } from "../../../../../redux/brandCategory/actions";
import MainCard from "ui-component/cards/MainCard";
import AddUpdateBrandCategoryDialog from "./component/addUpdateBrandCategory";

const BrandCategory = () => {
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const brandCategoriesList = useSelector((state) => state.brandCategoryReducer.brandCategoriesByAdminList);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [addUpdateOpen, setAddUpdateOpen] = useState(false);
  const [brandCategoryData, setBrandCategoryData] = useState({
    brand: location?.state?.brandData,
    brandId: location?.state?.brandData.id,
    categoryId: 0,
    profitPercentage: ""
  });

  useEffect(() => {
    dispatch(
      getAllBrandCategoriesByAdmin({
        brandId: location?.state?.brandData?.id,
        search: search,
        page: page,
        limit: limit,
        adminId: user.id
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);

  return (
    <>
      <AddUpdateBrandCategoryDialog
        open={addUpdateOpen}
        setOpen={setAddUpdateOpen}
        brandCategoryData={brandCategoryData}
        page={page}
        limit={limit}
        search={search}
      />
      <MainCard
        className="Adminheading"
        title={
          <Typography
            variant="h1"
            component="h2"
            className="headingcard"
            sx={{
              marginTop: "10px",
              fontWeight: 600,
              marginLeft: { lg: "-20px", md: "-20px" },
              background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
              color: theme.palette.mode === "dark" ? "white" : "#404040"
            }}
          >
            Brand Management
          </Typography>
        }
        secondary={
          <Button
            className="buttonSize"
            sx={{ float: "right" }}
            variant="contained"
            size="large"
            onClick={() => {
              if (user?.role === "Sub Admin") {
                navigate("/brandsByAdmin");
              } else {
                navigate("/brands");
              }
            }}
          >
            Back
          </Button>
        }
        content={false}
      ></MainCard>

      <MainCard
        className="tableShadow"
        title={
          <Grid container spacing={4}>
            <Grid item xs={6} lg={8}>
              <Typography
                className="mainheading"
                variant="h1"
                component="h2"
                sx={{ marginLeft: { lg: "48px", md: "48px" } }}
              >
                Category Management of : {location?.state?.brandData?.name}
              </Typography>
            </Grid>
            <Grid item xs={3} lg={2}>
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
            {/* <Grid item xs={3} lg={2} textAlign="start">
                        <Button className='buttonSize' sx={{marginLeft:{lg:'-16px', md:'-16px'}}}
                            variant="contained"
                            size="large"
                            onClick={() => {
                                setAddUpdateOpen(true);
                                setBrandCategoryData({
                                    brand: location.state.brandData,
                                    brandId: location.state.brandData.id,
                                    categoryId: 0,
                                    profitPercentage: ''
                                });
                                dispatch(getAllCategoriesDropdown({ brandId: location.state.brandData.id }));
                            }}
                        >
                        Create
                        </Button>
                    </Grid> */}
          </Grid>
        }
        content={false}
      >
        <BrandCategoryTable
          brandCategoriesList={brandCategoriesList}
          search={search}
          page={page}
          limit={limit}
          addUpdateOpen={addUpdateOpen}
          setAddUpdateOpen={setAddUpdateOpen}
          brandCategoryData={brandCategoryData}
          setBrandCategoryData={setBrandCategoryData}
        />

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

export default BrandCategory;
