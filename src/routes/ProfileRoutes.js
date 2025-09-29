import { lazy } from "react";
import NavMotion from "layout/NavMotion";
import UserLayout from "layout/UserLayout";
import Loadable from "ui-component/Loadable";
import UserGuard from "./RouteGuard/UserGuard";
import MyActivity from "views/pages/user/myActivity";
import MyActivityDetailMint from "views/pages/user/myActivity/component/MyActivityDetailMint";

const Profile = Loadable(lazy(() => import("views/pages/staticCode/creatorProfile")));
const EditProfile = Loadable(lazy(() => import("views/pages/staticCode/editProfile")));
const Addresses = Loadable(lazy(() => import("views/pages/staticCode/creatorProfile/Addresses")));
const MyActivityDetail = Loadable(lazy(() => import("views/pages/user/myActivity/component/MyActivityDetail")));
const ReturnCardItem = Loadable(lazy(() => import("views/pages/user/myActivity/component/ReturnCardItem")));
const ProfileRoutes = {
  path: "/",
  element: (
    <NavMotion>
      <UserGuard>
        <UserLayout />
      </UserGuard>
    </NavMotion>
  ),
  children: [
    {
      path: "/creatorProfile",
      element: <Profile />
    },
    {
      path: "/editProfile",
      element: <EditProfile />
    },
    {
      path: "/addresses",
      element: <Addresses />
    },
    {
      path: "/myactivity",
      element: <MyActivity />
    },
    {
      path: "/myactivitydetail/:orderId",
      element: <MyActivityDetail />
    },
    {
      path: "/myactivitydetailmint/:orderId",
      element: <MyActivityDetailMint />
    },
    { path: "/MyActivityReturn/:orderId", element: <ReturnCardItem /> }
  ]
};
export default ProfileRoutes;
