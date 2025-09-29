import axioss from "axios";

const axios = axioss.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "ngrok-skip-browser-warning": "69420"
  }
});

export default axios;
