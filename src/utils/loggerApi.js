import axios from "utils/axios";

import {store} from "../store";


// This function uses axios to make an API call.
export const loggerApi = async (endpoint, method, body = null) => {
  try {
    // Retrieve the token from the Redux store using useSelector.
    const token = store.getState().auth.token;

    // Configure headers, including the Authorization header with the token.
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Create the request based on the method.
    let response;
    switch (method.toUpperCase()) {
      case 'GET':
        response = await axios.get(endpoint, config);
        break;
      case 'POST':
        response = await axios.post(endpoint, body, config);
        break;
      case 'PUT':
        response = await axios.put(endpoint, body, config);
        break;
      case 'DELETE':
        response = await axios.delete(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }

    // Return the response data.
    return response.data;
  } catch (error) {
    // Log and rethrow the error for further handling.
    throw error;
  }
};
