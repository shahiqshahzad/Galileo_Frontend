// third-party
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { FormattedMessage } from "react-intl";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptIcon from "@mui/icons-material/Receipt";

// assets
import {
  IconDashboard,
  IconCheckbox,
  IconDeviceAnalytics,
  IconCash,
  IconUserCheck,
  IconBell,
  IconReceipt2,
  IconClipboardList,
  IconLayout2,
  IconBuildingStore,
  IconCurrencyEthereum
} from "@tabler/icons";
import { Icons } from "shared/Icons/Icons";
// constant
const icons = {
  IconDashboard,
  IconDeviceAnalytics,
  IconUserCheck,
  IconReceipt2,
  IconClipboardList,
  IconBell,
  IconCheckbox,
  IconCash,
  IconLayout2,
  IconBuildingStore,
  IconCurrencyEthereum,
  DashboardIcon,
  AccountCircleIcon,
  PaymentsIcon,
  SettingsSuggestIcon,
  ReceiptIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const superAdminMenu = {
  id: "Super Admin",
  // title: <FormattedMessage id="dashboard" />,
  type: "group",
  children: [
    // {
    //   id: "dashboard",
    //   title: <FormattedMessage id="admin.dashboard" />,
    //   type: "item",
    //   url: "/dashboard",
    //   icon: icons.DashboardIcon,

    //   breadcrumbs: false
    // },

    {
      id: "subAdminManagement",
      title: <FormattedMessage id="admin.adminManagement" />,
      type: "item",
      url: "/subAdminManagement",
      icon: icons.AccountCircleIcon,
      breadcrumbs: false
    },
    {
      id: "categories",
      title: <FormattedMessage id="categories" />,
      type: "item",
      icon: icons.IconCheckbox,
      url: "/categories",
      breadcrumbs: false
    },

    {
      id: "brands",
      title: <FormattedMessage id="admin.BrandManagement" />,
      type: "item",
      icon: icons.IconBuildingStore,
      url: "/brands",
      breadcrumbs: false
    },
    {
      id: "fees",
      title: "Configurations",
      type: "item",
      icon: icons.PaymentsIcon,
      url: "fees",
      breadcrumbs: false
    },
    {
      id: "general-settings",
      title: "General Settings",
      type: "item",
      icon: icons.SettingsSuggestIcon,
      url: "general-settings",
      breadcrumbs: false
    },
    {
      id: "earnings",
      title: "Earnings",
      type: "item",
      icon: icons.SettingsSuggestIcon,
      svgIcon: Icons.SuperAdminEarning,
      svgLightIcon: Icons.SuperAdminEarningHover,
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
    }
  ]
};

export default superAdminMenu;
