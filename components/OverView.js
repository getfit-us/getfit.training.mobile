import React, { useEffect } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import ActivityFeed from "./Notifications/ActivityFeed";
import Logout from "./Logout";
import { useProfile } from "../Store/Store";
import GetApiData from "./GetApiData";
import Profile from "./Profile/Profile";
import { Appbar } from "react-native-paper";

const Drawer = createDrawerNavigator();

const OverView = () => {
  const profile = useProfile((state) => state.profile);
  const setCalendar = useProfile((state) => state.setCalendar);

  return (
    <>
      <GetApiData />
      
      <Drawer.Navigator>
  
        <Drawer.Screen name="Activity Feed" component={ActivityFeed} />
        {/* <Drawer.Screen name="Start Workout" component={StartWorkout} /> */}
        {/* <Drawer.Screen name="Create Workout" component={CreateWorkout} /> */}
        {/* <Drawer.Screen name="View Workout" component={ViewWorkout} /> */}

        {/* <Drawer.Screen name="Measurements" component={Measurements} /> */}
        <Drawer.Screen name="Profile" component={Profile} />
        {/* <Drawer.Screen name="Settings" component={Settings} /> */}
        <Drawer.Screen name="Logout" component={Logout} />
      
      </Drawer.Navigator>
      
    </>
  );
};

export default OverView;
