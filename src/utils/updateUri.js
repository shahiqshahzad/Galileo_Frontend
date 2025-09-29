import { ethers } from "ethers";
import { toast } from "react-toastify";
import NFTAbi from "../contractAbi/NFT.json";
import axios from "axios";
import { mintLoaderNft } from "redux/nftManagement/actions";

export const updateUri = async (data, token, dispatch) => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  try {
    if (typeof data.nftDataArray !== "object") {
      data.nftDataArray = JSON.parse(data.nftDataArray);
    }

    if (typeof data.tokenIdArray !== "object") {
      data.tokenIdArray = JSON.parse(data.tokenIdArray);
    }

    const contractAddress = data.tokenIdArray[0].contractAddress;
    const tokenIds = data.tokenIdArray.map((data) => data.tokenId);

    const tokenUris = await Promise.all(
      data.tokenUriArray.map(async (tokenUri, index) => {
        const { data: result } = await axios.post(
          `${process.env.REACT_APP_API_URL}nft/createUpdateUri`,
          {
            tokenId: data.tokenIdArray[index].tokenId,
            tokenPId: data.tokenIdArray[index].id
          },
          headers
        );

        return result.data?.tokenUri;
      })
    );

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

    const { hash: transactionHash } = await contract.bulkUpdateUri(tokenIds, tokenUris);

    await Promise.all(
      tokenUris.map(async (tokenUri, index) => {
        await axios.post(
          `${process.env.REACT_APP_API_URL}nft/updateUrilink`,
          {
            transactionHash,
            tokenId: data.tokenIdArray[index].tokenId,
            tokenPId: data.tokenIdArray[index].id,
            tokenUri
          },
          headers
        );
      })
    );

    // Commented out as we're handling the error with try/catch
    // await contract.bulkUpdateUri(tokenIds, tokenUris).catch((error) => {
    //   console.log(error);
    //   toast.error(error.reason);
    //   console.log('error', error);
    // })
  } catch (error) {
    toast.error(error.reason);
    dispatch(mintLoaderNft(false));
  }
};
