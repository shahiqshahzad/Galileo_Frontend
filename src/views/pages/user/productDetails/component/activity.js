import { useState, useEffect } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { gridSpacing } from "store/constant";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import moment from "moment";
import { Pagination } from "@mui/material";
import Avatar from "ui-component/extended/Avatar";
import { Icons } from "shared/Icons/Icons";
import galileo_logo from "../../../../../assets/images/galileo_logo.png";
import MarketplaceAddress from "../../../../../contractAbi/Marketplace-address.js";

import "@fontsource/public-sans";
import SubCard from "ui-component/cards/SubCard";
import AutorenewIcon from "@mui/icons-material/Autorenew";
// import logo from '../../../../../assets/images/logo1.png';
// import transferlogo from '../../../../../assets/images/logo2.png';
import { Typography, Grid, Select, InputLabel, FormControl, MenuItem, Divider } from "@mui/material";
import { IconSearch } from "@tabler/icons";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";

import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { getTrack } from "redux/marketplace/actions";
import FactoryAbi from "contractAbi/Factory.json";
import { ethers } from "ethers";
import FactoryAddress from "contractAbi/Factory-address.js";
import MainCard from "ui-component/cards/MainCard";
import { setLoader } from "redux/auth/actions";
import { BLOCK_EXPLORER_URL } from "utils/constants";

