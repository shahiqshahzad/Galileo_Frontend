import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 1,
            pr: 2
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default function HorizontalTabs({ marketplaceCategories, categoryId, setCategoryId }) {
  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setCategoryId(newValue);
  };

  return (
    <>
      <Tabs
        value={categoryId}
        variant="scrollable"
        onChange={handleChange}
        sx={{
          mb: 1,
          ml: 1,
          "& a": {
            minHeight: "1rem",
            minWidth: 10,
            py: 1.5,
            px: 0,
            mr: 4.7,
            color: theme.palette.grey[600],
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
            // marginBottom: '0.3%'
          },
          "& a.Mui-selected": {
            color: theme.palette.primary.main
          }
        }}
      >
        <Tab sx={{}} to="#" label={"All"} value={0} {...a11yProps(0)} />
        {marketplaceCategories?.categories?.length > 0 &&
          marketplaceCategories?.categories.map((item) => {
            return <Tab label={item.name} value={item.id} {...a11yProps(item.id)} />;
          })}
      </Tabs>
    </>
  );
}
