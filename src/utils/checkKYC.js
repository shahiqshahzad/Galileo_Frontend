import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const checkUserKyc = (user) => {
  const userKyc = user?.kycStatus;
  const walletRiskScoreStatus = user?.walletRiskScoreStatus;

  if (userKyc === "Rejected" && (walletRiskScoreStatus === "Critical" || walletRiskScoreStatus === "High")) {
    toast.error("Please complete your KYC from your profile, to proceed");
    return false;
  } else if (userKyc === "Completed" && (walletRiskScoreStatus === "Critical" || walletRiskScoreStatus === "High")) {
    toast.error("Please complete your KYC from your profile, to proceed");
    return false;
  } else if (
    userKyc === "Rejected" &&
    (walletRiskScoreStatus === "Low" ||
      walletRiskScoreStatus === "Medium" ||
      walletRiskScoreStatus === "No Risk Detected")
  ) {
    toast.error("Please complete your KYC from your profile, to proceed");
    return false;
  } else if (user === null) {
    toast.error("Please complete your KYC from your profile, to proceed");
    return false;
  }

  return true;
};

export default checkUserKyc;
