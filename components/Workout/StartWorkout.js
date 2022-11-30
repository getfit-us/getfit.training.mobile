import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import CompletedWorkouts from "./StartWorkout/CompletedWorkouts";
import CustomWorkouts from "./StartWorkout/CreatedWorkouts";
import AssignedWorkouts from "./StartWorkout/AssignedWorkouts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const StartWorkout = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      backBehavior="order"
      screenOptions={{
        tabBarActiveTintColor: "rgb(8, 97, 164)",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 2,
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
        component={AssignedWorkouts}
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
        component={CustomWorkouts}
      />
      <Tab.Screen
        name="Completed"
        component={CompletedWorkouts}
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

const styles = StyleSheet.create({

});

export default StartWorkout;
