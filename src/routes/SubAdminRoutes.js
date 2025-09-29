import React, { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import AdminGuard from "./RouteGuard/AdminGuard";
import MyActivitySubAdmin from "views/pages/subAdmin/activity/MyActivitySubAdmin";
import ActivityMintDetail from "views/pages/brandAdmin/activityDashboard/component/ActivityMintDetail";
// const Starting = Loadable(lazy(() => import('views/pages/local/startingPage')));

// const SubAdminDashboard = Loadable(lazy(() => import("views/pages/subAdmin/dashboard")));

// const Starting = Loadable(lazy(() => import("views/pages/subAdmin/dashboard")));
const ChangePassword = Loadable(lazy(() => import("shared/changePassword/component/ChangePassword")));
const Brand = Loadable(lazy(() => import("views/pages/superAdmin/brands")));
const BrandAdmin = Loadable(lazy(() => import("views/pages/superAdmin/brands/brandAdmin")));
const BrandCategory = Loadable(lazy(() => import("views/pages/subAdmin/brands/brandCategory")));
const Category = Loadable(lazy(() => import("views/pages/superAdmin/categories")));
const NftManagement = Loadable(lazy(() => import("views/pages/superAdmin/nftManagement")));
const BrandsByAdmin = Loadable(lazy(() => import("views/pages/subAdmin/brands")));
// const AuthLogout = Loadable(lazy(() => import("views/auth/logout")));
const BulkNft = Loadable(lazy(() => import("views/pages/superAdmin/nftManagement/component/bulkNft")));
const Reports = Loadable(lazy(() => import("views/pages/subAdmin/reports")));
const Addresses = Loadable(lazy(() => import("views/pages/staticCode/creatorProfile/Addresses")));
const GeneralSetting = Loadable(lazy(() => import("views/pages/subAdmin/generalSetting")));
const Earnings = Loadable(lazy(() => import("views/pages/subAdmin/earnings")));
const MyActivityDetailCard = Loadable(lazy(() => import("views/pages/subAdmin/activity/MyActivityDetailCard")));
const AddProduct = Loadable(lazy(() => import("views/pages/subAdmin/nftManagement/addProduct/addProduct")));
const SellCrypto = Loadable(lazy(() => import("views/pages/subAdmin/sellCrypto")));
// ==============================|| MAIN ROUTING ||============================== //

const SubAdminRoutes = {
  id: "Admin",
  path: "/",
  element: (
    <AdminGuard>
      <MainLayout />
    </AdminGuard>
  ),
  type: "group",
  children: [
    // {
    //   path: "/",
    //   element: <Starting />
    // },
    // {
    //   path: '/logout',
    //   element: <AuthLogout />,
    // },
    // {
    //   path: "/dashboard",
    //   element: <SubAdminDashboard />
    // },
    {
      path: "/ChangePassword",
      element: <ChangePassword />
    },
    {
      path: "/addProduct",
      element: <AddProduct />
    },
    {
      path: "/editProduct/:nftId",
      element: <AddProduct />
    },

    {
      path: "/brands",
      element: <Brand />
    },
    {
      path: "/brandsByAdmin",
      element: <BrandsByAdmin />
    },
    {
      path: "/brands/admin",
      element: <BrandAdmin />
    },
    {
      path: "/brandsByAdmin/category",
      element: <BrandCategory />
    },
    {
      path: "/categories",
      element: <Category />
    },

    {
      path: "/nftManagement/:categoryId/:brandId",
      element: <NftManagement />
    },
    {
      path: "/bulkNft/:bulkId/:categoryId/:BrandId",
      element: <BulkNft />
    },
    {
      path: "/reports",
      element: <Reports />
    },
    {
      path: "/addresses",
      element: <Addresses />
    },
    {
      path: "/generalSetting",
      element: <GeneralSetting />
    },
    {
      path: "/earnings",
      element: <Earnings />
    },
    { path: "/activity", element: <MyActivitySubAdmin /> },
    { path: "/ActivityDashboardDetail/:orderId", element: <MyActivityDetailCard /> },
    {
      path: "/activity-dashboard-mint/:orderId",
      element: <ActivityMintDetail />
    },
    {
      path: "/sell-crypto",
      element: <SellCrypto />
    }
  ]
};
export default SubAdminRoutes;
