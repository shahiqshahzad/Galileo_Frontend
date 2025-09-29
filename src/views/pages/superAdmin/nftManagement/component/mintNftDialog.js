/* eslint-disable array-callback-return */
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { ethers, utils } from "ethers";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mintNft, lazyMintNft, mintLoaderNft } from "redux/nftManagement/actions";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import { SNACKBAR_OPEN } from "store/actions";
// import Erc20 from "../../../../../contractAbi/Erc20.json";
import BLOCKCHAIN from "../../../../../constants";
import axios from "axios";
import { BLOCK_EXPLORER_URL, BLOCKCHAIN_ACTIONS } from "utils/constants";
import { loggerApi } from "utils/loggerApi";
import { useNavigate } from "react-router-dom";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function MintNftDialog({
  open,
  setOpen,
  page,
  limit,
  search,
  nftData,
  type,
  mintNftoading,
  setMintNftoading
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let wallet = nftData?.Category?.BrandCategories[0]?.RoyaltyRecipients?.map((data) => {
    return data?.walletAddress;
  });
  let percentage = nftData?.Category?.BrandCategories[0]?.RoyaltyRecipients?.map((data) => {
    return ethers.utils.parseUnits(data?.percentage?.toString(), 6);
  });

  let royaltyPercentage = nftData?.Category?.BrandCategories[0]?.royaltyPercentage
    ? ethers.utils.parseUnits(nftData?.Category?.BrandCategories[0]?.royaltyPercentage.toString(), 6)
    : 0;

  const user = useSelector((state) => state.auth.user);
  const userToken = useSelector((state) => state.auth.token);
  const headers = { headers: { Authorization: `Bearer ${userToken}` } };
  const handleClose = () => {
    setOpen(false);
  };
  const checkWallet = async () => {
    const response = await window?.ethereum?.request({
      method: "eth_requestAccounts"
    });
    let connectWallet = await window.ethereum._metamask.isUnlocked();

    if ((window.ethereum && connectWallet) === false) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please connect one",
        variant: "alert",
        alertSeverity: "info"
      });
      dispatch(mintLoaderNft(false));
      setMintNftoading(false);
      return false;
    } else if (utils?.getAddress(response[0]) !== user.walletAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Please connect your registered Wallet Address ",
        variant: "alert",
        alertSeverity: "info"
      });
      dispatch(mintLoaderNft(false));
      setMintNftoading(false);
      return false;
    } else {
      return true;
    }
  };

  const directMintThenList = async (tokenUriArray) => {
    if (nftData.isDirectTransfer) {
      if (await checkWallet()) {
        let nftTokens = nftData.NFTTokens;
        let contractAddress =
          nftData?.brandContractAddress ||
          nftData?.contractAddress ||
          nftData?.Category?.BrandCategories[0]?.contractAddress;
        if (!contractAddress) {
          dispatch({
            type: SNACKBAR_OPEN,
            open: true,
            message: "No Contract Address found for this NFT",
            variant: "alert",
            alertSeverity: "info"
          });
        }
        let nftId = nftData.id;
        let categoryId = nftData.CategoryId;
        let brandId = nftData.BrandId;
        let price = ethers.utils.parseUnits(nftData.price.toString(), 6);
        let tokenIdArray = [];
        let transactionHash;
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const nft = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

          if (tokenUriArray.length === 1) {
            // const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
            // let approvalAmount = await token.allowance(user.walletAddress, contractAddress);
            // let approvePrice = ethers.utils.parseUnits('10000000000000000000',6);

            // if (approvalAmount.toString() < price) {
            //   await (await token.approve(contractAddress, approvePrice)).wait();
            // }
            // let mintedNFT = await nft.mint(tokenUriArray[0],wallet,percentage, price , royaltyPercentage);
            let mintedNFT = await nft.mintTo(tokenUriArray[0], nftData.transferAddress, nftTokens[0].id);
            // let mintedNFT = await (
            //   await nft.mintTo(tokenUriArray[0], nftData.transferAddress, nftTokens[0].id).catch((error) => {
            //     console.log(error);
            //     toast.error(error.message);
            //     setOpen(false);
            //     dispatch(mintLoaderNft(false));

            //   })
            // ).wait();
            transactionHash = `${BLOCK_EXPLORER_URL}tx/${mintedNFT.hash}`;
            // console.log(mintedNFT.events)
            // console.log(parseInt(mintedNFT.events[0].args[2]))
            // const id = parseInt(mintedNFT.events[0].args[2]);
            // let myNftTokenIdArray = [];
            // myNftTokenIdArray.push(id);
            // console.log(mintedNFT.events[3].args[2])
            // let serialId = mintedNFT.events[3].args[2]
            // const owner = await nft.ownerOf(nftTokens[0].id);
            // console.log({owner})

            // // let serialId = await nft.serialid(id);

            // const { data: tokenUriJSON } = await axios.get(tokenUriArray[0]);

            // tokenUriJSON.attributes = tokenUriJSON.attributes.map((data) => ({
            //   ...data,
            //   trait_type: 'Serial ID',
            //   value: serialId,
            //   countryCode: '',
            //   display_type: 'Text',
            //   primaryLocation: false,
            //   editRequested: null,
            //   editId: null,
            //   NftId: nftId,
            //   isEditable: false,
            //   proofRequired: false
            // }));

            // const objForIpfsClient = JSON.stringify(tokenUriJSON);

            // const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient }, headers);
            // const ipfsTokenUriUrl = `https://galileoprotocol.infura-ipfs.io/ipfs/${result.data?.path}`;

            // await (
            //   await nft.updateUri(id, ipfsTokenUriUrl, nftData.transferAddress).catch((error) => {
            //     toast.error(error.reason);
            //     setOpen(false);
            //     dispatch(mintLoaderNft(false));
            //   })
            // ).wait();

            tokenIdArray.push({
              contractAddress: nftData.contractAddress,
              transferAddress: nftData.transferAddress,
              isDirectTransfer: nftData.isDirectTransfer,
              nftId: nftData.id,
              id: nftTokens[0].id,
              tokenId: null,
              serialId: null
            });
            let nftDataArray = [];
            nftDataArray.push({
              nftId: nftId
              // tokenUri: tokenUri
            });

            // tokenUriArray.map((data, i) => {
            //   tokenIdArray[i].tokenUri = data;
            // });

            dispatch(
              mintNft({
                minterAddress: user.walletAddress,
                nftDataArray: nftDataArray,
                tokenIdArray: tokenIdArray,
                transactionHash: transactionHash,
                tokenUriArray,
                signerAddress: address,
                brandId: brandId,
                categoryId: categoryId,
                type: type,
                search: search,
                page: page,
                limit: limit,
                handleClose: handleClose,
                runCronJob: true
              })
            );
            // dispatch(
            //   mintNft({
            //     minterAddress: user.walletAddress,
            //     nftDataArray: nftDataArray,
            //     tokenIdArray: tokenIdArray,
            //     tokenUriArray,
            //     transactionHash: transactionHash,
            //     signerAddress: address,
            //     brandId: brandId,
            //     categoryId: categoryId,
            //     type: type,
            //     search: search,
            //     page: page,
            //     limit: limit,
            //     handleClose: handleClose,
            //     runCronJob: true
            //   })
            // );
          } else if (tokenUriArray.length > 1) {
            // const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
            // let approvalAmount = await token.allowance(user.walletAddress, contractAddress);
            // let approvePrice = ethers.utils.parseUnits('10000000000000000000',6);
            // if (approvalAmount.toString() < price) {
            //   await (await token.approve(contractAddress, approvePrice)).wait();
            // }
            let _nftTokens = nftTokens.map((token) => Number(token.id));
            let mintedNFT =
              await // let mintedNFT = await nft.multipleMint(wallet, tokenUriArray, _nftTokens,  percentage , price ,  royaltyPercentage)

              (
                await nft
                  .multipleMint(wallet, tokenUriArray, _nftTokens, percentage, price, royaltyPercentage)
                  .catch((error) => {
                    toast.error(error.reason);
                    setOpen(false);
                    dispatch(mintLoaderNft(false));
                    setMintNftoading(false);
                  })
              ).wait();

            transactionHash = `https://goerli.etherscan.io/tx/${mintedNFT.transactionHash}`;
            // const id = parseInt(mintedNFT.events[0].args[2]);

            let counter = 0;
            let myNftTokenIdArray = [];
            for (let i = 0; i < tokenUriArray.length; i++) {
              myNftTokenIdArray.push(mintedNFT.events[counter].args[2].toString());
              counter = counter + 2;
            }

            await (
              await nft.transferNftBunch(nftData.transferAddress, myNftTokenIdArray).catch((error) => {
                toast.error(error.reason);
                setOpen(false);
                dispatch(mintLoaderNft(false));
                setMintNftoading(false);
              })
            ).wait();
            let myNftSerialIdArray = [];
            for (let i = 0; i < myNftTokenIdArray.length; i++) {
              let serialId = await nft.serialid(myNftTokenIdArray[i]);
              myNftSerialIdArray.push(serialId);
            }

            nftTokens.map((data, index) => {
              tokenIdArray.push({
                contractAddress: nftData.contractAddress,
                transferAddress: nftData.transferAddress,
                isDirectTransfer: nftData.isDirectTransfer,
                nftId: nftData.id,
                id: data.id,
                serialId: myNftSerialIdArray[index],
                tokenId: myNftTokenIdArray[index]
              });
            });

            let nftDataArray = [];
            nftDataArray.push({
              nftId: nftId
              // tokenUri: tokenUri
            });

            tokenUriArray.map((data, i) => {
              tokenIdArray[i].tokenUri = data;
            });

            dispatch(
              mintNft({
                minterAddress: user.walletAddress,
                nftDataArray: nftDataArray,
                tokenIdArray: tokenIdArray,
                transactionHash: transactionHash,
                signerAddress: address,
                brandId: brandId,
                categoryId: categoryId,
                type: type,
                search: search,
                page: page,
                limit: limit,
                handleClose: handleClose
              })
            );
          }
        } catch (error) {
          setOpen(false);
          dispatch(mintLoaderNft(false));
          setMintNftoading(false);
          toast.error(error.reason || error.message);
        }
      }
    } else {
      if (await checkWallet()) {
        let nftTokens = nftData.NFTTokens;
        //GI-171
        // let contractAddress = nftData.Category.BrandCategories[0].contractAddress;
        let contractAddress =
          nftData?.brandContractAddress ||
          nftData?.contractAddress ||
          nftData?.Category?.BrandCategories[0]?.contractAddress;
        if (!contractAddress) {
          dispatch({
            type: SNACKBAR_OPEN,
            open: true,
            message: "No Contract Address found for this NFT",
            variant: "alert",
            alertSeverity: "info"
          });
        }

        let nftId = nftData.id;
        let categoryId = nftData.CategoryId;
        let brandId = nftData.BrandId;
        let price = ethers.utils.parseUnits(nftData.price.toString(), 6);
        let tokenIdArray = [];
        let transactionHash;
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const nft = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

          // const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
          // let approvalAmount = await token.allowance(user.walletAddress, contractAddress);
          // let approvePrice = ethers.utils.parseUnits('10000000000000000000',6);
          // if (approvalAmount.toString() < price) {
          //   await (await token.approve(contractAddress, approvePrice)).wait();
          // }

          if (tokenUriArray.length === 1) {
            //   mint(
            //     tokenURI ------> tokenUriArray[0],
            //    royalityAddresses[] -------> wallet,
            //    royalityValue[] -----> percentage,
            //    price,
            //    _tokenId,
            //    royalityAmount ----> royaltyPercentage
            //  )
            const endpoint = "/nft/admin/mint";
            const method = "POST";
            await loggerApi(endpoint, method, {
              minterAddress: user.walletAddress,
              tokenIdArray: tokenIdArray,
              tokenUriArray,
              signerAddress: address,
              brandId: brandId,
              categoryId: categoryId,
              type: type,
              search: search,
              page: page,
              limit: limit,
              runCronJob: true,
              middleware: true,
              blockchainAction: BLOCKCHAIN_ACTIONS.MINT
            });
            let mintedNFT = await nft.mint(
              tokenUriArray[0],
              wallet,
              percentage,
              price,
              nftTokens[0].id,
              royaltyPercentage
            );
            transactionHash = `${BLOCK_EXPLORER_URL}tx/${mintedNFT.hash}`;
            tokenIdArray.push({
              contractAddress: nftData.contractAddress,
              transferAddress: nftData.transferAddress,
              isDirectTransfer: nftData.isDirectTransfer,
              nftId: nftData.id,
              id: nftTokens[0].id,
              tokenId: null,
              serialId: null
            });

            let nftDataArray = [];

            nftDataArray.push({
              nftId: nftId
            });

            dispatch(
              mintNft({
                minterAddress: user.walletAddress,
                nftDataArray: nftDataArray,
                tokenIdArray: tokenIdArray,
                tokenUriArray,
                transactionHash: transactionHash,
                signerAddress: address,
                brandId: brandId,
                categoryId: categoryId,
                type: type,
                search: search,
                page: page,
                limit: limit,
                handleClose: handleClose,
                runCronJob: true
              })
            );
          } else if (tokenUriArray.length > 1) {
            // const token = new ethers.Contract(erc20Address, Erc20.abi, signer);
            // let approvalAmount = await token.allowance(user.walletAddress, contractAddress);
            // let approvePrice = ethers.utils.parseUnits('10000000000000000000',6);
            // if (approvalAmount.toString() < price) {
            //   await (await token.approve(contractAddress, approvePrice)).wait();
            // }

            let _nftTokens = nftTokens.map((token) => Number(token.id));
            const endpoint = "/nft/admin/mint";
            const method = "POST";
            await loggerApi(endpoint, method, {
              minterAddress: user.walletAddress,
              tokenIdArray: tokenIdArray,
              tokenUriArray,
              signerAddress: address,
              brandId: brandId,
              categoryId: categoryId,
              type: type,
              search: search,
              page: page,
              limit: limit,
              runCronJob: true,
              middleware: true,
              blockchainAction: BLOCKCHAIN_ACTIONS.MINT
            });

            // let mintedNFT = await nft.multipleMint(tokenUriArray, wallet , percentage , price , _nftTokens,  royaltyPercentage)
            let mintedNFT = await nft.multipleMint(
              wallet,
              tokenUriArray,
              _nftTokens,
              percentage,
              price,
              royaltyPercentage
            );

            transactionHash = `${BLOCK_EXPLORER_URL}tx/${mintedNFT.hash}`;
            nftTokens.map((data, index) => {
              tokenIdArray.push({
                contractAddress: nftData.contractAddress,
                transferAddress: nftData.transferAddress,
                isDirectTransfer: nftData.isDirectTransfer,
                nftId: nftData.id,
                id: data.id,
                serialId: null,
                tokenId: null
              });
            });

            tokenUriArray.map((data, i) => {
              tokenIdArray[i].tokenUri = data;
            });

            let nftDataArray = [];

            nftDataArray.push({
              nftId: nftId
              // tokenUri: tokenUri
            });

            dispatch(
              mintNft({
                minterAddress: user.walletAddress,
                nftDataArray: nftDataArray,
                tokenIdArray: tokenIdArray,
                tokenUriArray,
                transactionHash: transactionHash,
                signerAddress: address,
                brandId: brandId,
                categoryId: categoryId,
                type: type,
                search: search,
                page: page,
                limit: limit,
                handleClose: handleClose,
                runCronJob: true
              })
            );
          }
        } catch (error) {
          setOpen(false);
          dispatch(mintLoaderNft(false));
          setMintNftoading(false);
          toast.error(error.reason || error.message);
        }
      }
    }
  };

  const handleDirectMint = async () => {
    setOpen(false);

    dispatch(mintLoaderNft(true));
    setMintNftoading(true);
    let image = nftData.ipfsUrl;
    let price = nftData.price;
    let animation_url = nftData.animation_url;
    let name = nftData.name;
    let description = nftData.description;
    let projectName = "Galelio";
    let mintedDate = new Date().valueOf();
    let categoryName = nftData.Category.name;
    let brandName = nftData.Brand.name;
    // let metaData = nftData.NFTMetaData;
    let poa = nftData.NFTMetaFiles;
    let external_url = nftData.NFTMetaFiles[0].fieldValue;

    let attributes = [];
    for (let i = 0; i < nftData.NFTMetaData.length; i++) {
      attributes.push({
        trait_type: nftData.NFTMetaData[i]?.trait_type,
        value: nftData.NFTMetaData[i]?.value,
        countryCode: nftData.NFTMetaData[i]?.countryCode,
        display_type: nftData.NFTMetaData[i]?.display_type,
        primaryLocation: nftData.NFTMetaData[i]?.primaryLocation,
        editRequested: nftData.NFTMetaData[i]?.editRequested,
        editId: nftData.NFTMetaData[i]?.editId,
        NftId: nftData.NFTMetaData[i]?.NftId,
        isEditable: nftData.NFTMetaData[i]?.isEditable,
        proofRequired: nftData.NFTMetaData[i]?.proofRequired,
        Proofs: nftData.NFTMetaData[i]?.Proofs
      });
    }
    if (!image || !price || !name || !description) return;

    let tokenUriArray = [];

    try {
      for (let i = 0; i < nftData.NFTTokens.length; i++) {
        const objForIpfsClient = JSON.stringify({
          projectName,
          brandName,
          animation_url,
          categoryName,
          image,
          name,
          description,
          price,
          mintedDate,
          attributes,
          poa,
          external_url
        });
        const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient }, headers);
        tokenUriArray.push(`https://galileoprotocol.infura-ipfs.io/ipfs/${result.data?.path}`);
      }

      directMintThenList(tokenUriArray);
    } catch (error) {
      dispatch(mintLoaderNft(false));
      setMintNftoading(false);
      toast.error(error.reason || error.message);
      setOpen(false);
    }
  };

  const handleLazyMint = async () => {
    let brandId = nftData.BrandId;
    let categoryId = nftData.CategoryId;
    let nftId = nftData.id;
    let image = nftData.ipfsUrl;
    let animation_url = nftData.animation_url;
    let prices = nftData.price.toString();
    let price = ethers.utils.parseUnits(prices, 6);
    price = price.toString();
    let name = nftData.name;
    let description = nftData.description;
    let projectName = "Galelio";
    let mintedDate = new Date().valueOf();
    let categoryName = nftData.Category.name;
    let brandName = nftData.Brand.name;
    let metaData = nftData.NFTMetaData;

    let contractAddress =
      nftData?.brandContractAddress ||
      nftData?.contractAddress ||
      nftData?.Category?.BrandCategories[0]?.contractAddress;
    if (!contractAddress) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No Contract Address found for this NFT",
        variant: "alert",
        alertSeverity: "info"
      });
    }
    let poa = nftData.NFTMetaFiles;
    let external_url = nftData.NFTMetaFiles[0].fieldValue;
    let attributes = [];
    for (let i = 0; i < nftData.NFTMetaData.length; i++) {
      attributes.push({
        trait_type: nftData.NFTMetaData[i]?.trait_type,
        value: nftData.NFTMetaData[i]?.value,
        countryCode: nftData.NFTMetaData[i]?.countryCode,
        display_type: nftData.NFTMetaData[i]?.display_type,
        primaryLocation: nftData.NFTMetaData[i]?.primaryLocation,
        editRequested: nftData.NFTMetaData[i]?.editRequested,
        editId: nftData.NFTMetaData[i]?.editId,
        NftId: nftData.NFTMetaData[i]?.NftId,
        isEditable: nftData.NFTMetaData[i]?.isEditable,
        proofRequired: nftData.NFTMetaData[i]?.proofRequired,
        Proofs: nftData.NFTMetaData[i]?.Proofs
      });
    }

    let nftTokens = nftData.NFTTokens;

    const objForIpfsClient = JSON.stringify({
      projectName,
      brandName,
      categoryName,
      image,
      animation_url,
      name,
      description,
      price,
      attributes,
      poa,
      external_url,
      mintedDate,
      metaData
    });
    const result = await axios.post(`${REACT_APP_API_URL}ipfs/client`, { objForIpfsClient }, headers);
    const uri = `https://galileoprotocol.infura-ipfs.io/ipfs/${result.data?.path}`;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    let token = BLOCKCHAIN.USDC_ERC20;
    const role = "0xd2e4c2619ea6e0faebc405d89445161c041e30fe03373ea0473da142d57d4514";
    // const tokens = new ethers.Contract(token, Erc20.abi, signer);
    const nfts = new ethers.Contract(contractAddress, NFTAbi.abi, signer);
    const results = await nfts.hasRole(role, address);
    if (results) {
      // let approvalAmount = await tokens.allowance(user.walletAddress, contractAddress);
      // let approvePrice = ethers.utils.parseUnits("10000000000000000000", 6);
      // if (approvalAmount.toString() < price) {
      //   await (await tokens.approve(contractAddress, approvePrice)).wait();
      // }

      const SIGNING_DOMAIN = "Galileo-Protocol";
      const SIGNATURE_VERSION = "1";

      const domain = {
        name: SIGNING_DOMAIN,
        version: SIGNATURE_VERSION,
        verifyingContract: contractAddress,
        chainId: 80001
      };

      const types = {
        GalileoVoucher: [
          { name: "uri", type: "string" },
          { name: "price", type: "uint256" },
          { name: "token", type: "address" },
          { name: "time", type: "uint256" }
        ]
      };

      const time = Date.now();
      const voucher = { uri, price, token, time };

      await signer
        ._signTypedData(domain, types, voucher)
        .then((res) => {
          let nftDataArray = [
            {
              nftId: nftId,
              tokenUri: uri,
              tokenPrice: prices.toString(),
              signerAddress: address,
              lazyVoucherTimeStamp: time
            }
          ];

          let tokenIdArray = nftTokens.map((data) => {
            return {
              id: data.id,
              signature: res,
              erc20Address: token
            };
          });
          dispatch(
            lazyMintNft({
              minterAddress: user.walletAddress,
              nftDataArray: nftDataArray,
              tokenIdArray: tokenIdArray,
              brandId: brandId,
              categoryId: categoryId,
              type: type,
              search: search,
              page: page,
              limit: limit,
              handleClose: handleClose
            })
          );
        })
        .catch((err) => {
          toast.error(err.reason);
          handleClose();
          dispatch(mintLoaderNft(false));
          setMintNftoading(false);
        });
    } else {
      handleClose();
      dispatch(mintLoaderNft(false));
      setMintNftoading(false);
      toast.error("Please connect your registered wallet.");
    }
  };
  const handleError = () => {
    navigate(`/editProduct/${nftData.id}`, { state: { isRequired: true } });
  };

  const handleListItem = async () => {
    let nftDataArray = [];
    let nftId = nftData.id;
    let categoryId = nftData.CategoryId;
    nftDataArray.push({
      nftId: nftId
    });
    setMintNftoading(true);
    handleClose();
    dispatch(
      mintNft({
        nftDataArray: nftDataArray,
        categoryId: categoryId,
        brandId: nftData.BrandId,
        type: type,
        search: search,
        page: page,
        limit: limit,
        handleClose: handleClose,
        setMintNftoading,
        handleError
      })
    );
  };
  return (
    <>
      <Dialog
        className="responsiveDialog"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
        PaperProps={{ style: { width: "400px" } }}
      >
        <DialogTitle id="alert-dialog-slide-title1">Confirm listing</DialogTitle>
        <DialogContent>
          <Typography variant="body2" component="span">
            Are you sure you want to list this product for sale?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", paddingRight: "20px" }}>
          <>
            {/* {checkLoader ? (
              <DialogActions sx={{ display: "block", justifyContent: "center" }}>
                <Grid container justifyContent="center" sx={{ width: "30%", m: "0 auto " }}>
                  <Grid item>
                    <CircularProgress disableShrink size={"4rem"} />
                  </Grid>
                </Grid>

                <Button
                  className="mintbuttons"
                  variant="Text"
                  sx={{
                    fontSize: "13px",
                    margin: "0px 0px 10px 0px",
                    color: "#2196f3"
                  }}
                  size="small"
                >
                  this NFT is being minted...
                </Button>
              </DialogActions>
            ) : ( */}
            <>
              <Button
                sx={{
                  color: theme.palette.error.dark,
                  borderColor: theme.palette.error.dark
                }}
                onClick={handleClose}
                color="secondary"
              >
                No
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  if (!mintNftoading) {
                    if (true) {
                      handleListItem();
                    } else {
                      if (nftData.mintType === "directMint") {
                        checkWallet();
                        handleDirectMint();
                      } else if (nftData.mintType === "lazyMint") {
                        handleLazyMint();
                      }
                    }
                  }
                }}
              >
                Yes
              </Button>
            </>
            {/* )} */}
          </>
        </DialogActions>
      </Dialog>
    </>
  );
}
