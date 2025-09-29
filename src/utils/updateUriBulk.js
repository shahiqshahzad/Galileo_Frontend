import { ethers } from "ethers";
import NFTAbi from "../contractAbi/NFT.json";
import axios from "axios";

export const updateUriBulk = async (data, token) => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const { contractAddress, tokenIds, nftTokenIds } = data;

  const tokenUris = await Promise.all(
    tokenIds.map(async (item, index) => {
      const { data: result } = await axios.post(
        `${process.env.REACT_APP_API_URL}nft/createUpdateUri`,
        {
          tokenId: item?.tokenId,
          tokenPId: item?.tokenPId
        },
        headers
      );

      return result.data?.tokenUri;
    })
  );

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

  const { hash: transactionHash } = await contract.bulkUpdateUri(nftTokenIds, tokenUris);

  await Promise.all(
    tokenUris.map(async (tokenUri, index) => {
      await axios.post(
        `${process.env.REACT_APP_API_URL}nft/updateUrilink`,
        {
          transactionHash,
          tokenId: tokenIds[index]?.tokenId,
          tokenPId: tokenIds[index]?.tokenPId,
          tokenUri
        },
        headers
      );
    })
  );
};
