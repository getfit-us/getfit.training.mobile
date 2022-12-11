import { StyleSheet } from "react-native";
import React from "react";

import AddMeasurement from "./AddMeasurement";
import ViewMeasurements from "./ViewMeasurements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// component to add a new measurement
const Tab = createBottomTabNavigator();

const Measurements = () => {
  return (
    <Tab.Navigator
      initialRouteName="View Measurements"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            "View Measurements": "view-list",
            "Add Measurement": "plus-circle",
          };

          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen name="View Measurements" component={ViewMeasurements} />
      <Tab.Screen
        name="Add Measurement"
        component={AddMeasurement}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default Measurements;
