import axios from "axios";
import { setNotification } from "shared/helperMethods/setNotification";
import { loginSuccess, logout } from "redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { polygonAmoy, polygon } from "thirdweb/chains";
import { client } from "../../../../utils/thirdWebClient";
import { ConnectEmbed } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { useNavigate } from "react-router-dom";
import { ThirdWebHelperDialog } from "./thirdWebHelperDialog";
import { useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

const ThirdWebConnectButton = ({ embed = false }) => {
  const account = useActiveWallet();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const persistUser = useSelector((state) => state.auth.user);
  const persistToken = useSelector((state) => state.auth.token);
  let user = persistUser;
  let token = persistToken;
  const [isOpen, setIsOpen] = useState(false);

  const wallets = [
    inAppWallet({
      hidePrivateKeyExport: false,
      auth: {
        options: ["google", "email"]
      }
    }),
    createWallet("io.metamask")
  ];

  const ComponentToRender = embed ? ConnectEmbed : ConnectButton;

  return (
    <>
      <ComponentToRender
        chain={process.env.REACT_APP_MAINNET === "0" ? polygonAmoy : polygon}
        theme="dark"
        showAllWallets={false}
        client={client}
        wallets={wallets}
        /**
         * Looking to authenticate with account abstraction enabled? Uncomment the following lines:
         *
         * accountAbstraction={{
         *  chain: sepolia,
         *  factoryAddress: "0x5cA3b8E5B82D826aF6E8e9BA9E4E8f95cbC177F4",
         *  gasless: true,
         * }}
         */
        auth={{
          /**
           * 	`getLoginPayload` should @return {VerifyLoginPayloadParams} object.
           * 	This can be generated on the server with the generatePayload method.
           */
          getLoginPayload: async (params) => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}auth/getLoginPayload`, {
                params: {
                  address: params.address,
                  chainId: params.chainId
                }
              });
              return response.data;
            } catch (error) {
              console.error("Error fetching login payload", error);
              throw error;
            }
          },
          /**
           * 	`doLogin` performs any logic necessary to log the user in using the signed payload.
           * 	In this case, this means sending the payload to the server for it to set a JWT cookie for the user.
           */
          doLogin: async (params) => {
            try {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}auth/signupWithThirdWeb`, params);
              if (response?.data?.data?.isNewUser) {
                const dataToPass = {
                  walletAddress: response?.data?.data?.walletAddress,
                  email: response?.data?.data?.email,
                  signupMethod: response?.data?.data?.signupMethod,
                  token: response?.data?.data?.token
                };
                navigate("/signUp", { state: dataToPass });
              } else if (
                response?.data?.data?.token &&
                response?.data?.data?.user &&
                response?.data?.data?.user?.isVerified
              ) {
                setNotification("success", response.data.message);
                const kycStatus = response.data.data;
                dispatch(loginSuccess(kycStatus));
                user = kycStatus?.user;
                token = kycStatus?.token;
                let userData = response.data.data.user;
                if (userData && userData?.role === "Sub Admin") {
                  let url = `/nftManagement/${userData?.CategoryId}/${userData?.BrandId}?pageNumber=1&filter=draft`;
                  navigate(url);
                } else {
                  navigate("/home");
                }
              } else {
                navigate("/emailVerify");
              }
            } catch (error) {
              if (error.response.data.data.message === "User is not verified") {
                navigate("/emailVerify");
                return;
              }
              console.error("Error during login", error);
              // toast.error(error.response.data.data.message);
              if (
                error?.response?.data?.data?.message ===
                "You registered using a MetaMask account or another wallet. Please sign in using the same method."
              ) {
                if (account) {
                  disconnect(account);
                }
                setIsOpen(true);
              }
              throw error;
            }
          },
          /**
           * 	`isLoggedIn` returns true or false to signal if the user is logged in.
           * 	Here, this is done by calling the server to check if the user has a valid JWT cookie set.
           */
          isLoggedIn: async (address) => {
            try {
              if (user && token) {
                return true;
              }
              return false;
            } catch (error) {
              throw error;
            }
          },
          /**
           * 	`doLogout` performs any logic necessary to log the user out.
           * 	In this case, this means sending a request to the server to clear the JWT cookie.
           */
          doLogout: async () => {
            try {
              if (account) {
                disconnect(account);
              }
              dispatch(logout());
              navigate("/login");
            } catch (error) {
              console.error("Error during logout", error);
              throw error;
            }
          }
        }}
      />
      <ThirdWebHelperDialog isOpen={isOpen} handleClose={() => setIsOpen(false)} />
    </>
  );
};

export default ThirdWebConnectButton;
