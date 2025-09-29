import React, { useState } from "react";
import { Box, Stack } from "@mui/system";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { Icons } from "shared/Icons/Icons";

export const ProofsDropdown = ({ proofs }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    expanded: {
      "&.Mui-expanded": {
        height: "60px !important" // Set the desired height for the expanded state
      }
    }
  }));
  const classes = useStyles();
  return (
    <div>
      <Accordion
        expanded={open}
        onChange={() => setOpen(!open)}
        sx={{
          background: theme.palette.mode === "dark" ? "#262626" : "#fff",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          boxShadow: theme.palette.mode === "dark" ? "" : "0px 15px 30px 10px rgba(0, 0, 0, 0.06)",

          position: "absolute",
          width: { xs: "87.5%", md: "43%" },
          zIndex: "999",
          border: open ? "1px solid #8ab9db" : "0px",
          borderRadius: "8px !important"
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "#2196f3", height: "30px", width: "30px" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={classes.expanded}
          // sx={{ borderBottom: open ? '1px solid' : 'none', minHeight: '50px !important' }}
          sx={{ height: "64px" }}
        >
          <Typography className="attributes-custom">PROOF OF AUTHENTICITY</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "0.4em"
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid #8ab9db"
            },
            "& .MuiInput-underline:before": {
              borderBottom: "none" // Remove the default underline
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none" // Remove the underline when focused
            },
            padding: "0px 16px 0px",
            minHeight: "64px"
          }}
        >
          {proofs && proofs.length
            ? proofs.map((item) => {
                return (
                  <>
                    <Box sx={{ borderBottom: "1px solid #838383", opacity: "0.2" }}></Box>
                    <Stack
                      sx={{
                        marginTop: "0.5em",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "8px 0px 8px 0px"
                      }}
                      onClick={() => {
                        window.open(item?.fieldValue, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          window.open(item.fieldValue, "_blank", "noopener,noreferrer");
                        }}
                        className="attributes-custom"
                      >
                        {item?.fieldName}
                      </Typography>
                      <Typography
                        sx={{ color: "#2F53FF", cursor: "pointer" }}
                        onClick={() => {
                          window.open(item.fieldValue, "_blank", "noopener,noreferrer");
                        }}
                      >
                        {/* <img src={linkIcon} alt="open link" style={{ paddingLeft: '5px' }} /> */}
                        {Icons?.documentimage}
                      </Typography>
                    </Stack>
                  </>
                );
              })
            : ""}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
