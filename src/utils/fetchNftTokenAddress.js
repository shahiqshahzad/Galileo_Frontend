import { ethers } from "ethers";
import FactoryAbi from "contractAbi/Factory.json";
import FactoryAddress from "contractAbi/Factory-address.js";
import { RPC_URLS } from "./constants";

export const fetchNftTokenAndAddress = async (serialNo) => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URLS.POLYGON_RPC_URL);
  const factoryAddr = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, provider);

  let res = await factoryAddr.serials(serialNo);

  let address = res[0].toLowerCase();
  let tokenId = parseInt(res[1]._hex);
  return { tokenId: tokenId.toString(), address };
};
