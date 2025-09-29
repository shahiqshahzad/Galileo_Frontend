import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gridSpacing } from "store/constant";
import SubAdminTable from "./component/subAdminTable";
import { Button, Grid, Pagination, OutlinedInput, InputAdornment, Typography } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import { getAllSubAdminList } from "../../../../redux/subAdmin/actions";
import MainCard from "ui-component/cards/MainCard";
import AddUpdateSubAdminDialog from "./component/addUpdateSubAdmin";
import HeadingCard from "shared/Card/HeadingCard";
import { getAllBrandCategoriesAdmin } from "redux/brandCategory/actions";

const SubAdmin = () => {
  const dispatch = useDispatch();
  const subAdminList = useSelector((state) => state.subAdminReducer.subAdminList);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [addUpdateOpen, setAddUpdateOpen] = useState(false);
  const [subAdminData, setSubAdminData] = useState({
    id: null,
    adminEmail: "",
    walletAddress: "",
    role: "",
    isActive: "",
    hasMintingAccess: "",
    contractAddress: ""
  });

  useEffect(() => {
    dispatch(
      getAllSubAdminList({
        search: search,
        page: page,
        limit: limit
      }),
      dispatch(getAllBrandCategoriesAdmin())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, limit]);

  return (
    <>
      <AddUpdateSubAdminDialog
        open={addUpdateOpen}
        setOpen={setAddUpdateOpen}
        subAdminData={subAdminData}
        page={page}
        limit={limit}
        search={search}
      />
      <HeadingCard title="Admin Management" />

      <MainCard
        className="tableShadow"
        title={
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Typography
                className="mainheading"
                variant="h1"
                component="h2"
                sx={{ marginLeft: { lg: "38px", md: "38px" } }}
              >
                Admins
              </Typography>
            </Grid>
            <Grid item xs={6} lg={2}>
              <OutlinedInput
                variant="standard"
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
            <Grid item xs={6} lg={2} textAlign="start">
              <Button
                className="buttonSize "
                sx={{ marginLeft: { lg: "-16px", md: "-16px" } }}
                variant="contained"
                size="large"
                onClick={() => {
                  setAddUpdateOpen(true);
                  setSubAdminData({
                    id: null,
                    adminEmail: "",
                    walletAddress: "",
                    role: "",
                    isActive: ""
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
        <SubAdminTable
          subAdminList={subAdminList}
          search={search}
          page={page}
          limit={limit}
          addUpdateOpen={addUpdateOpen}
          setAddUpdateOpen={setAddUpdateOpen}
          subAdminData={subAdminData}
          setSubAdminData={setSubAdminData}
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
                  count={subAdminList.pages}
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

export default SubAdmin;
