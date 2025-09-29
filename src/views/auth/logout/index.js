import React, { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "redux/auth/actions";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

const Logout = () => {
  const account = useActiveWallet();
  const {disconnect } = useDisconnect()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (account) {
      disconnect(account)
    }
    dispatch(logout());
    window.location.href = "/login";
    toast.info("Session expired. Please login again");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
};

export default Logout;
