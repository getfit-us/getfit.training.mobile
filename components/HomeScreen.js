import { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import {
  TextInput,
  Switch,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import * as SecureStore from "expo-secure-store";
import { colors } from "../Store/colors";
import { set } from "lodash";

const HomeScreen = ({ navigation }) => {
  const axiosPrivate = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setStatus = useProfile((state) => state.setStatus);
  const status = useProfile((state) => state.status);

  const [formError, setFormError] = useState({
    message: "",
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(true);
  const setProfile = useProfile((state) => state.setProfile);
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
  const themeType = useProfile((state) => state.themeType);
  const setThemeType = useProfile((state) => state.setThemeType);

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onToggleSwitch = () => setPersist(!persist);
  const onToggleTheme = () =>
    themeType === false ? setThemeType(true) : setThemeType(false);

  const loadProfile = useCallback(async () => {
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
              message: "Your session has expired. Please log in again.",
            });
          }
        }
      }
    } catch (error) {
      setStatus({loading: false, success: false, error: true, message: error.message})
      console.log(`Keychain Error: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    if (persist) {
      console.log("Loading Profile");
      loadProfile();
    }
  }, [loadProfile, persist]);

  const onSubmit = async () => {
    setStatus({ loading: true, success: false, error: false, message: "" });

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

    try {
      const response = await axiosPrivate.post("/login", data, {
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
        console.log("Unauthorized", status);
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center", margin: 20 }}>
        <Text style={{ fontFamily: "Roboto", fontSize: 20, color: "#000" }}>
          Welcome to GETFIT Personal Training
        </Text>
      </View>
      <View
        style={{
          margin: 20,
        }}
      >
        <TextInput
          label="Email Address"
          value={email}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          onChangeText={(email) => setEmail(email)}
          error={formError.email}
          autoFocus
          name="email"
        />
        {formError.email && <Text>{formError.message}</Text>}

        <TextInput
          value={password}
          secureTextEntry={showPassword}
          mode="outlined"
          right={
            <TextInput.Icon
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? "eye-off" : "eye"}
            />
          }
          error={formError.password}
          onChangeText={(password) => setPassword(password)}
          label="Password"
        />
        {formError.password && <Text>{formError.message}</Text>}
      </View>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text>Remember Me</Text>
        <Switch value={persist} onValueChange={onToggleSwitch} />
        <Text>{themeType === "light" ? "Light Mode" : "Dark Mode"}</Text>
        <Switch value={themeType} onValueChange={onToggleTheme} />
      </View>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Forgot Password")}
      >
        Forgot Password
      </Button>
      {status.loading ? (
        <ActivityIndicator
          animating={status.loading}
          color={colors.primary}
          size={70}
        />
      ) : (
        <Button
          icon="login"
          mode="contained"
          buttonColor={status.error ? colors.error : colors.primaryLight}
          style={{
            margin: 20,
            width: "80%",
            alignSelf: "center",
          }}
          onPress={onSubmit}
        >
          {status.error ? status.message : "Login"}
        </Button>
      )}
      <View style={{ alignItems: "center", marginTop: 3 }}>
        <Text style={{ marginTop: 3, marginBottom: 10 }}>
          Don't have an account?
        </Text>
        <Button mode="text" onPress={() => navigation.navigate("Sign Up")}>
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default HomeScreen;
