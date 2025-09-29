import React from "react";
import { Stack } from "@mui/system";
import PhoneNumber from "libphonenumber-js";
import { Button, Tooltip, Typography } from "@mui/material";

export const KycAddressCard = ({
  index,
  item,
  color,
  textColor,
  CustomListItem,
  setSelectedAddress,
  setOpenDefaultAddressDlg
}) => {
  const displayStreetAddress = (item) => {
    const houseNumber = item?.addressLine1 || "";
    const address1 = item.area || "";
    const mergedAddress = `${houseNumber} ${address1}`;
    const addressToDisplay = mergedAddress.length > 35 ? `${mergedAddress.slice(0, 35)}..` : mergedAddress;

    return `Address: ${addressToDisplay}`;
  };
  return (
    <Stack
      key={index}
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
          padding: "15px 10px 9px 10px"
        }}
      >
        <Typography sx={{ color: textColor }}>
          {item?.isDefault && "Default: "}
          <Tooltip placement="top" title={item?.tag}>
            <span>{item?.tag?.length > 20 ? `${item?.tag.slice(0, 20)}...` : item?.tag}</span>
          </Tooltip>
        </Typography>
      </Stack>
      <Stack sx={{ borderBottom: "1.5px solid", borderColor: color }} />
      <Stack sx={{ padding: "10px", height: "100%" }}>
        <Typography sx={{ color: color, mb: "1rem", fontSize: "18px" }}>
          <Tooltip placement="top" title={item?.fullName}>
            <span>{item?.fullName?.length > 20 ? `${item?.fullName.slice(0, 20)}...` : item?.fullName}</span>
          </Tooltip>
        </Typography>
        <Stack>
          <Tooltip title={item.area} placement="top" arrow>
            <span>
              <CustomListItem color={textColor} text={displayStreetAddress(item)} />
            </span>
          </Tooltip>
          <CustomListItem color={textColor} text={`City: ${item?.city}`} />
          <CustomListItem color={textColor} text={`State/province/area: ${item?.state}`} />
          <CustomListItem color={textColor} text={`Phone number: ${item?.mobileNumber}`} />
          <CustomListItem color={textColor} text={`Zip code: ${item?.pinCode}`} />
          {item?.mobileNumber && PhoneNumber(item?.mobileNumber)?.countryCallingCode && (
            <CustomListItem
              color={textColor}
              text={`Country calling code: +${PhoneNumber(item.mobileNumber)?.countryCallingCode}`}
            />
          )}
          <CustomListItem color={textColor} text={`Country: ${item?.country}`} />
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
          {!item?.isDefault && (
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
        </Stack>
      </Stack>
    </Stack>
  );
};
