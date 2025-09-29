/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const useChatScript = () => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useSelector((state) => state.auth);

  const subAdminPaths = ["/nftManagement", "/activity", "/earnings", "/reports", "/generalSetting"];

  const isSubAdminPath = user?.role === "Sub Admin" && subAdminPaths.some((path) => pathname.includes(path));
  const isUserPath = user?.role === "User" && pathname === "/creatorProfile";

  useEffect(() => {
    const loadChatScript = () => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.id = "zsiqscript";
      script.defer = true;

      const code = `
        var $zoho = $zoho || {};
        $zoho.salesiq = $zoho.salesiq || { widgetcode: "siqf176ab42b98e3e93ea63ddd2c8bcf4155c5d792eeab114a47ea0c51a21573dce", values: {}, ready: function() {} };
        var d = document;
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.id = "zsiqscript_internal";
        s.defer = true;
        s.src = "https://salesiq.zohopublic.eu/widget";
        var t = d.getElementsByTagName("script")[0];
        t.parentNode.insertBefore(s, t);
      `;

      script.textContent = code;
      document.body.appendChild(script);

      const element = document.querySelector(".zsiq_floatmain.zsiq_theme1.siq_bR");
      if (element) {
        element.style.display = "block";
      }
    };

    const removeChatScript = () => {
      const element = document.querySelector(".zsiq_floatmain.zsiq_theme1.siq_bR");
      if (element) {
        element.style.display = "none";
      }
    };

    if (isSubAdminPath || isUserPath) {
      loadChatScript();
    } else {
      removeChatScript();
    }

    return () => {
      removeChatScript();
    };
  }, [location.pathname]);
};

export default useChatScript;