const Activity = ({ nftList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const loaderUse = useSelector((state) => state?.auth?.loader);
  var serialId = nftList?.nft?.NFTTokens?.[0]?.serialId;
  var nft = nftList?.nft;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoader(true));
        if (serialId) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const factoryAddr = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, signer);
          let res = await factoryAddr.serials(serialId);
          let address = res[0].toLowerCase();
          let tokenId = parseInt(res[1]._hex);

          tokenId = tokenId.toString();
          dispatch(
            getTrack({
              serialId: serialId,
              tokenId: `${tokenId}`,
              address: address,
              navigate: navigate
            })
          );
        } else {
          dispatch(setLoader(false));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch(setLoader(false));
      }
    };

    fetchData();
  }, [serialId]);

  const marketplaceNfts = useSelector((state) => state.marketplaceReducer.trackNft);
  const tracking = marketplaceNfts?.activity;
  let marketplacefrommap = tracking?.map((value, index) => value.from);
  let marketfrom = marketplacefrommap?.find((value, index) => value == MarketplaceAddress?.address.toLowerCase());

  let marketplacetomap = tracking?.map((value, index) => value.to);
  let marketTo = marketplacetomap?.find((value, index) => value == MarketplaceAddress?.address.toLowerCase());

  let indexfilter = tracking?.map((img, index) => index);

  // console.log(indexfilter, 'indexfilter');

  //    let index=1;
  //    let price = ethers.utils.formatUnits(tracking?.activity[index].price, 6)
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  // const names = ['Sales', 'Listings', 'Offers', 'Transfers'];

  const theme = useTheme();

  const matchesMD = useMediaQuery(theme.breakpoints.up("md"));

  const className = matchesMD ? "activityTable" : "activityTable-mobile";
  const rowBorder = matchesMD ? "" : "border-mobile";

  const [personName, setPersonName] = React.useState("Show All");
  const names = [
    {
      label: "Show All",
      value: "Show All"
    },

    {
      label: "Mint",
      value: "Mint"
    },
    {
      label: "Mint Bulk",
      value: "Mint Bulk"
    },
    {
      label: "Transfer",
      value: "Transfer"
    },
    {
      label: "Bought",
      value: "Bought"
    },
    {
      label: "List",
      value: "List"
    },
    {
      label: "Resell",
      value: "Resell"
    }
  ];
  const handleChange = (event) => {
    setPersonName(event.target.value);
  };
  const itemData = [
    {
      title: "List",
      price: "0.006 ETH",
      from: "Vlad556 ",
      to: "Vlad556 ",
      days: "9 Days ago "
    },
    {
      title: "List",
      price: "0.006 ETH",
      from: "Alex 67 ",
      to: "Alex 67 ",
      days: "6 Days ago "
    },
    {
      title: "List",
      price: "0.006 ETH",
      from: "cynthia321 ",
      to: "cynthia321 ",
      days: "60 Days ago "
    },
    {
      title: "List",
      price: "0.006 ETH",
      from: "Vlad556 ",
      to: "Vlad556 ",
      days: "79 Days ago "
    }
  ];
  const [search, setSearch] = useState("");
  const cardsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // const currentCards = itemData.slice(indexOfFirstCard, indexOfLastCard);
  const selectedValue = tracking?.find((value) => value?.event == personName);
  // console.log(selectedValue, 'selectedValue');
  return (
    <>
      <Grid container-fluid="true" spacing={gridSpacing} sx={{ margin: "15px" }}>
        <Grid item xs={12} lg={12} md={12}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Typography
                color={theme.palette.mode === "dark" ? "#fff" : "#000"}
                className="productfigmastyl"
                component="div"
                sx={{
                  textAlign: { xs: "center", md: "center", sm: "center" },
                  marginTop: "20px",
                  marginBottom: "20px",
                  textTransform: "capitalize"
                }}
              >
                Metadata & Ownership Activities
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid item md={12} sm={12}>
            <MainCard
              className="tableBorder"
              sx={{ background: theme.palette.mode === "dark" ? "#262626" : "#fff" }}
              title={
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} sx={{ display: "flex" }}>
                    <Typography
                      variant="h3"
                      className="filter-text"
                      sx={{ marginRight: "18px !important", color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      Filter by:
                    </Typography>
                    <div>
                      <FormControl
                        className="filter-select"
                        sx={{
                          background: "transparent",
                          color: theme.palette.mode === "dark" ? "#fff" : "#000",
                          fontWeight: "500",
                          // border: '4px solid red',
                          borderRadius: "0px"
                        }}
                      >
                        <Select
                          sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            fontWeight: "500",

                            "& .MuiSelect-icon": {
                              right: "5px",
                              top: "40%"
                            }
                          }}
                          variant="standard"
                          displayEmpty
                          value={personName}
                          onChange={handleChange}
                          disableUnderline={true}
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={theme.palette.mode === "dark" ? CustomSelectIcon : CustomSelectIconLight}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                marginTop: "15px",
                                // border: '2px solid ',
                                // boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.10)',
                                background: theme.palette.mode === "dark" ? "#262626" : "#fff",

                                borderRadius: "0px",
                                width: "165px !important",
                                height: "42px !important"
                              }
                            }
                          }}
                        >
                          {names.map((name, i) => (
                            <MenuItem
                              sx={{
                                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                background: theme.palette.mode === "dark" ? "#262626" : "#fff",
                                fontFamily: theme?.typography.appText,
                                fontSize: "14px !important",
                                fontStyle: "normal !important",
                                fontWeight: "500 !important",
                                textTransform: "capitalize !important",
                                width: "110px"
                              }}
                              key={i}
                              value={name?.value}
                              // style={getStyles(name, personName, theme)}
                            >
                              {name.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              }
              content={false}
            >
              <TableContainer sx={{ p: 4 }}>
                {personName != "Show All" && !selectedValue ? (
                  <TableBody>
                    <TableCell
                      className="activityTable"
                      sx={{ fontSize: "18px !important", border: "none", width: { md: "1210px" } }}
                      align="center"
                    >
                      <Grid item xs={12}>
                        {Icons?.searchIcon}
                      </Grid>
                      <span> No NFTs items found</span>
                    </TableCell>
                  </TableBody>
                ) : (
                  <Table>
                    <TableHead
                      sx={{
                        background: theme.palette.mode === "dark" ? "#6B6F72" : "#f3f3f3",
                        borderRadius: "8px",

                        display: personName != "Show All" && !selectedValue ? "none" : "inlineblock"
                      }}
                    >
                      <TableRow>
                        <TableCell
                          className="leftCellactivityTable"
                          sx={{
                            paddingLeft: "40px",
                            color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important"
                          }}
                          align="left"
                        >
                          Event
                        </TableCell>
                        {/*   <TableCell className="activityTable" sx={{ fontSize: '18px !important' }} align="center">
                                                Brand Name{' '}
                                            </TableCell> */}
                        <TableCell
                          className="head-activityTable"
                          sx={{ color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important" }}
                          align="center"
                        >
                          Price
                        </TableCell>
                        <TableCell
                          className="head-activityTable"
                          sx={{
                            paddingLeft: "40px",
                            color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important"
                          }}
                          align="left"
                        >
                          From
                        </TableCell>

                        <TableCell
                          className="head-activityTable"
                          sx={{
                            paddingLeft: "40px",
                            color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important"
                          }}
                          align="left"
                        >
                          To
                        </TableCell>
                        <TableCell
                          className="rightCellactivityTable"
                          sx={{ color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important" }}
                          align="center"
                        >
                          Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {tracking?.map((item, i) => (
                      <TableBody key={i}>
                        {item.event != "Redeem" && (
                          <>
                            {personName == item.event || personName == "Show All" ? (
                              <TableRow className={rowBorder}>
                                <TableCell
                                  className={className}
                                  sx={{
                                    fontSize: "15px",
                                    color: "#2194FF",
                                    cursor: "pointer"
                                  }}
                                  align="left"
                                  onClick={() => {
                                    window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                  }}
                                >
                                  <Grid item ml={2} xs={12} sx={{ display: "flex", justifyContent: "left" }}>
                                    {item.event == "Transfer" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.transfer}
                                      </Avatar>
                                    )}

                                    {item.event == "Bought" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.bought}
                                      </Avatar>
                                    )}

                                    {item.event == "List" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.list}
                                      </Avatar>
                                    )}
                                    {item.event == "Mint" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.mint}
                                      </Avatar>
                                    )}
                                    {item.event == "Mint Bulk" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.mint}
                                      </Avatar>
                                    )}
                                    {item.event == "Resell" && (
                                      <Avatar
                                        alt="User 1"
                                        sx={{ width: 32, height: 32, objectFit: "fill", background: "#46494C" }}
                                      >
                                        {Icons.resell}
                                      </Avatar>
                                    )}

                                    <Typography
                                      align="left"
                                      ml={1}
                                      variant="h3"
                                      className="activity-update"
                                      sx={{
                                        color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important"
                                      }}
                                    >
                                      {item.event}
                                    </Typography>
                                    <Typography
                                      onClick={() => {
                                        window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                      }}
                                      align="left"
                                      variant="h3"
                                      className="activity-update"
                                    >
                                      {Icons?.hash}
                                    </Typography>
                                  </Grid>
                                </TableCell>

                                <TableCell className={className} sx={{ fontSize: "15px" }} align="center">
                                  {nft?.price ? Number(nft?.price).toFixed(2) : 0} USDC
                                </TableCell>

                                <TableCell
                                  className={className}
                                  sx={{ fontSize: "15px", color: "#2194FF", cursor: "pointer" }}
                                  align="center"
                                  onClick={() => {
                                    window.open(
                                      `${BLOCK_EXPLORER_URL}address/${item?.from ? item?.from : item?.minter}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  {item.event == "Transfer" ||
                                  item.event == "Bought" ||
                                  item.event == "List" ||
                                  item.event == "Resell" ? (
                                    <Grid
                                      item
                                      ml={2}
                                      xs={12}
                                      sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                                    >
                                      <>
                                        <Avatar
                                          alt="User 1"
                                          src={item?.fromUser?.picUrl}
                                          sx={{ border: "1px solid #5498CB", width: 32, height: 32, objectFit: "fill" }}
                                        />

                                        <Tooltip
                                          placement="top"
                                          title={item?.fromUser ? item?.fromUser?.fullName : item?.from}
                                        >
                                          <Typography
                                            align="left"
                                            ml={1}
                                            variant="h3"
                                            className="activity-update"
                                            sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                                          >
                                            {item?.fromUser
                                              ? item?.fromUser?.fullName
                                              : item?.from?.slice(0, 5) + "..." + item?.from?.slice(38, 42)}
                                          </Typography>
                                        </Tooltip>
                                        <Typography
                                          onClick={() => {
                                            window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                          }}
                                          align="left"
                                          variant="h3"
                                          className="activity-update"
                                        >
                                          {Icons?.hash}
                                        </Typography>
                                      </>
                                    </Grid>
                                  ) : (
                                    <Grid
                                      item
                                      ml={2}
                                      xs={12}
                                      sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                                    >
                                      {item?.minterUser && (
                                        <Avatar
                                          alt="User 1"
                                          src={item?.minterUser?.picUrl ? item?.minterUser?.picUrl : "m"}
                                          sx={{ border: "1px solid #5498CB", width: 32, height: 32, objectFit: "fill" }}
                                        />
                                      )}

                                      <>
                                        <Tooltip
                                          placement="top"
                                          title={item?.fromUser ? item?.fromUser?.fullName : item?.from}
                                        >
                                          <Typography
                                            align="left"
                                            ml={1}
                                            variant="h3"
                                            className="activity-update"
                                            sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                                          >
                                            {item?.minterUser
                                              ? item?.minterUser?.fullName
                                              : item?.from?.slice(0, 5) + "..." + item?.minter?.slice(38, 42)}
                                          </Typography>
                                        </Tooltip>
                                        <Typography
                                          onClick={() => {
                                            window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                          }}
                                          align="left"
                                          variant="h3"
                                          className="activity-update"
                                        >
                                          {Icons?.hash}
                                        </Typography>
                                      </>
                                    </Grid>
                                  )}
                                </TableCell>
                                <TableCell
                                  className={className}
                                  sx={{ fontSize: "15px", color: "#2194FF", cursor: "pointer" }}
                                  align="center"
                                  onClick={() => {
                                    window.open(
                                      `${BLOCK_EXPLORER_URL}address/${item?.toUser ? item?.to : item?.sellerUser?.walletAddress}`,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <Grid
                                    item
                                    ml={2}
                                    xs={12}
                                    sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                                  >
                                    {item.event == "Transfer" ||
                                    item.event == "Bought" ||
                                    item.event == "List" ||
                                    item.event == "Resell" ? (
                                      <>
                                        <Avatar
                                          alt="User 1"
                                          src={item?.toUser?.picUrl ? item?.toUser?.picUrl : "m"}
                                          sx={{ border: "1px solid #5498CB", width: 32, height: 32, objectFit: "fill" }}
                                        />

                                        <Tooltip
                                          placement="top"
                                          title={item?.toUser ? item?.toUser.fullName : item?.to}
                                        >
                                          <Typography
                                            align="left"
                                            ml={1}
                                            variant="h3"
                                            className="activity-update"
                                            sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                                          >
                                            {item?.toUser
                                              ? item?.toUser.fullName
                                              : item?.to?.slice(0, 5) + "..." + item?.to?.slice(38, 42)}
                                          </Typography>
                                        </Tooltip>
                                        <Typography
                                          onClick={() => {
                                            window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                          }}
                                          align="left"
                                          variant="h3"
                                          className="activity-update"
                                        >
                                          {Icons?.hash}
                                        </Typography>
                                      </>
                                    ) : (
                                      <>
                                        {item?.sellerUser && (
                                          <Avatar
                                            alt="User 1"
                                            src={item?.sellerUser?.picUrl ? item?.sellerUser?.picUrl : "m"}
                                            sx={{
                                              border: "1px solid #5498CB",
                                              width: 32,
                                              height: 32,
                                              objectFit: "fill"
                                            }}
                                          />
                                        )}
                                        <Tooltip
                                          placement="top"
                                          title={item?.sellerUser ? item?.sellerUser?.fullName : item?.seller}
                                        >
                                          <Typography
                                            align="left"
                                            ml={1}
                                            variant="h3"
                                            className="activity-update"
                                            sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                                          >
                                            {item?.seller
                                              ? item?.sellerUser?.fullName
                                              : item?.seller?.slice(0, 5) + "..." + item?.seller?.slice(38, 42)}
                                          </Typography>
                                        </Tooltip>
                                        {item?.seller && (
                                          <Typography
                                            onClick={() => {
                                              window.open(`${BLOCK_EXPLORER_URL}tx/${item?.transactionHash}`, "_blank");
                                            }}
                                            align="left"
                                            variant="h3"
                                            className="activity-update"
                                          >
                                            {Icons?.hash}
                                          </Typography>
                                        )}
                                      </>
                                    )}
                                  </Grid>
                                </TableCell>
                                <Tooltip
                                  placement="top"
                                  title={moment.unix(item?.blockTimestamp).format("ddd MMM DD YYYY")}
                                >
                                  <TableCell
                                    className={className}
                                    sx={{
                                      display: { xs: "flow-root", md: "none" },
                                      width: "150px",
                                      marginTop: "10px",
                                      fontSize: "15px"
                                    }}
                                    align="center"
                                  >
                                    {moment.unix(item?.blockTimestamp).format("ddd MMM DD YYYY")}
                                  </TableCell>
                                </Tooltip>
                                <Tooltip
                                  placement="top"
                                  title={moment.unix(item?.blockTimestamp).format("ddd MMM DD YYYY")}
                                >
                                  <TableCell
                                    className={className}
                                    sx={{ display: { xs: "none", md: "table-cell" }, fontSize: "15px" }}
                                    align="center"
                                  >
                                    {moment.unix(item?.blockTimestamp).format("ddd MMM DD YYYY")}
                                  </TableCell>
                                </Tooltip>
                              </TableRow>
                            ) : (
                              ""
                            )}
                          </>
                        )}
                      </TableBody>
                    ))}
                  </Table>
                )}
                {/*      <Pagination
                                count={Math.ceil(currentCards.length / cardsPerPage)}
                                onChange={(event, value) => setCurrentPage(value)}
                                page={currentPage}
                              /> */}
              </TableContainer>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const CustomSelectIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none" {...props}>
      <path
        d="M1 1.24023L4.53 4.76023L8.06 1.24023"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const CustomSelectIconLight = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none" {...props}>
      <path
        d="M1 1.24023L4.53 4.76023L8.06 1.24023"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Activity;
