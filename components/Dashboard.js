import React, { useEffect } from "react";

import { createDrawerNavigator, DrawerButton } from "@react-navigation/drawer";
import ActivityFeed from "./Notifications/ActivityFeed";
import Logout from "./Logout";
import { useProfile, useWorkouts } from "../Store/Store";
import GetApiData from "./GetApiData";
import Profile from "./Profile/Profile";
import Messages from "./Notifications/Messages";
import ViewActivity from "./Notifications/ViewActivity";
import {List } from "react-native-paper";

const Drawer = createDrawerNavigator();

const Dashboard = ({navigation}) => {
 const accessToken = useProfile((state) => state.profile?.accessToken);
  const setCalendar = useProfile((state) => state.setCalendar);
  const viewWorkout = useWorkouts((state) => state.viewWorkout);
  const viewMeasurement = useProfile((state) => state.viewMeasurement);

  if (!accessToken) navigation.navigate('Home');


  return (
    <>
      <GetApiData />

      <Drawer.Navigator>
        <Drawer.Screen name="Activity Feed" component={ActivityFeed} 
        options={{
          drawerIcon: () => (
            <List.Icon icon="bell-ring" />
          ),
          title: 'Activity Feed',
          titleStyle: {
            color: 'red',
            backgroundColor: 'blue',
          },
          headerVisible: false,
          headerShown: false,

          


        }}
        
        
        />
        <Drawer.Screen name="Messages" component={Messages}
        options={{
          drawerIcon: () => (
            <List.Icon icon="message-text" />
          ),
          headerVisible: false,
      headerShown: false,

        }} 
       
        />
        {/* <Drawer.Screen name="Start Workout" component={StartWorkout} /> */}
        {/* <Drawer.Screen name="Create Workout" component={CreateWorkout} /> */}
        {/* <Drawer.Screen name="View Workout" component={ViewWorkout} /> */}
        <Drawer.Screen
          options={{
            drawerItemStyle: {
              display:
               "none",
            },
            headerVisible: false,
            headerShown: false,
  
          }}
          name="View Activity"
          component={ViewActivity}
          
        />

        {/* <Drawer.Screen name="Measurements" component={Measurements} /> */}
        <Drawer.Screen name="Profile" component={Profile} 
         options={{
          drawerIcon: () => (
            <List.Icon icon="account-circle" />
          ),
          headerVisible: false,
          headerShown: false,


        }} />
        {/* <Drawer.Screen name="Settings" component={Settings} /> */}
        <Drawer.Screen name="Logout" component={Logout}
         options={{
          drawerIcon: () => (
            <List.Icon icon="logout" />
          ),
          headerVisible: false,
          headerShown: false,


        }} />
      </Drawer.Navigator>
    </>
  );
};

export default Dashboard;
