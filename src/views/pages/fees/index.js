import { Container, Grid, Typography, Box } from "@mui/material";
import { gridSpacing } from "store/constant";
import "@fontsource/public-sans";

const FeesTaxesDisclaimer = () => {
  return (
    <Grid item md={12} xs={12} lg={11} xl={11}>
      <Grid container-fluid="true">
        <Grid item md={12} xs={12} sx={{ border: "2px solid transparent" }}>
          <Container>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={gridSpacing}
              sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}
            >
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={gridSpacing} sx={{ textAlign: "left" }}>
                  <Grid item xs={12}>
                    <Typography variant="h1" sx={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "2rem" }}>
                      Fees & Taxes Disclaimer
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Fees
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" component="li" sx={{ mb: "1rem" }}>
                        Every transaction on the Galileo Protocol NFT Marketplace requires the payment of a transaction
                        fee (each, a “Transaction Fee”). Except as otherwise expressly stated in these Terms and/or the
                        Sales Terms, you will be solely responsible to pay any Transaction Fee for any transaction
                        entered into via the NFT Marketplace.
                      </Typography>
                      <Typography variant="body1" component="li" sx={{ mb: "1rem" }}>
                        By buying and selling pNFTs on the NFT Marketplace, you agree to pay all applicable fees,
                        including transaction fees, as stipulated on the checkout screen at the time of your purchase,
                        It authorise us to automatically deduct any such fees directly from payments to you and/or add
                        fees to your payments where applicable.
                      </Typography>
                      <Typography variant="body1" component="li" sx={{ mb: "1rem" }}>
                        Approved Networks charge network fees. These fees are often required to cover the transaction
                        costs on virtual currency networks and may apply to the purchase transactions. Unless indicated
                        otherwise in your account or elsewhere in the Terms of the NFT Marketplace, you are solely
                        responsible for paying all network fees. We will not advance nor fund network fees on your
                        behalf, nor be responsible should the network fee paid be insufficient or excessive. Your
                        Account and Wallet from which you wish to send must hold sufficient NFTs and funds to cover the
                        transaction and its associated network fees, failing which the transaction may be blocked, might
                        fail or result in your value being suspended temporarily or forever.
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      Taxes
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" component="li">
                        Galileo Protocol is not responsible for determining your taxes, if any, taxes apply to your
                        purchases, sales, and transfers of NFTs. If you have specific questions regarding taxes, please
                        consult with a professional tax advisor.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FeesTaxesDisclaimer;
