import { Grid, Typography } from "@mui/material";
import { gridSpacing } from "store/constant";

import ProductCard from "./ProductCard";

const SearchProducts = ({ marketplaceNfts }) => {
  return (
    <Grid container-fluid="true" spacing={gridSpacing} sx={{ paddingRight: "0%" }}>
      <Grid item xs={12}>
        {marketplaceNfts?.nfts?.length > 0 ? (
          <Grid
            container
            justifyContent="left"
            spacing={gridSpacing}
            sx={{ mt: 2, textAlign: "center", paddingRight: "1%" }}
          >
            {marketplaceNfts?.nfts?.map((item, i) => (
              <ProductCard key={i} data={item} />
            ))}
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Typography
                className="fontfamily"
                variant="h3"
                component="div"
                sx={{
                  mt: { md: 8, lg: 8 },
                  textAlign: { xs: "center", md: "center", sm: "center" }
                }}
              >
                No results found
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default SearchProducts;
