import React, { memo } from "react";
import {
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
import { useTheme, styled } from "@mui/material/styles";
import moment from "moment";

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#272F34",
    color: "#FFFFFF",
    padding: "5px"
  }
});

const tableContainerStyles = {
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
};

const blurBgStyle = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  filter: "blur(1px)",
  position: "relative",
  backgroundColor: "rgba(0, 0, 0, 0.5)"
};

const tableHeadStyles = { background: "#252B2F" };
const tableRowStyles = { borderBottom: "1px solid #2F3235" };
const emptyStateStyles = { padding: "20px 70px", fontWeight: 500 };
const formatLocalDate = (dateString) => {
  const date = moment(dateString).format("hh:mm A");
  return date;
};
const ReaseSchedule = memo(({ ReleaseScheduled, statusCode }) => {
  const theme = useTheme();

  const headers = ["Order ID", "Created", "Delivered", "Release Scheduled", "Amount", "Withdraw Status"];
  console.log(ReleaseScheduled, "release");
  return (
    <TableContainer sx={tableContainerStyles}>
      <Table sx={statusCode === 0 ? blurBgStyle : {}}>
        <TableHead sx={tableHeadStyles}>
          <TableRow>
            {headers.map((heading, index) => (
              <TableCell
                className="HeaderFonts"
                key={index}
                align={index === 5 ? "right" : "left"}
                sx={{ borderBottom: "none", fontFamily: theme.typography.appText }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody sx={{ padding: "10px" }}>
          {statusCode === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : ReleaseScheduled.length ? (
            ReleaseScheduled.map((item, index) => (
              <TableRow key={index} sx={tableRowStyles}>
                {Object.keys(item).map((key, idx) => (
                  <TableCell
                    key={idx}
                    align={key === "withdrawStatus" ? "right" : "left"}
                    sx={{ borderBottom: "none", paddingLeft: key === "orderId" ? "5px" : undefined, cursor: "pointer" }}
                  >
                    <CustomTooltip
                      title={
                        key === "releaseSchedule" || key === "createdAt" || key === "deliveredAt"
                          ? formatLocalDate(item[key])
                          : String(item[key])
                      }
                    >
                      {item[key] === "N/A"
                        ? "N/A"
                        : key === "amount"
                          ? item[key].toFixed(2)
                          : key === "releaseSchedule" || key === "createdAt" || key === "deliveredAt"
                            ? moment(item[key]).format("M/DD/YYYY")
                            : String(item[key])}
                    </CustomTooltip>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <Grid item>
              <Typography sx={{ ...emptyStateStyles, fontFamily: theme.typography.appText }}>
                No Data Available
              </Typography>
            </Grid>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default ReaseSchedule;
