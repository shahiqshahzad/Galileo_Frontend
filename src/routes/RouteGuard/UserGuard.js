import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { logout } from "../../redux/auth/actions";
import { useDispatch } from "react-redux";
import { persistor } from "store";

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const UserGuard = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

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

    if (user && user.role === "User" && !user.isVerified) {
      navigate("/emailVerify", { replace: true });
    }
    // else if (token && user?.role=="User" ) {
    //     navigate('/landingPage', { replace: true });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  return children;
};

UserGuard.propTypes = {
  children: PropTypes.node
};

export default UserGuard;
