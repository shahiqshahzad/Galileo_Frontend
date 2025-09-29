import { Link } from "react-router-dom";
import { ButtonBase } from "@mui/material";
import config from "config";
import galileoLogo from "assets/images/profile/logoG.svg";

import { useTheme } from "@mui/material/styles";

const LogoSection = () => {
  const theme = useTheme();
  return (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
      {theme.palette.mode === "dark" ? (
        <img src={galileoLogo} alt="Galileo White Logo" width="100" />
      ) : (
        <img src={galileoLogo} alt="Galileo Dark Logo" width="100" />
      )}
    </ButtonBase>
  );
};

export default LogoSection;
