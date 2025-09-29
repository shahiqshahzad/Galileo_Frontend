import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "@fontsource/public-sans";
// material-ui
import { useTheme } from "@mui/material/styles";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { Card, CardContent, Tooltip } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "ui-component/extended/Avatar";
import { Pagination } from "@mui/material";
// import leftImage from '../../../../../assets/images/icons/left-icon.svg';
// import rightImage from '../../../../../assets/images/icons/right.svg';
// import logo01 from '../../../../../assets/images/logo01.png';
// assets
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Stack } from "@mui/system";
import moment from "moment";
// ==============================|| ACCORDION ||============================== //

const Attribute = ({
  history,
  tracking,
  data,
  defaultExpandedId = null,
  expandIcon,
  square,
  toggle,
  createdBy,
  createdByUser,
  createdAt
}) => {
  const theme = useTheme(createdBy, "createdBy");

  const [expanded, setExpanded] = useState(null);
  const handleChange = (panel) => (event, newExpanded) => {
    if (toggle) setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(defaultExpandedId);
  }, [defaultExpandedId]);
  const cardsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const filterFirstSerial = [];

  tracking?.filter((d) => filterFirstSerial.push(d));
  const currentCards = filterFirstSerial?.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <Box sx={{ width: "100%" }}>
      {data &&
        data.map((item) => (
          <MuiAccordion
            className="muiAccordion"
            sx={{
              background: theme.palette.mode === "dark" ? "#262626" : "#fff",
              color: theme.palette.mode === "dark" ? "rgb(189, 200, 240)" : "#000"
            }}
            m={3}
            key={item.id}
            defaultExpanded={!item.disabled && item.defaultExpand}
            expanded={(!toggle && !item.disabled && item.expanded) || (toggle && expanded === item.id)}
            disabled={item.disabled}
            square={square}
            onChange={handleChange(item.id)}
          >
            <MuiAccordionSummary
              sx={{
                color: theme.palette.mode === "dark" ? "#fff" : "#000"
              }}
              expandIcon={
                expandIcon || expandIcon === false ? expandIcon : <ExpandMoreIcon sx={{ color: "#5498CB" }} />
              }
            >
              <span className="attribute-title" sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000000" }}>
                {" "}
                {item.title}
              </span>
            </MuiAccordionSummary>
            <Stack mx={2}>
              <Divider sx={{ borderBottom: "1px solid #8885854d" }} />
            </Stack>
            <MuiAccordionDetails>
              <Grid
                item
                container
                className=""
                sx={{
                  pl: 1.5,
                  pb: { xs: 3, md: 1 },
                  background: theme.palette.mode === "dark" ? "#262626" : "#fff",
                  color: theme.palette.mode === "dark" ? "rgb(189, 200, 240)" : "#000"
                }}
              >
                <Grid item xs={5} md={3} sx={{ padding: "8px 0" }}>
                  <Typography
                    variant="body"
                    className="date-logo-name-bar"
                    sx={{ color: theme.palette.mode === "dark" ? "#bcbcbc" : "#4a4848" }}
                  >
                    Date:
                    <Box
                      variant="span"
                      className="date-logo"
                      ml={3}
                      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      {createdAt && moment(createdAt).format("ddd MMM DD YYYY")}
                      {/* {Date(tracking?.nft?.createdAt).slice(0, 15)} */}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={1} sx={{ borderLeft: "2px solid #3385C1", height: "26px", marginTop: "13px" }}></Grid>
                <Grid item xs={5} md={8} sx={{ display: "flex", padding: "8px 0" }}>
                  <Grid item xs={2}>
                    <Typography
                      variant="body"
                      className="date-logo-name-bar"
                      sx={{ float: { md: "right" }, color: theme.palette.mode === "dark" ? "#bcbcbc" : "4a4848" }}
                    >
                      {history?.length > 0 ? " Updated by:" : "Created by:"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ display: "flex" }}>
                    {createdByUser?.picUrl && (
                      <Avatar
                        alt="User 1"
                        src={createdByUser?.picUrl}
                        sx={{
                          border: "1px solid #5498CB",
                          width: 32,
                          height: 32,
                          objectFit: "fill",
                          color: theme.palette.mode === "dark" ? "#4A4848" : "#4A4848"
                        }}
                      />
                    )}

                    <Typography
                      align="left"
                      ml={createdByUser ? 1 : 1}
                      variant="body"
                      className="attribute-update"
                      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      {createdByUser?.fullName
                        ? createdByUser?.fullName
                        : createdByUser?.walletAddress.slice(0, 5) + "..." + createdByUser?.walletAddress.slice(38, 42)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  pl: 1.5,
                  pb: { xs: 3, md: 0 },
                  background: theme.palette.mode === "dark" ? "#262626" : "#fff",
                  color: theme.palette.mode === "dark" ? "rgb(189, 200, 240)" : "#000",
                  // display: { md: 'flex' },
                  maxHeight: { md: "300px" },
                  maxWidth: "98% !important",
                  margin: "0 auto"
                }}
              >
                <Grid container justifyContent="left" spacing={2} sx={{ textAlign: "center", mb: 5 }}>
                  {currentCards?.map(
                    (item, index) =>
                      item?.trait_type && (
                        <>
                          <Grid item xs={12} md={2}>
                            <Card
                              className="card-style"
                              sx={{
                                background:
                                  item?.trait_type === "Serial ID"
                                    ? "#0066B1"
                                    : theme.palette.mode === "dark"
                                      ? "#262626"
                                      : "#fff",
                                border: item?.trait_type === "Serial ID" ? "" : "2px solid rgb(47, 83, 255)"
                                // border: '1px solid #2F53FF',
                                // background:
                                //   theme.palette.mode === 'dark'
                                //     ? item?.trait_type === 'Serial ID' && 'linear-gradient(to top right, #2F53FF ,#2FC1FF)'
                                //     : '#fff'
                              }}
                            >
                              <CardContent>
                                <Tooltip placement="top" title={item?.trait_type}>
                                  <Typography
                                    className={item?.trait_type === "Serial ID" ? "Engine-deafult" : "Engine"}
                                    style={{
                                      color: theme.palette.mode === "dark" ? "#2194ff" : "#4a4848",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      width: "95%",
                                      textAlign: "center",
                                      margin: "0 auto",
                                      height: "2.5em"
                                    }}
                                    variant="h3"
                                    sx={{
                                      color: null
                                    }}
                                  >
                                    {item?.trait_type
                                      ? item?.trait_type?.length > 11
                                        ? item?.trait_type.slice(0, 12) + "..."
                                        : item?.trait_type
                                      : "0"}
                                  </Typography>
                                </Tooltip>
                                <Tooltip
                                  placement="bottom"
                                  title={
                                    item?.display_type === "Date" &&
                                    moment(item?.value).format("ddd MMM DD YYYY") !== "Invalid Date"
                                      ? moment(item?.value).format("ddd MMM DD YYYY")
                                      : item?.value
                                  }
                                >
                                  <Typography
                                    variant="h6"
                                    // className="V8"
                                    className={item?.trait_type === "Serial ID" ? "centerText-default" : "centerText"}
                                    sx={{
                                      color: theme.palette.mode === "dark" ? "#fff" : "#252222",
                                      cursor: "pointer",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      width: "95%",
                                      textAlign: "center",
                                      margin: "0 auto",
                                      height: "2.5em"
                                    }}
                                  >
                                    {item?.display_type === "Date" &&
                                    moment(item?.value).format("ddd MMM DD YYYY") !== "Invalid Date"
                                      ? moment(item?.value).format("ddd MMM DD YYYY")
                                      : item?.value
                                        ? item?.value?.length > 11
                                          ? item?.value.slice(0, 12) + "..."
                                          : item?.value
                                        : "0"}
                                  </Typography>
                                </Tooltip>
                              </CardContent>
                            </Card>
                          </Grid>
                        </>
                      )
                  )}
                </Grid>
              </Grid>
              <Grid sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Pagination
                  count={Math.ceil(tracking.length / cardsPerPage)}
                  onChange={(event, value) => setCurrentPage(value)}
                  page={currentPage}
                  variant="outlined"
                  shape="rounded"
                />
              </Grid>
            </MuiAccordionDetails>
          </MuiAccordion>
        ))}
    </Box>
  );
};

Attribute.propTypes = {
  data: PropTypes.array,
  defaultExpandedId: PropTypes.string,
  expandIcon: PropTypes.object,
  square: PropTypes.bool,
  toggle: PropTypes.bool
};

export default Attribute;
