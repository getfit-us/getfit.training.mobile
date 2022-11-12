import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, View, TouchableHighlight } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeScreen from "./components/HomeScreen";
import {
  IconButton,
  Provider as PaperProvider,
  Text,
  MD3Colors,
  Button,
} from "react-native-paper";
import { useTheme } from "react-native-paper";
import { useProfile } from "./Store/Store";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";

const Stack = createNativeStackNavigator();

export default function App() {
  const accessToken = useProfile((state) => state.profile?.accessToken);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const messages = useProfile((state) => state.messages);

  function LogoTitle() {
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <TouchableHighlight
        underlayColor={"rgb(8, 97, 164)"}
        onPress={() => accessToken ? navigation.navigate("Activity Feed"): null}
        >
        
        <Image
          
          style={{ width: 50, height: 50 }} 
          source={require("./assets/GETFIT-LOGO.png")}
        />
          </TouchableHighlight>       
        <Text style={styles.title} variant="titleMedium">
          GETFIT Personal Training
        </Text>
        {accessToken &&  activeNotifications?.length > 0 && (
          <IconButton
            icon="bell"
            iconColor={
              activeNotifications.length > 0 ? MD3Colors.error50 : "#fff"
            }
            size={25}
            onPress={() => navigation.navigate("Messages")}
          />
        )}
      </View>
    );
  }
  const theme = useTheme({
    colors: {
      primary: "rgb(8, 97, 164)",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(210, 228, 255)",
      onPrimaryContainer: "rgb(0, 28, 55)",
      secondary: "rgb(83, 95, 112)",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "rgb(215, 227, 248)",
      onSecondaryContainer: "rgb(16, 28, 43)",
      tertiary: "rgb(107, 87, 120)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(243, 218, 255)",
      onTertiaryContainer: "rgb(37, 20, 49)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "#e0e0e0",
      onBackground: "rgb(26, 28, 30)",
      surface: "rgb(253, 252, 255)",
      onSurface: "rgb(26, 28, 30)",
      surfaceVariant: "rgb(223, 226, 235)",
      onSurfaceVariant: "rgb(67, 71, 78)",
      outline: "rgb(115, 119, 127)",
      outlineVariant: "rgb(195, 198, 207)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(47, 48, 51)",
      inverseOnSurface: "rgb(241, 240, 244)",
      inversePrimary: "rgb(160, 202, 255)",
      elevation: {
        level0: "transparent",
        level1: "rgb(241, 244, 250)",
        level2: "rgb(233, 240, 248)",
        level3: "rgb(226, 235, 245)",
        level4: "rgb(224, 233, 244)",
        level5: "rgb(219, 230, 242)",
      },
      surfaceDisabled: "rgba(26, 28, 30, 0.12)",
      onSurfaceDisabled: "rgba(26, 28, 30, 0.38)",
      backdrop: "rgba(44, 49, 55, 0.4)",
    },
  });


  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {!accessToken ? (
            <>
              <Stack.Screen
                name="Home"
                options={{
                  headerTitle: (props) => <LogoTitle {...props} />,
                  headerStyle: { backgroundColor: "rgb(8, 97, 164)" },
                }}
                component={HomeScreen}
              />
              <Stack.Screen name="Sign Up" component={SignUp} />
              <Stack.Screen name="Forgot Password" component={ResetPassword} />

            </>
          ) : (
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                headerTitle: ({ navigation, ...props }) => (
                  <LogoTitle {...props} />
                ),
                headerStyle: { backgroundColor: "rgb(8, 97, 164)" },
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(8, 97, 164)",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 10,
  },
  title: {
    marginLeft: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
