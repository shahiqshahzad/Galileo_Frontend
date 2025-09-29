import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Magic as MagicBase } from "magic-sdk";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import { CHAIN_IDS, RPC_URLS } from "./constants";
import { client } from "../utils/thirdWebClient";
import { ethers5Adapter } from "thirdweb/adapters/ethers5";
import { defineChain } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
const MagicContext = createContext({
  magic: null,
  provider: null
});

export const useWeb3 = () => useContext(MagicContext);

const MagicProvider = ({ children }) => {
  // const [magic, setMagic] = useState(null);
  // const [isMagicLoggedIn, setIsMagicLoggedIn] = useState(false);

  const account = useActiveAccount();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const setupProviderAndSigner = async () => {
      if (account) {
        const provider = ethers5Adapter.provider.toEthers({
          client,
          chain: defineChain(+CHAIN_IDS.POLYGON_CHAIN_ID)
        });

        const _signer = await ethers5Adapter.signer.toEthers({
          client,
          chain: defineChain(+CHAIN_IDS.POLYGON_CHAIN_ID),
          account
        });

        setSigner(_signer);
        setProvider(provider);

        // You can use the signer if needed
      } else {
        setProvider(null);
        setSigner(null);
      }
    };

    setupProviderAndSigner(); // Call the async function
  }, [account]);

  // const loginMethod = useSelector((state) => state.auth?.user?.signupMethod);
  // const { sdk, connected, provider: metamaskProvider } = useSDK();

  // useEffect(() => {
  //   if (process.env.REACT_APP_MAGIC_API_KEY) {
  //     const magicInstance = new MagicBase(process.env.REACT_APP_MAGIC_API_KEY, {
  //       network: {
  //         rpcUrl: RPC_URLS.POLYGON_RPC_URL,
  //         chainId: CHAIN_IDS.POLYGON_CHAIN_ID
  //       }
  //     });
  //     setMagic(magicInstance);
  //   }
  // }, []);

  // useEffect(() => {
  //   const initializeProvider = async () => {
  //     if (magic && isMagicLoggedIn && loginMethod === "MAGIC") {
  //       const magicProvider = await magic.wallet.getProvider();
  //       setProvider(new ethers.providers.Web3Provider(magicProvider));
  //     } else if (sdk && ["DIRECT", "GOOGLE"].includes(loginMethod)) {
  //       try {
  //         await sdk.connect();
  //       } catch (error) {
  //         console.error(error);
  //       } finally {
  //         if (connected) {
  //           setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //         }
  //       }
  //     } else {
  //       // setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //     }
  //   };

  //   initializeProvider();
  // }, [loginMethod, magic, sdk, connected, isMagicLoggedIn, metamaskProvider]);

  // useEffect(() => {
  //   const updateLogIn = async () => {
  //     setIsMagicLoggedIn(await magic?.user?.isLoggedIn());
  //   };
  //   if (magic) {
  //     updateLogIn();
  //   }
  // }, [loginMethod, magic]);

  const value = useMemo(() => ({ provider, setProvider, signer }), [provider, signer]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
