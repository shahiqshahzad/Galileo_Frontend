import React, { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import AdminGuard from "./RouteGuard/AdminGuard";

// const SuperAdminDashboard = Loadable(lazy(() => import("views/pages/superAdmin/dashboard")));
// const Starting = Loadable(lazy(() => import("views/pages/superAdmin/dashboard")));
const SubAdmin = Loadable(lazy(() => import("views/pages/superAdmin/subAdmin")));
const Brand = Loadable(lazy(() => import("views/pages/superAdmin/brands")));
const BrandAdmin = Loadable(lazy(() => import("views/pages/superAdmin/brands/brandAdmin")));
const BrandCategory = Loadable(lazy(() => import("views/pages/superAdmin/brands/brandCategory")));
const Categories = Loadable(lazy(() => import("views/pages/superAdmin/categories")));
const NftManagement = Loadable(lazy(() => import("views/pages/superAdmin/nftManagement")));
const Category = Loadable(lazy(() => import("views/pages/brandAdmin/brandCategory")));
const Fees = Loadable(lazy(() => import("views/pages/superAdmin/feesConfigurations")));
// const AuthLogout = Loadable(lazy(() => import("views/auth/logout")));
const SuperBulkNft = Loadable(lazy(() => import("views/pages/superAdmin/nftManagement/component/bulkNft")));
const ChangePassword = Loadable(lazy(() => import("shared/changePassword/component/ChangePassword")));
const GeneralSettings = Loadable(lazy(() => import("views/pages/superAdmin/generalSettings")));
const Earnings = Loadable(lazy(() => import("views/pages/superAdmin/earnings")));
// ==============================|| MAIN ROUTING ||============================== //
const Reports = Loadable(lazy(() => import("views/pages/subAdmin/reports")));

const SuperAdminRoutes = {
  id: "super_admin",
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
    //   element: <SuperAdminDashboard />
    // },
    {
      path: "/brands",
      element: <Brand />
    },
    {
      path: "/brands/admin",
      element: <BrandAdmin />
    },
    {
      path: "/ChangePassword",
      element: <ChangePassword />
    },
    {
      path: "/brands/:id/category",
      element: <BrandCategory />
    },
    {
      path: "/categories",
      element: <Categories />
    },
    {
      path: "/category",
      element: <Category />
    },
    {
      path: "/subAdminManagement",
      element: <SubAdmin />
    },
    {
      path: "/nftManagement/:categoryId/:brandId",
      element: <NftManagement />
    },
    {
      path: "/fees",
      element: <Fees />
    },
    {
      path: "/general-settings",
      element: <GeneralSettings />
    },
    {
      path: "/bulkNft/:bulkId/:categoryId/:BrandId",
      element: <SuperBulkNft />
    },
    { path: "/earnings", element: <Earnings /> },
    {
      path: "/general-settings",
      element: <GeneralSettings />
    },
    {
      path: "/reports",
      element: <Reports />
    }
  ]
};

export default SuperAdminRoutes;
