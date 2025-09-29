import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Stack } from "@mui/system";
import { Tooltip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllAddresses } from "redux/addresses/actions";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";

import copyIcon from "assets/images/profile/copy.svg";
import editIcon from "assets/images/profile/edit-2.svg";
import walletIcon from "assets/images/profile/wallet.svg";
import supportIcon from "assets/images/profile/suppot.svg";
import verifiedIcon from "assets/images/profile/verified.svg";
import userAvatar from "assets/images/profile/user-avatar.svg";
import initiateKycIcon from "assets/images/profile/initiate-kyc.svg";
import failedKycIcon from "assets/images/profile/kycFailedIcon.svg";
import completedKycIcon from "assets/images/profile/kycCompleteIcon.svg";
import defaultAddressIcon from "assets/images/profile/default-address.svg";
import referalCode from "assets/images/profile/referalCode.svg";
import { copyToClipboard, formatEthereumAddress } from "utils/utilFunctions";
import ReferalCodeDlg from "./ReferalCodeDlg";
import ThirdWebConnectButton from "views/auth/login/component/thirdWebConnectButton";

const CardComponent = ({
  icon,
  iconStyle,
  title,
  copyIcon,
  editIcon,
  description,
  verifiedIcon,
  walletAddress,
  onClick,
  navigate
}) => {
  return (
    <>
      <Stack
        className="userCard"
        onClick={() => {
          onClick && onClick();
        }}
        sx={{
          cursor: onClick ? "pointer" : "",
          display: "flex",
          flexDirection: "row",
          padding: "8px",
          borderRadius: "4px",
          background: "#181C1F",
          height: "83px",
          marginBottom: "10px"
        }}
      >
        <div
          style={
            iconStyle?.border
              ? {
                  paddingTop: "3px",
                  paddingLeft: "7px",
                  paddingRight: "7px"
                }
              : {}
          }
        >
          <img src={icon} alt="" style={{ width: "70px", height: "70px", ...iconStyle }} />
        </div>
        <Stack sx={{ paddingLeft: "12px", paddingTop: "10px", width: "100%", position: "relative" }}>
          <Typography component={"span"} sx={{ fontWeight: "bold", display: "flex" }} className="app-text">
            {title || ""}
            {verifiedIcon && <img src={verifiedIcon} alt="" style={{ paddingLeft: "5px", width: "17px" }} />}
            {editIcon && (
              <Tooltip placement="top-start" title="Modify or add addresses">
                <img
                  alt=""
                  src={editIcon}
                  onClick={() => navigate("/addresses")}
                  style={{
                    paddingLeft: "5px",
                    width: "25px",
                    marginLeft: "auto",
                    cursor: "pointer",
                    position: "absolute",
                    top: "0",
                    right: "2px"
                  }}
                />
              </Tooltip>
            )}
          </Typography>
          <Typography
            component={"span"}
            sx={{ fontSize: walletAddress ? "15px" : "13px", color: "#CDCDCD", paddingTop: "10px" }}
            className="app-text"
          >
            {walletAddress ? formatEthereumAddress(walletAddress) : description}{" "}
            {copyIcon && (
              <img
                alt=""
                src={copyIcon}
                // onClick={() => copyToClipboard(walletAddress)}
                style={{ marginLeft: "15px", cursor: "pointer" }}
              />
            )}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export const UserInfoCards = ({
  user,
  kycStatus,
  navigate,
  openSupportDlg,
  configureIdentityClient,
  kycAttemptsScore
}) => {
  const theme = useTheme();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const userAddresses = useSelector((state) => state.addresses.addressesList);
  const [defaultAddress, setDefaultAddress] = useState(null);

  useEffect(() => {
    dispatch(getAllAddresses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleDocs = () => {
  //   window.open("https://galileo-protocol.gitbook.io/galileo-marketplace-guide/", "_blank");
  // };

  const handleSupport = () => {
    window.open("https://galileonetwork.zohodesk.eu/portal/en/kb", "_blank");
  };
  const handleConnectButtonFocus = () => {
    const button = inputRef.current.querySelector('button');
    button.click()
  }
  const [isOpen, setIsOpen] = useState(false);
  const [referalCodeOpen, setReferalCodeOpen] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
  };
  const kycPoints = [
    "Make sure that you are using valid identity document.",
    "The Full Name you are entering is as it is in the ID submitted.",
    "Your image on ID document is clear, non-blurry and recent.",
    "You are at a well lit place while taking your picture."
  ];
  const linearGradient = "linear-gradient(98deg, #2F57FF 0%, #2FA3FF 108.45%)";
  const handleKycModal = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    if (userAddresses?.length) {
      const defaultObject = userAddresses.find((obj) => obj.isDefault === true);
      if (defaultObject?.isKycAddress) {
        setDefaultAddress("KYC Address");
      } else {
        setDefaultAddress(defaultObject?.tag);
      }
    }
  }, [userAddresses]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <Typography
            variant="h2"
            fontSize="25px"
            color="#ffffff"
            fontWeight="500"
            fontFamily={theme?.typography.appText}
          >
            Before starting the KYC process please ensure the following
          </Typography>
          <List sx={{ mt: 1 }}>
            {kycPoints.map((item, index) => (
              <ListItem key={index} sx={{ py: 0, my: 0, pl: 0.3 }}>
                <ListItemText
                  primary={`${index + 1}. ${item}`}
                  primaryTypographyProps={{
                    style: { color: "#98A2B2", fontFamily: theme?.typography.appText, fontSize: "16px" }
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box textAlign="center">
            <Button
              variant="contained"
              sx={{
                background: `var(--Linear, ${linearGradient})`,
                color: "white",
                "&:hover": {
                  background: `var(--Linear, ${linearGradient})`
                },
                padding: " 10px 29px 10px 28px",
                fontFamily: "DM SANS",
                fontStyle: "normal",
                fontSize: "17.625px"
              }}
              onClick={() => {
                configureIdentityClient();
                setIsOpen(false);
              }}
            >
              OK , Proceed
            </Button>
          </Box>
        </Box>
      </Modal>
      <ReferalCodeDlg open={referalCodeOpen} setOpen={setReferalCodeOpen} referalCode={user?.referalCode} />
      <Stack
        sx={{
          width: "100%",
          paddingTop: "15px",
          marginLeft: { xs: "1rem", sm: "1rem", md: "1rem", lg: "3rem" },
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          flexDirection: "row"
        }}
      >
        <CardComponent
          className="app-text"
          icon={user?.UserProfile?.profileImg ? user?.UserProfile?.profileImg : userAvatar}
          iconStyle={
            user?.UserProfile?.profileImg
              ? { borderRadius: "5px", border: "1px solid #2f6cfe", width: "55px", height: "58px" }
              : {}
          }
          verifiedIcon={kycStatus === "KYC Completed" ? verifiedIcon : null}
          title={`${user?.firstName} ${user?.lastName}`}
          description={user?.email}
        />
        {(user?.role === "User" || user?.role === "Sub Admin") && (
          <CardComponent
            icon={defaultAddressIcon}
            title="Default Address"
            description={defaultAddress ? defaultAddress : "Not Available"}
            editIcon={editIcon}
            navigate={navigate}
          />
        )}
        <CardComponent icon={supportIcon} title="Support Center" description="Contact Us" onClick={handleSupport} />
        <Box sx={{ opacity: 0, width: 0, height:0 }} ref={inputRef}>
          <ThirdWebConnectButton />
        </Box>
        <CardComponent
          icon={walletIcon}
          walletAddress={user?.walletAddress}
          title="Registered Wallet"
          copyIcon={copyIcon}
          onClick={handleConnectButtonFocus}
        />
        {user?.role === "User" && (
          <CardComponent
            title={kycStatus}
            icon={
              kycStatus === "Initiate KYC"
                ? initiateKycIcon
                : kycStatus === "KYC Completed"
                  ? completedKycIcon
                  : failedKycIcon
            }
            onClick={kycStatus !== "KYC Completed" ? handleKycModal : () => {}}
            description={
              kycStatus === "Initiate KYC"
                ? "Click to start, will take 3-5 minutes"
                : kycStatus === "KYC Completed"
                  ? "KYC Completed"
                  : `Click to restart`
            }
          />
        )}
        {user?.role === "User" && (
          <CardComponent
            icon={referalCode}
            title={`Reward Points: ${user?.totalPoints}`}
            description="Click to refer and earn more"
            onClick={() => setReferalCodeOpen(true)}
          />
        )}
      </Stack>
    </>
  );
};
