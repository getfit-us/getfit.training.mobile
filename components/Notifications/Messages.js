import React, { useEffect, useState } from "react";
import { useProfile } from "../../Store/Store";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Inbox from "./Inbox";
import Chat from "./Chat";
import Ionicons from "react-native-vector-icons/Ionicons";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import {
  getNotifications,
  getClientData,
  getTrainerInfo,
} from "../Api/services";
import { ActivityIndicator } from "react-native-paper";
import LoadingScreen from "../UserFeedback/LoadingScreen";
const Tab = createBottomTabNavigator();

const Messages = () => {
  const [loadingNotifications, notificationData, errorNotifications] =
    useApiCallOnMount(getNotifications);
  const [loadingClientData, clientData, errorClient] =
    useApiCallOnMount(getClientData);
  const [loadingTrainerData, trainerData, errorTrainer] =
    useApiCallOnMount(getTrainerInfo);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  useEffect(() => {
    if (loadingClientData || loadingTrainerData || loadingNotifications)
      setStatus({ loading: true, error: false, success: false });
    else if (!loadingClientData && !loadingTrainerData && !loadingNotifications)
      setStatus({ loading: false, error: false, success: true });
  }, [loadingClientData, loadingTrainerData, loadingNotifications]);

  const title = 'Get Fit .... Loading Messages';

  
    return status.loading ? (
      <LoadingScreen  title={title} icon='message-reply-text'/>
      ) : (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Inbox") {
            iconName = "mail";
          } else if (route.name === "Chat") {
            iconName = "chatbox";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "rgb(8, 97, 164)",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",

          elevation: 3,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          marginBottom: 5,
        },
      })}
    >
     
        
          <Tab.Screen
            name="Inbox"
            component={Inbox}
            options={{
              headerVisible: false,
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
              headerVisible: false,
              headerShown: false,
            }}
          />
        
    
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Messages;
