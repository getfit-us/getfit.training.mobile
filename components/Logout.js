import useAxios from "../hooks/useAxios";
import React from "react";
import * as SecureStore from "expo-secure-store";
import { useProfile, useWorkouts } from "../Store/Store";
import { useNavigation } from "@react-navigation/native";



const Logout = () => {
  const resetProfileState = useProfile((state) => state.resetProfileState);
  const resetWorkoutState = useWorkouts((state) => state.resetWorkoutState);
  const navigation = useNavigation();
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
   const axiosPrivate = useAxios();
  const onLogout = async () => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/logout", {
        signal: controller.signal,
      });
      // console.log(response.data);
      
      resetProfileState();
      resetWorkoutState();
      setPersist(false);
      const remove = await SecureStore.deleteItemAsync("profile");
      
        // console.log(remove);
    } catch (err) {

      console.log(err);
    }

    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  onLogout();

};

export default Logout;
