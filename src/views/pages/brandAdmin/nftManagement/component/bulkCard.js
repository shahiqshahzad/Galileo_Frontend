import { useTheme } from "@mui/material/styles";
import { Card, Grid, CardActionArea, CardContent, Tooltip, Typography, Button } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { cloneDeep } from "lodash";

import DetailsDialog from "./details";
import { useState } from "react";
import EditReuqestNftDialog from "./editRequestNftDialog";
import { gridSpacing } from "store/constant";

const BulkCard = ({ nftData, bulkId }) => {
  const theme = useTheme();
  const [DetailsNftOpen, setDetailsNftOpen] = useState(false);
  const [DetailsNft, setDetailsNft] = useState();
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
  const [editNftRequestOpen, setEditRequestNftOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loader, setLoader] = useState(false);

  return (
    <>
      <DetailsDialog open={DetailsNftOpen} setOpen={setDetailsNftOpen} nftData={DetailsNft} />
      <EditReuqestNftDialog
        nftInfo={cloneDeep(nftInfo)}
        bulkId={bulkId}
        //   type={type}
        //   search={search}
        //   page={page}
        //   limit={limit}
        //   loader={loader}
        setLoader={setLoader}
        open={editNftRequestOpen}
        setOpen={setEditRequestNftOpen}
      />
      <Grid container spacing={gridSpacing} mt={2} sx={{ padding: "0px 16px" }}>
        {nftData.map((nftData, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                    <Grid item xs={8}>
                      {nftData?.status === "MINTED" && nftData?.isEditable === true && (
                        <>
                          <Button
                            className="fontstyling"
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: "5px" }}
                            onClick={() => {
                              setEditRequestNftOpen(true);
                              const length = nftData.asset.split("/").length;
                              const imageC = {
                                image: { name: nftData.asset.split("/")[length - 1] },
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
                                images: imageC,
                                asset: nftData.asset,
                                NFTImages: nftData.NFTImages,
                                threeDModelUrl: nftData.threeDModelUrl,
                                threeDFileName: nftData.threeDFileName,
                                animation_url: nftData?.animation_url,

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
                            Edit Request
                          </Button>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BulkCard;
