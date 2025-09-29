import React, { useEffect, useRef } from "react";
import "./MetamaskModal.css";
import metamaskIcon from "assets/images/metamask-icon.svg";

export const MetamaskModal = ({ onClose }) => {
  const modalRef = useRef(null);
  const metamaskExtensionUrl = "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="metamask-modal__overlay">
      <div ref={modalRef} className="metamask-modal__content">
        <span className="metamask-modal__title">Connect Wallet</span>

        <div className="metamask-modal__button" onClick={() => window.open(metamaskExtensionUrl, "_blank")}>
          <img src={metamaskIcon} alt="Metamask logo" className="metamask-modal__icon" />
          <span className="metamask-modal__text">Metamask</span>
        </div>
      </div>
    </div>
  );
};
