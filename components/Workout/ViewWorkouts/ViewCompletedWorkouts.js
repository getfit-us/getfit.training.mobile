import { View, Text , StyleSheet, FlatList} from "react-native";
import { useCallback, useState, useEffect } from "react";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import {
  getCompletedWorkouts,
  getSingleCompletedWorkout,
} from "../../Api/services";
import { useWorkouts } from "../../../Store/Store";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ProgressBar, Searchbar, List, Avatar } from "react-native-paper";
import { colors } from "../../../Store/colors";

const ViewCompletedWorkouts = ({navigation}) => {
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);
  const stateCompletedWorkouts = useWorkouts(
    (state) => state.completedWorkouts
  );

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
    if (!loadingCompletedWorkouts || stateCompletedWorkouts?.length > 0) {
      setStatus({ loading: false, error: false, success: true });
      setWorkoutData(
        stateCompletedWorkouts?.sort(
          (a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted)
        )
      );
    }
    if (loadingCompletedWorkouts)
      setStatus({
        loading: true,
        error: false,
      });
  }, [loadingCompletedWorkouts, completedWorkouts, stateCompletedWorkouts]);

  const handleSearch = (query) => {
    const filteredData = stateCompletedWorkouts.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase());
    });
    setWorkoutData(filteredData);
  };

  
  const handleGetWorkout = (item) => {
    setStatus({ loading: true });
    getSingleCompletedWorkout(
      axiosPrivate,
        item._id
    ).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        setViewWorkout(status.data);
        navigation.navigate("View Activity", { status });
      }
    });
  };

  const renderList = useCallback(({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        titleNumberOfLines={2}
        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={
          "Date Completed:" + new Date(item.dateCompleted).toLocaleDateString()
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
          handleGetWorkout(item);
        }}
      />
    );
  }, [workoutData]);

  return status.loading ? (
    <ProgressBar loading={status.loading}
    color={colors.primaryLight}
    style={{height: 10}}

    />
  ) : (
    <View style={styles.container}>
      <Searchbar
        elevation={4}
        placeholder="Search Completed Workouts"
        onChangeText={(query) => handleSearch(query)}
        style={styles.searchBar}
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


export default ViewCompletedWorkouts;
