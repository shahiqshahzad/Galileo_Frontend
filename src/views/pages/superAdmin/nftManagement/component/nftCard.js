import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Card, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DetailsDialog from "views/pages/brandAdmin/nftManagement/component/details";
import EditReuqestBeforeMintDialog from "views/pages/subAdmin/brands/component/editNftBeforeMint";
import MintRequestActions from "views/pages/subAdmin/brands/component/mintEditRequestDetails";
import ApproveEditNftDialog from "./ApproveEditRequest";
import RejectReasonDialog from "./RejectReasonDialog";
import MainCard from "./mainCard";
import MintNftDialog from "./mintNftDialog";
import RejectEditNftDialog from "./rejectEditRequest";
import { LoaderComponent } from "utils/LoaderComponent";
import { useDispatch, useSelector } from "react-redux";
import RemovedItemDialog from "./removeItem";
import { Stack } from "@mui/system";
import EditRequestDialog from "views/pages/brandAdmin/nftManagement/component/editRequestNftDialog";
import { getAllBulkNft, rejectNft } from "redux/nftManagement/actions";
import { getnftData, getnftDataSuccess } from "redux/landingPage/actions";
import draftNftImage from "assets/images/no-image.png";
import { toast } from "react-toastify";

const NftCard = ({ nftData, search, page, limit, type }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();

  const filter = searchParams.get("filter") || "draft";

  const user = useSelector((state) => state.auth.user);

  const [loader, setLoader] = useState(false);
  const [mintNftoading, setMintNftoading] = useState(false);
  const [openMint, setOpenMint] = useState(false);
  const [removedItemOpen, setRemovedItemOpen] = useState(false);
  const [rejectMintOpen, setRejectMintOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [DetailsNftOpen, setDetailsNftOpen] = useState(false);
  const [editNftOpen, setEditNftOpen] = useState(false);
  const [editMintedNftOpen, setEditMintedNftOpen] = useState(false);
  const [requesterInfo, setRequesterInfo] = useState("Brand Admin");
  const [image, setImage] = useState([]);

  const [nftInfo, setNftInfo] = useState({
    id: null,
    CategoryId: null,
    brandId: null,
    nftName: "",
    nftDescription: "",
    nftPrice: 0,
    mintType: "directMint",
    currencyType: "USDC",
    fieldDataArray: [],
    fileDataArray: [],
    Proof: [],
    images: [],
    asset: "",
    ipfsUrl: "",
    NFTImages: [],
    threeDModelUrl: null,
    animation_url: null,
    quantity: 0,

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
    if (nftData?.asset) {
      const length = nftData.asset.split("/").length;
      setImage([{ image: { name: nftData.asset.split("/")[length - 1] }, quantity: nftData.NFTTokens.length }]);
    }
    // eslint-disable-next-line array-callback-return
    nftData.NFTImages?.map((img) => {
      if (img.User) {
        setRequesterInfo(`This request is submitted by ${img.User.firstName} ${img.User.lastName}`);
      }
    });
    if (nftData?.transactionStatus === "success") {
      setMintNftoading(false);
    }
  }, [nftData]);

  const handleNftAction = (data) => {
    const { type, role, status, e } = data;
    e.stopPropagation();
    if (type === "reject" && (role === "Sub Admin" || role === "Super Admin")) {
      // setRejectMintOpen(true);
      setLoader(true);
      dispatch(
        rejectNft({
          id: nftData.id,
          categoryId: nftData.CategoryId,
          brandId: nftData.BrandId,
          rejectReason: "delete",
          type: "draft",
          page: page,
          limit: limit,
          search: search,
          setLoader: () => setLoader(false)
        })
      );
    }
    if (type === "reject-listed" && (role === "Sub Admin" || role === "Super Admin")) {
      setRejectMintOpen(true);
    }
    if (type === "edit" && (role === "Sub Admin" || role === "Super Admin")) {
      dispatch(getnftDataSuccess({}));
      navigate(`/editProduct/${nftData.id}`, { state: { filter, isRequired: filter === "listed" } });
    }
    if (type === "mint" && status === "REQUESTED" && (role === "Sub Admin" || role === "Super Admin")) {
      setOpenMint(true);
    }
    if (type === "approve" && status === "temp" && (role === "Sub Admin" || role === "Super Admin")) {
      setApproveOpen(true);
    }
    if (type === "all" && status === "MINTED" && role === "Sub Admin") {
      setRemovedItemOpen(true);
    }
    if (type === "reject" && status === "temp" && (role === "Super Admin" || role === "Sub Admin")) {
      setRejectOpen(true);
    }
    if (type === "reject" && status === "edit_requested" && (role === "Super Admin" || role === "Sub Admin")) {
      setRejectOpen(true);
    }
    if (type === "approve" && status === "edit_requested" && (role === "Sub Admin" || role === "Super Admin")) {
      setApproveOpen(true);
    }
    if (type === "update_reason" && status === "REJECTED" && (role === "Super Admin" || role === "Sub Admin")) {
      setRejectMintOpen(true);
    }
    if (type === "edit_after_mint" && (role === "Sub Admin" || role === "Super Admin") && status === "MINTED") {
      setEditMintedNftOpen(true);
      setNftInfo({
        id: nftData.id,
        CategoryId: nftData.CategoryId,
        brandId: nftData.BrandId,
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
        Proof: nftData.NFTMetaData,
        ipfsUrl: nftData?.ipfsUrl,
        quantity: nftData?.NFTTokens?.length,

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
    }
  };

  const blurBgStyle = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    filter: "blur(1px)",
    position: "relative"
  };

  return (
    <>
      {editNftOpen && (
        <EditReuqestBeforeMintDialog
          nftInfo={cloneDeep(nftInfo)}
          type={type}
          search={search}
          page={page}
          limit={limit}
          loader={loader}
          setLoader={setLoader}
          open={editNftOpen}
          setOpen={setEditNftOpen}
        />
      )}
      {editMintedNftOpen && (
        <EditRequestDialog
          nftInfo={cloneDeep(nftInfo)}
          categoryId={categoryId}
          type={type}
          search={search}
          page={page}
          limit={limit}
          loader={loader}
          setLoader={setLoader}
          open={editMintedNftOpen}
          setOpen={setEditMintedNftOpen}
          editAndApprove={true}
        />
      )}
      <RejectReasonDialog
        nftData={nftData}
        type={type}
        search={search}
        page={page}
        limit={limit}
        setLoader={setLoader}
        open={rejectMintOpen}
        setOpen={setRejectMintOpen}
      />
      <RejectEditNftDialog
        nftData={nftData}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={rejectOpen}
        setOpen={setRejectOpen}
      />
      {approveOpen && (
        <ApproveEditNftDialog
          nftData={nftData}
          type={type}
          search={search}
          page={page}
          limit={limit}
          loader={loader}
          setLoader={setLoader}
          open={approveOpen}
          setOpen={setApproveOpen}
        />
      )}
      <RemovedItemDialog
        nftData={nftData}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={removedItemOpen}
        setOpen={setRemovedItemOpen}
      />
      <MintNftDialog
        nftData={nftData}
        type={type}
        search={search}
        page={page}
        limit={limit}
        open={openMint}
        setOpen={setOpenMint}
        mintNftoading={mintNftoading}
        setMintNftoading={setMintNftoading}
      />
      <DetailsDialog nftData={nftData} open={DetailsNftOpen} setOpen={setDetailsNftOpen} />

      <Stack sx={mintNftoading || nftData?.transactionStatus === "pending" ? blurBgStyle : {}}>
        {(mintNftoading || nftData?.transactionStatus === "pending") && (
          <Stack
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              margin: "auto",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
          >
            <CircularProgress color="primary" size={50} />
          </Stack>
        )}

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
            onClick={() => {
              if (nftData?.isComplete) {
                navigate("/productDetails/" + nftData.id);
              } else {
                toast.error("Please fill all the mandatory fields to view the product");
              }
              // if (nftData?.bulkId) {
              //   navigate(`/bulkNft/${nftData.bulkId}/${nftData?.CategoryId}/${nftData?.BrandId}`);
              // } else {
              //   navigate("/productDetails/" + nftData.id);
              // }
            }}
            sx={{
              color: theme.palette.mode === "dark" ? "white" : "#404040",
              background: theme.palette.mode === "dark" ? "#181C1F" : "white",
              width: "100%",
              maxHeight: "427px",
              borderRadius: "3px",
              marginBottom: "10px",
              maxWidth: { xl: "100%" }
            }}
          >
            <Box sx={{ height: "220px" }}>
              <CardMedia
                position="relative"
                component="img"
                height="100%"
                sx={{
                  objectFit: "cover",
                  background: "radial-gradient(circle, rgba(255,255,255,1) -10%, rgba(0,0,0,1) 170%)"
                }}
                image={nftData?.asset ? nftData?.asset : draftNftImage}
                alt={nftData.id}
                // onClick={() => {
                //   navigate("/productDetails/" + nftData.id);
                // }}
              />
            </Box>
            {user?.role === "Super Admin" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: "4%",
                  right: "5%"
                }}
              >
                <Tooltip
                  title={requesterInfo}
                  arrow
                  placement="top-start"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        padding: "1rem",
                        bgcolor: "#46494C",
                        "& .MuiTooltip-arrow": {
                          color: "#46494C"
                        },
                        fontFamily: theme?.typography.appText,
                        color: "white",
                        fontSize: "1rem"
                      }
                    }
                  }}
                >
                  <InfoOutlinedIcon color="primary" />
                </Tooltip>
              </Box>
            )}
            <CardContent sx={{ px: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Tooltip placement="top" title={nftData.name}>
                    <Typography
                      variant="h3"
                      sx={{
                        textDecoration: "none",
                        cursor: "pointer",
                        color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                        fontWeight: 400,
                        fontFamily: theme?.typography.appText
                      }}
                    >
                      {nftData?.name?.length > 15
                        ? nftData?.name.slice(0, 15) + "..."
                        : nftData?.name
                          ? nftData?.name
                          : "Product"}
                    </Typography>
                  </Tooltip>
                </Grid>

                <Grid item xs={12} mt={-1.5}>
                  {/* <Tooltip placement="left" title={nftData?.description}>
                    <Typography
                      variant="h6"
                      sx={{
                        height: 16,
                        color: theme.palette.mode === "dark" ? "#CDCDCD" : "black",
                        fontWeight: 300,
                        fontFamily: theme?.typography.appText
                      }}
                    >
                      {nftData?.description?.length > 30
                        ? `${nftData?.description?.slice(0, 30)}..`
                        : nftData?.description}
                    </Typography>
                  </Tooltip> */}
                </Grid>

                {/* {!nftData?.bulkId && ( */}
                <Grid item xs={12} sm={4} md={6} lg={6}>
                  {/*     {nftData.NFTTokens[0]?.serialId && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: theme?.typography.appText,
                        color: theme.palette.mode === "dark" ? "#CDCDCD" : "black",
                        fontWeight: 300
                      }}
                    >
                      Serial ID
                    </Typography>
                  )} */}

                  {nftData.mintType !== "lazyMint" ? (
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: theme?.typography.appText,
                        color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                        fontWeight: 400
                      }}
                    >
                      {nftData?.status === "REQUESTED" ? (
                        "Draft"
                      ) : nftData?.status === "LISTED" ? (
                        "Listed"
                      ) : (
                        <>
                          Sold
                          {/* <br />
                          12 items */}
                        </>
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: theme?.typography.appText,
                        color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                        fontWeight: 400
                      }}
                    >
                      {nftData.NFTTokens[0]?.serialId ? "" : nftData?.mintType}
                    </Typography>
                  )}
                </Grid>
                {/* )} */}

                <Grid item xs={12} sm={4} md={4} lg={6} sx={{ alignItems: "right" }}>
                  <Grid item xs={12}>
                    {/* {nftData?.bulkId ? (
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.mode === "dark" ? "#CDCDCD" : "black",
                          fontWeight: 300,
                          fontFamily: theme?.typography.appText
                        }}
                      >
                        BULK NFT's
                      </Typography>
                    ) : (
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.mode === "dark" ? "#CDCDCD" : "black",
                          fontWeight: 300,
                          fontFamily: theme?.typography.appText
                        }}
                      >
                        {nftData?.quantity} Items
                      </Typography>
                    )} */}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                        fontWeight: 400,
                        fontFamily: theme?.typography.appText
                      }}
                    >
                      {nftData?.salePrice
                        ? Number(nftData?.salePrice).toFixed(2)
                        : nftData?.price
                          ? Number(nftData?.price).toFixed(2)
                          : 0}
                      {nftData.currencyType}
                    </Typography>
                  </Grid>
                </Grid>
                {!nftData.updateUriPendingForEdit &&
                nftData?.updateUriPendingBy === user.id &&
                nftData.progressState === "updateUriPending" ? (
                  <Grid
                    item
                    xs={12}
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMintNftoading(true);
                      if (nftData?.bulkId) {
                        dispatch(
                          getAllBulkNft({
                            bulkId: nftData.bulkId
                          })
                        );
                      } else {
                        dispatch(getnftData({ id: nftData.id, tax: false }));
                      }
                    }}
                  >
                    <Tooltip placement="top" title="You need to complete one last transaction before listing this item">
                      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "4px" }}>
                        <InfoOutlinedIcon color="error" />{" "}
                        <Typography sx={{ pt: "3px", fontFamily: theme?.typography.appText }}>
                          Click to confirm listing
                        </Typography>
                      </Stack>
                    </Tooltip>
                  </Grid>
                ) : (
                  nftData.updateUriPendingForEdit &&
                  nftData?.updateUriPendingBy === user.id &&
                  nftData.progressState === "updateUriPending" && (
                    <Grid
                      item
                      xs={12}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        navigate("/productDetails/" + nftData.id);
                      }}
                    >
                      <Tooltip
                        placement="top"
                        title="You need to complete one last transaction before listing this item"
                      >
                        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "4px" }}>
                          <InfoOutlinedIcon color="error" />{" "}
                          <Typography sx={{ pt: "3px", fontFamily: theme?.typography.appText }}>
                            Click to confirm listing
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </Grid>
                  )
                )}

                <Grid justifyContent={"center"} item xs={12} sm={12} md={12}>
                  {loader ? (
                    <LoaderComponent height={"0"} alignItems={"flex-end"} />
                  ) : (
                    <MintRequestActions
                      nftList={nftData}
                      type={type}
                      setNftAction={(data) => handleNftAction(data)}
                      filter={filter}
                    />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </MainCard>
      </Stack>
    </>
  );
};

export default NftCard;
