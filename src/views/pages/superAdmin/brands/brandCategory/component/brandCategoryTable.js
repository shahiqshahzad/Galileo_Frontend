import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  CircularProgress
} from "@mui/material";

import AddUpdateBrandCategoryDialog from "./addUpdateBrandCategory";
import DeleteBrandCategoryDialog from "./deleteBrandCategoryDialog";
import Avatar from "ui-component/extended/Avatar";
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOutlinedIcon from "assets/images/edit.png";

// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import DeleteOutlineOutlinedIcon from "assets/images/delete.png";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import moment from "moment";
import UpdateBrandCategory from "./UpdateBrandCategory";

const BrandCategoryTable = ({
  brandData,
  checked,
  setChecked,
  brandCategoriesList,
  search,
  page,
  limit,
  addUpdateOpen,
  setAddUpdateOpen,
  brandCategoryData,
  setDeactivateBrandOpen,
  deactivateBrandOpen,
  setBrandCategoryData
}) => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const [detailId, setDetailId] = useState();
  const theme = useTheme();
  const [updateBrandCategoryModal, setUpdateBrandCategoryModal] = useState(false);
  const [updateBrandCategoryData, setUpdateBrandCategoryData] = useState({});
  // const openDetails = (id) => {
  //   if (detailId === id) {
  //     setDetailId(null);
  //   } else {
  //     setDetailId(id);
  //   }
  // };

  return (
    <TableContainer>
      <AddUpdateBrandCategoryDialog
        open={addUpdateOpen}
        setOpen={setAddUpdateOpen}
        brandCategoryData={brandCategoryData}
        page={page}
        limit={limit}
        search={search}
      />

      <DeleteBrandCategoryDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        page={page}
        limit={limit}
        search={search}
        brandCategoryData={brandCategoryData}
      />
      <UpdateBrandCategory
        open={updateBrandCategoryModal}
        modalHandler={setUpdateBrandCategoryModal}
        brandCategoryData={updateBrandCategoryData}
      />
      {brandCategoriesList.brandCategories === undefined ? (
        <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
          <Grid item>
            <CircularProgress disableShrink size={"4rem"} />
          </Grid>
        </Grid>
      ) : (
        <>
          {brandCategoriesList.brandCategories !== undefined && brandCategoriesList.count > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ borderBottom: "none" }}></TableCell>
                  <TableCell align="left " className="Tableheading" sx={{ borderBottom: "none" }}>
                    Category name{" "}
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Profit Percentage
                  </TableCell>
                  {/* <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Description</TableCell> */}

                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Created At
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Updated At
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ padding: "10px" }}>
                {brandCategoriesList.brandCategories !== undefined &&
                  brandCategoriesList.brandCategories.map((row, index) => (
                    <>
                      <TableRow>
                        <TableCell align="right" sx={{ borderBottom: "none" }}></TableCell>
                        <TableCell
                          sx={{
                            display: "flex",
                            textTransform: "capitalize",
                            borderBottom: "none"
                          }}
                        >
                          <Grid item lg={6}>
                            <Avatar alt="Brand Image" src={row.Category.image} sx={{}} />
                          </Grid>
                          <Grid item lg={6} className="tableName">
                            {row.Category.name}
                          </Grid>
                        </TableCell>

                        <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                          {row.profitPercentage}%
                        </TableCell>
                        <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                          {moment(row.createdAt).format("DD-MMM-YYYY")}
                        </TableCell>
                        <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                          {moment(row.updatedAt).format("DD-MMM-YYYY")}
                        </TableCell>

                        <TableCell align="left" sx={{ padding: "0px", borderBottom: "none" }}>
                          <Stack direction="row">
                            {process.env.REACT_APP_ENVIRONMENT === "development" && (
                              <Tooltip
                                placement="top"
                                title={
                                  brandCategoriesList !== undefined && brandCategoriesList?.brand?.isActive === false
                                    ? "Deactivated"
                                    : "Active"
                                }
                              >
                                <IconButton
                                  color="primary"
                                  aria-label="detail"
                                  size="medium"
                                  onClick={() => {
                                    setDeactivateBrandOpen(true);
                                    setBrandCategoryData({
                                      categoryId: row.CategoryId,
                                      brandId: row.BrandId,
                                      profitPercentage: row.profitPercentage,
                                      contractAddress: row.contractAddress
                                    });
                                  }}
                                >
                                  <Switch
                                    checked={brandCategoriesList !== undefined && brandCategoriesList?.brand?.isActive}
                                    // onChange={(event) => setChecked(event.target.checked)}
                                    inputProps={{ "aria-label": "controlled" }}
                                    size="small"
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip placement="top" title="Edit">
                              <IconButton
                                sx={{ color: "#008b04" }}
                                aria-label="Edit"
                                size="large"
                                onClick={() => {
                                  setUpdateBrandCategoryModal(true);
                                  setUpdateBrandCategoryData(row);
                                }}
                              >
                                <img src={EditOutlinedIcon} alt="mmm" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip placement="top" title=" View NFT'S">
                              <IconButton
                                color="primary"
                                aria-label="detail"
                                size="medium"
                                onClick={() => {
                                  navigate(`/nftManagement/${row.CategoryId}/${row.BrandId}?pageNumber=1&filter=all`);
                                }}
                              >
                                <RemoveRedEyeIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            </Tooltip>

                            {process.env.REACT_APP_ENVIRONMENT === "development" && (
                              <Tooltip placement="top" title="Edit">
                                <IconButton
                                  sx={{ color: "#008b04" }}
                                  aria-label="Edit"
                                  size="large"
                                  onClick={() => {
                                    setAddUpdateOpen(true);
                                    setBrandCategoryData({
                                      categoryId: row.CategoryId,
                                      brandId: row.BrandId,
                                      profitPercentage: row.profitPercentage,
                                      contractAddress: row.contractAddress
                                    });
                                  }}
                                >
                                  <img src={EditOutlinedIcon} alt="lll" />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip placement="top" title="Delete">
                              <IconButton
                                color="primary"
                                sx={{
                                  color: theme.palette.orange.dark,
                                  borderColor: theme.palette.orange.main,
                                  "&:hover ": { background: theme.palette.orange.light }
                                }}
                                size="large"
                                onClick={() => {
                                  setDeleteOpen(true);
                                  setBrandCategoryData({
                                    categoryId: row.CategoryId,
                                    brandId: row.BrandId
                                  });
                                }}
                              >
                                <img src={DeleteOutlineOutlinedIcon} alt="qas" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <>
              <Grid item>
                <Typography className="statustypo" style={{ padding: "20px 20px 20px 70px", fontWeight: "500" }}>
                  {" "}
                  No Data Available
                </Typography>
              </Grid>
            </>
          )}
        </>
      )}
    </TableContainer>
  );
};

export default BrandCategoryTable;
