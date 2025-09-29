// third-party
import { FormattedMessage } from "react-intl";

// assets
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  IconDashboard,
  IconDeviceAnalytics,
  IconCheckbox,
  IconUser,
  IconUserCheck,
  IconReceipt2,
  IconClipboardList
} from "@tabler/icons";
import React from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Icons } from "shared/Icons/Icons";

// constant
const icons = {
  IconCheckbox,
  IconDashboard,
  IconDeviceAnalytics,
  IconUserCheck,
  IconUser,
  IconReceipt2,
  IconClipboardList,
  ReceiptIcon,
  SettingsSuggestIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const subAdminMenu = {
  id: "Sub Admin",
  type: "group",
  children: [
    // {
    //   id: "dashboard",
    //   title: <FormattedMessage id="admin.dashboard" />,
    //   type: "item",
    //   url: "/dashboard",
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false
    // },

    // {
    //     id: 'categories',
    //     title: <FormattedMessage id="categories" />,
    //     type: 'item',
    //     icon: icons.IconCheckbox,
    //     url: '/categories',
    //     breadcrumbs: false
    // },

    {
      id: "nftManagement",
      title: <FormattedMessage id="subAdmin.ProductManagement" />,

      type: "item",
      icon: icons.IconCheckbox,
      url: "/brandsByAdmin",
      breadcrumbs: false
    },
    {
      id: "activity",
      title: <FormattedMessage id="Order Dashboard" />,
      type: "item",
      icon: icons.SettingsSuggestIcon,
      svgIcon: Icons.activityLighSidebarIcon,
      svgLightIcon: Icons.activitySidbarIcon,
      url: "/activity",
      breadcrumbs: false
    },
    {
      id: "earnings",
      title: <FormattedMessage id="Earnings" />,
      type: "item",
      icon: icons.SettingsSuggestIcon,
      svgIcon: Icons.earningsLightIcon,
      svgLightIcon: Icons.earningsIcon,
      url: "/earnings",
      breadcrumbs: false
    },
    {
      id: "reports",
      title: <FormattedMessage id="reports" />,
      type: "item",
      url: "/reports",
      icon: icons.ReceiptIcon,
      breadcrumbs: false
    },
    {
      id: "generalSetting",
      title: <FormattedMessage id="General Settings" />,
      type: "item",
      icon: icons.SettingsSuggestIcon,
      url: "/generalSetting",
      breadcrumbs: false
    },
    {
      id: "sell-crypto",
      title: <FormattedMessage id="Sell Crypto" />,
      type: "item",
      icon: SwapVertIcon,
      url: "/sell-crypto",
      breadcrumbs: false
    }
  ]
};

export default subAdminMenu;
