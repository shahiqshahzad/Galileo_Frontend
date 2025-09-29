import { Transak } from "@transak/transak-sdk";

// const hostName = window.location.href;
// const productionDomain = "https://app.galileoprotocol.io/";
// let environment = hostName.startsWith(productionDomain) ? "PRODUCTION" : "STAGING";

const transakConfig = {
  apiKey: process.env.REACT_APP_TRANSAK_KEY,
  environment: "PRODUCTION",
  containerId: false,
  defaultCryptoCurrency: "USDC"
};
let transak = new Transak(transakConfig);

Transak.on("*", (data) => {
  console.log("Crypto to Money Event:", data);
});

Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
  console.log("Transak SDK closed!");
});

Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
  console.log(orderData);
});

Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
  console.log(orderData);
  transak.cleanup();
});
export default transak;
