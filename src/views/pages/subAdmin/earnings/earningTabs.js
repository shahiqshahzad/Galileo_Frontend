import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WithdrawalHistoryTable from "./withdrawalHistoryTable";
import ReaseSchedule from "./ReleaseSchedule";

function EarningTabs(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, borderRadius: "2px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

EarningTabs.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

export default function FullWidthTabs({ escrowHistory, ReleaseScheduled, statusCode }) {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.paper",
        width: "97.5%",
        margin: "0 auto",
        mb: 4,
        height: "auto"
      }}
    >
      <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", bgcolor: "#000" }}>
        <AppBar position="static" sx={{ width: "83%", bgcolor: "#000", mb: 1.5 }}>
          <Tabs
            className="tabBorder"
            value={value}
            onChange={handleChange}
            textColor="#fff"
            variant="fullWidth"
            aria-label="left side tabs"
            sx={{
              width: "310px",
              "& .Mui-selected": {
                borderTop: "2px solid #2196f3",
                borderLeft: "2px solid #2196f3",
                borderRight: "2px solid #2196f3",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "8px",
                marginBottom: "none",
                textDecoration: "none",
                borderBottom: "none"
              },
              "& .MuiTabs-flexContainer": {
                textDecoration: "none",
                borderBottom: "2px solid #2196f3",
                overflow: "hide"
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
                height: "0px"
              }
            }}
          >
            <Tab
              className="HeaderFonts"
              sx={{
                border: value !== 1 ? "2px solid #2F57FF" : "0px",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "8px"
              }}
              label="Release Schedule"
              {...a11yProps(0)}
            />
            <Tab className="HeaderFonts" label="Withdraw History" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
      </Box>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ width: "100%" }}
      >
        <EarningTabs value={value} index={0} dir={theme.direction}>
          <ReaseSchedule ReleaseScheduled={ReleaseScheduled} statusCode={statusCode} />
        </EarningTabs>
        <EarningTabs value={value} index={1} dir={theme.direction}>
          <WithdrawalHistoryTable escrowHistory={escrowHistory} />
        </EarningTabs>
      </SwipeableViews>
    </Box>
  );
}
