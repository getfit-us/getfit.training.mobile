import { useWorkouts } from "../../../Store/Store";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import { getAssignedCustomWorkouts } from "../../Api/services";
import { Avatar, List, Searchbar } from "react-native-paper";
import RenderWorkout from "../RenderWorkout";
import ProgressBar from "../../UserFeedback/ProgressBar";
import { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../../Store/colors";

const AssignedWorkouts = ({ navigation }) => {
  const stateAssignedWorkouts = useWorkouts(
    (state) => state.assignedCustomWorkouts
  );
  const [loadingAssignedWorkouts, assignedWorkouts, errorAssignedWorkouts] =
    useApiCallOnMount(getAssignedCustomWorkouts);
  const [workoutData, setWorkoutData] = useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  const assignedWorkoutOptions = {
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons
        name="clipboard-account"
        color={color}
        size={size}
      />
    ),
    title: "Assigned Workouts",

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
    } else if (loadingAssignedWorkouts && stateAssignedWorkouts?.length > 0) {
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

  const renderList = useMemo(({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        titleNumberOfLines={2}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={new Date(item.Created).toLocaleDateString()}
        left={(props) => (
          <Avatar.Icon
            {...props}
            color="white"
            icon={item?.exercises[0]?.type === "cardio" ? "run" : "dumbbell"}
            size={40}
            style={{
              backgroundColor:
                item?.exercises[0]?.type === "cardio"
                  ? "#f9a825"
                  : "rgb(8, 97, 164)",
              marginLeft: 10,
              alignSelf: "center",
            }}
          />
        )}
        onPress={() => {
          setStartWorkout(item);
        }}
      />
    );
  }, [stateAssignedWorkouts?.length]);

  return loadingAssignedWorkouts && stateAssignedWorkouts?.length === 0 ? (
    <ProgressBar loading={loadingAssignedWorkouts}
    color={colors.primaryLight}
    style={{height: 10}} />
  ) : stateAssignedWorkouts?.length === 0 && assignedWorkouts?.length === 0 ? (
    <View>
      <Text style={styles.noWorkoutsText}>
        You have no trainer assigned workouts.
      </Text>
    </View>
  ) : startWorkout?.exercises?.length > 0 ? (
    <RenderWorkout screenOptions={assignedWorkoutOptions} />
  ) : (
    <View style={styles.container}>
      <Searchbar
        elevation={3}
        placeholder="Search Assigned Workouts"
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d9d5db",
    flex: 1,
  },
  listItem: {
    backgroundColor: "white",
    border: "1px solid black",
    marginBottom: 5,
    marginTop: 5,
    elevation: 3,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  listItemTitle: {
    fontSize: 20,
    padding: 5,
  },
  searchBar: {
    backgroundColor: "white",
    elevation: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  listItemDescription: {
    fontSize: 15,
  },
  noWorkoutsText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});

export default AssignedWorkouts;
