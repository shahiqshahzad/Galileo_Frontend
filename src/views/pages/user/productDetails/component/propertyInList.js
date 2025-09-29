import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import moment from "moment";

export default function PropertyInList({ nftList }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const metaDataPerPage = 30;

  const indexofLastCard = currentPage * metaDataPerPage;
  const indexofFirstCard = indexofLastCard - metaDataPerPage;
  const metaDatapagination = nftList?.nft?.NFTMetaData.slice(indexofFirstCard, indexofLastCard);

  return (
    <>
      <TableContainer component={Paper} sx={{ pt: 2, pl: 3, pr: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {metaDatapagination.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="center"></TableCell>
                <TableCell className="centerText" sx={{ color: "#FFFFFF", width: "50%" }} align="center">
                  {row?.trait_type}
                </TableCell>
                <TableCell className="centerText" sx={{ color: "#FFFFFF", width: "50%" }} align="center">
                  {row?.display_type === "Date" && moment(row?.value).format("ddd MMM DD YYYY") !== "Invalid Date"
                    ? moment(row?.value).format("ddd MMM DD YYYY")
                    : row?.value
                      ? row?.value
                      : "0"}
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack sx={{ m: 3 }}>
        {nftList?.nft?.NFTMetaData?.length > metaDataPerPage && (
          <Pagination
            className="app-text"
            sx={{ display: "flex", justifyContent: "center" }}
            count={Math.ceil(nftList?.nft?.NFTMetaData?.length / metaDataPerPage)}
            onChange={(event, value) => setCurrentPage(value)}
            page={currentPage}
            variant="outlined"
            shape="rounded"
          />
        )}
      </Stack>
    </>
  );
}
