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
import ProgressBar from "../UserFeedback/ProgressBar";

const StartWorkout = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'rgb(8, 97, 164)',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: "#b5b1b1",
          borderTopWidth: 2,
          borderTopColor: "rgb(8, 97, 164)",
          elevation: 3,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Assigned Workouts"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-account"
              color={color}
              size={size}
            />
          ),
          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
        component={AssignedWorkouts}
      />
      <Tab.Screen
        name="Created Workouts"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pencil" color={color} size={size} />
          ),

          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
        }}
        component={CustomWorkouts}
      />
      <Tab.Screen
        name="Completed Workouts"
        component={CompletedWorkouts}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check" color={color} size={size} />
          ),

          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          icon: "check",
        }}
      />
    </Tab.Navigator>
  );
};

const AssignedWorkouts = () => {
  const stateAssignedWorkouts = useWorkouts(
    (state) => state.assignedCustomWorkouts
  );
  const [loadingAssignedWorkouts, assignedWorkouts, errorAssignedWorkouts] =
    useApiCallOnMount(getAssignedCustomWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [status, setStatus] = React.useState({
    loading: false,
    error: false,
    success: false,
  });

  const assingedWorkoutOptions = {
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons
        name="clipboard-account"
        color={color}
        size={size}
      />
    ),
    title: "Trainer Assigned Workouts",

    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerRight: () => null,
    tabBarStyle: { display: "flex" },
  };

  useEffect(() => {
    if (!loadingAssignedWorkouts) {
      setWorkoutData(
        stateAssignedWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingAssignedWorkouts, stateAssignedWorkouts, assignedWorkouts]);

  const handleSearch = (query) => {
    if (query === "") setWorkoutData(stateAssignedWorkouts);
    else {
      const filteredData = stateAssignedWorkouts?.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      });
      setWorkoutData(filteredData);
    }
  };

  const renderList = ({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={new Date(item.Created).toLocaleDateString()}
        left={(props) => <List.Icon {...props} icon="dumbbell" />}
        onPress={() => {
          setStartWorkout(item);
        }}
      />
    );
  };

  return loadingAssignedWorkouts ? (
    <ProgressBar loading={loadingAssignedWorkouts} />
  ) : stateAssignedWorkouts?.length === 0 && assignedWorkouts?.length === 0 ? (
    <View>
      <Text style={styles.noWorkoutsText}>
        You have no trainer assigned workouts.
      </Text>
    </View>
  ) : startWorkout?.name ? (
    <RenderWorkout screenOptions={assingedWorkoutOptions} />
  ) : (
    <View style={styles.container}>
      <Searchbar
        elevation={3}
        placeholder="Search"
        style={styles.searchBar}
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

const CustomWorkouts = () => {
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const stateCustomWorkouts = useWorkouts((state) => state.customWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);

  const customWorkoutOptions = {
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="pencil" color={color} size={size} />
    ),

    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerRight: () => null,
    tabBarStyle: { display: "flex" },
    title: "Created Workouts",
  };

  useEffect(() => {
    if (!loadingCustomWorkouts) {
      setWorkoutData(
        customWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingCustomWorkouts, stateCustomWorkouts, customWorkouts]);

  const handleSearch = (query) => {
    const filteredData = stateCustomWorkouts?.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setWorkoutData(filteredData);
  };

  const renderList = ({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={
          "Date Created: " + new Date(item.Created).toLocaleDateString()
        }
        left={(props) => <List.Icon {...props} icon="dumbbell" />}
        onPress={() => {
          setStartWorkout(item);
        }}
      />
    );
  };

  return startWorkout?.name ? (
    <RenderWorkout screenOptions={customWorkoutOptions} />
  ) : (
    <View>
      <Searchbar
        elevation={3}
        placeholder="Search"
        style={styles.searchBar}
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

const CompletedWorkouts = () => {
  const stateCompletedWorkouts = useWorkouts(
    (state) => state.completedWorkouts
  );
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);
  const [workoutData, setWorkoutData] = React.useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const completedWorkoutOptions = {
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="check" color={color} size={size} />
    ),

    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    icon: "check",
    headerRight: () => null,
    tabBarStyle: { display: "flex" },
    title: "Completed Workouts",
  };

  useEffect(() => {
    if (!loadingCompletedWorkouts) {
      setWorkoutData(
        stateCompletedWorkouts?.sort(
          (a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)
        )
      );
    }
  }, [loadingCompletedWorkouts, completedWorkouts, stateCompletedWorkouts]);

  const handleSearch = (query) => {
    const filteredData = stateCompletedWorkouts.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setWorkoutData(filteredData);
  };

  const renderList = ({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={
          "Date Completed:" + new Date(item.dateCompleted).toLocaleDateString()
        }
        left={(props) => <List.Icon {...props} icon="dumbbell" />}
        onPress={() => {
          setStartWorkout(item);
        }}
      />
    );
  };

  return startWorkout?.name ? (
    <RenderWorkout screenOptions={completedWorkoutOptions} />
  ) : (
    <View style={styles.container}>
      <Searchbar
        elevation={3}
        placeholder="Search"
        onChangeText={(query) => handleSearch(query)}
        style={styles.searchBar}
      />
      <FlatList
        data={workoutData}
        renderItem={renderList}
        keyExtractor={(item) => item._id}
        style={{ backgroundColor: "white" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 2,
    height: 30,
    borderRadius: 10,
  },
  headerTitleStyle: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    paddingTop: 0,
    marginTop: 0,
  },
  container: {
    backgroundColor: "#d9d5db",
  },
  listItem: {
    backgroundColor: "white",
    border: "1px solid black",
    marginBottom: 5,
    elevation: 3,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 20,
    padding: 5,
    backgroundColor: "rgb(8, 97, 164)",
    borderRadius: 15,
    color: "white",
  },
  searchBar: {
    backgroundColor: "white",
    elevation: 3,
    marginBottom: 5,
  },
  listItemDescription: {
    fontSize: 15,
  },
});

export default StartWorkout;
