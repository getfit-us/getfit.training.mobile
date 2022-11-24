import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import * as SecureStore from "expo-secure-store";

const useRefreshToken = () => {
  const setProfile = useProfile((state) => state.setProfile);
  const axiosPrivate = useAxios();
  const persist = useProfile((state) => state.persist);
  const setPersist = useProfile((state) => state.setPersist);
  

  const refresh = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    console.log("refresh token", refreshToken);
    // check if refresh token is still valid
    const refreshTokenExpiration = await SecureStore.getItemAsync(
      "refreshTokenExpiration"
    );
    if (refreshTokenExpiration) {
      const now = new Date().getTime();
      const expiration = new Date(refreshTokenExpiration).getTime();
      if (now > expiration) {
        console.log("Refresh token expired");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("refreshTokenExpiration");
        await SecureStore.deleteItemAsync("profile");

        setProfile({});
        return;
      }
    } else if (!refreshTokenExpiration) {
      console.log("No refresh token");
      setProfile({});
      setPersist(false);

      return;
    }
    try {
      const response = await axiosPrivate.get("/refresh", {
        headers: {
          "Content-Type": "application/json",
          "refreshToken": refreshToken,
        },
        withCredentials: true,
      });
      console.log("response", response.data);

      setProfile(response.data);
      if (persist) {
        console.log("AccessToken Profile");
        const profile = await SecureStore.setItemAsync(
          "profile",
          JSON.stringify(response.data)
        );
      }

      return response.data;
    } catch (error) {
      console.log("error inside refresh token", error);
    } 
  };
  return refresh;
  
};

export default useRefreshToken;
