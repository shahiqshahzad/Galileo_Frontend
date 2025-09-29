/* eslint-disable react-hooks/exhaustive-deps */
import { useTheme } from "@emotion/react";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cancleReselNft, getALLNftResold, mintLoaderNft, resoledNft } from "redux/nftManagement/actions";
import SearchIcon from "../../../../assets/images/icons/search_icon_items.svg";

import { gridSpacing } from "store/constant";
import { toast } from "react-toastify";
import MarketplaceAbi from "../../../../contractAbi/Marketplace.json";
import MarketplaceAddress from "../../../../contractAbi/Marketplace-address.js";
import {
  Card,
  Grid,
  Typography,
  CardActionArea,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  CircularProgress,
  Box
} from "@mui/material";
import { useState } from "react";
// import BLOCKCHAIN from "../../../../constants";
import { ethers, utils } from "ethers";
import { SNACKBAR_OPEN } from "store/actions";
import { CardImage } from "utils/CardImage";

const ResoldItems = () => {
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [cancelHandler, setCancelHandler] = useState(false);
  const [resellLoader, setResellLoader] = useState(false);
  const [rprice, setRprice] = useState(0);

  const [idNft, setIdNft] = useState("");
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const nfts = useSelector((state) => state.nftReducer.nftResold);
  const checkLoader = useSelector((state) => state.nftReducer.mintNftLoader);
  const getResoldNftLoader = useSelector((state) => state.nftReducer.getResoldNftLoader);

  const handleResellNft = async () => {
    const findNft = nfts.userNFT.find((d) => d.NftId === idNft);

    setResellLoader(true);
    dispatch(mintLoaderNft(true));

    if (findNft !== undefined) {
      if (user == null) {
        navigate("/login");
      } else if (await checkWallet()) {
        try {
          setResellLoader(true);
          dispatch(mintLoaderNft(true));

          // let erc20Address = BLOCKCHAIN.USDC_ERC20;
          // let tokenId = parseInt(findNft?.NFTTokenId);
          let tokenId = parseInt(findNft?.Nft?.NFTTokens[0]?.tokenId);
          // let contractAddress = nfts?.nft?.contractAddress;
          let contractAddress = findNft?.contractAddress;

          let rrprice = ethers.utils.parseUnits(rprice.toString(), 6);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
          const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

          // await (await nfts.approve(MarketplaceAddress.address, tokenId)).wait();

          // eslint-disable-next-line no-unused-vars
          const { from: buyerAddress, hash: transactionHash } = await marketplace.changePrice(
            tokenId,
            contractAddress,
            rrprice
          );
          dispatch(
            resoledNft({
              price: rprice,
              nftId: findNft?.NftId,
              transactionHash: transactionHash,
              handleClose: handleClose
            })
          );

          // toast.success('NFT will be resold on metamask');

          // await (await marketplace.changePrice(tokenId, contractAddress, rrprice))
          //   .wait()
          //   .then((data) => {
          //     dispatch(
          //       resoledNft({
          //         price: rprice,
          //         nftId: findNft?.NftId,
          //         //   nftToken: findNft?.NFTTokenId,
          //         //   buyerAddress: data.from,
          //         //   contractAddress: contractAddress,
          //         //   resellNftResolve: resellNftResolve,
          //         handleClose: handleClose
          //       })
          //     );
          //     toast.success('NFT is Resold');
          //     setIdNft('');
          //     setResellLoader(false);
          //   })
          //   .catch((error) => {
          //     toast.error(error.reason);
          //     setIdNft('');
          //     setResellLoader(false);
          //   });
        } catch (error) {
          setResellLoader(false);
          toast.error(error.reason);
          setOpenEdit(false);
          dispatch(mintLoaderNft(false));
          setIdNft("");
        }
        //  if (dNft?.Nft?.mintType == 'lazyMint') {
        //     try {
        //         setResellLoader(true);
        //
        //         let erc20Address = BLOCKCHAIN.USDC_ERC20;
        //         // let tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
        //         let tokenId;
        //         if (lazyTokenId == '') {
        //             tokenId = parseInt(nftList?.nft?.NFTTokens[0].tokenId);
        //         } else {
        //             tokenId = parseInt(lazyTokenId);
        //         }
        //
        //         let contractAddress = nftList?.nft?.contractAddress;
        //         let nftPrice = nftList?.nft?.price.toString();

        //         let rrprice = ethers.utils.parseUnits(nftPrice,6);
        //         rrprice = rrprice.toString();
        //         let buyer = buyerNft?.buyer?.buyerAddress;

        //         const provider = new ethers.providers.Web3Provider(window.ethereum);
        //         const signer = provider.getSigner();
        //         console.log('signer', signer);
        //         const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
        //         const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
        //         console.log('MARKETPLACE', marketplace);
        //         console.log(
        //             'erc20Address, tokenId, contractAddress, rrprice,buyer',
        //             erc20Address,
        //             tokenId,
        //             contractAddress,
        //             rrprice,
        //             buyer
        //         );
        //         //await (await nfts.approve(MarketplaceAddress.address, tokenId)).wait();
        //         // console.log("tokenid",tokenId)
        //         await (await marketplace.makeItem(erc20Address, tokenId, contractAddress, rrprice, buyer))
        //             .wait()
        //             .then((data) => {
        //                 dispatch(
        //                     resellNft({
        //                         nftId: nftList?.nft?.id,
        //                         nftToken: nftList?.nft?.NFTTokens[0].id,
        //                         buyerAddress: data.from,
        //                         contractAddress: contractAddress,
        //                         resellNftResolve: resellNftResolve
        //                     })
        //                 );

        //                 toast.success('NFT is Resold');
        //                 console.log(data)
        //             })
        //             .catch((error) => {
        //                 toast.error(error.reason);
        //                 console.log(error);
        //             });
        //         setOpen(false);
        //     } catch (error) {
        //         setResellLoader(false);
        //         toast.error(error.reason);
        //         console.log(error);
        //     }
        // }
      }
    }
  };
  const dispatch = useDispatch();
  const mediumNotifications = useSelector((state) => state.marketplaceReducer?.notifications?.medium);
  const handleClose = () => {
    setOpenEdit(false);
    setIdNft("");
    setResellLoader(false);
  };
  const handleOpen = (id) => {
    setOpenEdit(true);
    setIdNft(id);
  };
  const handleCloseCancel = () => {
    setCancelHandler(false);
    setResellLoader(false);
  };
  const handlerCancleOpener = (id) => {
    setCancelHandler(true);
    setIdNft(id);
  };

  useEffect(() => {
    dispatch(
      getALLNftResold({
        walletAddress: user.walletAddress
      })
    );
  }, []);

  useEffect(() => {
    if (mediumNotifications && mediumNotifications[0]?.type === "OrderUpdates") {
      dispatch(
        getALLNftResold({
          walletAddress: user.walletAddress
        })
      );
    }
  }, [mediumNotifications]);

  const checkWallet = async () => {
    const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
    let connectWallet = await window?.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      // toast.error('No crypto wallet found. Please install it.');
    }

    // else if (window?.ethereum?.networkVersion !== '5') {
    //     dispatch({
    //         type: SNACKBAR_OPEN,
    //         open: true,
    //         message: 'Please change your Chain ID to Goerli',
    //         variant: 'alert',
    //         alertSeverity: 'info'
    //     });
    //     console.log('Please change your Chain ID to Goerli');
    // }
    else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address",
        variant: "alert",
        alertSeverity: "info"
      });
    } else {
      return true;
    }
  };

  const handleByPassNft = async () => {
    setResellLoader(true);

    try {
      const findNft = nfts.userNFT.find((d) => d.NftId === idNft);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let tokenId = parseInt(findNft?.Nft?.NFTTokens[0]?.tokenId);

      let contractAddress = findNft?.contractAddress;

      const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);

      const { hash: transactionHash } = await marketplace.deListNft(tokenId, contractAddress);

      dispatch(
        cancleReselNft({
          walletAddress: findNft.NftId,
          transactionHash
        })
      );

      //     await (await marketplace.deListNft(tokenId, contractAddress)).wait().then((data) => {
      //       dispatch(
      //         cancleReselNft({
      //           walletAddress: findNft.NftId
      //         })
      //       );
      //       setCancelHandler(false);
      //       setResellLoader(false);
      //       navigate(`/productDetails/${findNft.NftId}`);
      //     });
    } catch (error) {
      setCancelHandler(false);
      setResellLoader(false);
      toast.error(error.reason);
    }
  };

  return (
    <>
      <Grid mt={2} container-fluid="true" spacing={gridSpacing}>
        <Grid mt={4} item xs={12}>
          {checkLoader || getResoldNftLoader ? (
            <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          ) : (
            <Grid container justifyContent="left" spacing={gridSpacing} sx={{ textAlign: "center" }}>
              {nfts.userNFT?.length > 0 ? (
                <>
                  {nfts.userNFT?.map((data) => (
                    <Grid item md={2} sm={6}>
                      <Card
                        sx={{
                          color: theme.palette.mode === "dark" ? "white" : "#404040",
                          background: theme.palette.mode === "dark" ? "#181C1F" : "white",
                          maxWidth: 365,
                          width: "105%",
                          borderRadius: "3px"
                        }}
                      >
                        <CardActionArea>
                          <CardImage src={data?.Nft?.asset} alt={data?.Nft?.id} />

                          <CardContent sx={{ padding: "6%" }}>
                            <Grid item xs={8} sx={{ textAlign: "left" }}>
                              <span className="cardHeading encap" style={{ fontSize: "130%" }}>
                                {data.Nft.name}
                              </span>
                              <div className="overflow" style={{ marginTop: "5%", color: "#656565" }}>
                                {data.Nft.price} {data.Nft.currencyType}
                              </div>
                            </Grid>
                            <Grid sx={{ display: "flex", justifyContent: "space-between", mt: "8px" }}>
                              <Button
                                className="app-text"
                                variant="contained"
                                onClick={() => {
                                  handleOpen(data.Nft.id);
                                  setRprice(data.Nft.price);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                className="app-text"
                                variant="contained"
                                color="error"
                                onClick={() => handlerCancleOpener(data.Nft.id)}
                              >
                                Cancel
                              </Button>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </>
              ) : (
                // <Grid item xs={12}>
                //   <Typography
                //     variant="h3"
                //     mt={1}
                //     component="div"
                //     sx={{
                //       textAlign: { xs: 'center', md: 'left', sm: 'center', color: 'gray' },
                //       textTransform: 'capitalize',
                //     }}
                //   >
                //     No Resold nfts found..!
                //   </Typography>
                // </Grid>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    xs={10}
                    md={10}
                    lg={10}
                    sx={{ background: "#22282C", borderRadius: "5px", height: "200px", textAlign: "center" }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                      <Typography
                        variant="h3"
                        mt={1}
                        component="div"
                        sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
                      >
                        No Resold Items found
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Dialog open={openEdit}>
        <DialogTitle>Resold</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the selling price for NFT in USDC</DialogContentText>
          <TextField
            autoFocus
            type="number"
            margin="dense"
            label="Price "
            fullWidth
            variant="standard"
            disabled={resellLoader}
            value={rprice}
            onChange={(e) => {
              setRprice(e.target?.value);
            }}
            InputProps={{ inputProps: { min: 0 } }}
          />
        </DialogContent>
        {resellLoader ? (
          <DialogActions sx={{ display: "block" }}>
            <Grid container justifyContent="center" sx={{ width: "30%", m: "0 auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>
            <Button
              className="buttons"
              variant="Text"
              sx={{ width: "100%", margin: "0 auto", color: "#2196f3" }}
              size="large"
            >
              Please wait
            </Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleResellNft}
              // onClick={handleClose}
            >
              Resell
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* cancel modal  */}
      <Dialog
        className="responsiveDialog"
        open={cancelHandler}
        // TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1">Resold Items</DialogTitle>
        <DialogContent>
          <Typography variant="body2" component="span">
            Are you sure you want to Cancel NFT ?
          </Typography>
        </DialogContent>

        {resellLoader ? (
          <DialogActions sx={{ display: "block" }}>
            <Grid container justifyContent="center" sx={{ width: "30%", m: "0 auto " }}>
              <Grid item>
                <CircularProgress disableShrink size={"4rem"} />
              </Grid>
            </Grid>
            <Button
              className="buttons"
              variant="Text"
              sx={{ width: "100%", margin: "0 auto", color: "#2196f3" }}
              size="large"
            >
              Please wait for Cancel Resold Items
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ pr: 2.5 }}>
            <Button
              sx={{
                color: theme.palette.error.dark,
                borderColor: theme.palette.error.dark
              }}
              onClick={handleCloseCancel}
              color="secondary"
            >
              No
            </Button>
            <Button
              variant="contained"
              size="small"
              // onClick={() => {

              //     if (!loader) {
              //         if (nftData.mintType == 'directMint') {
              //             checkWallet();
              //             handleDirectMint();
              //         } else if (nftData.mintType == 'lazyMint') {
              //             handleLazyMint();
              //         }
              //     }
              // }}
              onClick={handleByPassNft}
            >
              Yes
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default ResoldItems;
