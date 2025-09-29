import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Properties from "./properties";
import PropertyInList from "./propertyInList";
import { Icons } from "shared/Icons/Icons";
// import ListIcon from "@mui/icons-material/List";
// import GridViewSharpIcon from "@mui/icons-material/GridViewSharp";
import { ParseHtmlToText } from "./parseHtmlToText/parseHtmlToText";
import { Stack } from "@mui/system";

function TabPanel(props) {
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

TabPanel.propTypes = {
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

export default function FullWidthTabs({ nftList }) {
  const theme = useTheme();
  const [value, setValue] = React.useState(2);
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
        height: "auto",
        minHeight: "auto",
        background: "inherit"
      }}
    >
      <Box sx={{ display: "flex", width: "100%", background: "inherit", justifyContent: "space-between" }}>
        <AppBar position="static" sx={{ width: "fit-content", background: "inherit" }}>
          <Tabs
            className="tabBorder"
            value={value < 2 ? value : false}
            onChange={handleChange}
            textColor="#fff"
            variant="fullWidth"
            aria-label="left side tabs"
            sx={{
              width: nftList?.nft?.longDescription ? "320px" : "180px",
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
              sx={{
                border: value !== 1 ? "2px solid #2F57FF" : "0px",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "8px",
                color: value !== 1 ? "white !important" : "inherit",
                fontWeight: value !== 1 ? "bold" : "inherit"
              }}
              label="Properties"
              {...a11yProps(0)}
            />
            {nftList?.nft?.longDescription?.length && (
              <Tab
                sx={{
                  color: value === 1 ? "white !important" : "inherit",
                  fontWeight: value === 1 ? "bold" : "inherit"
                }}
                label="Additional Details"
                {...a11yProps(1)}
              />
            )}
          </Tabs>
        </AppBar>
        {value !== 1 && (
          <Tabs
            sx={{
              ".MuiTabs-indicator": {
                display: "none"
              },
              background: "linear-gradient(105.98deg, #3059FF 0.18%, #309BFF 100.33%)",
              minHeight: "43px  !important",
              height: "21px"
            }}
            value={value >= 2 ? value - 2 : false}
            onChange={(e, newValue) => handleChange(e, newValue + 2)}
            aria-label="icon label tabs example"
          >
            <Tab
              sx={{
                background: "",
                minWidth: "30px",
                minHeight: "40px",
                padding: "4px"
              }}
              icon={
                value !== 2 ? (
                  <Box className="tab-cons"> {Icons?.listWhiteIcon}</Box>
                ) : (
                  <Box className="tab-cons" sx={{ background: value !== 2 ? "" : "#fff" }}>
                    {Icons?.listfilledIcon}
                  </Box>
                )
              }
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                background: "",
                minWidth: "30px",
                minHeight: "40px",
                padding: "4px"
              }}
              icon={
                value !== 3 && value !== 0 ? (
                  <Box className="tab-cons">{Icons?.dashWhiteIcon}</Box>
                ) : (
                  <Box
                    className="tab-cons"
                    sx={{
                      background: "#fff"
                    }}
                  >
                    {Icons?.dashIcon}
                  </Box>
                )
              }
              {...a11yProps(3)}
            />
          </Tabs>
        )}
      </Box>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ width: "100%", background: "#181C1F" }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <PropertyInList nftList={nftList} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Stack sx={{ paddingLeft: "1rem", paddingRight: "1rem", background: "#181C1F" }}>
            <ParseHtmlToText description={nftList?.nft?.longDescription || ""} />
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <PropertyInList nftList={nftList} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Properties nftList={nftList} />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
