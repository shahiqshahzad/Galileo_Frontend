import React, { useState } from "react";
import { ethers } from "ethers";
import { Stack } from "@mui/system";
import { toast } from "react-toastify";
import { fetchEarnings, fetchWithdrawHistroy } from "redux/subAdmin/actions";
import { useDispatch, useSelector } from "react-redux";
import GalileoEscrow from "contractAbi/GalileoEscrow.js";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { useWeb3 } from "utils/MagicProvider";
import { checkWallet } from "utils/utilFunctions";
import { useActiveAccount } from "thirdweb/react";

export const AvailableFundsCard = ({ earningsData, setLoading }) => {
  const account = useActiveAccount();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { provider, signer } = useWeb3();

  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const userWalletAddress = useSelector((state) => state.auth?.walletAddress);
  const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);

  const AddressType = {
    OWNER: 0,
    PLATFORM: 1
  };

  //   const checkWallet = async () => {
  //     // const response = await window?.ethereum?.request({ method: "eth_requestAccounts" });
  //     // let connectWallet = await window?.ethereum._metamask.isUnlocked();

  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress()
  // ;
  //    if (address !== user.walletAddress) {
  //       dispatch({
  //         type: SNACKBAR_OPEN,
  //         open: true,
  //         message: "Please connect your registered Wallet Address",
  //         variant: "alert",
  //         alertSeverity: "info"
  //       });
  //     } else {
  //       return true;
  //     }
  //   };

  const handleWithdraw = async () => {
    if (
      (await checkWallet(provider, dispatch, account, user.walletAddress)) !== null
    ) {
      try {
        setWithdrawLoading(true);
        
        const escrowContract = new ethers.Contract(GalileoEscrow.address, GalileoEscrow.abi, signer);
        let tx = await (
          await escrowContract
            .withdrawFunds(AddressType.OWNER, earningsData.collectionAddresses, earningsData.tokenIdsToWithdraw)
            .catch((error) => {
              setWithdrawLoading(false);
              return toast.error(`${error.message}`);
            })
        ).wait();

        if (tx?.status === 1) {
          toast.success("Withdraw Successful");
          setWithdrawLoading(false);

          setLoading(true);
          dispatch(fetchEarnings({ setLoading }));
          dispatch(fetchWithdrawHistroy());
        } else {
          toast.error("Withdraw Transaction failed");
          setWithdrawLoading(false);
          setLoading(false);
        }
      } catch (error) {
        setWithdrawLoading(false);
        setLoading(false);
        toast.error(error?.reason || error?.message || "Error while withdrawing funds");
      }
    }
  };

  return (
    <Stack sx={{ width: "30em" }}>
      <Typography
        className="HeaderFonts"
        variant="h4"
        sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}
      >
        Available
      </Typography>

      <Stack sx={{ background: "#181C1F", padding: "1em", borderRadius: "10px", mt: "1em", height: "19em" }}>
        <Typography
          className="app-text"
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#757575"
          }}
        >
          Available for withdrawal
        </Typography>
        <Typography variant="h2" fontWeight={500} my={1} className="app-text">
          ${earningsData?.availableTotalFunds.toFixed(2)}
        </Typography>
        <Typography variant="h4" fontWeight={500} my={"3px"} color={"#757575"} className="app-text">
          {earningsData?.availableTotalFunds.toFixed(2)} {earningsData?.currencySymbol}
        </Typography>
        <Typography
          sx={{ opacity: "0" }}
          variant="h4"
          fontWeight={500}
          my={"3px"}
          color={"#757575"}
          className="app-text"
        >
          4 USDC
        </Typography>

        <Button
          variant="contained"
          sx={{
            paddingX: "4em",
            paddingY: "10px",
            borderRadius: "8px",
            background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
            fontSize: "14px",
            my: "1.5em",
            width: "15rem"
          }}
          disabled={earningsData?.availableTotalFunds === 0}
          onClick={handleWithdraw}
          className="app-text"
        >
          {withdrawLoading ? <CircularProgress size={25} color="info" /> : "Withdraw Balance"}
        </Button>
        <Typography sx={{ fontWeight: "400", my: "3px", color: "#2F53FF" }} className="app-text">
          Amount will be withdrawn to{" "}
          <Tooltip
            title={userWalletAddress ? userWalletAddress : user?.userWalletAddress}
            placement="right"
            arrow
            className="app-text"
          >
            <span style={{ cursor: "pointer" }} className="app-text">
              {userWalletAddress
                ? userWalletAddress.slice(0, 5) + "..." + userWalletAddress.slice(39, 42)
                : user?.walletAddress?.slice(0, 5) + "..." + user?.walletAddress?.slice(36, 40)}
            </span>
          </Tooltip>
        </Typography>
      </Stack>
    </Stack>
  );
};
