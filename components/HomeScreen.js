import { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import { TextInput, Switch, Button, ActivityIndicator } from "react-native-paper";
import { useProfile } from "../Store/Store";
import useAxios from "../hooks/useAxios";
import * as SecureStore from 'expo-secure-store';

const HomeScreen = ({ navigation }) => {
  const axiosPrivate = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState({
    message: "",
    error: false,
  });
  const [formError, setFormError] = useState({
    message: "",
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const setProfile = useProfile((state) => state.setProfile);
  const accessToken = useProfile((state) => state.profile?.accessToken);
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
  const themeType = useProfile((state) => state.themeType);
  const setThemeType = useProfile((state) => state.setThemeType);

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const onToggleSwitch = () => setPersist(!persist);
  const onToggleTheme = () =>  themeType === false ? setThemeType(true) : setThemeType(false);

  const loadProfile = useCallback(async () => {
    try {
     
      const userInfo = await SecureStore.getItemAsync('profile');
      if (userInfo) {
        console.log(userInfo)
      setProfile(JSON.parse(userInfo));
      //check if token is expired
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
        }
      }
      }
    } catch (error) {
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
      setFormError({ email: true, message: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosPrivate.post("/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

    
      //save refresh token to keychain
      if (response.headers["set-cookie"]) {
        console.log('Saving refresh token to keychain');
        const refreshToken = response.headers["set-cookie"][0].split(';')[0].split('=')[1];
        const refreshTokenExpiration = response.headers["set-cookie"][0].split(';')[3].split('=')[1]
       
        await SecureStore.setItemAsync('refreshToken', refreshToken);
        await SecureStore.setItemAsync('refreshTokenExpiration',  refreshTokenExpiration);
        
      }
      setProfile(response.data);
      if (persist) {
        console.log("Saving Profile");
        const profile = await SecureStore.setItemAsync(
          "profile",
          JSON.stringify(response.data)
        );
      }

      setLoginStatus({ message: "Login Successful", error: false });
      setLoading(false);
    } catch (err) {
      //if email unverified show error message for 6seconds
      setLoading(false);
      console.log('error on login', err);

      if (err?.response?.status === 403)
        // Unauthorized email not verified
        setLoginStatus((prev) => ({
          ...prev,
          message: "Please verify your email address",
          error: true,
        }));
      setTimeout(() => {
        setLoginStatus((prev) => ({
          ...prev,
          message: "",
          error: false,
        }));
      }, 6000);

      if (err?.response?.status === 401)
        setLoginStatus((prev) => ({
          ...prev,
          message: "Unauthorized",
          error: true,
        }));
      setTimeout(() => {
        setLoginStatus((prev) => ({
          ...prev,
          message: "",
          error: false,
        }));
      }, 6000);

      if (err?.response?.status === 423)
        setLoginStatus((prev) => ({
          ...prev,
          message: "Account Disabled",
          error: true,
        }));
      setTimeout(() => {
        setLoginStatus((prev) => ({
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


  return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
          style={{fontFamily: 'Roboto', fontSize: 20, color: '#000'}}
          >Welcome to GETFIT Personal Training</Text>
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
        <View style={{ alignItems: "center", flex:1 , flexDirection: 'row', justifyContent: 'center' }}>
          <Text>Remember Me</Text>
          <Switch value={persist} onValueChange={onToggleSwitch} />
          <Text>{themeType === 'light' ? 'Light Mode' : 'Dark Mode'}</Text>
          <Switch value={themeType} onValueChange={onToggleTheme} />
        </View>
        {loading ? <ActivityIndicator animating={true} color={'blue'} /> :  <Button
          icon="login"
          mode="contained"
          buttonColor={loginStatus.error ? "red" : "#03A9F4"}
          style={{
            margin: 20,
          }}
          onPress={onSubmit}
        >
          {loginStatus.error ? loginStatus.message : "Login"}
        </Button>}
        <View style={{ alignItems: "center", marginTop: 3 }}>
          <Text style={{marginTop: 3, marginBottom: 10,}}>Don't have an account?</Text>
          <Button
          
            mode="text"
            
            onPress={() => navigation.navigate("Sign Up")}
          >Sign Up</Button>
          <Button mode="text" onPress={() => navigation.navigate("Forgot Password")}>Forgot Password</Button>
      </View>
    </View>
  );
};

export default HomeScreen;
