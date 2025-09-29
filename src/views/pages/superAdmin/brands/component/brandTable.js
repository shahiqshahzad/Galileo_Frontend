import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
  Typography,
  CircularProgress
} from "@mui/material";
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOutlinedIcon from "assets/images/edit.png";

// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteOutlineOutlinedIcon from "assets/images/delete.png";
import DeleteBrandDialog from "./deleteBrandDialog";
import Avatar from "ui-component/extended/Avatar";
import moment from "moment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const BrandTable = ({ brandsList, page, limit, search, setAddUpdateOpen, setBrandData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [brandId, setBrandId] = useState();
  return (
    <TableContainer>
      <DeleteBrandDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        brandId={brandId}
        page={page}
        limit={limit}
        search={search}
      />

      {brandsList?.brands !== undefined ? (
        <>
          {brandsList?.count > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ borderBottom: "none" }}></TableCell>
                  <TableCell align="left" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Brand name
                  </TableCell>
                  {/*   <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Location</TableCell>
                        <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Description</TableCell> */}

                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Created At
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Updated At
                  </TableCell>
                  <TableCell align="center" className="Tableheading" sx={{ borderBottom: "none" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  {brandsList.brands !== undefined &&
                    brandsList.brands.map((row, index) => (
                      <TableRow key={index}>
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
                            {row.name}
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
                        <TableCell className="tablecell" sx={{ borderBottom: "none", textTransform: "capitalize" }}>
                          <Stack direction="row" className="tablecell" justifyContent="center" alignItems="center">
                            <Tooltip placement="top" title="Brand Admin">
                              <IconButton
                                className="color"
                                aria-label="detail"
                                size="medium"
                                onClick={() => {
                                  navigate("/brands/admin", {
                                    state: {
                                      brandData: row
                                    }
                                  });
                                }}
                              >
                                <AccountCircleIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip placement="top" title="Brand Categories">
                              <IconButton
                                className="color"
                                aria-label="detail"
                                size="medium"
                                onClick={() => {
                                  navigate(`/brands/${row.id}/category`, {
                                    state: {
                                      brandData: row
                                    }
                                  });
                                }}
                              >
                                <DashboardIcon sx={{ fontSize: "1.5rem" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip placement="top" title="Edit">
                              <IconButton
                                className="color"
                                aria-label="Edit"
                                size="large"
                                onClick={() => {
                                  setAddUpdateOpen(true);
                                  setBrandData({
                                    id: row.id,
                                    name: row.name,
                                    description: row.description,
                                    location: row.location,
                                    image: null,
                                    instagram: row.socials?.instagram,
                                    medium: row.socials?.medium,
                                    telegram: row.socials?.telegram,
                                    website: row.socials?.website,
                                    facebook: row.socials?.facebook,
                                    twitter: row.socials?.twitter,
                                    linkedin: row.socials?.linkedin,
                                    email: row.socials?.email,
                                    phoneNumber: row.socials?.phoneNumber,
                                    discord: row.socials?.discord
                                  });
                                }}
                              >
                                <img src={EditOutlinedIcon} alt="assaa" />
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
                                  setBrandId(row.id);
                                }}
                              >
                                <img src={DeleteOutlineOutlinedIcon} alt="123" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
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
      ) : (
        <>
          <Grid container justifyContent="center" sx={{ width: "80%", m: "15px auto " }}>
            <Grid item>
              <CircularProgress size={"4rem"} />
            </Grid>
          </Grid>
        </>
      )}
    </TableContainer>
  );
};

export default BrandTable;
