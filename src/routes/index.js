import { useRoutes } from "react-router-dom";
import { useSelector } from "react-redux";
// routes
import SuperAdminRoutes from "./SuperAdminRoutes";
import SubAdminRoutes from "./SubAdminRoutes";
import BrandAdminRoutes from "./BrandAdminRoutes";
import UserRoutes from "./UserRoutes";
import LoginRoutes from "./LoginRoutes";
import TrackingRoutes from "./TrackingRoute";
import ProfileRoutes from "./ProfileRoutes";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";


export default function ThemeRoutes() {
  const location = useLocation();
  const userData = useSelector((state) => state.auth);
  if (userData?.user?.role !== "Sub Admin" || userData?.user?.role !== "Super Admin") {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }
  let routes;
  if (userData.user && userData.user.role === "Super Admin") {
    routes = [UserRoutes, SuperAdminRoutes, TrackingRoutes, ProfileRoutes];
  } else if (userData.user && userData.user.role === "Sub Admin") {
    routes = [UserRoutes, SubAdminRoutes, TrackingRoutes, ProfileRoutes];
  } else if (userData.user && userData.user.role === "Brand Admin") {
    routes = [UserRoutes, BrandAdminRoutes, TrackingRoutes, ProfileRoutes];
  } else if (userData.user && userData.user.role === "User" && userData.user.isVerified === true) {
    routes = [UserRoutes, TrackingRoutes, ProfileRoutes];
  } else if (userData.user && userData.user.role === "User" && userData.user.isVerified === false) {
    routes = [UserRoutes, TrackingRoutes, LoginRoutes];
  } else {
    routes = [UserRoutes, LoginRoutes, TrackingRoutes];
  }
  return useRoutes(routes);
}
