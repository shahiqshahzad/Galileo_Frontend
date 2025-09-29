import { useLocation } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Divider } from "@mui/material";
import Activity from "./component/activity";
import Product from "./component/productView";
import Header from "layout/UserLayout/header";
import Sidebar from "layout/UserLayout/sidebar";
// import Footer from "layout/UserLayout/footer";
import TrackAtribute from "./component/trackAtribute";
import { getTrack } from "redux/marketplace/actions";
import { useParams } from "react-router-dom";
// import { getnftData } from 'redux/landingPage/actions';
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { fetchNftTokenAndAddress } from "utils/fetchNftTokenAddress";

const TrackingTool = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const serialId = useParams().token;

  const marketplaceNfts = useSelector((state) => state.marketplaceReducer.trackNft);

  const fetchData = async () => {
    try {
      // Check if tokenId and address are already available in the component's state
      if (location.state?.tokenId && location.state?.address) {
        // Return the data from the state if available
        return { tokenId: location.state?.tokenId, address: location.state?.address };
      } else {
        // If tokenId and address are not in the state, fetch them using fetchNftTokenAndAddress(serialNo)
        const { tokenId, address } = await fetchNftTokenAndAddress(serialId);
        return { tokenId, address };
      }
    } catch (error) {
      // Handle errors that may occur during the data fetching process
      console.error("Error fetching data:", error);
      // Return default values in case of an error
      return { tokenId: null, address: null };
    }
  };

  useEffect(() => {
    // Define an asynchronous function to fetch and dispatch data
    const fetchAndDispatch = async () => {
      // Call the fetchData function to get tokenId and address
      const { tokenId, address } = await fetchData();

      // Create a payload object to be used in the dispatch function
      const payload = {
        serialId: serialId,
        navigate: navigate,
        tokenId: `${tokenId}`,
        address: address
      };

      // Check if tokenId and address are available before dispatching the action
      if (tokenId && address) {
        // Dispatch the action with the payload
        dispatch(getTrack(payload));
      }
    };

    // Call the fetchAndDispatch function when dependencies change
    fetchAndDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialId, navigate, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    // stop the timer once the data is fetched
    if (marketplaceNfts?.nft) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [marketplaceNfts]);

  return (
    <>
      <Grid
        container
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(to top right, 50% 50% at 50% 50%, #2B8CFF 0%, rgba(43, 140, 255, 0.27))"
              : "#f3f3f3",

          // backgroundImage: "linear-gradient(to top right, black,rgba(255,0,0,0), rgba(43 140 255 / 27%) )",
          // background: "radial-gradient(to top right, 50% 50% at 50% 50%, #2B8CFF 0%, rgba(43, 140, 255, 0.27))",

          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(to top right, black,rgba(255,0,0,0), rgba(43 140 255 / 27%) )"
              : ""
        }}
      >
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          sx={{
            mt: 2,
            ml: 2,
            mr: 2,
            background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
            color: theme.palette.mode === "dark" ? "white" : "#404040",
            borderRadius: "4px"
          }}
        >
          <Header />
        </Grid>

        <Grid
          item
          md={1}
          xs={12}
          sx={{
            mt: 2,
            marginBottom: "28px",
            position: "sticky",
            height: "100%",
            top: "0",
            display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }
          }}
        >
          <Sidebar />
        </Grid>
        <Grid
          container-fluid="true"
          md={11}
          lg={11}
          sx={{
            ml: { md: -2 },
            mt: 0.4,
            display: { xs: "block", sm: "block", md: "flex", lg: "flex" },
            background: "tranparent",
            color: theme.palette.mode === "dark" ? "white" : "#404040"
          }}
        >
          {marketplaceNfts?.nft ? (
            <Grid item md={12} xs={12} lg={12}>
              {/*  <Grid item xs={12} lg={12} md={12}>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12}>
                                    <Typography
                                        color={theme.palette.mode === 'dark' ? '#FFFFFF' : 'black'}
                                        className="productfigmastyl"
                                        variant="h2"
                                        mt={4}
                                        component="div"
                                        sx={{ textAlign: { xs: 'center', md: 'center', sm: 'center' }, textTransform: 'capitalize' }}
                                    >
                                        The product is authentic
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid> */}
              <Grid container-fluid="true">
                <Grid item md={12} xs={12}>
                  <Grid container>
                    <Grid item md={12} xs={12}>
                      <Product tracker={marketplaceNfts} />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TrackAtribute tracking={marketplaceNfts} />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Activity tracking={marketplaceNfts?.activity} nft={marketplaceNfts?.nft} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Stack m={5} sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              {/*   <LinearProgress color="secondary" />
                        <LinearProgress color="success" /> */}
              <LinearProgress color="secondary" variant="determinate" value={progress} />
            </Stack>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ borderBottomWidth: 1, border: "1px solid #ccc" }} />

      <Grid
        item
        md={10}
        sm={10}
        xs={12}
        sx={{
          pl: {},
          background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
          color: theme.palette.mode === "dark" ? "white" : "#404040"
        }}
      >
        {/* <Footer /> */}
      </Grid>
    </>
  );
};

export default TrackingTool;
