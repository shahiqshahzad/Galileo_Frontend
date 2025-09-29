import { Container, Grid, Typography } from "@mui/material";
import { gridSpacing } from "store/constant";
import "@fontsource/public-sans";

const TermsofService = () => {
  return (
    <Grid item md={12} xs={12} lg={11} xl={11}>
      <Grid container>
        <Grid item md={12} xs={12} sx={{ border: "2px solid transparent" }}>
          <Container>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={gridSpacing}
              sx={{ mt: { xs: 10, sm: 6, md: 12 }, mb: { xs: 2.5, md: 10 } }}
            >
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={gridSpacing} sx={{ textAlign: "left" }}>
                  <Grid item xs={12}>
                    <Typography variant="h1" sx={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "2rem" }}>
                      Terms of Service
                    </Typography>

                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Thank you for choosing to use the Galileo Protocol Marketplace ("Company", "we", "us", or "our").
                      By accessing or using our platform, you agree to comply with and be bound by the following terms
                      and conditions of service ("Terms"). Please read these Terms carefully before using our platform.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Introduction
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      These Terms govern your access to and use of the Galileo Protocol Marketplace, including any
                      content, functionality, and services offered on or through the platform (collectively, the
                      "Services").
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Acceptance of Terms
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      By accessing or using the Services, you agree to be bound by these Terms and all applicable laws
                      and regulations. If you do not agree with any of these Terms, you are prohibited from using or
                      accessing the Services.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Use of the Services
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      You agree to use the Services only for lawful purposes and in accordance with these Terms. You are
                      solely responsible for your use of the Services and any consequences thereof.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Registration
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      In order to access certain features of the Services, you may be required to register for an
                      account. When registering for an account, you agree to provide accurate, current, and complete
                      information. You are responsible for maintaining the confidentiality of your account credentials
                      and for all activities that occur under your account.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Cryptocurrency Transactions
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Galileo Protocol Marketplace allows users to buy physical products using various
                      cryptocurrencies such as USDC, USDT, and others as specified by the Company. By engaging in
                      cryptocurrency transactions on the platform, you agree to abide by all applicable laws and
                      regulations governing the use and exchange of cryptocurrencies.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Buying, Reselling, and Redeeming Items
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Users may purchase items from the Galileo Protocol Marketplace for personal use, resale, or
                      redemption. You agree to adhere to any specific terms and conditions associated with the purchase,
                      resale, or redemption of items on the platform.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Intellectual Property
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Services and all content, features, and functionality thereof are owned by the Company or its
                      licensors and are protected by copyright, trademark, and other intellectual property laws. You may
                      not modify, reproduce, distribute, or create derivative works based on the Services without the
                      prior written consent of the Company.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Disclaimer of Warranties
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Services are provided on an "as is" and "as available" basis, without any warranties of any
                      kind, either express or implied. The Company disclaims all warranties, including, but not limited
                      to, the implied warranties of merchantability, fitness for a particular purpose, and
                      non-infringement.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Limitation of Liability
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      In no event shall the Company, its officers, directors, employees, or agents be liable for any
                      indirect, incidental, special, consequential, or punitive damages, arising out of or in connection
                      with your use of the Services or these Terms.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Indemnification
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      You agree to indemnify and hold harmless the Company, its officers, directors, employees, and
                      agents, from and against any and all claims, damages, obligations, losses, liabilities, costs, or
                      debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of
                      and access to the Services; (ii) your violation of any term of these Terms; or (iii) your
                      violation of any third-party right, including without limitation any copyright, property, or
                      privacy right.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Changes to Terms
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Company reserves the right to modify or revise these Terms at any time, in its sole
                      discretion. All changes are effective immediately when posted, and your continued use of the
                      Services after any changes have been made constitutes your acceptance of the updated Terms.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Governing Law
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      These Terms shall be governed by and construed in accordance with the laws of Switzerland, without
                      regard to its conflict of law principles.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      Contact Us
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      If you have any questions or concerns about these Terms, please contact us at
                      hello@galileoprotocol.io
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

export default TermsofService;
