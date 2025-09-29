import React, { lazy } from "react";
// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import AdminGuard from "./RouteGuard/AdminGuard";
import ActivityDashboard from "views/pages/brandAdmin/activityDashboard";
import ActivityDetail from "views/pages/brandAdmin/activityDashboard/component/ActivityDetail";

// const BrandAdminDashboard = Loadable(lazy(() => import("views/pages/brandAdmin/dashboard")));
const Starting = Loadable(lazy(() => import("views/pages/brandAdmin/dashboard")));
const ChangePassword = Loadable(lazy(() => import("shared/changePassword/component/ChangePassword")));
const Category = Loadable(lazy(() => import("views/pages/brandAdmin/brandCategory")));
const DeliveryDashboard = Loadable(lazy(() => import("views/pages/brandAdmin/deliveryDashboard")));
const NftManagement = Loadable(lazy(() => import("views/pages/brandAdmin/nftManagement")));
const BulkNftManagement = Loadable(lazy(() => import("views/pages/brandAdmin/nftManagement/component/bulkNft")));
const AuthLogout = Loadable(lazy(() => import("views/auth/logout")));
const ActivityMintDetail = Loadable(
  lazy(() => import("views/pages/brandAdmin/activityDashboard/component/ActivityMintDetail"))
);
const BrandAdminRoutes = {
  path: "/",
  element: (
    <AdminGuard>
      <MainLayout />
    </AdminGuard>
  ),
  children: [
    {
      path: "/",
      element: <Starting />
    },
    {
      path: "/logout",
      element: <AuthLogout />
    },
    // {
    //   path: "/dashboard",
    //   element: <BrandAdminDashboard />
    // },
    {
      path: "/ChangePassword",
      element: <ChangePassword />
    },
    {
      path: "/categories",
      element: <Category />
    },
    {
      path: "/deliveryDashboard",
      element: <DeliveryDashboard />
    },
    {
      path: "/nftManagement/:categoryId/:brandId",
      element: <NftManagement />
    },
    {
      path: "/bulkNft/:bulkId",
      element: <BulkNftManagement />
    },
    {
      path: "/activitydashboard",
      element: <ActivityDashboard />
    },
    {
      path: "/activitydashboard/:orderId",
      element: <ActivityDetail />
    },
    {
      path: "/activitydashboardmint/:orderId",
      element: <ActivityMintDetail />
    }
  ]
};

export default BrandAdminRoutes;
