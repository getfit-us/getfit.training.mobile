import useAxios from "../hooks/useAxios";
import * as SecureStore from "expo-secure-store";
import { useProfile, useWorkouts } from "../Store/Store";

const Logout = () => {
  const resetProfileState = useProfile((state) => state.resetProfileState);
  const resetWorkoutState = useWorkouts((state) => state.resetWorkoutState);
 const setPersist = useProfile((state) => state.setPersist);
  const axiosPrivate = useAxios();
  const onLogout = async () => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/logout", {
        signal: controller.signal,
      });

      const remove = await SecureStore.deleteItemAsync("profile");
      resetProfileState();
      resetWorkoutState();
      setPersist(false);
      // console.log(remove);
    } catch (err) {
      console.log("logout error", err);
    }

    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  onLogout();
};

export default Logout;
