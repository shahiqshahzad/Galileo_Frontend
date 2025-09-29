import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import "./styles.css";

// material-ui
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TableContainer,
  Typography
} from "@mui/material";

// project imports
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";
import PersonIcon from "@mui/icons-material/Person";
import TourIcon from "@mui/icons-material/Tour";
// assets
import DescriptionIcon from "@mui/icons-material/Description";

function LinearProgressWithLabel({ value, ...other }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress {...other} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number
};

const DeliveryDashboard = ({ productList }) => {
  const theme = useTheme();

  return (
    <Grid item lg={12} md={12} xs={12}>
      <Grid container direction="column" spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard className="tableShadow" title="Delivery Dashboard">
            <Grid container direction="column" spacing={2}>
              <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "15px" }}>
                {productList?.length > 0 ? (
                  <Grid item xs={12}>
                    {productList?.length > 0 &&
                      productList?.map((row) => (
                        <>
                          <Grid
                            container
                            justifyContent="center"
                            spacing={gridSpacing}
                            sx={{ textAlign: "center", marginBottom: "20px" }}
                          >
                            <Grid item md={4.5} lg={4} className="Productdetails" sx={{ height: "auto" }}>
                              <SubCard
                                className="tableShadow"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <div className="delivery-container">
                                  <img
                                    src={"https://images.heb.com/is/image/HEBGrocery/001621707-1"}
                                    alt={row?.Nft?.id}
                                    className="image"
                                  />
                                </div>
                              </SubCard>{" "}
                            </Grid>

                            <Grid item xs={12} md={6} sm={12} sx={{ height: "auto" }}>
                              <SubCard className="tableShadow">
                                <TableContainer sx={{}}>
                                  <List component="nav" aria-label="main mailbox folders">
                                    <ListItemButton>
                                      <ListItemIcon>
                                        <PersonIcon sx={{ fontSize: "1.3rem" }} />
                                      </ListItemIcon>
                                      <ListItemText primary={<Typography variant="subtitle1">Name</Typography>} />
                                      <ListItemSecondaryAction>
                                        <Typography
                                          sx={{
                                            color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                                            textTransform: "capitalize"
                                          }}
                                          variant="subtitle1"
                                          align="right"
                                        >
                                          {row?.Nft?.name}
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                    <ListItemButton>
                                      <ListItemIcon>
                                        <PersonIcon sx={{ fontSize: "1.3rem" }} />
                                      </ListItemIcon>
                                      <ListItemText primary={<Typography variant="subtitle1">Type</Typography>} />
                                      <ListItemSecondaryAction>
                                        <Typography
                                          sx={{
                                            color: theme.palette.mode === "dark" ? "#FFFFFF" : "black",
                                            textTransform: "capitalize"
                                          }}
                                          variant="subtitle1"
                                          align="right"
                                        >
                                          {row?.Nft?.type}
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>

                                    <Divider />
                                    <ListItemButton>
                                      <ListItemIcon>
                                        <TourIcon sx={{ fontSize: "1.3rem" }} />
                                      </ListItemIcon>
                                      <ListItemText primary={<Typography variant="subtitle1">Status</Typography>} />
                                      <ListItemSecondaryAction>
                                        <Typography
                                          color={
                                            row?.status === "Delivered"
                                              ? "Green"
                                              : row?.status === "pending"
                                                ? "Blue"
                                                : "Orange"
                                          }
                                          variant="subtitle1"
                                          align="right"
                                        >
                                          {row?.status}
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                    <Divider />
                                    <ListItemButton>
                                      <ListItemIcon>
                                        <MonetizationOnIcon sx={{ fontSize: "1.3rem" }} />
                                      </ListItemIcon>
                                      <ListItemText primary={<Typography variant="subtitle1">Price</Typography>} />
                                      <ListItemSecondaryAction>
                                        <Typography sx={{ color: "Orange" }} variant="subtitle1" align="right">
                                          {row?.Nft?.price ? Number(row?.Nft.price).toFixed(2) : 0}{" "}
                                          {row?.Nft?.currencyType}
                                        </Typography>
                                      </ListItemSecondaryAction>
                                    </ListItemButton>
                                    <Divider />

                                    <ListItemButton>
                                      <ListItemIcon>
                                        <DescriptionIcon sx={{ fontSize: "1.3rem" }} />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={<Typography variant="subtitle1">Wallet Address</Typography>}
                                      />
                                      <Typography
                                        sx={{
                                          color: "#9e9e9e",
                                          textTransform: "capitalize",
                                          display: { xs: "none", sm: "flex" }
                                        }}
                                        variant="subtitle1"
                                        // align="right"
                                      >
                                        {row?.walletAddress}
                                      </Typography>
                                    </ListItemButton>
                                    <ListItemText
                                      sx={{ display: { xs: "block", sm: "none", wordBreak: "break-word" } }}
                                    >
                                      {row?.walletAddress}
                                    </ListItemText>
                                    <Divider />
                                  </List>
                                </TableContainer>
                              </SubCard>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Typography>No data available</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default DeliveryDashboard;
