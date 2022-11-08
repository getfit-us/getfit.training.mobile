import React, { useEffect } from 'react'



import { createDrawerNavigator } from '@react-navigation/drawer';
import ActivityFeed from './Notifications/ActivityFeed';
import Logout from './Logout';
const Drawer = createDrawerNavigator();


const OverView = () => {

useEffect(() => {
    console.log('loading state');
        

}, []);

  return (
    <Drawer.Navigator>
    <Drawer.Screen name="Activity Feed" component={ActivityFeed} />
    {/* <Drawer.Screen name="Start Workout" component={StartWorkout} /> */}
    {/* <Drawer.Screen name="Measurements" component={Measurements} /> */}
    {/* <Drawer.Screen name="Profile" component={Profile} /> */}
    {/* <Drawer.Screen name="Settings" component={Settings} /> */}
    <Drawer.Screen name="Logout" component={Logout} />
  </Drawer.Navigator>
  )
}

export default OverView