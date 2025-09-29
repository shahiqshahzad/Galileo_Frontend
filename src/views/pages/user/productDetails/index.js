/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@emotion/react";
import { Grid } from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getnftData, getnftDataSuccess } from "redux/landingPage/actions";
import EditReuqestBeforeMintDialog from "views/pages/subAdmin/brands/component/editNftBeforeMint";
import MintRequestActions from "views/pages/subAdmin/brands/component/mintEditRequestDetails";
import ApproveEditNftDialog from "views/pages/superAdmin/nftManagement/component/ApproveEditRequest";
import MintNftDialog from "views/pages/superAdmin/nftManagement/component/mintNftDialog";
import RejectEditNftDialog from "views/pages/superAdmin/nftManagement/component/rejectEditRequest";
import RejectNftDialog from "../../superAdmin/nftManagement/component/RejectReasonDialog";
import PropertiesView from "./component/productView";
// import Properties from "./component/properties";
import PropertyMenu from "./component/propertyMenu";
// import SimilarProducts from "./component/similarProducts";
import { LoaderComponent } from "utils/LoaderComponent";
import { mintLoaderNft, rejectNft } from "redux/nftManagement/actions";
import { Stack } from "@mui/system";

const ProductDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "draft";

  const user = useSelector((state) => state.auth.user);

  const productId = useParams().id;
  const [fetchNftLoading, setFetchNftLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [openMint, setOpenMint] = useState(false);
  const [rejectMintOpen, setRejectMintOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  const [nftAdminEditOpen, setNftAdminEditOpen] = useState(false);
  const type = user?.role === "Sub Admin" ? "draft" : "all";
  const search = "";
  const page = 1;
  const limit = 12;
  const image = [];

  const mediumNotifications = useSelector((state) => state.marketplaceReducer?.notifications?.medium);
  const checkLoader = useSelector((state) => state.nftReducer.mintNftLoader);

  const nftList = useSelector((state) => state.landingPageReducer?.nft);
  useEffect(() => {
    dispatch(getnftData({ id: productId, tax: true, setFetchNftLoading }));
  }, [mediumNotifications, productId]);

  const handleNftAction = (data) => {
    const { type, role, status } = data;
    if (type === "reject" && status === "REQUESTED" && (role === "Super Admin" || role === "Sub Admin")) {
      // setRejectMintOpen(true);
      let nftData = nftList?.nft;
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
          setLoader: () => {
            setLoader(false);
            navigate(`/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=draft`);
          }
        })
      );
    }
    if (type === "edit" && (role === "Sub Admin" || role === "Super Admin") && status === "REQUESTED") {
      // setNftAdminEditOpen(true);
      dispatch(getnftDataSuccess({}));
      navigate(`/editProduct/${nftList?.nft?.id}`, { state: { filter, isRequired: filter === "listed" } });
    }
    if (type === "mint" && status === "REQUESTED" && (role === "Sub Admin" || role === "Super Admin")) {
      setOpenMint(true);
    }
    if (type === "approve" && status === "temp" && (role === "Super Admin" || role === "Sub Admin")) {
      setApproveOpen(true);
    }
    if (type === "reject" && status === "temp" && (role === "Super Admin" || role === "Sub Admin")) {
      setRejectOpen(true);
    }
  };
  useEffect(() => {
    return () => {
      dispatch(mintLoaderNft(false));
    };
  }, []);
  return (
    <>
      {/* <EditNftDialog
        nftInfo={nftInfo}
        categoryId={nftList.nft?.Category.id}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={editNftOpen}
        setOpen={setEditNftOpen}
      /> */}
      {/* <Backdrop
        sx={{
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: '#fff',
          pt: '30%',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={checkLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      {nftAdminEditOpen && (
        <EditReuqestBeforeMintDialog
          // nftInfo={cloneDeep(nftList.nft)}
          nftInfo={cloneDeep({
            id: nftList.nft.id,
            CategoryId: nftList.nft.CategoryId,
            brandId: nftList.nft.BrandId,
            nftName: nftList.nft.name,
            nftDescription: nftList.nft.description,
            nftPrice: nftList.nft.price,
            mintType: nftList.nft.mintType,
            currencyType: nftList.nft.currencyType,
            fieldDataArray: nftList.nft.NFTMetaData,
            fileDataArray: nftList.nft.NFTMetaFiles,
            threeDModelUrl: nftList.nft.threeDModelUrl,
            threeDFileName: nftList.nft.threeDFileName,
            images: image,
            asset: nftList.nft.asset,
            NFTImages: nftList.nft.NFTImages,
            animation_url: nftList.nft?.animation_url,

            // values for fulfillment detail
            shippingCalculationMethod: nftList.nft?.shippingCalculationMethod,
            flatRateShippingCost: nftList.nft?.flatRateShippingCost,
            noExternalCostForMultipleCopies: nftList.nft?.noExternalCostForMultipleCopies,
            weight: nftList.nft?.weight,
            height: nftList.nft?.height,
            length: nftList.nft?.length,
            breadth: nftList.nft?.breadth,
            warehouseAddressId: nftList.nft?.warehouseAddressId,
            supportedCarrier: nftList.nft?.supportedCarrier,
            modeOfShipment: nftList.nft?.modeOfShipment,

            shippingCostAdjustment: nftList.nft?.shippingCostAdjustment,
            isPurchaseAllowed: nftList.nft?.isPurchaseAllowed,
            fallBackShippingAmount: nftList.nft?.fallBackShippingAmount
          })}
          images={image}
          type={type}
          search={search}
          page={page}
          limit={limit}
          loader={loader}
          setLoader={setLoader}
          open={nftAdminEditOpen}
          setOpen={setNftAdminEditOpen}
        />
      )}

      <RejectNftDialog
        nftData={nftList.nft}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={rejectMintOpen}
        setOpen={setRejectMintOpen}
      />
      <RejectEditNftDialog
        nftData={nftList.nft}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={rejectOpen}
        setOpen={setRejectOpen}
      />
      <ApproveEditNftDialog
        nftData={nftList.nft}
        type={type}
        search={search}
        page={page}
        limit={limit}
        loader={loader}
        setLoader={setLoader}
        open={approveOpen}
        setOpen={setApproveOpen}
      />
      <MintNftDialog
        nftData={nftList.nft}
        type={type}
        search={search}
        page={page}
        limit={limit}
        // loader={loader}
        // setLoader={setLoader}
        open={openMint}
        setOpen={setOpenMint}
        mintNftoading={loader}
        setMintNftoading={setLoader}
      />
      {fetchNftLoading ? (
        <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
          <LoaderComponent />
        </div>
      ) : (
        <>
          <Grid
            container-fluid="true"
            md={12}
            lg={12}
            sx={{
              ml: { lg: -1 },
              display: { xs: "block", sm: "block", md: "flex", lg: "flex" },
              background: "tranparent",
              color: theme.palette.mode === "dark" ? "white" : "#404040"
            }}
          >
            <Grid item md={12} xs={12} lg={11}>
              <Grid container-fluid="true">
                <Grid item md={12} xs={12}>
                  <Grid container>
                    <Grid item md={12} xs={12}>
                      <PropertiesView nftList={nftList} />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <PropertyMenu nftList={cloneDeep(nftList)} />
                      {checkLoader === false && nftList.nft?.status === "REQUESTED" && (
                        <>
                          <Grid container md={12} xs={12}>
                            <Grid item md={8} xs={8}></Grid>
                            <Grid
                              item
                              md={4}
                              xs={4}
                              justifyContent="flex-end"
                              sx={{ marginBottom: "2rem", paddingRight: "1rem", marginTop: "2rem", height: "3rem" }}
                            >
                              {loader ? (
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                  <Stack>
                                    <LoaderComponent height={"0"} alignItems={"flex-end"} />
                                  </Stack>
                                </div>
                              ) : (
                                <MintRequestActions
                                  nftList={nftList.nft}
                                  setNftAction={(data) => handleNftAction(data)}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>
                    {nftList?.nft?.status !== "REQUESTED" && (
                      <>
                        {/*  <Grid item md={12} xs={12}>
                          <Activity nftList={nftList} />
                        </Grid> */}
                        <Grid item md={12} xs={12}>
                          {/* <SimilarProducts nftList={nftList} /> */}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default ProductDetails;
