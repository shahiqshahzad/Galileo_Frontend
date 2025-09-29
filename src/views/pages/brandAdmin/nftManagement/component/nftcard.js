import { useState } from "react";
import {
  Button,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  CardActionArea,
  Card,
  Tooltip,
  Box
} from "@mui/material";
import MainCard from "./mainCard";
import EditNftDialog from "./editNft/editNftDialog";
import RequestForMintDialog from "./requestForMintDialog";
import DeleteNFTDialog from "./deleteNftDialog";
import DetailsDialog from "./details";
import { useTheme } from "@mui/material/styles";
import EditRequestDialog from "./editRequestNftDialog";
import { useEffect } from "react";
import { cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ViewRejectReasonDialog from "./viewRejectReasonDialog";
import { LoaderComponent } from "utils/LoaderComponent";

const NftCard = ({ nftData, categoryId, search, page, limit, type }) => {
  const [loader, setLoader] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [openRequestMint, setOpenRequestMint] = useState(false);
  const [editNftOpen, setEditNftOpen] = useState(false);
  const [editNftRequestOpen, setEditRequestNftOpen] = useState(false);
  const [deleteNftOpen, setDeleteNftOpen] = useState(false);

  const [DetailsNftOpen, setDetailsNftOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [image, setImage] = useState([]);
  const [viewReason, setViewReason] = useState(false);
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
    ipfsUrl: "",
    NFTImages: [],
    threeDModelUrl: null,
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

  useEffect(() => {
    const length = nftData.asset.split("/").length;
    setImage([
      {
        image: { name: nftData.asset.split("/")[length - 1] },
        quantity: nftData.NFTTokens.length
      }
    ]);
  }, [nftData]);
  return (
    <>
      <DeleteNFTDialog
        nftInfo={nftInfo}
        categoryId={categoryId}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={deleteNftOpen}
        setOpen={setDeleteNftOpen}
      />

      <ViewRejectReasonDialog nftData={nftData} open={viewReason} setOpen={setViewReason} />
      <EditNftDialog
        nftInfo={cloneDeep(nftInfo)}
        categoryId={categoryId}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={editNftOpen}
        setOpen={setEditNftOpen}
      />

      <EditRequestDialog
        nftInfo={cloneDeep(nftInfo)}
        categoryId={categoryId}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={editNftRequestOpen}
        setOpen={setEditRequestNftOpen}
      />
      <RequestForMintDialog
        nftData={nftData}
        categoryId={categoryId}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={openRequestMint}
        setOpen={setOpenRequestMint}
      />
      <DetailsDialog open={DetailsNftOpen} setOpen={setDetailsNftOpen} nftData={nftData} />
      <MainCard
        content={false}
        className="tableShadow"
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
          onClick={() => {
            if (nftData?.bulkId) {
              navigate("/bulkNft/" + nftData?.bulkId, {
                state: {
                  nft: nftData
                }
              });
            }
          }}
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
            <Box sx={{ height: "220px" }}>
              <CardMedia component="img" height="220" sx={{ objectFit: "cover" }} image={nftData?.asset} />
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Tooltip placement="top" title={nftData.name}>
                    <Typography
                      variant="subtitle1"
                      className="fontstyling encap-nft"
                      sx={{ textDecoration: "none", textTransform: "capitalize", cursor: "pointer" }}
                    >
                      {nftData?.name?.length > 13 ? nftData?.name.slice(0, 13) + "..." : nftData?.name}
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
                    {nftData?.bulkId ? (
                      <Typography variant="h6" className="fontstyling">
                        BULK NFT's
                      </Typography>
                    ) : (
                      <Typography variant="h6" className="fontstyling">
                        {nftData.NFTTokens.length} Items
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {!nftData?.bulkId && (
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
                      disabled={loader}
                      onClick={() => {
                        navigate(`/productDetails/${nftData.id}`);
                      }}
                    >
                      Details
                    </Button>
                  </Grid>
                )}
                {loader ? (
                  <LoaderComponent width={"100%"} alignItems={"center"} />
                ) : (
                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="end" alignItems="center">
                      {nftData.status !== "MINTED" && nftData.status !== "REQUESTED" && type !== "rejected" && (
                        <>
                          <Button
                            className="fontstyling"
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: "5px" }}
                            onClick={() => {
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
                                threeDModelUrl: nftData.threeDModelUrl,
                                threeDFileName: nftData.threeDFileName,
                                images: image,
                                asset: nftData.asset,
                                NFTImages: nftData.NFTImages,
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
                              setEditNftOpen(true);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            className="fontstyling"
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: "5px" }}
                            onClick={() => {
                              setDeleteNftOpen(true);
                              setNftInfo({
                                id: nftData.id,
                                nftName: nftData.name,
                                nftDescription: nftData.description,
                                nftPrice: nftData.price,
                                mintType: nftData.mintType,
                                currencyType: nftData.currencyType,
                                fieldDataArray: nftData.NFTMetaData,
                                images: image,
                                threeDModelUrl: nftData.threeDModelUrl,
                                animation_url: nftData?.animation_url
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      {!nftData?.bulkId &&
                        nftData?.status === "MINTED" &&
                        nftData?.isEditable === true &&
                        type !== "rejected" && (
                          <>
                            <Button
                              className="fontstyling"
                              variant="contained"
                              color="primary"
                              sx={{ marginRight: "5px" }}
                              onClick={() => {
                                setEditRequestNftOpen(true);
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
                                  animation_url: nftData?.animation_url
                                });
                              }}
                            >
                              Edit Request
                            </Button>
                          </>
                        )}

                      {(nftData.status === "DRAFT" || nftData.status === "REJECTED") && type !== "rejected" && (
                        <Button
                          className="fontstyling"
                          variant="contained"
                          color="primary"
                          sx={{ marginRight: "5px" }}
                          onClick={() => {
                            setOpenRequestMint(true);
                          }}
                        >
                          Request
                        </Button>
                      )}

                      {nftData.status === "REJECTED" && user.role === "Brand Admin" && type === "rejected" && (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ marginRight: "5px", fontWeight: "300" }}
                          onClick={() => setViewReason(true)}
                        >
                          View reject reason
                        </Button>
                      )}
                    </Stack>
                    <Stack direction="row" justifyContent="end" alignItems="center"></Stack>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </MainCard>
    </>
  );
};

export default NftCard;
