import React, { useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";
import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import SearchIcon from "../../../../assets/images/icons/search_icon_items.svg";

import { gridSpacing } from "store/constant";

import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllNftUser } from "redux/nftManagement/actions";
import { CardImage } from "utils/CardImage";
import { LoaderComponent } from "utils/LoaderComponent";

const Items = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(
      getAllNftUser({
        walletAddress: user.walletAddress,
        setLoading: setLoading
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = useTheme();
  const { nfts } = useSelector((state) => state.nftReducer.nftListUser);

  return (
    <Grid mt={2} container-fluid="true" spacing={gridSpacing}>
      <Grid mt={4} item xs={12}>
        {loading === true ? (
          <LoaderComponent justifyContent={"center"} alignItems={"center"} />
        ) : (
          <Grid container justifyContent="left" spacing={gridSpacing} sx={{ textAlign: "center" }}>
            {nfts?.length > 0 ? (
              <>
                {nfts?.map((data) => (
                  <Grid
                    item
                    md={2}
                    sm={6}
                    onClick={() => {
                      navigate("/productDetails/" + data.id, {
                        state: {
                          nft: data
                        }
                      });
                    }}
                  >
                    <Card
                      sx={{
                        color: theme.palette.mode === "dark" ? "white" : "#404040",
                        background: theme.palette.mode === "dark" ? "#181C1F" : "white",
                        maxWidth: 365,
                        width: "105%",

                        borderRadius: "3px"
                      }}
                    >
                      <CardActionArea>
                        <CardImage src={data?.asset} alt={data?.id} className={"my-items-container"} />
                        <CardContent sx={{ padding: "6%" }}>
                          <Grid container>
                            <Grid item xs={8} sx={{ textAlign: "left" }}>
                              <span className="cardHeading encap" style={{ fontSize: "130%" }}>
                                {data.name}{" "}
                              </span>
                              <div className="overflow" style={{ marginTop: "5%", color: "#656565" }}>
                                {data.price} {data.currencyType}
                              </div>
                            </Grid>
                            <Grid item xs={4} sx={{ background: "" }}>
                              <span sx={{ fontWeight: "50 !important ", fontSize: "110%", float: "right" }}>
                                {/* {item.creator} */}
                              </span>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </>
            ) : (
              <Grid container justifyContent={"center"}>
                <Grid
                  item
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  xs={10}
                  md={10}
                  lg={10}
                  sx={{ background: "#22282C", borderRadius: "5px", height: "200px", textAlign: "center" }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                    <Typography
                      variant="h3"
                      mt={1}
                      component="div"
                      className="app-text"
                      sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
                    >
                      No items found
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Items;
