import { useTheme } from "@mui/material/styles";
import { Card, Grid, CardActionArea, CardContent, Tooltip, Typography, Button, Stack } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";

import DetailsDialog from "views/pages/brandAdmin/nftManagement/component/details";
import { useState } from "react";
import RejectEditNftDialog from "./rejectEditRequest";
import ApproveEditNftDialog from "./ApproveEditRequest";
import { gridSpacing } from "store/constant";
import MainCard from "./mainCard";
import EditRequestNftDialog from "views/pages/brandAdmin/nftManagement/component/editRequestNftDialog";
import { cloneDeep } from "lodash";
import { Icons } from "shared/Icons/Icons";

const BulkCard = ({ nftData, bulkId, categoryId }) => {
  const theme = useTheme();
  const [DetailsNftOpen, setDetailsNftOpen] = useState(false);
  const [DetailsNft, setDetailsNft] = useState();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [editMintedNftOpen, setEditMintedNftOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const [nftInfo, setNftInfo] = useState({
    id: null,
    brandId: null,
    nftName: "",
    nftDescription: "",
    nftPrice: 0,
    mintType: "directMint",
    currencyType: nftData?.currencyType,
    fieldDataArray: [],
    fileDataArray: [],
    Proof: [],
    images: [],
    asset: "",
    NFTImages: [],
    threeDModelUrl: null,
    threeDFileName: null,
    animation_url: null,

    // values for fulfillment detail
    shippingCalculationMethod: null,
    flatRateShippingCost: null,
    noExternalCostForMultipleCopies: false,
    weight: null,
    height: null,
    length: null,
    breadth: null,
    warehouseAddressId: null,
    supportedCarrier: null,
    modeOfShipment: null,

    shippingCostAdjustment: null,
    isPurchaseAllowed: false,
    fallBackShippingAmount: null
  });

  return (
    <>
      <DetailsDialog open={DetailsNftOpen} setOpen={setDetailsNftOpen} nftData={DetailsNft} />

      <RejectEditNftDialog
        nftData={nftData}
        bulkId={bulkId}
        // type={type}
        // search={search}
        // page={page}
        // limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={rejectOpen}
        setOpen={setRejectOpen}
      />
      <ApproveEditNftDialog
        bulkId={bulkId}
        nftData={nftData}
        // type={type}
        // search={search}
        // page={page}
        // limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={approveOpen}
        setOpen={setApproveOpen}
      />

      <EditRequestNftDialog
        nftInfo={cloneDeep(nftInfo)}
        bulkId={bulkId}
        setLoader={setLoader}
        open={editMintedNftOpen}
        setOpen={setEditMintedNftOpen}
        editAndApprove={true}
      />

      <Grid container spacing={gridSpacing} mt={2} sx={{ padding: "0px 16px" }}>
        {nftData.map((nftData, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <MainCard
              className="tableShadow"
              content={false}
              boxShadow
              sx={{
                position: "relative",
                "&:hover": {
                  transform: "scale3d(1.02, 1.02, 1)",
                  transition: "all .4s ease-in-out"
                }
              }}
            >
              <Card
                sx={{
                  color: theme.palette.mode === "dark" ? "white" : "#404040",
                  background: theme.palette.mode === "dark" ? "#181C1F" : "white",
                  // maxWidth: nfts && nfts?.length > 3? 0 : 365,

                  width: "100%",
                  maxHeight: "435px",
                  // boxShadow: '1px 2px 6px #d3d3d3',
                  borderRadius: "3px",
                  marginBottom: "10px",
                  maxWidth: { xl: "100%" }
                }}
              >
                <CardActionArea>
                  <CardMedia component="img" height="220" sx={{ objectFit: "scale-down" }} image={nftData?.asset} />

                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={9}>
                        <Tooltip placement="left" title={nftData.name}>
                          <Typography
                            variant="subtitle1"
                            className="fontstyling encap-nft"
                            sx={{ textDecoration: "none", textTransform: "capitalize" }}
                          >
                            {nftData.name}
                          </Typography>
                        </Tooltip>
                      </Grid>

                      <Grid item xs={12} mt={-1.5}>
                        <Tooltip placement="left" title={nftData?.description}>
                          <Typography
                            className="fontstyling encap-nft"
                            variant="body1"
                            sx={{
                              overflow: "hidden",
                              height: 16,
                              textTransform: "capitalize"
                            }}
                          >
                            {nftData.description}
                          </Typography>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {nftData.NFTTokens[0]?.serialId ? nftData.NFTTokens[0]?.serialId : "Draft"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Grid item xs={12}>
                          <Typography variant="h6" className="fontstyling">
                            {nftData?.price ? Number(nftData?.price).toFixed(2) : 0} {nftData?.currencyType}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" className="fontstyling">
                            {nftData.NFTTokens.length} Items
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            marginRight: "10px",
                            float: "right",
                            ":hover": {
                              boxShadow: "none"
                            },
                            color: "#2F5AFF",
                            background: "#B9DDFF"
                          }}
                          onClick={() => {
                            setDetailsNftOpen(true);
                            setDetailsNft(nftData);
                          }}
                        >
                          Details
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <Stack direction="row" justifyContent="start" alignItems="center">
                          {nftData.editStatus === "temp" && (
                            //  && nftData?.isEditable == true
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginRight: "5px" }}
                              onClick={() => {
                                setRejectOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                          )}
                          {nftData.editStatus === "temp" && (
                            // && nftData?.isEditable == true
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginRight: "5px" }}
                              onClick={() => {
                                setApproveOpen(true);
                              }}
                            >
                              Approve
                            </Button>
                          )}
                          {nftData?.status === "MINTED" && (
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ marginRight: "5px" }}
                              onClick={() => {
                                setEditMintedNftOpen(true);
                                const image = {
                                  image: { name: nftData.asset.split("/").pop() },
                                  quantity: nftData.NFTTokens.length
                                };
                                setNftInfo({
                                  id: nftData.id,
                                  brandId: nftData.Brand.id,
                                  nftName: nftData.name,
                                  nftDescription: nftData.description,
                                  nftPrice: nftData.price,
                                  mintType: nftData.mintType,
                                  currencyType: nftData.currencyType,
                                  fieldDataArray: nftData.NFTMetaData,
                                  fileDataArray: nftData.NFTMetaFiles,
                                  Proof: nftData.NFTMetaData,
                                  images: image,
                                  asset: nftData.asset,
                                  NFTImages: nftData.NFTImages,
                                  threeDModelUrl: nftData.threeDModelUrl,
                                  threeDFileName: nftData.threeDFileName,
                                  animation_url: nftData?.animation_url,
                                  ipfsUrl: nftData?.ipfsUrl,
                                  categoryId: categoryId,

                                  // values for fulfillment detail
                                  shippingCalculationMethod: nftData?.shippingCalculationMethod,
                                  flatRateShippingCost: nftData?.flatRateShippingCost,
                                  noExternalCostForMultipleCopies: nftData?.noExternalCostForMultipleCopies,
                                  weight: nftData?.weight,
                                  height: nftData?.height,
                                  length: nftData?.length,
                                  breadth: nftData?.breadth,
                                  warehouseAddressId: nftData?.warehouseAddressId,
                                  supportedCarrier: nftData?.supportedCarrier,
                                  modeOfShipment: nftData?.modeOfShipment,

                                  shippingCostAdjustment: nftData?.shippingCostAdjustment,
                                  isPurchaseAllowed: nftData?.isPurchaseAllowed,
                                  fallBackShippingAmount: nftData?.fallBackShippingAmount
                                });
                              }}
                            >
                              {Icons.editNft}
                            </Button>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </CardActionArea>
              </Card>
            </MainCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BulkCard;
