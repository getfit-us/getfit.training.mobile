import { useWorkouts } from "../../../Store/Store";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import { getCompletedWorkouts } from "../../Api/services";
import { List, Searchbar, Avatar } from "react-native-paper";
import RenderWorkout from "../RenderWorkout";
import ProgressBar from "../../UserFeedback/ProgressBar";
import { useEffect, useState } from "react";
import { View,  FlatList, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CompletedWorkouts = ({navigation}) => {
  const stateCompletedWorkouts = useWorkouts(
    (state) => state.completedWorkouts
  );
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);
  const [workoutData, setWorkoutData] = useState([]);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
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


  useEffect(() => {
    setStartWorkout({ name: "New Workout", exercises: [] });

    const unsubscribe = navigation.addListener("focus", () => {
      setStartWorkout({
        name: "",
        exercises: [],
      });
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
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        titleNumberOfLines={2}

        descriptionStyle={styles.listItemDescription}
        key={item._id}
        title={item.name}
        description={
          "Date Completed:" + new Date(item.dateCompleted).toLocaleDateString()
        }
        left={(props) => <Avatar.Icon {...props} 
      color="white"
      icon={item?.exercises[0]?.type === 'cardio' ? 'run' : 'dumbbell'} 
      size={40}
      style={{backgroundColor: item?.exercises[0]?.type === 'cardio' ? '#f9a825' : 'rgb(8, 97, 164)',
      marginLeft: 10,
      alignSelf: 'center',
    }}/>}
        onPress={() => {
          setStartWorkout(item);
        }}
      />
    );
  };

  return status.loading ? (    <ProgressBar loading={status.loading} />
  ) : startWorkout?.exercises?.length > 0 ? (
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
    elevation: 3,
    marginBottom: 1,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  listItemDescription: {
    fontSize: 15,
  },
});

export default CompletedWorkouts;
