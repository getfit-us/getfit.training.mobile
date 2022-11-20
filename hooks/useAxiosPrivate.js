import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useEffect } from "react";
import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
 const refresh = useRefreshToken();
 const axiosPrivate = useAxios();
 const accessToken = useProfile((state) => state.profile?.accessToken);

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = "Bearer " + accessToken;
          console.log('interceptor', config.headers['Authorization']);
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
        // console.log('interceptor error', error);
      }
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        // console.log('interceptor error', err);
        if (err.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          console.log('new access token', newAccessToken);
          prevRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseInterceptor);
      axiosPrivate.interceptors.request.eject(requestInterceptor);

      //remove prev interceptor
    };
  }, [accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
