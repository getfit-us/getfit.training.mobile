import { useProfile } from "../Store/Store";
import useAxios from '../hooks/useAxios';
import * as SecureStore from 'expo-secure-store';


const useRefreshToken = () => {
  const setProfile = useProfile((state) => state.setProfile);
  const axiosPrivate = useAxios();
  const persist = useProfile((state) => state.persist);

  const refresh = async () => {


    // check if refresh token is still valid
    const refreshTokenExpiration = await SecureStore.getItemAsync('refreshTokenExpiration');
    if (refreshTokenExpiration) {
      const now = new Date().getTime();
      const expiration = new Date(refreshTokenExpiration).getTime();
      if (now > expiration) {
        console.log('Refresh token expired');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('refreshTokenExpiration');
        await SecureStore.deleteItemAsync('profile');
        setProfile(null);
        return;
      }
    } else {
      console.log('No refresh token');
      setProfile(null);
      return;
    }
    const response = await axiosPrivate.get("/refresh", {
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${await SecureStore.getItemAsync("refreshToken")}`,
      },
      withCredentials: true,
    });
 

    setProfile(response.data);
    if (persist) {
      console.log("AccessToken Profile");
      const profile = await SecureStore.setItemAsync(
        "profile",
        JSON.stringify(response.data)
      );
    }
  };

  return refresh;
};

export default useRefreshToken;
