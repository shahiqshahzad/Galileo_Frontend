import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";
import BrandAdminTable from "./component/brandAdminTable";
import { Button, Typography, Grid, Pagination, OutlinedInput, InputAdornment } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { getAllBrandAdmin } from "../../../../../redux/brandAdmin/actions";
import MainCard from "ui-component/cards/MainCard";
import AddUpdateBrandAdminDialog from "./component/addUpdateBrandAdmin";

const BrandAdmin = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const brandAdminList = useSelector((state) => state.brandadminReducer.brandadminsList);

  const userData = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [addUpdateOpen, setAddUpdateOpen] = useState(false);
  const [brandAdminData, setBrandAdminData] = useState({
    id: null,
    brandId: location.state.brandData.id,
    firstName: "",
    lastName: "",
    adminEmail: "",
    adminPassword: "",
    walletAddress: ""
  });

  useEffect(() => {
    dispatch(
      getAllBrandAdmin({
        brandId: location.state.brandData.id,
        search: search,
        page: page,
        limit: limit
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);

  return (
    <>
      <AddUpdateBrandAdminDialog
        open={addUpdateOpen}
        setOpen={setAddUpdateOpen}
        brandAdminData={brandAdminData}
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
          userData?.user.role === "Sub Admin" ? (
            <Button
              className="buttonSize"
              sx={{ float: "right" }}
              variant="contained"
              size="large"
              onClick={() => {
                navigate("/brandsByAdmin");
              }}
            >
              Back
            </Button>
          ) : (
            <Button
              className="buttonSize"
              sx={{ float: "right" }}
              variant="contained"
              size="large"
              onClick={() => {
                navigate("/brands");
              }}
            >
              Back
            </Button>
          )
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
                sx={{ marginLeft: { lg: "38px", md: "38px" } }}
              >
                Admin Management of : {location.state.brandData.name}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={2}>
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
            <Grid item xs={12} lg={2} textAlign="start">
              <Button
                className="buttonSize"
                sx={{ marginLeft: { lg: "-16px", md: "-16px" } }}
                variant="contained"
                size="large"
                onClick={() => {
                  setAddUpdateOpen(true);
                  setBrandAdminData({
                    id: null,
                    brandId: location.state.brandData.id,
                    firstName: "",
                    lastName: "",
                    adminEmail: "",
                    adminPassword: "",
                    walletAddress: ""
                  });
                }}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        }
        content={false}
      >
        <BrandAdminTable
          brandAdminList={brandAdminList}
          search={search}
          page={page}
          limit={limit}
          addUpdateOpen={addUpdateOpen}
          setAddUpdateOpen={setAddUpdateOpen}
          brandAdminData={brandAdminData}
          setBrandAdminData={setBrandAdminData}
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
                  count={brandAdminList.pages}
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

export default BrandAdmin;
