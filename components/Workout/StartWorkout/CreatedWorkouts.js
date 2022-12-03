import { useWorkouts } from "../../../Store/Store";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import { getCustomWorkouts } from "../../Api/services";
import { List, Searchbar, Avatar } from "react-native-paper";
import RenderWorkout from "../RenderWorkout";
import ProgressBar from "../../UserFeedback/ProgressBar";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { colors } from "../../../Store/colors";

const CustomWorkouts = ({ navigation }) => {
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const stateCustomWorkouts = useWorkouts((state) => state.customWorkouts);
  const [workoutData, setWorkoutData] = useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  useEffect(() => {
    if (!loadingCustomWorkouts) {
      setStatus({ loading: false, error: false, success: false });

      setWorkoutData(
        customWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    } else if (loadingCustomWorkouts && stateCustomWorkouts?.length > 0) {
      setStatus({ loading: false, error: false, success: false });
      setWorkoutData(
        stateCustomWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingCustomWorkouts, stateCustomWorkouts, customWorkouts]);

  // useEffect(() => {
  //   setStartWorkout({ name: "New Workout", exercises: [] });

  //   const unsubscribe = navigation.addListener("focus", () => {
  //     setStartWorkout({
  //       name: "",
  //       exercises: [],
  //     });
  //   });

  //   return unsubscribe;
  // }, [navigation]);

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
        titleNumberOfLines={2}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={
          "Date Created: " + new Date(item.Created).toLocaleDateString()
        }
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
  };

  return status.loading ? (
    <ProgressBar
      loading={status.loading}
      color={colors.primaryLight}
      style={{ height: 10 }}
    />
  ) : startWorkout?.exercises?.length > 0 ? (
    <RenderWorkout />
  ) : (
    <View style={styles.container}>
      <Searchbar
        elevation={3}
        placeholder="Search Created Workouts"
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
  headerStyle: {
    backgroundColor: "black",

    height: 40,
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
    flex: 1,
  },
  listItem: {
    backgroundColor: "white",

    marginTop: 5,
    marginBottom: 5,
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
});

export default CustomWorkouts;
