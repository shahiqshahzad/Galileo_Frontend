import { lazy } from "react";

// project imports
import UserLayout from "layout/UserLayout";
import NavMotion from "layout/NavMotion";
import Loadable from "ui-component/Loadable";

//New Routing
const LandingPage = Loadable(lazy(() => import("views/pages/user/landingPage")));

// ==============================|| market  ROUTING ||============================== //

const LandingRoutes = {
  path: "/",
  element: (
    <NavMotion>
      <UserLayout />
    </NavMotion>
  ),
  children: [
    {
      path: "/home",
      element: <LandingPage />
    }
  ]
};

export default LandingRoutes;
