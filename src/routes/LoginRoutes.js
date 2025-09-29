import { lazy } from "react";
import MinimalLayout from "layout/MinimalLayout";
import NavMotion from "layout/NavMotion";
import Loadable from "ui-component/Loadable";
import PrivacyPolicy from "views/pages/privacyPolicy";
import TermsofService from "views/pages/termsAndConditions";
// login routing
const AuthLogout = Loadable(lazy(() => import("views/auth/logout")));
const AuthLoginEmail = Loadable(lazy(() => import("views/auth/login/component/email")));
const AuthLoginPassword = Loadable(lazy(() => import("views/auth/login/component/password")));
const Metamask = Loadable(lazy(() => import("views/auth/login/component/metamaskWallet")));
const Email = Loadable(lazy(() => import("views/auth/signUp/component/email")));
const VerifyEmail = Loadable(lazy(() => import("views/auth/verifyEmail")));
const VerifyEmailBefore = Loadable(lazy(() => import("views/auth/emailVerifyBefore")));
const AuthForgot = Loadable(lazy(() => import("views/auth/forgetPassword")));
const AuthRsetPassword = Loadable(lazy(() => import("views/auth/resetPassword")));
const SignUpMarketPlace = Loadable(lazy(() => import("views/auth/signUp")));
const SocialLogin = Loadable(lazy(() => import("views/auth/socialLogin")));
const ChangePassword = Loadable(lazy(() => import("shared/changePassword/component/ChangePassword")));
const Starting = Loadable(lazy(() => import("views/pages/user/landingPage")));
const MaintenancePage = Loadable(lazy(() => import("views/pages/staticCode/MaintenancePage/MaintenancePage")));
// const TrackNft = Loadable(lazy(() => import('views/pages/TrackNFT/TrackNFT')));
// const Tracking = Loadable(lazy(()=> import('views/pages/trackingTool')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "/",
  element: (
    <NavMotion>
      <MinimalLayout />
    </NavMotion>
  ),
  children: [
    {
      path: "/login",
      element: <AuthLoginEmail />
    },
    {
      path: "/password",
      element: <AuthLoginPassword />
    },
    {
      path: "/select-signup",
      element: <Metamask />
    },
    {
      path: "/email",
      element: <Email />
    },
    {
      path: "/logout",
      element: <AuthLogout />
    },
    {
      path: "/emailVerify",
      element: <VerifyEmailBefore />
    },
    {
      path: "/Verify",
      element: <VerifyEmail />
    },
    {
      path: "/Verify",
      element: <VerifyEmailBefore />
    },
    {
      path: "/",
      element: <Starting />
    },
    {
      path: "/forgetPassword",
      element: <AuthForgot />
    },
    {
      path: "/resetPassword",
      element: <AuthRsetPassword />
    },

    {
      path: "/signUp",
      element: <SignUpMarketPlace />
    },
    {
      path: "/ChangePassword",
      element: <ChangePassword />
    },
    {
      path: "/socialLogin",
      element: <SocialLogin />
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />
    },
    {
      path: "/Terms-of-Service",
      element: <TermsofService />
    },
    {
      path: "/maintenance",
      element: <MaintenancePage />
    }
    // {
    //     path: '/tracknft',
    //     element: <TrackNft/>
    // },
    // {
    //     path: '/tracking',
    //     element: <Tracking />
    // }
  ]
};

export default LoginRoutes;
