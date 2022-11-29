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
          // if no authorization header, add it
          config.headers["Authorization"] = `Bearer ${accessToken}`;
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
        err.config.retryCount += 1;
        if (
          err.response?.status === 403 ||
          (err.response?.status === 401 && err.config.retryCount < 2)
        ) {
          console.log("refreshing token retry count", err.config?.retryCount);

          const token = await refresh();

          err.config.headers["Authorization"] = "Bearer " + token;
          err.config.retryCount += 1;
          return axiosPrivate(err.config);
        } else if (err.response?.status === 403 && err.config.retryCount >= 2) {
          //already tried to refresh token remove all tokens and redirect to login
          console.log("already tried to refresh token", err.config.retryCount);
          resetProfileState();
          resetWorkoutState();
          setPersist(false);
          const remove = await SecureStore.deleteItemAsync("profile");
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
