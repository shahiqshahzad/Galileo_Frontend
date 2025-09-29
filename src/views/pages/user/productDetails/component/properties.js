import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { Grid, Typography, Tooltip, Pagination, Card, CardContent } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/BorderColorSharp";
import { gridSpacing } from "store/constant";
import EditPropertiesNew from "./EditPropertiesNew";
import { cloneDeep } from "lodash";
import moment from "moment";

const Properties = ({ nftList }) => {
  const theme = useTheme();
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const [id] = useState("");
  const buyerNft = useSelector((state) => state.nftReducer.nftBuyer);
  const [currentPage, setCurrentPage] = useState(1);

  const metaDataPerPage = 12;
  const indexofLastCard = currentPage * metaDataPerPage;
  const indexofFirstCard = indexofLastCard - metaDataPerPage;

  const metaDatapagination = nftList?.nft?.NFTMetaData.slice(indexofFirstCard, indexofLastCard);

  return (
    <>
      <EditPropertiesNew
        id={id}
        buyerNft={buyerNft}
        nftList={cloneDeep(nftList)}
        open={propertiesOpen}
        setOpen={setPropertiesOpen}
      />
      {/* <Edit
        nftList={nftList}
        open={propertiesOpen}
        id={id}
        setOpen={setPropertiesOpen}
        metadata={metadata}
        value={value}
        editable={editable}
        proofRequired={proofRequired}
      /> */}
      <Grid container-fluid="true" spacing={gridSpacing} sx={{ background: "#181C1F" }}>
        <Grid item xs={12} lg={12} md={12}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <Typography
                color={theme.palette.mode === "dark" ? "#FFFFFF" : "black"}
                className="productfigmastyl"
                variant="h2"
                component="div"
                sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
              >
                {buyerNft?.status === "Redeem" && nftList?.nft?.NFTMetaData.some((data) => data.isEditable) && (
                  <Tooltip placement="right" title="Edit Properties">
                    <ModeEditIcon
                      sx={{
                        marginLeft: "1em",
                        color: theme.palette.mode === "dark" ? "#bde2f0" : "#000"
                      }}
                      onClick={() => setPropertiesOpen(true)}
                    />
                  </Tooltip>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {nftList?.nft?.NFTMetaData?.length > 0 ? (
          <Grid
            item
            xs={12}
            sx={{ background: theme.palette.mode === "dark" ? "#181C1F" : "#fff", borderRadius: "5px" }}
            p={2}
          >
            <Grid container justifyContent="left" spacing={gridSpacing} sx={{ textAlign: "center" }}>
              {metaDatapagination
                .sort((a, b) => {
                  if (a?.trait_type === "Serial ID") return -1;
                  if (b?.trait_type === "Serial ID") return 1;
                  return 0;
                })
                ?.map((item, i) => (
                  <Grid key={i} item md={2} lg={2} xs={6} sm={2}>
                    <Card
                      className="card-style"
                      sx={{
                        background:
                          item?.trait_type === "Serial ID" && "linear-gradient(to top right, #2F53FF ,#2FC1FF)",
                        border: item?.trait_type === "Serial ID" ? "" : "2px solid rgb(47, 83, 255)"
                      }}
                    >
                      <CardContent sx={{ padding: "15px" }}>
                        <Tooltip placement="top" title={item?.trait_type}>
                          <Typography
                            className={item?.trait_type === "Serial ID" ? "Engine-deafult" : "Engine"}
                            style={{
                              color: theme.palette.mode === "dark" ? "#2194ff" : "#4a4848",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "100%",
                              textAlign: "center",
                              margin: "0 auto",
                              height: "2.5em"
                            }}
                            variant="h3"
                            sx={{ color: null }}
                          >
                            {item?.trait_type
                              ? item?.trait_type?.length > 11
                                ? item?.trait_type.slice(0, 12) + "..."
                                : item?.trait_type
                              : "0"}
                          </Typography>
                        </Tooltip>
                        <Tooltip
                          placement="bottom"
                          title={
                            item?.display_type === "Date" &&
                            moment(item?.value).format("ddd MMM DD YYYY") !== "Invalid Date"
                              ? moment(item?.value).format("ddd MMM DD YYYY")
                              : item?.value
                          }
                        >
                          <Typography
                            variant="h6"
                            className={item?.trait_type === "Serial ID" ? "centerText-default" : "centerText"}
                            sx={{
                              color: theme.palette.mode === "dark" ? "#fff" : "#252222",
                              cursor: "pointer",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "95%",
                              textAlign: "center",
                              margin: "0 auto"
                            }}
                          >
                            {item?.display_type === "Date" &&
                            moment(item?.value).format("ddd MMM DD YYYY") !== "Invalid Date"
                              ? moment(item?.value).format("ddd MMM DD YYYY")
                              : item?.value
                                ? item?.value?.length > 11
                                  ? item?.value.slice(0, 12) + "..."
                                  : item?.value
                                : "0"}
                          </Typography>
                        </Tooltip>
                        <Typography className="plight" variant="body2" mt={1}>
                          {nftList?.nft?.userAllowed === true && item?.Proofs[0]?.proof ? (
                            <>
                              {nftList?.nft?.hasPermission === true && nftList?.nft?.permissionExpTime === false ? (
                                <span
                                  onClick={() => {
                                    window.open(item?.Proofs[0]?.decryptedProof, "_blank");
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: theme.palette.mode === "dark" ? "#CDCDCD" : "darkgray",
                                    textDecoration: "underline"
                                  }}
                                >
                                  Proof of metadata
                                </span>
                              ) : (
                                <span
                                  style={{
                                    cursor: "pointer",
                                    color: theme.palette.mode === "dark" ? "#CDCDCD" : "darkgray",
                                    textDecoration: "underline"
                                  }}
                                >
                                  Access time expired
                                </span>
                              )}
                            </>
                          ) : (
                            <span style={{ color: "transparent" }}>no proof</span>
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Grid xs={12} mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              {nftList?.nft?.NFTMetaData?.length > 12 && (
                <Pagination
                  count={Math.ceil(nftList?.nft?.NFTMetaData?.length / metaDataPerPage)}
                  onChange={(event, value) => setCurrentPage(value)}
                  page={currentPage}
                  variant="outlined"
                  shape="rounded"
                />
              )}
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  className="fontfamily"
                  variant="h3"
                  mt={2}
                  component="div"
                  sx={{
                    textAlign: { xs: "center", md: "left", sm: "center" },
                    textTransform: "capitalize",
                    color: " #9498AA"
                  }}
                >
                  No Property Found.
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Properties;
