import React from "react";
import { Grid, Typography, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCurrencies } from "redux/generalSettingSuperadmin/actions";
import { styled, useTheme } from "@mui/material/styles";
import AddNewCurrencyDialog from "./addNewCurrencyDialog";
import { LoaderComponent } from "utils/LoaderComponent";
import { useWeb3 } from "utils/MagicProvider";
const StyledDownloadBtn = styled(Button)(({ theme }) => ({
  fontFamily: theme?.typography.appText,
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "18.8px",
  marginLeft: "60px",
  letterSpacing: "0em",
  textAlign: "center",
  width: "198px",
  height: "50px",
  color: "#fff",
  borderRadius: "4.62px",
  background: "linear-gradient(138.3deg, #2F53FF -0.85%, #2FC1FF 131.63%)",
  "&:hover": { backgroundColor: "#2196f3" }
}));

const Index = () => {
  const theme = useTheme();
  const currencyList = useSelector((state) => state.Currency.currencyList);
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { provider } = useWeb3();

  useEffect(() => {
    dispatch(getAllCurrencies({ setLoading: setLoading }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLoading]);

  return (
    <>
      <AddNewCurrencyDialog setOpen={setOpen} open={open} />
      {loading === true ? (
        <LoaderComponent justifyContent={"center"} alignItems={"center"} />
      ) : (
        <div>
          <Typography
            variant="h1"
            component="h2"
            className="SupportedCurrencies"
            sx={{
              marginTop: "10px",
              marginBottom: "20px",

              background: theme.palette.mode === "dark" ? "black" : "#f3f3f3",
              color: theme.palette.mode === "dark" ? "white" : "#404040"
            }}
          >
            Supported Currencies
          </Typography>
          {loading === true ? (
            <LoaderComponent justifyContent={"center"} alignItems={"center"} />
          ) : (
            <Grid
              container
              xs="8"
              sx={{
                background: "#181C1F",
                padding: "10px",
                borderRadius: "10px"
              }}
            >
              {currencyList && currencyList !== undefined && currencyList?.length !== 0 ? (
                currencyList.map((row, index) => (
                  <Grid
                    container
                    sx={{
                      background: "#252B2F",
                      margin: "10px",
                      padding: "20px",
                      borderRadius: "10px"
                    }}
                    xs="12"
                  >
                    <Grid xs="6" item key={index}>
                      <Tooltip sx={{ cursor: "pointer" }} placement="left" title={row.address}>
                        <Typography
                          variant="p"
                          component="p"
                          className="app-text"
                          sx={{
                            fontWeight: 600,
                            cursor: "pointer",
                            color: theme.palette.mode === "dark" ? "white" : "#404040"
                          }}
                        >
                          {row.address?.slice(0, 7) + "..." + row.address?.slice(38, 42)}
                        </Typography>
                      </Tooltip>
                    </Grid>
                    <Grid xs="2" item key={index} color={"white"}>
                      {row.networkName}
                    </Grid>
                    <Grid xs="2" item key={index}>
                      <Grid
                        width={"24px"}
                        height={"2px"}
                        sx={{ borderRadius: "5px", background: "liner-gradient(rgba(47,83,255,1),rgba(47,193,255,1))" }}
                      ></Grid>
                    </Grid>
                    <Grid
                      xs="2"
                      item
                      key={index}
                      className="app-text"
                      sx={{ textAlign: "end", cursor: "pointer" }}
                      color={"white"}
                    >
                      <Tooltip sx={{ cursor: "pointer" }} placement="right" title={row.currencySymbol}>
                        {row.currencySymbol?.length > 7 ? row.currencySymbol.slice(0, 7) + "..." : row.currencySymbol}
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Grid item>
                  <Typography className="statustypo" style={{ padding: "20px 20px 20px 70px", fontWeight: "500" }}>
                    Supported Currencies are not available
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
          <Grid container xs={8} justifyContent={"right"} alignItems={"center"} sx={{ marginTop: "30px" }}>
            <StyledDownloadBtn
              className="Add-new-button addNewText"
              variant="outlined"
              aria-label="Cart"
              onClick={() => {
                setOpen(true);
              }}
            >
              Add New
            </StyledDownloadBtn>
          </Grid>
        </div>
      )}
    </>
  );
};

export default Index;
