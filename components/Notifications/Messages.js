import React from "react";
import { useProfile } from "../../Store/Store";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inbox from './Inbox';
import Chat from './Chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getNotifications , getClientData} from "../Api/services";

const Tab = createBottomTabNavigator();

const Messages = () => {
  const [loadingNotifications, notificationData, errorNotifications] = useApiCallOnMount(getNotifications);
  const [loadingClientData, clientData, errorClient] = useApiCallOnMount(getClientData);


  return (
  <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Inbox') {
        iconName = 'mail';
        
      } else if (route.name === 'Chat') {
        iconName ='chatbox' 
      }

      // You can return any component that you like here!
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'rgb(8, 97, 164)',
    tabBarInactiveTintColor: 'white',
    tabBarStyle: {
      backgroundColor: '#b5b1b1',
      borderTopWidth: 2,
      borderTopColor: 'rgb(8, 97, 164)',
      elevation: 3,
      shadowOpacity: 0,
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: 16,
      marginBottom: 5,
    },
  })}>
    <Tab.Screen name="Inbox" component={Inbox} 
    options={{
      headerVisible: false,
      headerShown: false,
    }}

    />
    <Tab.Screen name='Chat' component={Chat}
     options={{
      headerVisible: false,
      headerShown: false,
      
    }} />
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
