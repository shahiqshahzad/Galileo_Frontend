import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Typography,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  TableRow,
  Tooltip,
  Stack,
  CircularProgress
} from "@mui/material";
import DeleteBrandAdminDialog from "./deleteBrandAdminDialog";
import Chip from "ui-component/extended/Chip";
import AddUpdateBrandAdminDialog from "./addUpdateBrandAdmin";
import ChangeBrandAdminStatusDialog from "./changeBrandAdminStatus";
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOutlinedIcon from "assets/images/edit.png";
import DeleteOutlineOutlinedIcon from "assets/images/delete.png";
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BlockIcon from "@mui/icons-material/Block";

const BrandAdminTable = ({
  addUpdateOpen,
  setAddUpdateOpen,
  search,
  page,
  limit,
  brandAdminList,
  setBrandAdminData,
  brandAdminData
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const theme = useTheme();

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [detailId, setDetailId] = useState();
  // const openDetails = (id) => {
  //   if (detailId === id) {
  //     setDetailId(null);
  //   } else {
  //     setDetailId(id);
  //   }
  // };

  return (
    <TableContainer>
      <AddUpdateBrandAdminDialog
        open={addUpdateOpen}
        setOpen={setAddUpdateOpen}
        brandAdminData={brandAdminData}
        page={page}
        limit={limit}
        search={search}
      />

      <DeleteBrandAdminDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        page={page}
        limit={limit}
        search={search}
        brandAdminData={brandAdminData}
      />

      <ChangeBrandAdminStatusDialog
        open={changeStatusOpen}
        setOpen={setChangeStatusOpen}
        page={page}
        limit={limit}
        search={search}
        brandAdminData={brandAdminData}
      />
      {brandAdminList?.admins === undefined ? (
        <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
          <Grid item>
            <CircularProgress disableShrink size={"4rem"} />
          </Grid>
        </Grid>
      ) : (
        <>
          {brandAdminList.count > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}></TableCell>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                    First Name
                  </TableCell>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Last Name
                  </TableCell>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Email
                  </TableCell>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ padding: "10px" }}>
                {brandAdminList.admins !== undefined &&
                  brandAdminList.admins.map((row, index) => (
                    <>
                      <TableRow>
                        <TableCell align="left" className="tableName" sx={{ textTransform: "capitalize" }}></TableCell>
                        <TableCell align="left" className="tableName" sx={{ textTransform: "capitalize" }}>
                          {row.firstName}
                        </TableCell>
                        <TableCell align="left" className="tableName" sx={{ textTransform: "capitalize" }}>
                          {row.lastName}
                        </TableCell>
                        <TableCell align="left" className="tableName">
                          {row.email}
                        </TableCell>

                        <TableCell align="left" sx={{ borderBottom: "none" }}>
                          {row.isActive === false ? (
                            <Chip className="app-text" label="Blocked" size="small" chipcolor="orange" />
                          ) : (
                            <Chip className="app-text" label="Unblocked" size="small" chipcolor="success" />
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: "none" }}>
                          <Stack direction="row" justifyContent="center" alignItems="center">
                            <Tooltip placement="top" title="Change Status">
                              <IconButton
                                className="color"
                                aria-label="Edit"
                                size="large"
                                onClick={() => {
                                  setChangeStatusOpen(true);
                                  setBrandAdminData({
                                    id: row.id,
                                    brandId: row.BrandId,
                                    isActive: row.isActive
                                  });
                                }}
                              >
                                <BlockIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip placement="top" title="Edit">
                              <IconButton
                                className="color"
                                aria-label="Edit"
                                size="large"
                                onClick={() => {
                                  setAddUpdateOpen(true);
                                  setBrandAdminData({
                                    id: row.id,
                                    brandId: row.BrandId,
                                    firstName: row.firstName,
                                    lastName: row.lastName,
                                    adminEmail: row.email,
                                    walletAddress: row.walletAddress,
                                    adminPassword: ""
                                  });
                                }}
                              >
                                <img src={EditOutlinedIcon} alt="sdd" />
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
                                  setBrandAdminData({
                                    id: row.id,
                                    brandId: row.BrandId
                                  });
                                }}
                              >
                                <img src={DeleteOutlineOutlinedIcon} alt="xd" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" className="tableName" sx={{ textTransform: "capitalize" }}></TableCell>
                      </TableRow>
                      <TableRow style={{ display: detailId !== row.id ? "none" : "" }}>
                        <TableCell sx={{ pl: 12 }} colSpan={12}>
                          <div>
                            <Grid container spacing={4}>
                              <Grid item xs={4} md={4}>
                                <Button
                                  variant="outlined"
                                  size="large"
                                  onClick={() => {
                                    setAddUpdateOpen(true);
                                    setBrandAdminData({
                                      id: row.id,
                                      brandId: row.BrandId,
                                      firstName: row.firstName,
                                      lastName: row.lastName,
                                      adminEmail: row.email,
                                      adminPassword: ""
                                    });
                                  }}
                                >
                                  Edit
                                </Button>
                              </Grid>
                              <Grid item xs={4} md={4}>
                                <Button
                                  variant="outlined"
                                  size="large"
                                  onClick={() => {
                                    setDeleteOpen(true);
                                    setBrandAdminData({
                                      id: row.id,
                                      brandId: row.BrandId
                                    });
                                  }}
                                >
                                  Delete
                                </Button>
                              </Grid>
                              <Grid item xs={4} md={4}>
                                <Button
                                  variant="outlined"
                                  size="large"
                                  onClick={() => {
                                    setChangeStatusOpen(true);
                                    setBrandAdminData({
                                      id: row.id,
                                      brandId: row.BrandId,
                                      isActive: row.isActive
                                    });
                                  }}
                                >
                                  Change Status
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
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

export default BrandAdminTable;
