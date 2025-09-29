import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  Divider,
  Typography,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress
} from "@mui/material";
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOutlinedIcon from "assets/images/edit.png";

// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteOutlineOutlinedIcon from "assets/images/delete.png";
import DeleteCategoryDialog from "./deleteCategoryDialog";
import Avatar from "ui-component/extended/Avatar";
import moment from "moment";

const CategoryTable = ({ categoryList, page, limit, search, setAddUpdateOpen, setCategoryData }) => {
  const theme = useTheme();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryId, setCategoryId] = useState();
  return (
    <>
      <DeleteCategoryDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        categoryId={categoryId}
        page={page}
        limit={limit}
        search={search}
      />
      <DeleteCategoryDialog />
      <TableContainer>
        {categoryList.categories?.length === 0 || undefined ? (
          <>
            <Grid item>
              <Grid item>
                <Typography className="statustypo" style={{ padding: "20px 20px 20px 70px", fontWeight: "500" }}>
                  {" "}
                  No Data Available
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            {categoryList?.categories !== undefined || categoryList.categories?.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ borderBottom: "none" }}></TableCell>
                    <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                      Category name{" "}
                    </TableCell>
                    {/*   <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Location</TableCell>
                    <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Description</TableCell> */}

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

                <>
                  <TableBody>
                    {categoryList.categories !== undefined &&
                      categoryList.categories.map((row, index) => (
                        <React.Fragment key={index}>
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
                                <Avatar alt="Brand Image" src={row.image} sx={{}} />
                              </Grid>
                              <Grid item lg={6} className="tableName">
                                <Tooltip placement="top" title={row.name}>
                                  {row.name.length > 15 ? row.name.slice(0, 15) + "..." : row.name}
                                </Tooltip>
                              </Grid>
                            </TableCell>
                            {/*       <TableCell  className='tablecell' sx={{ textTransform: 'capitalize' ,  borderBottom: 'none'}}>
                                                        {row.location}
                                                    </TableCell>
                                                    <TableCell  className='tablecell' sx={{ textTransform: 'capitalize' ,  borderBottom: 'none'}}>
                                                        {row.description}
                                                    </TableCell> */}

                            <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                              {moment(row.createdAt).format("DD-MMM-YYYY")}
                            </TableCell>
                            <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                              {moment(row.updatedAt).format("DD-MMM-YYYY")}
                            </TableCell>
                            <TableCell sx={{ borderBottom: "none" }}>
                              <Stack direction="row" justifyContent="left">
                                <Tooltip placement="top" title="Edit">
                                  <IconButton
                                    className="color"
                                    aria-label="Edit"
                                    size="large"
                                    onClick={() => {
                                      setAddUpdateOpen(true);
                                      setCategoryData({
                                        id: row.id,
                                        name: row.name,
                                        description: row.description,
                                        image: null
                                      });
                                    }}
                                  >
                                    <img src={EditOutlinedIcon} alt="qwert" />
                                  </IconButton>
                                </Tooltip>
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
                                      setCategoryId(row.id);
                                    }}
                                  >
                                    <img src={DeleteOutlineOutlinedIcon} alt="asz" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                  </TableBody>
                </>
              </Table>
            ) : (
              <>
                <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
                  <Grid item>
                    <CircularProgress disableShrink size={"4rem"} />
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
        <Divider />
      </TableContainer>
    </>
  );
};

export default CategoryTable;
