import axiosInstance from "./axios";

const setupAxiosInterceptors = (handleNonAuthorized) => {
  axiosInstance.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      if (error?.response && error?.response?.status === 401) {
        handleNonAuthorized();
      }
      // Forward the error to the next handler
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
