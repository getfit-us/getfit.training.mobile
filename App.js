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
} from "react-native-paper";
import { useTheme, Badge } from "react-native-paper";
import { useProfile } from "./Store/Store";
import Dashboard from "./components/Dashboard";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";
import { darkTheme, lightTheme } from "./theme/theme";
import { DrawerActions } from "@react-navigation/native";
import LoadingScreen from "./components/UserFeedback/LoadingScreen";

import { colors } from "./Store/colors";

const Stack = createNativeStackNavigator();

export default function App() {
  const accessToken = useProfile((state) => state.profile?.accessToken);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const themeType = useProfile((state) => state.themeType);
  const status = useProfile((state) => state.status);

  function LogoTitle() {
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={colors.primary}
          onPress={() =>
            accessToken
              ? navigation.dispatch(DrawerActions.toggleDrawer())
              : null
          }
        >
          <Image
            style={{ width: 50, height: 50 }}
            source={require("./assets/GETFIT-LOGO.png")}
          />
        </TouchableHighlight>
        <Text style={styles.title} variant="titleMedium">
          GETFIT Personal Training
        </Text>
        {accessToken && (
          <View style={styles.activeNotifications}>
            <IconButton
              icon="bell"
              iconColor={"#fff"}
              size={25}
              onPress={() => navigation.navigate("Messages")}
            />
            <Badge
              visible={activeNotifications?.length > 0}
              size={20}
              children={activeNotifications?.length}
              style={{ position: "absolute", top: 5, right: 10 }}
              onPress={() => navigation.navigate("Messages")}
            />
          </View>
        )}
      </View>
    );
  }
  const theme = useTheme({
    colors: themeType === true ? darkTheme : lightTheme,
    version: 3,
    mode: "exact",
    roundness: 4,
    fonts: {
      regular: {
        fontFamily: "Roboto",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "Roboto",
        fontWeight: "bold",
      },

      light: {
        fontFamily: "Roboto",
        fontWeight: "300",
      },
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
                  headerStyle: {
                    backgroundColor: colors.primary,
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                  },
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
                headerStyle: { backgroundColor: colors.primary },
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
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 10,
    height: 50,
  },
  title: {
    marginLeft: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  activeNotifications: {
    margin: 16,
  },
});
