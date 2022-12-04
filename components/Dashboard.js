import React, { useEffect, useState } from "react";

import { createDrawerNavigator, DrawerButton } from "@react-navigation/drawer";
import ActivityFeed from "./Notifications/ActivityFeed";
import Logout from "./Logout";
import { useProfile, useWorkouts } from "../Store/Store";
import Profile from "./Profile/Profile";
import Messages from "./Notifications/Messages";
import ViewActivity from "./Notifications/ViewActivity";
import { Badge, List } from "react-native-paper";
import StartWorkout from "./Workout/StartWorkout";
import CreateWorkout from "./Workout/CreateWorkout";
import ViewWorkouts from "./Workout/ViewWorkouts/ViewWorkouts";
import Measurements from "./Measurements/Measurements";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();

const Dashboard = () => {
  const notifications = useProfile((state) => state.notifications);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [newActivity, setNewActivity] = useState([]);

  useEffect(() => {
    setNewActivity(
      notifications.filter((notification) => {
        if (
          notification.type === "activity" &&
          notification.is_read === false
        ) {
          return true;
        }
      })
    );
  }, [notifications]);

  return (
    <Drawer.Navigator
      initialRouteName="Activity Feed"
      backBehavior="history"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#0a0a0a",
          width: "60%",
         
        },
        headerShown: false,
        headerVisible: false,
        drawerActiveBackgroundColor: "#3483eb",
        drawerActiveTintColor: "#f2f2f2",
        drawerInactiveTintColor: "#f2f2f2",
      }}
    >
      
      <Drawer.Screen
        name="Activity Feed"
        component={ActivityFeed}
        options={{
          drawerIcon: (props) => (
            <>
              <List.Icon
                icon="bell-ring"
                color={props.focused ? "black" : "white"}
              />
              <Badge
                size={20}
                visible={newActivity.length > 0}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 2,
                  backgroundColor: "red",
                }}
              >
                {newActivity?.length}
              </Badge>
            </>
          ),
          title: "Activity Feed",
          titleStyle: {
            color: "red",
            backgroundColor: "blue",
          },
         
        }}
      />
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
        
        }}
        component={CreateWorkout}
      />

      <Drawer.Screen name="View Workouts"
        options={{
          drawerIcon: (props) => (
            <List.Icon
              icon="history"
              color={props.focused ? "black" : "white"}
            />
          ),
        
        }}
      
      component={ViewWorkouts} />

      <Drawer.Screen
        name="Messages"
        component={Messages}
        options={{
          drawerIcon: (props) => (
            <>
              <List.Icon
                icon="message-text"
                color={props.focused ? "black" : "white"}
              />
              <Badge
                size={20}
                visible={activeNotifications.length > 0}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 2,
                  backgroundColor: "red",
                }}
              >
                {activeNotifications?.length}
              </Badge>
            </>
          ),
        
        }}
      />

      <Drawer.Screen name="Measurements" 
       options={{
        drawerIcon: (props) => (
          <List.Icon
            icon="chart-line"
            color={props.focused ? "black" : "white"}
          />
        ),
        headerVisible: false,
        headerShown: false,
      }}
      component={Measurements} />

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
        
        }}
      />
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
    </Drawer.Navigator>
  );
};

export default Dashboard;
