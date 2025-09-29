import React, { useState, useEffect } from "react";
import { Stack } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { AddAddressDlg } from "./AddAddressDlg";
import DeleteAddressDlg from "./DeleteAddressDlg";
import { getAllAddresses } from "redux/addresses/actions";
import { useDispatch, useSelector } from "react-redux";
import DefaultAddressDlg from "./DefaultAddressDlg";
import { Country, State } from "country-state-city";
import { Button, Tooltip, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PhoneNumber from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { KycAddressCard } from "./KycAddressCard";
import "./style.css";

const CustomListItem = ({ text, color }) => {
  return (
    <Typography sx={{ color: color }}>
      <FiberManualRecordIcon sx={{ height: "10px" }} />
      <span>{text || ""}</span>
    </Typography>
  );
};

const Addresses = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userAddresses = useSelector((state) => state.addresses.addressesList);

  const color = theme.palette.mode === "light" ? "black" : "white";
  const textColor = theme.palette.mode === "light" ? "black" : "#B1B1B1";

  const [type, setType] = useState("Add");
  const [selectedAddress, setSelectedAddress] = useState();
  const [openAddAddressDlg, setOpenAddAddressDlg] = useState(false);
  const [openDeleteAddressDlg, setOpenDeleteAddressDlg] = useState(false);
  const [openDefaultAddressDlg, setOpenDefaultAddressDlg] = useState(false);

  useEffect(() => {
    dispatch(getAllAddresses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayStreetAddress = (item) => {
    const houseNumber = item?.houseNo || "";
    const address1 = item.area || "";
    const mergedAddress = `${houseNumber} ${address1}`;
    const addressToDisplay = mergedAddress.length > 35 ? `${mergedAddress.slice(0, 35)}..` : mergedAddress;

    return `Address: ${addressToDisplay}`;
  };

  return (
    <Stack sx={{ position: "relative" }}>
      <Stack sx={{ position: "absolute", top: "25px", left: "20px" }}>
        <ArrowBackIosIcon
          onClick={() => navigate(-1)}
          sx={{ color: "#2F53FF", height: "2rem", width: "2rem", cursor: "pointer" }}
        />
      </Stack>
      <Stack padding={"2em 5em"} marginLeft={"3rem"}>
        <Typography sx={{ color: color, fontSize: "20px" }}>
          {user?.role === "Sub Admin" ? "Warehouse addresses" : "Your Addresses"}
        </Typography>
        <Stack
          sx={{
            width: "100%",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            flexDirection: "row",
            marginTop: "2rem",
            gap: "1em"
          }}
        >
          <Stack
            onClick={() => {
              setType("Add");
              setSelectedAddress(null);
              setOpenAddAddressDlg(true);
            }}
            className="addressCard "
            sx={{
              cursor: "pointer",
              border: "2px dotted",
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              justifyContent: "center",
              alignItems: "center",
              height: "22em"
            }}
          >
            <AddIcon sx={{ height: "30px", width: "30px" }} />
            <Typography sx={{ color: color, fontSize: "20px" }}>Add Address</Typography>
          </Stack>
          {userAddresses?.length
            ? userAddresses
                .slice()
                .sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1))
                .map((item, i) => {
                  return (
                    <React.Fragment key={i}>
                      {item?.isKycAddress ? (
                        <KycAddressCard
                          index={i}
                          item={item}
                          color={color}
                          textColor={textColor}
                          CustomListItem={CustomListItem}
                          setSelectedAddress={setSelectedAddress}
                          setOpenDefaultAddressDlg={setOpenDefaultAddressDlg}
                        />
                      ) : (
                        <Stack
                          className="addressCard "
                          sx={{
                            border: "2px solid",
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "12px",
                            height: "22em",
                            minHeight: "fit-content"
                          }}
                        >
                          <Stack
                            sx={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "7px 10px 0 10px"
                            }}
                          >
                            <Typography sx={{ color: textColor }}>
                              {item?.isDefault && "Default: "}
                              <Tooltip placement="top" title={item.tag}>
                                <span>{item.tag.length > 20 ? `${item.tag.slice(0, 20)}...` : item.tag}</span>
                              </Tooltip>
                            </Typography>
                            <CloseIcon
                              sx={{ height: "35px", width: "35px", cursor: "pointer" }}
                              onClick={() => {
                                setSelectedAddress(item);
                                setOpenDeleteAddressDlg(true);
                              }}
                            />
                          </Stack>
                          <Stack sx={{ borderBottom: "1.5px solid", borderColor: color }} />
                          <Stack sx={{ padding: "10px", height: "100%" }}>
                            <Typography sx={{ color: color, mb: "1rem", fontSize: "18px" }}>
                              <Tooltip placement="top" title={item.fullName}>
                                <span>
                                  {item.fullName.length > 20 ? `${item.fullName.slice(0, 20)}...` : item.fullName}
                                </span>
                              </Tooltip>
                            </Typography>
                            <Stack>
                              <Tooltip title={item.area} placement="top" arrow>
                                <span>
                                  <CustomListItem color={textColor} text={displayStreetAddress(item)} />
                                </span>
                              </Tooltip>
                              <CustomListItem color={textColor} text={`City: ${item.city}`} />
                              <CustomListItem
                                color={textColor}
                                text={`State/province/area: ${State.getStateByCodeAndCountry(item.state, item.country)?.name}`}
                              />
                              <CustomListItem color={textColor} text={`Phone number: ${item.mobileNumber}`} />
                              <CustomListItem color={textColor} text={`Zip code: ${item.pinCode}`} />
                              {PhoneNumber(item?.mobileNumber)?.countryCallingCode && (
                                <CustomListItem
                                  color={textColor}
                                  text={`Country calling code: +${PhoneNumber(item.mobileNumber)?.countryCallingCode}`}
                                />
                              )}
                              <CustomListItem
                                color={textColor}
                                text={`Country: ${Country.getCountryByCode(item.country)?.name}`}
                              />
                            </Stack>
                            <Stack
                              sx={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "10px",
                                marginTop: "auto"
                              }}
                            >
                              {!item.isDefault && (
                                <Button
                                  onClick={() => {
                                    setSelectedAddress(item);
                                    setOpenDefaultAddressDlg(true);
                                  }}
                                  variant={"outlined"}
                                  sx={{ borderRadius: "8px", border: "1px solid" }}
                                >
                                  Set As Default
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  setType("Edit");
                                  setSelectedAddress(item);
                                  setOpenAddAddressDlg(true);
                                }}
                                variant={"outlined"}
                                sx={{ borderRadius: "8px", border: "1px solid", borderColor: color, color: textColor }}
                              >
                                Edit
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      )}
                    </React.Fragment>
                  );
                })
            : ""}
        </Stack>
      </Stack>
      <AddAddressDlg
        type={type}
        open={openAddAddressDlg}
        selectedAddress={selectedAddress}
        handleClose={() => setOpenAddAddressDlg(false)}
      />
      <DeleteAddressDlg
        id={selectedAddress?.id}
        open={openDeleteAddressDlg}
        handleClose={() => setOpenDeleteAddressDlg(false)}
      />
      <DefaultAddressDlg
        id={selectedAddress?.id}
        open={openDefaultAddressDlg}
        handleClose={() => setOpenDefaultAddressDlg(false)}
      />
    </Stack>
  );
};

export default Addresses;
