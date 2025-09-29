import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { gridSpacing } from "store/constant";
import "@fontsource/public-sans";

const index = () => {
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
              sx={{ mt: { xs: 10, sm: 6, md: 3 }, mb: { xs: 2.5, md: 5 } }}
            >
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={gridSpacing} sx={{ textAlign: "left" }}>
                  <Grid item xs={12}>
                    <Typography variant="h1" sx={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "2rem" }}>
                      LEGAL DISCLAIMER, CONSIDERATIONS AND RISKS
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Please read the entirety of this “Legal Disclaimer, Considerations and Risks” section carefully.
                      If you have any doubts as to what actions you should take, we recommend that you consult with your
                      legal, financial, tax or other professional advisor(s).
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Galileo protocol’s Terms of Use, Privacy Policy and other documents related to Galileo protocol
                      Website Services (‘’Galileo protocol Documents’’) and other services are not subject to any legal
                      system and are not governed by any law. No regulatory authority has examined or approved of any of
                      the information set out in the Galileo protocol Documents or Services and no such action has been
                      or will be taken under the laws, regulatory requirements or rules of any jurisdiction.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Galileo protocol Documents and Services provide comprehensive information about Galileo protocol
                      Platform/Website, including NFT marketplace and other features such as the ecosystem, token
                      economy etc. The publication, distribution or dissemination of the Galileo protocol Documents do
                      not imply that the applicable laws, regulatory requirements or rules have been complied with.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      You don’t have the right and shouldn’t buy NFTs or Tokens if you are a citizen or resident (tax or
                      otherwise) of any country or territory where transactions with digital tokens and/or digital
                      currencies are prohibited or in any other manner restricted by applicable laws. (“Person” is
                      generally defined as a natural person residing in the relevant state or any entity organized or
                      incorporated under the laws of the relevant state).
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      This ‘’Legal Disclaimer, Considerations and Risks’’ section applies to all information available
                      on the GALILEO PROTOCOL Platform/Website. The contents of this “Legal Disclaimer, Considerations
                      and Risks” section outlines the terms and conditions applicable to you in connection with (i) your
                      use of any and all information available on the Website; and (ii) your participation in the NFTs
                      or Tokens, in each case in addition to any other terms and conditions that we may publish from
                      time to time , the Website and the related legal documents on the Website (such terms hereinafter
                      referred to as the “Terms”).
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      This “Legal Disclaimer, Considerations and Risks” section may be updated from time to time and
                      will be published as part of the latest version which shall be available on the Website. You shall
                      be obliged to read in full the latest available versio available on the Website.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      No part of the Galileo protocol Documents are to be reproduced, distributed, or disseminated
                      without including this “Disclaimer of Liability'' section. The sole purpose of the Galileo
                      protocol Document is to present Galileo protocol Platform and NFTs or Tokens to potential NFT or
                      token holders. The information is provided for informative purposes only. It may not be exhaustive
                      and doesn’t imply any elements of a contractual relationship or obligations.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Despite the fact that Galileo protocol makes every effort to ensure the accuracy, up-to-datedness,
                      and relevance of any material in the Galileo protocol Documents and the services on the Galileo
                      protocol Platform/Website this document and materials contained herein are not professional advice
                      and in no way constitutes the provision of professional advice of any kind.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Further, Galileo protocol reserves the right to modify or update the Galileo protocol Documents
                      and information contained herein, the Services on the Galileo protocol Platform/Website at any
                      moment and without notice. To the maximum extent permitted by any applicable laws, regulations and
                      rules, Galileo protocol doesn’t guarantee and doesn’t accept legal responsibility of any nature,
                      for any indirect, special, incidental, consequential or other losses of any kind, in tort,
                      contract or otherwise (including but not limited to loss of revenue, income or profits, and loss
                      of use or data), arising from orrelated to the accuracy, reliability, relevance or completeness of
                      any material contained in Galileo protocol Documents or in the Services on the Galileo protocol
                      Platform/Website.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Further, Galileo protocol does not make or purport to make, and hereby disclaims, any
                      representation, warranty or undertaking in any form whatsoever to any entity, person, or
                      authority, including any representation, warranty or undertaking in relation to the truth,
                      accuracy and completeness of any of the information set out in Galileo protocol Documents or about
                      the Services on the Galileo protocol Platform/Website.
                    </Typography>

                    {/* <Typography variant="h2" sx={{ marginBottom: '1rem' }}>
                                    1. Information We Collect
                                </Typography> */}
                    {/* <Box component="ol">
                                    <Typography variant="body1" sx={{ mb: '1rem' }}>
                                        We may collect information that identifies you as an individual or relates to an
                                        identifiable individual ("Personal Information") when you access or use our Services. The
                                        types of Personal Information we may collect include:
                                        <ul style={{ marginTop: '10px' }}>
                                            <li>Contact information, such as your name, email address, and phone number.</li>
                                            <li>
                                                Payment information, such as your credit card or other payment account information.
                                            </li>
                                            <li>
                                                Information about your use of the Services, such as your IP address, browser type,
                                                operating system, referring URLs, access times, and pages viewed.
                                            </li>
                                        </ul>
                                    </Typography>
                                </Box> */}
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      LEGAL CONSIDERATIONS
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Galileo protocol has used reasonable endeavours to approach the Services on the Galileo protocol
                      Platform/Website in a responsible and sensible manner. Given the legal uncertainty of distributed
                      ledger technologies, businesses and activities as well as cryptocurrencies and
                      cryptocurrency-related businesses and activities in a number of jurisdictions, Galileo protocol
                      has spent time and resources to consider its business approach and where it proposes to operate
                      now and in the future.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Purchased NFTs or tokens cannot be offered or distributed as well as cannot be resold or otherwise
                      alienated by their holders to mentioned persons. It is your sole responsibility to establish, by
                      consulting (if necessary) your legal, tax, accounting or other professional advisors, what
                      requirements and limitations, if any, apply to your particular jurisdiction, and ensure that you
                      have observed and complied with all restrictions, at your own expense and without liability to
                      Galileo protocol NFTs or tokens are not and will not be intended to constitute securities, digital
                      currency, commodity, or any other kind of financial instrument and have not been registered under
                      relevant securities regulations, including the securities laws of any jurisdiction in which a
                      potential token holder is a resident.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Galileo protocol Documents are not a prospectus or a proposal, and their purposes are not to
                      serve as securities offer or request for investments in the form of securities in any
                      jurisdiction. However, in spite of the above, legislation of certain jurisdictions may, now or in
                      future, recognize Galileo protocol NFTs or Tokens as securities. Galileo protocol does not accept
                      any liability for such recognition and\or any legal and other consequences of such recognition for
                      potential owners of Galileo protocol NFTs or tokens, nor provide any opinions or advice regarding
                      the acquisition, sale or other operations with Galileo protocol NFTs or tokens, and the fact of
                      the provision of the Galileo protocol Documents doesn’t form the basis or should not be relied
                      upon in matters related to the conclusion of contracts or acceptance investment decisions. The
                      Galileo protocol Documents do not oblige anyone to enter into any contract, to take legal
                      obligations with respect to the sale or purchase of Galileo protocol NFTs or tokens, and to accept
                      any cryptocurrency or other form of payment.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Potential owners of Galileo protocol NFTs or Tokens are advised to contact relevant independent
                      professional advisors, on the above matters. Certain statements, estimates and financial
                      information contained herein, constitute forward looking statements or information. Such
                      forward-looking statements or information involve known and unknown risks and uncertainties, which
                      may cause actual events or results to differ materially from the estimates or the results implied
                      or expressed in such forward-looking statements. Further, all examples of calculation of income
                      and profits used in Galileo protocol Documents were provided only for demonstration purposes or
                      for demonstrating the industry’s averages.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      For avoidance of doubt, nothing contained in the Galileo protocol Documents and in the Services of
                      Galileo protocol Platform/Website is or may be relied upon as a guarantee, promise, representation
                      or undertaking as to the future performance of Galileo protocol and/or NFTs or tokens, and/or
                      promise or guarantee of future profit resulting from purchase of NFTs or tokens. Galileo protocol
                      NFTs or Tokens cannot be used for any purposes other than as provided in the Galileo protocol
                      Documents, including but not limited to, any investment, speculative or other financial purposes.
                      Galileo protocol NFTs or Tokens
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Confer no other rights in any form, including but not limited to any ownership, distribution
                      (including, but not limited to, profit), redemption, liquidation, property (including all forms of
                      intellectual property), or other financial or legal rights, other than those specifically set
                      forth above.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      While the community’s opinion and feedback can be taken into account, Galileo protocol NFTs or
                      Tokens do not give any right to participate in decision-making or any direction of business
                      related to the services of Galileo protocol Platform/Website .
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      English language is the primary official source of information about the Galileo protocol
                      Services, NFTs or tokens, any information contained herein may from time to time be translated
                      into other languages or used in the course of written or oral communications with customers,
                      contractors, partners etc. In the course of such translation or communication some of the
                      information contained herein may be lost, corrupted or misrepresented. The accuracy of such
                      alternative communications cannot be guaranteed. In the event of any conflicts or inconsistencies
                      between such translations and communications and this English language, the provision of this
                      English language as original document shall prevail.
                    </Typography>

                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      LIMITATION OF LIABILITY
                    </Typography>

                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        In no event shall Galileo protocol or any current or former employees, officers, directors,
                        partners, trustees, representative, agents, advisors, contractors, or volunteers of Galileo
                        protocol (hereinafter the “GALILEO PROTOCOL Representatives”) be responsible or accountable or
                        liable in any way whatsoever to any purchaser of NFTs or Tokens for any loss of profits or
                        otherwise or for any lost savings or for any incidental direct indirect special or consequential
                        damages in each case arising out of or from or in connection with:
                        <ul style={{ marginTop: "10px" }}>
                          <li>
                            any failure by Galileo protocol or any of its affiliated companies to deliver or realize all
                            or any part of the project or the platform or the membership network or NFT or Token
                            features described in or envisaged by the available Information;
                          </li>
                          <li>
                            your use or inability to use at any time the services or the products or the platform or the
                            membership network or NFTs or Tokens offered by Galileo protocol ;
                          </li>
                          <li>
                            the breach of any of these Terms by Galileo protocol or by Galileo protocol Representatives
                            or by you or by any third party;
                          </li>
                          <li>
                            any security risk or security breach or security threat or security attack or any theft or
                            loss of data including but not limited to hacker attacks, losses of password, losses of
                            private keys, or anything similar;
                          </li>
                          <li>
                            mistakes or errors in code, text, or images involved in the NFTs or Tokens or in any of the
                            available information; or
                          </li>
                          <li>any information contained in or omitted from the available information;</li>
                          <li>
                            any expectation promise representation or warranty arising (or purportedly arising) from the
                            available information;
                          </li>
                          <li>
                            the volatility in pricing of NFTs or Tokens in any countries and/or on any exchange or
                            market (regulated, unregulated, primary, secondary or otherwise);
                          </li>
                          <li> the purchase use sale resale redemption or otherwise of the NFTs or Tokens; or</li>
                          <li>
                            {" "}
                            your failure to properly secure any private key to a wallet containing NFTs or Tokens
                          </li>
                        </ul>
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      The Available Information including the legal documentations on Galileo protocol Platform/Website
                      and the NFTs or Tokens are provided on an “as is” basis and without any representations or
                      warranties of any kind, either express or implied. You assume all responsibility and risk with
                      respect to your use of the Available Information and purchasing of any amount of NFTs or Tokens
                      and their use. If applicable law does not allow all or any part of the above limitation of
                      liability to apply to you, the limitations will apply to you only to the maximum extent permitted
                      by applicable law.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      To the maximum extent permitted by applicable law, you hereby irrevocably and unconditionally
                      waive: (i) all and any claims (whether actual or contingent and whether as an employee, office
                      holder, trustee, agent, principal or in any other capacity whatsoever or howsoever arising)
                      including, without limitation, claims, any payment or repayment of monies, indemnity or otherwise
                      that you may have against Galileo protocol or against any of the Galileo protocol Representatives;
                      and (ii) release and discharge Galileo protocol and all of Galileo protocol Representatives from
                      any and all liability (of whatsoever nature or howsoever arising) it or they may have to you.
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                      If for any reason you hereafter bring or commence any action or legal proceeding in respect of any
                      claim purported to be released and discharged pursuant to this paragraph or these Terms, or
                      otherwise attempt to pursue any such claim against Galileo protocol or any Galileo protocol
                      Representative then you hereby irrevocably and unconditionally undertake to indemnify, and keep
                      indemnified Galileo protocol and all Galileo protocol Representatives fully on demand from and
                      against:
                    </Typography>

                    <Box component="ol">
                      <Typography variant="body1" sx={{ mb: "1rem" }}>
                        <ul style={{ marginTop: "10px" }}>
                          <li>
                            all liabilities or losses suffered by Galileo protocol or any Galileo protocol
                            Representative; and
                          </li>
                          <li>
                            all reasonable costs, charges and reasonable expenses (including without limitation
                            reasonable legal costs and expenses) reasonably and properly incurred by Galileo protocol or
                            any Galileo protocol Representative,
                          </li>
                          <li>
                            in each case by reason of or in connection with the bringing or commencement of such action
                            or pursuit of such claim by you.
                          </li>
                        </ul>
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      If any provision or part-provision of this “Legal Disclaimer, Considerations and Risks’’ section
                      is or becomes invalid, illegal or unenforceable, it shall be deemed modified to the minimum extent
                      necessary to make it valid, legal and enforceable. If such modification is not possible, the
                      relevant provision or part-provision shall be deemed deleted. Any modification to or deletion of a
                      provision or part-provision under this “Legal Disclaimer, Considerations and Risks’’ section shall
                      not affect the validity and enforceability of the rest of this “Legal Disclaimer, Considerations
                      and Risks’’ section.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      CAUTIONARY NOTE ON FORWARD-LOOKING STATEMENTS
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      All statements contained in the Available Information, statements made in any press releases or in
                      any place accessible by the public and oral statements that may be made by Galileo protocol or the
                      Galileo protocol Representatives (as the case may be), that are not statements of historical fact,
                      constitute “forward looking statements”.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Some of these statements can be identified by forward-looking terms such as “aim”, “target”,
                      “anticipate”, “believe”, “could”, “estimate”, “expect”, “if”, “intend”, “may”, “plan”, “possible”,
                      “probable”, “project”, “should”, “would”, “will” or other similar terms. However, these terms are
                      not the exclusive means of identifying forward-looking statements.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      These forward-looking statements are applicable only as of the later of the date of publication of
                      the Website and the latest date that the Website has been updated. Neither Galileo protocol nor
                      the Galileo protocol Representatives nor any other person represents, warrants and/or undertakes
                      that the actual future results, performance or achievements of Galileo protocol will be as
                      discussed in those forward-looking statements. The actual results, performance or achievements of
                      Galileo protocol may differ materially from those anticipated in these forward-looking statements.
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      Nothing contained in the Available Information is or may be relied upon as a promise,
                      representation or undertaking as to the future performance or policies of Galileo protocol .
                      Further, Galileo protocol disclaims any responsibility to update any of those forward-looking
                      statements or publicly announce any revisions to those forward-looking statements to reflect
                      future developments, events or circumstances, even if new information becomes available or other
                      events occur in the future.
                    </Typography>
                    <Typography variant="h2" sx={{ marginBottom: "1rem" }}>
                      RISK FACTORS
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                      You should carefully consider and evaluate each of the following risk factors and all other
                      information contained in these Terms before deciding to participate in the Services of Galileo
                      protocol Platform/Website.
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

export default index;
