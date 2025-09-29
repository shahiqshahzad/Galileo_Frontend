import React from "react";
import { createRoot } from "react-dom/client";

// third party
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// project imports
// import * as serviceWorker from 'serviceWorker';
import App from "App";
import { store, persistor } from "store";

// style + assets
import "assets/scss/style.scss";
import config from "config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import process from "process";
import MagicProvider from "utils/MagicProvider";
import { MetaMaskProvider } from "@metamask/sdk-react";
import ReactDOM from "react-dom";
import { MetamaskModal } from "ui-component/MetamaskModal";
import { ThirdwebProvider } from "thirdweb/react";

window.process = process;

// ==============================|| REACT DOM RENDER  ||============================== //

const AppDom = () => {
  return (
    <ThirdwebProvider>
    {/* <MetaMaskProvider
      debug={false}
      sdkOptions={{
        infuraAPIKey: process.env.REACT_APP_INFURA_API_KEY,
        checkInstallationImmediately: false,
        dappMetadata: {
          name: "Demo React App",
          url: window.location.href
        },
        preferDesktop: true,
        modals: {
          install: ({ link }) => {
            let modalContainer;

            return {
              mount: () => {
                // if (modalContainer) return;

                modalContainer = document.createElement("div");

                modalContainer.id = "meta-mask-modal-container";

                document.body.appendChild(modalContainer);

                ReactDOM.render(
                  <MetamaskModal
                    onClose={() => {
                      ReactDOM.unmountComponentAtNode(modalContainer);
                      modalContainer.remove();
                    }}
                  />,
                  modalContainer
                );
              },
              unmount: () => {
                if (modalContainer) {
                  ReactDOM.unmountComponentAtNode(modalContainer);

                  modalContainer.remove();
                }
              }
            };
          }
        }
      }}
    > */}
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <MagicProvider>
            {/* <ConnectedRouter history={history}> */}
            <PersistGate loading={null} persistor={persistor}>
              <BrowserRouter basename={config.basename}>
                <App />
              </BrowserRouter>
            </PersistGate>
            {/* </ConnectedRouter> */}
          </MagicProvider>
        </Provider>
      </GoogleOAuthProvider>
    {/* </MetaMaskProvider> */}
    </ThirdwebProvider>
  );
};

const root = document.getElementById("root");
const rootInstance = createRoot(root);
rootInstance.render(<AppDom />);
