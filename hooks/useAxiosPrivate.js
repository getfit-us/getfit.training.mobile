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
          console.log("inside request", config.retryCount);
          config.retryCount === config.retryCount || 3;
          // console.log("config", config.headers);
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
        err.config.retryCount = err.config.retryCount || 0;
        console.log(err.config.retryCount);
        if (err.response?.status === 403) {
          console.log("refreshing token", err.config?.retryCount);

          const token = await refresh();

          err.config.headers["Authorization"] = "Bearer " + token;
        }
        if (err.config.retryCount > 1) {
          //already tried to refresh token remove all tokens and redirect to login
          console.log("already tried to refresh token");
          resetProfileState();
          resetWorkoutState();
          setPersist(false);
          const remove = await SecureStore.deleteItemAsync("profile");
          return Promise.reject(err);
        }

        return axiosPrivate(err.config);
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
