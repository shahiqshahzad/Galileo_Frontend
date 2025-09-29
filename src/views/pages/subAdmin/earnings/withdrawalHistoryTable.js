import React from "react";
import moment from "moment";
import { Stack } from "@mui/system";
import { Icons } from "shared/Icons/Icons";
import { Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WithdrawalHistoryTable = ({ escrowHistory }) => {
  const theme = useTheme();
  return (
    <TableContainer
      sx={{
        background: "#181C1F",
        padding: "1em",
        maxHeight: "400px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "0.4em"
        },
        "&::-webkit-scrollbar-track": {
          "-webkit-box-shadow": "inset 0 0 6px gray"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray"
        }
      }}
    >
      <Table>
        <TableHead sx={{ background: "#252B2F" }}>
          <TableRow>
            <TableCell align="left" sx={{ fontSize: "19px !important", borderBottom: "none", fontFamily: "DM Sans" }}>
              Date
            </TableCell>
            <TableCell sx={{ fontSize: "19px !important", borderBottom: "none", fontFamily: "DM Sans" }}>
              Activity
            </TableCell>
            <TableCell sx={{ fontSize: "19px !important", borderBottom: "none", fontFamily: "DM Sans" }}>
              Transaction
            </TableCell>
            <TableCell align="right" sx={{ fontSize: "19px !important", borderBottom: "none", fontFamily: "DM Sans" }}>
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ padding: "10px" }}>
          {escrowHistory?.length ? (
            escrowHistory?.map((item, index) => (
              <TableRow key={index} sx={{ borderBottom: "1px solid #2F3235" }}>
                <TableCell
                  sx={{
                    display: "flex",
                    textTransform: "capitalize",
                    borderBottom: "none",
                    paddingLeft: "5px"
                  }}
                >
                  <Grid item lg={6} className="tableName app-text">
                    {moment.unix(item.blockTimestamp).format("MM/DD/YYYY")}
                  </Grid>
                </TableCell>

                <TableCell className="tablecell" sx={{ borderBottom: "none" }}>
                  <Stack
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                      fontFamily: theme?.typography.appText
                    }}
                  >
                    {Icons.withdrawArrowDown} {item.type === "withdraw" ? "Withdrawal Amount" : "Refund Processed"}
                  </Stack>
                </TableCell>
                <TableCell
                  className="tablecell"
                  onClick={() => window.open(item.transactionHash, "_blank")}
                  sx={{
                    borderBottom: "none",
                    cursor: "pointer",
                    color: "#2F53FF !important",
                    fontFamily: theme?.typography.appText
                  }}
                >
                  Link
                </TableCell>
                <TableCell
                  align="right"
                  className="tablecell"
                  sx={{ borderBottom: "none", fontFamily: theme?.typography.appText }}
                >
                  ${item.tokenAmounts}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <Grid item>
              <Typography
                className="statustypo"
                style={{ padding: "20px 20px 20px 70px", fontWeight: "500", fontFamily: theme?.typography.appText }}
              >
                No Data Available
              </Typography>
            </Grid>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WithdrawalHistoryTable;
