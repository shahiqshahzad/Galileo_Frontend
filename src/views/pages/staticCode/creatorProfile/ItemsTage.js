import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";

// assets
import Items from "./Items";
import ResoldItems from "./ResoldItems";

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <Grid
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
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </Grid>
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

export default function HorizontalTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        value={value}
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
            mr: 3.7,
            color: theme.palette.grey[600],
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.3%"
          },
          "& a.Mui-selected": {
            color: theme.palette.primary.main
          },
          "& .css-1bmeeyq-MuiTabs-flexContainer": {
            borderBottom: "2px solid #CECECE"
          }
        }}
      >
        <Tab className="app-text" component={Link} to="#" label="My items" {...a11yProps(0)} />
        {/* => NOTE: currently Resold Items have been closed due to ticket 497 - Phase 1 UI upgradations  */}
        {/*  <Tab component={Link} to="#" label="Resold items" {...a11yProps(1)} /> */}
      </Tabs>

      <TabPanel value={value} index={0}>
        <Items />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ResoldItems />
      </TabPanel>
    </>
  );
}
