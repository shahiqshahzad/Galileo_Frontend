import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
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
  Button
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChangeStatusDialog from "./changeStatus";

import Avatar from "ui-component/extended/Avatar";
import { Stack } from "@mui/system";

const DeliveryDashboard = ({ deliveryList, user }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [deliveryId, setDeliveryId] = useState(0);

  return (
    <>
      <ChangeStatusDialog
        setOpen={setOpen}
        open={open}
        user={user}
        setDeliveryId={setDeliveryId}
        deliveryId={deliveryId}
      />
      <TableContainer>
        <>
          {deliveryList?.length === 0 ? (
            <>
              <Grid item>
                <Typography
                  variant="h3"
                  style={{
                    padding: "20px",
                    fontWeight: "800",
                    color: theme.palette.mode === "light" ? " #000 " : "#98A2B2",
                    justifyContent: "center"
                  }}
                >
                  No Deliveries found.
                </Typography>
              </Grid>
            </>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ borderBottom: "none" }}></TableCell>
                  <TableCell align="left " className="Tableheading" sx={{ borderBottom: "none" }}>
                    Product name{" "}
                  </TableCell>
                  {/*   <TableCell   className='Tableheading' sx={{borderBottom:'none'}}>Location</TableCell> */}
                  {/*  <TableCell className="Tableheading" sx={{ borderBottom: 'none' }}>
                                        Description
                                    </TableCell> */}

                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Price
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Status
                  </TableCell>
                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Address
                  </TableCell>

                  <TableCell className="Tableheading" sx={{ borderBottom: "none" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {deliveryList !== undefined &&
                  deliveryList?.map((row, index) => (
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
                            <Avatar alt="Brand Image" src={row?.Nft?.asset} sx={{}} />
                          </Grid>
                          <Grid item lg={6} className="tableName">
                            {row?.Nft.name}
                          </Grid>
                        </TableCell>

                        {/*     <TableCell className="tablecell" sx={{ borderBottom: 'none' }}>
                                                    {row?.Nft.description}
                                                </TableCell> */}
                        <TableCell
                          className="tablecell"
                          sx={{
                            borderBottom: "none",
                            color: row?.status === "Delivered" ? "Green" : row?.status === "pending" ? "Blue" : "Orange"
                          }}
                        >
                          {row?.Nft?.price ? Number(row?.Nft?.price).toFixed(2) : 0} {row?.Nft.currencyType}
                        </TableCell>
                        <TableCell
                          className="tablecell"
                          sx={{
                            borderBottom: "none",
                            color: row?.status === "Delivered" ? "Green" : row?.status === "pending" ? "Blue" : "Orange"
                          }}
                        >
                          {row?.status}
                        </TableCell>
                        <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                          {row?.User?.address}
                        </TableCell>
                        <TableCell align="left" sx={{ borderBottom: "none" }}>
                          <Stack direction="row" justifyContent="left">
                            <Tooltip placement="top" title="Status">
                              <Button
                                variant="outlined"
                                sx={{ fontFamily: theme?.typography.appText, fontStyle: "normal" }}
                                endIcon={<SendIcon />}
                                disabled={row?.status === "Delivered" && true}
                                onClick={() => {
                                  if (row?.status !== "Delivered") {
                                    setOpen(true);
                                    setDeliveryId(row?.id);
                                  }
                                }}
                              >
                                Status
                              </Button>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          )}
        </>
        <Divider />
      </TableContainer>
    </>
  );
};

export default DeliveryDashboard;
