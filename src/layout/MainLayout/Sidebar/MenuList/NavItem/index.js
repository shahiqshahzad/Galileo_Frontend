import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";

// project imports
import { MENU_OPEN } from "store/actions";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React from "react";
import { AddProductWarningDialog } from "views/pages/subAdmin/nftManagement/utils/warningDlg";

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const customization = useSelector((state) => state.customization);

  const Icon = item.icon;
  const itemIcon = item.svgIcon ? (
    item.svgIcon
  ) : item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }
  let itemUrl =
    item.url === "/brandsByAdmin" && user?.role === "Sub Admin"
      ? `/nftManagement/${user?.CategoryId}/${user?.BrandId}?pageNumber=1&filter=draft`
      : item.url;

  let listItemProps = {
    component: forwardRef((props, ref) => <Link ref={ref} {...props} to={itemUrl} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, [document.location.pathname]);

  const handleStay = () => {
    navigate(itemUrl);
    setOpenDialog(false);
  };

  return (
    <>
      <ListItemButton
        {...listItemProps}
        onClick={(e) => {
          if (document.location.pathname === "/addProduct" || document.location.pathname.includes("/editProduct")) {
            e.preventDefault();
            setOpenDialog(true);
          }
        }}
        disabled={item.disabled}
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 12}px`,
          pr: "0px",
          ":hover": {
            backgroundColor: "#7c4dff15"
          }
        }}
        selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      >
        <ListItemIcon
          className="icons"
          sx={{
            my: "auto",
            minWidth: !item?.icon ? 18 : 36,
            color: theme.palette.mode === "light" ? " #000 " : "#98A2B2"
          }}
        >
          {item.svgLightIcon && customization.isOpen.findIndex((id) => id === item.id) > -1
            ? item.svgLightIcon
            : itemIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              className="icons stylingtitle"
              sx={{ color: theme.palette.mode === "light" ? " #000 " : "#98A2B2" }}
              variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? "h5" : "body1"}
            >
              {item.id === "sbtToken" ? <Tooltip title="Coming Soon"> {item.title}</Tooltip> : item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                {item.caption}
              </Typography>
            )
          }
        />
        {item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItemButton>
      <AddProductWarningDialog open={openDialog} handleStay={handleStay} handleClose={() => setOpenDialog(false)} />
    </>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
