import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import jwt_decode from "jwt-decode";
import { logout } from "../../redux/auth/actions";
import { useDispatch } from "react-redux";
import { persistor } from "store";
/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AdminGuard = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const theme = useTheme();
  const matchMD = useMediaQuery(theme.breakpoints.down("md"));

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      const expiryDate = decoded.exp * 1000; // Multiply by 1000 to convert seconds to milliseconds
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        dispatch(logout());
        localStorage.clear();
        persistor.flush();
        window.open("/", "_blank");
        // navigate('/');
      }
    }
    if (token == null) {
      navigate("/login", { replace: true });
    } else if (matchMD && user && user?.role !== "User") {
      navigate("/home", { replace: true });
    }
    //  else if (token) {
    //     navigate('/dashboard', { replace: true });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, matchMD]);
  return children;
};

AdminGuard.propTypes = {
  children: PropTypes.node
};

export default AdminGuard;
