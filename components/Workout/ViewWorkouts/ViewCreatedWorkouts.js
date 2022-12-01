import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useWorkouts } from "../../../Store/Store";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import { getCustomWorkouts, getSingleCustomWorkout } from "../../Api/services";
import  useAxiosPrivate  from "../../../hooks/useAxiosPrivate";
import { Avatar, List, Searchbar, ProgressBar } from "react-native-paper";
import { colors } from "../../../Store/colors";

const ViewCreatedWorkouts = ({navigation}) => {
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const stateCustomWorkouts = useWorkouts((state) => state.customWorkouts);
  const [viewWorkout, setViewWorkout] = useWorkouts((state) => [
    state.viewWorkout,
    state.setViewWorkout,
  ]);
  const [workoutData, setWorkoutData] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setViewWorkout({});
  }, []);

  useEffect(() => {
    if (!loadingCustomWorkouts || stateCustomWorkouts?.length > 0) {
      setWorkoutData(
        stateCustomWorkouts?.sort(
          (a, b) => new Date(b.Created) - new Date(a.Created)
        )
      );
    }
  }, [loadingCustomWorkouts, stateCustomWorkouts, customWorkouts]);

  const handleSearch = (query) => {
    if (query === "") setWorkoutData(stateCustomWorkouts);
    else {
      const filteredData = stateCustomWorkouts?.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
      });
      setWorkoutData(filteredData);
    }
  };

  const handleGetWorkout = (item) => {
    setStatus({ loading: true });
    getSingleCustomWorkout(axiosPrivate, item._id).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        setViewWorkout(status.data);
        navigation.navigate("View Activity", { status });
      }
    });
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
          handleGetWorkout(item);
        }}
      />
    );
  };

  return loadingCustomWorkouts ? (
    <ProgressBar
      loading={loadingCustomWorkouts}
      color={colors.primaryLight}
      style={{ height: 10 }}
    />
  ) : stateCustomWorkouts?.length === 0 && customWorkouts?.length === 0 ? (
    <View>
      <Text style={styles.noWorkoutsText}>
        You have no custom created workouts.
      </Text>
    </View>
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
        initialNumToRender={20}
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

export default ViewCreatedWorkouts;
