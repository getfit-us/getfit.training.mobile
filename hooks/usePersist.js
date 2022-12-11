import {useCallback} from "react";
import * as SecureStore from "expo-secure-store";
import { useProfile } from "../Store/Store";

//going to use this hook to persist the user's profile in the secure store, this will cut down on using this code in multiple components

function usePersist() {
  const setProfile = useProfile((state) => state.setProfile);
  const setStatus = useProfile((state) => state.setStatus);

  const loadProfile = useCallback(async () => {
    console.log("Loading Profile from Secure Store...")

    try {
      const userInfo = await SecureStore.getItemAsync("profile");
      if (userInfo) {
        setStatus({ loading: true });
        setProfile(JSON.parse(userInfo));
        //check if token is expired
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
            setProfile(null);
            setStatus({
              loading: false,
              success: false,
              error: true,
              message: "Your session has expired.  in again.",
            });
          }
        }
      } else {
        setStatus({ loading: false });
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: error.message,
      });
      console.log(`Keychain Error: ${error.message}`);
    }
  }, []);

  return loadProfile;
}

export default usePersist;
