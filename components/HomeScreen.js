import { useEffect, useState, useCallback } from "react";
import { View, Text } from "react-native";
import {
  TextInput,
  Switch,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { useProfile } from "../Store/Store";
import { colors } from "../Store/colors";
import usePersist from "../hooks/usePersist";
import useAuthLogin from "../hooks/useAuthLogin";

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const status = useProfile((state) => state.status);
  const loadProfile = usePersist();
  const { formError, onSubmit } = useAuthLogin({ email, password, persist });

  const [showPassword, setShowPassword] = useState(true);
  const [persist, setPersist] = useProfile((state) => [
    state.persist,
    state.setPersist,
  ]);
  const themeType = useProfile((state) => state.themeType);
  const setThemeType = useProfile((state) => state.setThemeType);
  const onToggleSwitch = () => setPersist(!persist);
  const onToggleTheme = () =>
    themeType === false ? setThemeType(true) : setThemeType(false);

  useEffect(() => {
    if (persist) {
      loadProfile();
    }
  }, [persist]);

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
        {/* <Text>{themeType === "light" ? "Light Mode" : "Dark Mode"}</Text>
        <Switch value={themeType} onValueChange={onToggleTheme} /> */}
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
