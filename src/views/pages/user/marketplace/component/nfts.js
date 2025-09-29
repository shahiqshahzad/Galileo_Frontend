import { Grid, Typography, Box } from "@mui/material";
import NftCard from "../../commonComponent/nftCard";
import SearchIcon from "assets/images/icons/search_icon_items.svg";
import { useWeb3 } from "utils/MagicProvider";

const NFTS = ({ marketplaceNfts, categoryId }) => {
  // eslint-disable-next-line no-unused-vars
  const { provider } = useWeb3();

  // useEffect(() => {

  //   const myFunctions = async  () =>{
  //     const newSigner = await provider.getSigner()
  //     let address = null
  //     try{
  //       address = await newSigner.getAddress();
  //       console.log(address , " >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  //    }catch(err){
  //      console.log(err, "errrrrrrrrrrr")
  //    }
  //   }
  //   if(provider){
  //     myFunctions()

  //   }
  // }, [provider])
  return (
    <Grid container-fluid="true">
      <Grid item md={12} xs={12}>
        <Grid container>
          {marketplaceNfts?.nfts?.length > 0 ? (
            marketplaceNfts?.nfts?.map((item, i) => <NftCard key={i} data={item} categoryId={categoryId} />)
          ) : (
            <>
              <Grid container justifyContent={"center"}>
                <Grid
                  item
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  xs={12}
                  md={11.9}
                  lg={11.9}
                  sx={{ background: "#22282C", borderRadius: "5px", height: "200px", textAlign: "center" }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box textAlign="center" component="img" alt="search-icon" src={SearchIcon} sx={{ height: 50 }} />
                    <Typography
                      className="app-text"
                      variant="h3"
                      mt={1}
                      component="div"
                      sx={{ textAlign: { xs: "center", md: "left", sm: "center" }, textTransform: "capitalize" }}
                    >
                      No items founds
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NFTS;
