import { ethers } from "ethers";
import NFTAbi from "../contractAbi/NFT.json";
import axios from "axios";

export const updateSingleUri = async (data, token) => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  let tokenIds = [];
  let tokenUris = [];

  const { contractAddress, tokenId, updateUriReason, tokenPId } = data;
  tokenIds.push(tokenId);
  const { data: result } = await axios.post(`${process.env.REACT_APP_API_URL}nft/createUpdateUri`, {
    tokenId,
    tokenPId
  },
  headers
  );
  const tokenUri = result?.data?.tokenUri;
  tokenUris.push(tokenUri);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

  const { hash: transactionHash } = await contract.bulkUpdateUri(tokenIds, tokenUris);

  await axios.post(
    `${process.env.REACT_APP_API_URL}nft/updateUrilink`,
    {
      transactionHash,
      tokenId,
      tokenPId,
      tokenUri,
      updateUriReason: updateUriReason ? updateUriReason : null
    },
    headers
  );
};
