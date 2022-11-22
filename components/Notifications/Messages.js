import React from "react";
import { useProfile } from "../../Store/Store";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inbox from './Inbox';
import Chat from './Chat';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const Messages = () => {
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
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
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
