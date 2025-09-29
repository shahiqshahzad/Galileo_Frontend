import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SNACKBAR_OPEN } from "store/actions";

import { useSelector, useDispatch } from "react-redux";
import { ethers, utils } from "ethers";
import { Button } from "@mui/material";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { setWallet } from "../../../../redux/auth/actions";
const MetaMaskSection = () => {
  console.log("METAMASK section")
  const dispatch = useDispatch();
  const [walletAddress, setWalletAddress] = useState();
  const handleConnect = async () => {
    if (!window.ethereum) {
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "No crypto wallet found. Please install it.",
        variant: "alert",
        alertSeverity: "info"
      });
      // toast.error('No crypto wallet found. Please install it.');
    }

    const response = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (response) {
      const address = utils?.getAddress(response[0]);
      setWalletAddress(address);
      dispatch({
        type: SNACKBAR_OPEN,
        open: true,
        message: "Success",
        variant: "alert",
        alertSeverity: "success"
      });
    } else {
      // toast.error('No crypto wallet found. Please install it.');
    }
  };

  useEffect(() => {
    dispatch(setWallet(walletAddress));
  }, [walletAddress]);
  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          handleConnect();
        }}
      >
        {walletAddress ? walletAddress.slice(0, 5) + "..." + walletAddress.slice(38, 42) : "Connect"}
      </Button>
    </>
  );
};

export default MetaMaskSection;
