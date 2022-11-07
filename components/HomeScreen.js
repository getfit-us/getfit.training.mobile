import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TextInput, Switch, Button } from "react-native-paper";
import { useProfile } from "../Store/Store";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState({
    message: "",
    show: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const setProfile = useProfile((state) => state.setProfile);
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
  });
  const onToggleSwitch = () => setPersist(!persist);

  const onSubmit = async () => {
    let data = { email, password };
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post("http://app.getfit.us:9000/https://app.getfit.us:8000/login", data, {
        headers: {
          "Content-Type": "application/json",
         
        },
        
      });

      // const response = await axios.get("http://app.getfit.us:9000/login", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Target-URL": " https://httpbin.org",
      //   },
      //   withCredentials: true,
      // });
     

      setProfile(response.data);
      reset();
      setLoading(false);
      console.log(response.data);
      //   navigate("/dashboard/overview", { replace: true });
    } catch (err) {
      //if email unverified show error message for 6seconds
      setLoading(false);
      console.log(err);

      if (err?.response?.status === 403)
        // Unauthorized email not verified
        setLoginError((prev) => ({
          ...prev,
          message: "Please verify your email address",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);

      if (err?.response?.status === 401)
        setLoginError((prev) => ({
          ...prev,
          message: "Unauthorized",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);

      if (err?.response?.status === 423)
        setLoginError((prev) => ({
          ...prev,
          message: "Account Disabled",
          show: true,
        }));
      setTimeout(() => {
        setLoginError((prev) => ({
          ...prev,
          message: "",
          show: false,
        }));
      }, 6000);
    }
  };

  const showNetInfo = async () => {
    const connectionInfo = await NetInfo.fetch();

    Platform.OS === "ios"
      ? Alert.alert("Initial Network Connectivity Type:", connectionInfo.type)
      : ToastAndroid.show(
          "Initial Network Connectivity Type: " + connectionInfo.type,
          ToastAndroid.LONG
        );
  };

  const handleConnectivityChange = (connectionInfo) => {
    let connectionMsg = "You are now connected to an active network.";
    switch (connectionInfo.type) {
      case "none":
        connectionMsg = "No network connection is active.";
        break;
      case "unknown":
        connectionMsg = "The network connection state is now unknown.";
        break;
      case "cellular":
        connectionMsg = "You are now connected to a cellular network.";
        break;
      case "wifi":
        connectionMsg = "You are now connected to a WiFi network.";
        break;
    }
    Platform.OS === "ios"
      ? Alert.alert("Connection change:", connectionMsg)
      : ToastAndroid.show(connectionMsg, ToastAndroid.LONG);
  };

  useEffect(() => {
    // showNetInfo();
    // const unsubscribeNetInfo = NetInfo.addEventListener((connectionInfo) => {
    //   handleConnectivityChange(connectionInfo);
    // });
    // return unsubscribeNetInfo;
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text>Welcome to GetFit Personal Training</Text>
        </View>
        <View
          style={{
            margin: 20,
          }}
        >
          <TextInput
            label="Email Address"
            value={email}
            {...register("email")}
            mode="outlined"
            left={<TextInput.Icon icon="email" />}
            onChangeText={(email) => setEmail(email)}
            error={errors.email}
            autoFocus
            name="email"
          />
          {errors.email && <Text>{errors.email.message}</Text>}

          <TextInput
            value={password}
            secureTextEntry={showPassword}
            mode="outlined"
            {...register("password")}
            right={
              <TextInput.Icon
                onPress={() => setShowPassword(!showPassword)}
                icon={showPassword ? "eye-off" : "eye"}
              />
            }
            error={errors.password}
            onChangeText={(password) => setPassword(password)}
            label="Password"
          />
          {errors.password && <Text>{errors.password.message}</Text>}
        </View>
        <View style={{ alignItems: "center" }}>
          <Text>Remember Me</Text>
          <Switch value={persist} onValueChange={onToggleSwitch} />
        </View>
        <Button
          icon="login"
          mode="contained"
          style={{
            margin: 20,
          }}
          onPress={onSubmit}
        >
          Login
        </Button>
      </View>
    </>
  );
};

export default HomeScreen;
