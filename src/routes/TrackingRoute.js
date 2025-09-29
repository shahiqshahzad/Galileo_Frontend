import { lazy } from "react";
import MinimalLayout from "layout/MinimalLayout";

// project imports
import NavMotion from "layout/NavMotion";
import Loadable from "ui-component/Loadable";
// import TrackNFT from 'views/pages/TrackNFT/TrackNFT';
//New Routing

//static page routes

const Tracking = Loadable(lazy(() => import("views/pages/trackingTool")));
// const TrackNft = Loadable(lazy(() => import("views/pages/TrackNFT/TrackNFT")));

// ==============================|| market  ROUTING ||============================== //

const TrackingRoutes = {
  path: "/",
  element: (
    <NavMotion>
      <MinimalLayout />
    </NavMotion>
  ),
  children: [
    {
      path: "/tracking/:token",
      element: <Tracking />
    }
    // {
    //   path: "/tracknft",
    //   element: <TrackNft />
    // }
  ]
};

export default TrackingRoutes;
