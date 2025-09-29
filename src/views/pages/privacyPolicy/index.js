import { Container, Grid, Typography, Box, Link } from "@mui/material";
import { gridSpacing } from "store/constant";
import "@fontsource/public-sans";

const PrivacyPolicy = () => {
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
              sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}
            >
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={gridSpacing} sx={{ textAlign: "left" }}>
                  <Grid item xs={12}>
                    <Typography variant="h1" sx={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "2rem" }}>
                      Privacy Policy
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Thank you for using Galileo Protocol Product Suite, owned and operated by Galileo Network SARL
                      (hereinafter "Galileo Network," "we," "us," or "our"). Your privacy is important to us. This
                      Privacy Policy (the "Policy") explains how we collect, use, and disclose information about you
                      when you access or use our product suite, which includes software, applications, and services
                      (collectively referred to as the "Service" or "Services").
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      By accessing or using any part of the Services, you acknowledge that you have read this Policy and
                      agree to be bound by its terms. If you do not agree to this Policy, do not use the Services.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      1. Information We Collect
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We may collect information that identifies you as an individual or relates to an identifiable
                        individual ("Personal Information") when you access or use our Services. The types of Personal
                        Information we may collect include:
                        <ul style={{ marginTop: "10px" }}>
                          <li>Contact information, such as your name, email address, and phone number.</li>
                          <li>Payment information, such as your credit card or other payment account information.</li>
                          <li>
                            Information about your use of the Services, such as your IP address, browser type, operating
                            system, referring URLs, access times, and pages viewed.
                          </li>
                        </ul>
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      2. Use of Your Personal Information
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We may use your Personal Information for the following purposes:
                        <ul style={{ marginTop: "10px" }}>
                          <li>To provide and maintain the Services, including to process payments and orders.</li>
                          <li>
                            To communicate with you about the Services, including to send you updates and marketing
                            materials.
                          </li>
                          <li>
                            To monitor and analyze usage of the Services and to improve and personalize your experience.
                          </li>
                          <li>To comply with legal obligations and to protect our rights and interests.</li>
                        </ul>
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      3. Sharing of Your Personal Information
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We may share your Personal Information with third parties in the following circumstances:
                        <ul style={{ marginTop: "10px" }}>
                          <li>With your consent or at your direction.</li>
                          <li>
                            With service providers who perform services on our behalf, such as payment processing and
                            data analysis.
                          </li>
                          <li>To comply with legal obligations or to protect our rights and interests.</li>
                          <li>In connection with a merger, acquisition, or sale of all or a portion of our assets.</li>
                        </ul>
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      4. Security of Your Personal Information
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We take reasonable measures to protect your Personal Information from unauthorized access, use,
                        or disclosure. However, no method of transmission over the internet or electronic storage is
                        100% secure, and we cannot guarantee absolute security.
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      5. Retention of Your Personal Information
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We will retain your Personal Information for as long as necessary to fulfill the purposes for
                        which it was collected, or as required by law. We may also retain and use your information to
                        comply with our legal obligations, resolve disputes, and enforce our agreements.
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      6. Your Choices and Rights
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        You may have certain rights with respect to your Personal Information, such as the right to
                        access, correct, or delete your information. You may also have the right to object to or
                        restrict certain types of processing of your information. To exercise these rights, please
                        contact us at the email address below.
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      7. Changes to this Policy
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        We may update this Policy from time to time by posting a revised version on our website. Your
                        continued use of the Services after the effective date of any revised Policy constitutes your
                        acceptance of the revised Policy.
                      </Typography>
                    </Box>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      8. Contact Us
                    </Typography>
                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        If you have any questions or concerns about this Policy or our privacy practices, please contact
                        us at <Link href="mailto:hello@galileoprotocol.io">hello @galileoprotocol.io</Link>
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      This Policy was last updated on May 22, 2023.
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

export default PrivacyPolicy;
