import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ViewAssignedWorkouts from "./ViewAssignedWorkouts";
import ViewCreatedWorkouts from "./ViewCreatedWorkouts";
import ViewCompletedWorkouts from "./ViewCompletedWorkouts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ViewWorkouts = () => {
  const Tab = createBottomTabNavigator();
  



  return (
    <Tab.Navigator
      backBehavior="order"
      screenOptions={{
        tabBarActiveTintColor: "rgb(8, 97, 164)",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 4,
          borderTopColor: "rgb(8, 97, 164)",
          elevation: 3,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Assigned"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-account"
              color={color}
              size={size}
            />
          ),
          headerShown: false,
        }}
        component={ViewAssignedWorkouts}
      />
      <Tab.Screen
        name="Created"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pencil" color={color} size={size} />
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              name="pencil"
              size={30}
              color="white"
              style={{ marginLeft: 10 }}
            />
          ),

          headerShown: false,
        }}
        component={ViewCreatedWorkouts}
      />
      <Tab.Screen
        name="Completed"
        component={ViewCompletedWorkouts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check" color={color} size={size} />
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              name="check"
              size={30}
              color="white"
              style={{ marginLeft: 10 }}
            />
          ),

          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default ViewWorkouts;
