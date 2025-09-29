import { Container, Grid, Typography } from "@mui/material";
import { gridSpacing } from "store/constant";
import "@fontsource/public-sans";

const FAQ = () => {
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
                      FAQ
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      What is an pNFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      An pNFT Marketplace is an online platform where creators can mint and sell non-fungible tokens
                      (pNFTs), which are unique digital assets that represent ownership or authenticity of a specific
                      digital item, such as art, music, videos, or other digital content.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How do pNFT Marketplaces work?
                    </Typography>
                    <Typography variant="body1">
                      pNFT Marketplaces provide a platform for creators to mint and list their pNFTs for sale, and for
                      buyers to browse and purchase pNFTs using cryptocurrency. Once an pNFT is sold, the ownership of
                      the digital asset is transferred to the buyer, who can then resell it on the marketplace or hold
                      onto it as an investment.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What are the benefits of using an pNFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      pNFT Marketplaces provide creators with a new revenue stream by allowing them to monetize their
                      digital creations. They also provide buyers with a way to own and collect unique digital assets,
                      and potentially profit from their appreciation in value.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What are the fees associated with using an NFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      Most NFT Marketplaces charge a transaction fee, which is a percentage of the sale price of the
                      NFT. Some marketplaces also charge a listing fee or a gas fee to cover the cost of blockchain
                      transactions.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What cryptocurrencies are accepted on pNFT Marketplaces?
                    </Typography>
                    <Typography variant="body1">
                      The most common cryptocurrency accepted on pNFT Marketplaces is Ether (ETH), which is the native
                      cryptocurrency of the Ethereum blockchain. Some marketplaces also accept other cryptocurrencies
                      such as Bitcoin (BTC) or stablecoins like USDC or DAI.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      Are NFTs environmentally friendly?
                    </Typography>
                    <Typography variant="body1">
                      The environmental impact of pNFTs is a controversial topic, as the minting and trading of pNFTs
                      requires significant energy consumption. However, some pNFT Marketplaces are taking steps to
                      mitigate their environmental impact, such as using renewable energy sources or implementing carbon
                      offset programs.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How can I ensure the authenticity of an pNFT?
                    </Typography>
                    <Typography variant="body1">
                      The authenticity of an pNFT is guaranteed by the blockchain technology used to create and track
                      it. Each pNFT has a unique digital signature that is stored on the blockchain, which ensures that
                      it is one-of-a-kind and cannot be duplicated or counterfeited. Buyers should always verify the
                      authenticity of an pNFT before making a purchase, and ensure that it is listed on a reputable pNFT
                      Marketplace.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What are some popular pNFT Marketplaces?
                    </Typography>
                    <Typography variant="body1">
                      Some popular pNFT Marketplaces include OpenSea, Rarible, SuperRare, Nifty Gateway, and Foundation.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How do I create and sell NFTs on an NFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      The process for creating and selling NFTs on an NFT Marketplace may vary, but generally involves
                      minting the NFT using a blockchain platform such as Ethereum, listing the NFT for sale on the
                      marketplace, and setting a price in cryptocurrency.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What type of content can be turned into an NFT?
                    </Typography>
                    <Typography variant="body1">
                      Almost any digital content can be turned into an NFT, including artwork, music, videos, tweets,
                      and even virtual real estate.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How do I store NFTs?
                    </Typography>
                    <Typography variant="body1">
                      NFTs are stored in a digital wallet that is compatible with the blockchain platform used to create
                      the NFT. Some popular digital wallets for storing NFTs include MetaMask and MyEtherWallet.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      What are the fees associated with buying and selling NFTs on an NFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      Fees associated with buying and selling NFTs on an NFT Marketplace vary, but generally include
                      transaction fees, gas fees, and platform fees. These fees may be paid in cryptocurrency.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      Can NFTs be resold?
                    </Typography>
                    <Typography variant="body1">
                      Yes, NFTs can be resold on an NFT Marketplace or through other channels. The resale price may be
                      higher or lower than the original purchase price, depending on market demand.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      Are there any risks associated with buying and selling NFTs?
                    </Typography>
                    <Typography variant="body1">
                      As with any investment, there are risks associated with buying and selling NFTs. The value of NFTs
                      may fluctuate based on market demand, and there is no guarantee of profit. There is also a risk of
                      scams or fraud, so it is important to do research and use caution when buying and selling NFTs.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How do I buy an NFT on an NFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      To buy an NFT on an NFT Marketplace, you need to have a cryptocurrency wallet with the appropriate
                      cryptocurrency (usually Ethereum). Then, you need to browse the NFT Marketplace, find the NFT you
                      want to buy, and place a bid or purchase it outright if it is available for sale.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
                      How do I sell an NFT on an NFT Marketplace?
                    </Typography>
                    <Typography variant="body1">
                      To sell an NFT on an NFT Marketplace, you need to create an account, upload your NFT to the
                      platform, set a price or auction it, and wait for a buyer to make an offer or purchase it
                      outright.
                    </Typography>
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

export default FAQ;
