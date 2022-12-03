import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import * as SecureStore from "expo-secure-store";

const useRefreshToken = () => {
  const setProfile = useProfile((state) => state.setProfile);
  const setAccessToken = useProfile((state) => state.setAccessToken);
  const axiosPrivate = useAxios();
  const persist = useProfile((state) => state.persist);
  const setPersist = useProfile((state) => state.setPersist);
  const setStatus = useProfile((state) => state.setStatus);

  const refresh = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    // check if refresh token is still valid
    const refreshTokenExpiration = await SecureStore.getItemAsync(
      "refreshTokenExpiration"
    );
    // check for expired refresh token
    if (refreshTokenExpiration) {
      const now = new Date().getTime();
      const expiration = new Date(refreshTokenExpiration).getTime();
      if (now > expiration) {
        console.log("Refresh token expired");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("refreshTokenExpiration");
        await SecureStore.deleteItemAsync("profile");

        setAccessToken(null);
        return;
      }
    } else if (!refreshTokenExpiration) {
      console.log("No refresh token expiration");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("refreshTokenExpiration");
      await SecureStore.deleteItemAsync("profile");
      setAccessToken(null);
      setPersist(false);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: "Your session has expired. Please log in again.",
      });

      return;
    }
    try {
      const response = await axiosPrivate.get("/refresh", {
        headers: {
          "Content-Type": "application/json",
          refreshToken: refreshToken,
        },
        withCredentials: true,
      });

      setAccessToken(response.data.accessToken);
      if (persist) {
        console.log("AccessToken Profile Saving to secure store");
        const profile = await SecureStore.setItemAsync(
          "profile",
          JSON.stringify(response.data)
        );
      }
      return response.data.accessToken; // return the new access token
    } catch (error) {
      console.log("Unable to get refresh token", error);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: "Your session has expired. Please log in again.",
      });
      setPersist(false);
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("refreshTokenExpiration");
      await SecureStore.deleteItemAsync("profile");
      setAccessToken(null);
    }
  };
  return refresh;
};

export default useRefreshToken;
