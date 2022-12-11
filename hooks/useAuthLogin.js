import { useState } from "react";
import { useProfile } from "../Store/Store";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const useAuthLogin = ({ email, password, persist }) => {
  const BASE_URL = "https://app.getfit.us:8000";
  const setStatus = useProfile((state) => state.setStatus);
  const setProfile = useProfile((state) => state.setProfile);
  const [formError, setFormError] = useState({
    message: "",
    email: false,
    password: false,
  });

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onSubmit = async () => {
    let data = { email, password };
    if (!email || !password) {
      email?.length > 0
        ? setFormError({
            ...formError,
            email: false,
            password: true,
            message: "Password is required",
          })
        : setFormError({
            ...formError,
            email: true,
            password: false,
            message: "Please enter a valid email",
          });
      return;
    }
    if (!emailRegex.test(email)) {
      setFormError({
        email: true,
        message: "Please enter a valid email address",
      });
      return;
    }
    setStatus({ loading: true, success: false, error: false, message: "" });
    try {
      const response = await axios.post(`${BASE_URL}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      //save refresh token to keychain
      if (response.headers["set-cookie"]) {
        console.log("Saving refresh token to key chain");
        const refreshToken = response.headers["set-cookie"][0]
          .split(";")[0]
          .split("=")[1];
        const refreshTokenExpiration = response.headers["set-cookie"][0]
          .split(";")[3]
          .split("=")[1];

        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await SecureStore.setItemAsync(
          "refreshTokenExpiration",
          refreshTokenExpiration
        );
      }
      setProfile(response.data);
      if (persist) {
        console.log("Saving Profile");
        const profile = await SecureStore.setItemAsync(
          "profile",
          JSON.stringify(response.data)
        );
      }

      setStatus({
        loading: false,
        success: true,
        error: false,
        message: "Login Successful",
      });
    } catch (err) {
      //if email unverified show error message for 6seconds
      console.log(err.message);

      if (err?.response?.status === 403) {
        // Unauthorized email not verified
        setStatus({
          loading: false,
          message: "Please verify your email address",
          error: true,
          success: false,
        });
      }

      if (err?.response?.status === 401) {
        setStatus({
          message: "Unauthorized",
          error: true,
          loading: false,
        });
      }

      if (err?.response?.status === 423) {
        setStatus({
          loading: false,

          message: "Account Disabled",
          error: true,
        });
      }

      setTimeout(() => {
        setStatus({
          loading: false,

          message: "",
          error: false,
        });
      }, 6000);
    }
  };

  return { onSubmit, formError };
};

export default useAuthLogin;
