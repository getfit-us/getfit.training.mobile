import { useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RenderWorkout from "./RenderWorkout";
import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import {
  getAssignedCustomWorkouts,
  getCustomWorkouts,
  getCompletedWorkouts,
} from "../Api/services";
import { List, Searchbar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const StartWorkout = () => {
  const Tab = createBottomTabNavigator();
  const startWorkout = useWorkouts((state) => state.startWorkout);

  return (
    <Tab.Navigator
    
    >
      <Tab.Screen
        name="Trainer Assigned Workouts"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-account" color={color} size={size} />
          ),
          backBehavior: "history",
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
        component={AssignedWorkouts}
      />
      <Tab.Screen name="Created Workouts"
       options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="pencil" color={color} size={size} />
        ),
        backBehavior: "history",
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
      }}
      
      component={CustomWorkouts} />
      <Tab.Screen name="Completed Workouts" component={CompletedWorkouts} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="check" color={color} size={size} />
        ),
        backBehavior: "history",
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        icon: "check",
      }}
      />
    </Tab.Navigator>
  );
};

const AssignedWorkouts = () => {
  const stateAssignedWorkouts = useWorkouts((state) => state.assignedWorkouts);
  const [loadingAssignedWorkouts, assignedWorkouts, errorAssignedWorkouts] =
    useApiCallOnMount(getAssignedCustomWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);

  useEffect(() => {
    if (!loadingAssignedWorkouts) {
      setWorkoutData(
        assignedWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingAssignedWorkouts]);

  return assignedWorkouts?.length > 0 && !loadingAssignedWorkouts ? (
    <View>
      <Text>Nothing Found</Text>
    </View>
  ) : (
    <FlatList
      data={workoutData}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item._id}
      //   onEndReached={assignedWorkouts?.length > 0 ? data.next() : null}
    />
  );
};

const CustomWorkouts = () => {
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const stateCustomWorkouts = useWorkouts((state) => state.customWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);

  useEffect(() => {
    if (!loadingCustomWorkouts) {
      setWorkoutData(
        customWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingCustomWorkouts]);

  const handleSearch = (query) => {
    const filteredData = stateCustomWorkouts?.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setWorkoutData(filteredData);
  };

  const renderList = ({ item }) => {
    return (
      <List.Item
        style={{ backgroundColor: "white", border: "1px solid black" }}
        key={item._id}
        title={item.name}
        description={new Date(item.Created).toLocaleDateString()}
        left={(props) => <List.Icon {...props} icon="dumbbell" />}
        onPress={() => console.log(item)}
      />
    );
  };

  return stateCustomWorkouts?.length > 0 ? (
    <View>
      <Searchbar
        elevation={3}
        placeholder="Search"
        onChangeText={(query) => handleSearch(query)}
      />
      <FlatList
        data={workoutData}
        renderItem={renderList}
        keyExtractor={(item) => item._id}
        //  onEndReached={data.next()}
      />
    </View>
  ) : (
    <View>
      <Text>Nothing Found</Text>
    </View>
  );
};

const CompletedWorkouts = ({ navigation }) => {
  const stateCompletedWorkouts = useWorkouts(
    (state) => state.completedWorkouts
  );
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);

  useEffect(() => {
    if (!loadingCompletedWorkouts) {
      setWorkoutData(
        completedWorkouts?.sort(
          (a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)
        )
      );
    }
  }, [loadingCompletedWorkouts]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('goBack', (e) => {
      setStartWorkout({});
      navigation.goBack();
      
  
      // Do something manually
      // ...
    });
  
    return unsubscribe;
  }, [navigation]);


  const handleSearch = (query) => {
    const filteredData = stateCompletedWorkouts.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setWorkoutData(filteredData);
  };

  const renderList = ({ item }) => {
    return (
      <List.Item
        style={{ backgroundColor: "white", border: "1px solid black" }}
        key={item._id}
        title={item.name}
        description={new Date(item.dateCompleted).toLocaleDateString()}
        left={(props) => <List.Icon {...props} icon="dumbbell" />}
        onPress={() => {
          setStartWorkout(item);
          
        }}
      />
    );
  };

  return startWorkout?.name ? (
    <RenderWorkout />
  ) : (
    <View>
      <Searchbar
        elevation={3}
        placeholder="Search"
        onChangeText={(query) => handleSearch(query)}
      />
      <FlatList
        data={workoutData}
        renderItem={renderList}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#ebab34",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    height: 30,
  
    
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    justifyContent: 'center',
    paddingTop: 0,
    marginTop: 0,
    
    
 
  
  },
});

export default StartWorkout;
