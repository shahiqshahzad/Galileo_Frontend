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
  Tooltip
} from "@mui/material";
import moment from "moment";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Avatar from "ui-component/extended/Avatar";
import { useNavigate } from "react-router-dom";
const BrandCategoryTable = ({ brandCategoriesList }) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
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
              {/*   <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Description</TableCell> */}

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

                    <TableCell align="left" sx={{ borderBottom: "none" }}>
                      <Tooltip placement="top" title="View NFT's">
                        <IconButton
                          className="color"
                          aria-label="detail"
                          size="large"
                          onClick={() => {
                            navigate(`/nftManagement/${row.CategoryId}/${row.BrandId}`, {
                              state: {
                                nft: row
                              }
                            });
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: "1.5rem" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      ) : (
        <>
          <Grid item>
            <Typography
              className="statustypo"
              style={{
                padding: "20px 20px 20px 70px",
                fontWeight: "500"
              }}
            >
              No Data Available
            </Typography>
          </Grid>
        </>
      )}
    </TableContainer>
  );
};

export default BrandCategoryTable;
