import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useEffect } from "react";
import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const axiosPrivate = useAxios();
  const accessToken = useProfile((state) => state.profile?.accessToken);
  const resetProfileState = useProfile((state) => state.resetProfileState);
  const resetWorkoutState = useProfile((state) => state.resetWorkoutState);
  const setPersist = useProfile((state) => state.setPersist);
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;

          console.log("config", config.headers);
        }
        return config;
      },
      (error) => {
        console.log("interceptor error", error);
        Promise.reject(error);
      }
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        prevRequest._retryCount = prevRequest._retryCount || 0;
        console.log("interceptor error", err.config);
        if (prevRequest._retryCount > 2) {
          //already tried to refresh token remove all tokens and redirect to login
          console.log("already tried to refresh token");
          resetProfileState();
          resetWorkoutState();
          setPersist(false);
          const remove = await SecureStore.deleteItemAsync("profile");
          return Promise.reject(err);
        }
        prevRequest._retryCount += 1;
        if (err.response?.status === 403 && prevRequest._retryCount <= 1) {
          console.log("refreshing token", prevRequest._retryCount);

          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        }

        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1);
        });

        return backoff.then(() => {
          return axiosPrivate(prevRequest);
        });
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
