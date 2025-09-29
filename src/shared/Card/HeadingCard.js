import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
// material-ui
import { useTheme } from "@mui/material/styles";

import { forwardRef } from "react";
import { gridSpacing } from "store/constant";

// constant

// ==============================|| CUSTOM MAIN CARD ||============================== //

const HeadingCard = forwardRef(({ title, role, value, setValue, options }, ref) => {
  const theme = useTheme();

  return (
    <Box sx={{ padding: "13px 20px 22px 20px" }}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
        <Grid item>
          <Typography
            variant="h1"
            component="h2"
            className="headingcard"
            sx={{
              marginTop: "10px",
              fontWeight: 600,
              marginLeft: { lg: "-20px", md: "-20px" },
              background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
              color: theme.palette.mode === "dark" ? "white" : "#404040"
            }}
          >
            {title}
          </Typography>
        </Grid>

        {value !== undefined && (
          <Grid item>
            {/* {options && (role == 'teacher' || role == 'super_admin') && ( */}
            <TextField
              id="standard-select-currency"
              select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              sx={{ width: "110px", height: "40px" }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {/* )} */}
          </Grid>
        )}
      </Grid>
    </Box>
  );
});

export default HeadingCard;
