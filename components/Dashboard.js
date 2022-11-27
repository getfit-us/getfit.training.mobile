import React, { useEffect } from "react";

import { createDrawerNavigator, DrawerButton } from "@react-navigation/drawer";
import ActivityFeed from "./Notifications/ActivityFeed";
import Logout from "./Logout";
import { useProfile, useWorkouts } from "../Store/Store";
import Profile from "./Profile/Profile";
import Messages from "./Notifications/Messages";
import ViewActivity from "./Notifications/ViewActivity";
import { List } from "react-native-paper";
import StartWorkout from "./Workout/StartWorkout";
import CreateWorkout from "./Workout/CreateWorkout";

const Drawer = createDrawerNavigator();

const Dashboard = ({ navigation }) => {
  const accessToken = useProfile((state) => state.profile?.accessToken);

 

  return (
  

      <Drawer.Navigator
        initialRouteName="Activity Feed"
        backBehavior="history"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#0a0a0a",
            width: "60%",
            borderRightWidth: 1,
            borderRightColor: "#f2f2f2",
          },
          drawerActiveBackgroundColor: "#3483eb",
          drawerActiveTintColor: "#f2f2f2",
          drawerInactiveTintColor: "#f2f2f2",
        }}
      >
        <Drawer.Screen
          name="Start Workout"
          component={StartWorkout}
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="weight-lifter"
                color={props.focused ? "black" : "white"}
              />
            ),
            title: "Start Workout",
            titleStyle: {
              backgroundColor: "blue",
            },
            headerVisible: false,
            headerShown: false,
          }}
        />
         <Drawer.Screen
          name="Create Workout"
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="pencil"
                color={props.focused ? "black" : "white"}
              />
            ),
            headerVisible: false,
            headerShown: false,
          }}
          component={CreateWorkout}
        />
        <Drawer.Screen
          name="Activity Feed"
          component={ActivityFeed}
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="bell-ring"
                color={props.focused ? "black" : "white"}
              />
            ),
            title: "Activity Feed",
            titleStyle: {
              color: "red",
              backgroundColor: "blue",
            },
            headerVisible: false,
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Messages"
          component={Messages}
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="message-text"
                color={props.focused ? "black" : "white"}
              />
            ),
            headerVisible: false,
            headerShown: false,
          }}
        />
       
        {/* <Drawer.Screen name="View Workout" component={ViewWorkout} /> */}
        <Drawer.Screen
          options={{
            drawerItemStyle: {
              display: "none",
            },
            headerVisible: false,
            headerShown: false,
          }}
          name="View Activity"
          component={ViewActivity}
        />

        {/* <Drawer.Screen name="Measurements" component={Measurements} /> */}
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="account-circle"
                color={props.focused ? "black" : "white"}
              />
            ),
            headerVisible: false,
            headerShown: false,
          }}
        />
        {/* <Drawer.Screen name="Settings" component={Settings} /> */}
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{
            drawerIcon: (props) => (
              <List.Icon
                icon="logout"
                color={props.focused ? "black" : "white"}
              />
            ),
            headerVisible: false,
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
  );
};

export default Dashboard;
