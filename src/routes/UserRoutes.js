import { lazy } from "react";

// project imports
import UserGuard from "./RouteGuard/UserGuard";
import UserLayout from "layout/UserLayout";
import NavMotion from "layout/NavMotion";
import Loadable from "ui-component/Loadable";
import ChangePassword from "shared/changePassword/component/ChangePassword";
// import TrackNFT from 'views/pages/TrackNFT/TrackNFT';
//New Routing
const ComingSoon = Loadable(lazy(() => import("views/pages/staticCode/comingSoon/ComingSoon")));
// const ComingsoonMarketpace = Loadable(lazy(() => import("views/pages/user/comingsoonMarketplace/")));
const LandingPage = Loadable(lazy(() => import("views/pages/user/landingPage")));
const Starting = Loadable(lazy(() => import("views/pages/user/landingPage")));
const Marketplace = Loadable(lazy(() => import("views/pages/user/marketplace")));
const ProductDetails = Loadable(lazy(() => import("views/pages/user/productDetails")));
const DeliveryDashboard = Loadable(lazy(() => import("views/pages/user/deliveryDashboard")));
//static page routes
const CompanyPage = Loadable(lazy(() => import("views/pages/staticCode/companyPage")));
const BMWPage = Loadable(lazy(() => import("views/pages/staticCode/BMWPage")));
const BrandsData = Loadable(lazy(() => import("views/pages/user/featureData")));
const Notification = Loadable(lazy(() => import("../layout/UserLayout/header/notification/Notification")));
// const PrivacyPolicy = Loadable(lazy(() => import("views/pages/privacyPolicy/index")));
const LegalDisclaimar = Loadable(lazy(() => import("views/pages/legalDisclaimar/index")));
const Fees = Loadable(lazy(() => import("views/pages/fees/index")));
const Faq = Loadable(lazy(() => import("views/pages/faq/index")));
// const AuthLogout = Loadable(lazy(() => import("views/auth/logout")));
const Cart = Loadable(lazy(() => import("views/pages/cart/index")));
const Wishlist = Loadable(lazy(() => import("views/pages/cart/index")));
const SearchResults = Loadable(lazy(() => import("views/pages/searchResults/index")));
// const Addresses = Loadable(lazy(() => import("views/pages/staticCode/creatorProfile/Addresses")));

// const Tracking = Loadable(lazy(()=> import('views/pages/trackingTool')));
// const TrackNft = Loadable(lazy(() => import('views/pages/TrackNFT/TrackNFT')));

// ==============================|| market  ROUTING ||============================== //

const UserRoutes = {
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
      path: "/home",
      element: <LandingPage />
    },
    // {
    //   path: '/logout',
    //   element: <AuthLogout />,
    // },

    {
      path: "/",
      element: <Starting />
    },
    // {
    //   path: "/ComingSoon",
    //   element: <ComingsoonMarketpace />
    // },
    {
      path: "/chart",
      element: <ComingSoon />
    },
    {
      path: "/bookmarks",
      element: <ComingSoon />
    },
    {
      path: "/Nfts",
      element: <ComingSoon />
    },
    {
      path: "/downloads",
      element: <ComingSoon />
    },
    {
      path: "/tags",
      element: <ComingSoon />
    },
    {
      path: "/changePassword",
      element: <ChangePassword />
    },
    {
      path: "/settings",
      element: <ComingSoon />
    },
    {
      path: "/marketplace",
      element: <Marketplace />
    },
    {
      path: "/productDetails/:id",
      element: <ProductDetails />
    },

    {
      path: "/deliveryDashboard",
      element: <DeliveryDashboard />
    },
    {
      path: "/companyPage",
      element: <CompanyPage />
    },
    {
      path: "/brand/:id",
      element: <BMWPage />
    },
    {
      path: "/*",
      element: <LandingPage />
    },
    // {
    //   path: '/privacy-policy',
    //   element: <PrivacyPolicy />
    // },
    {
      path: "/legal-disclaimer",
      element: <LegalDisclaimar />
    },
    {
      path: "/fees-and-taxes",
      element: <Fees />
    },
    {
      path: "/faq",
      element: <Faq />
    },
    {
      path: "/allbrands",
      element: <BrandsData />
    },
    {
      path: "/notifications",
      element: <Notification />
    },
    {
      path: "/searchresults",
      element: <SearchResults />
    }

    // {
    //     path: '/tracking',
    //     element: <Tracking />
    // },
    // {
    //     path: '/tracknft',
    //     element: <TrackNft/>
    // },
  ]
};

const developmentRoutes = [
  {
    path: "/cart",
    element: <Cart />
  },
  {
    path: "/wishlist",
    element: <Wishlist />
  }
];

const productionRoutes = [];
const routesToAdd = process.env.REACT_APP_ENVIRONMENT === "development" ? developmentRoutes : productionRoutes;
UserRoutes.children = UserRoutes.children.concat(routesToAdd);

export default UserRoutes;
