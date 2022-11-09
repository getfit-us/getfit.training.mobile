import { useProfile } from "../Store/Store";
import useAxios from '../hooks/useAxios';
import * as SecureStore from 'expo-secure-store';


const useRefreshToken = () => {
  const setProfile = useProfile((state) => state.setProfile);
  const axiosPrivate = useAxios();
  const persist = useProfile((state) => state.persist);

  const refresh = async () => {
    const response = await axiosPrivate.get("/refresh", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.headers["set-cookie"]) {
      console.log('Saving refresh token to keychain');
      const refreshToken = response.headers["set-cookie"][0].split(';')[0].split('=')[1];
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    setProfile(response.data);
    if (persist) {
      console.log("Saving Profile");
      const profile = await SecureStore.setItemAsync(
        "profile",
        JSON.stringify(response.data)
      );
    }
  };

  return refresh;
};

export default useRefreshToken;
