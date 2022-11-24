import React from "react";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getAllExercises } from "../Api/services";
import { List, Searchbar, Button, Checkbox } from "react-native-paper";
import { FlatList, View } from "react-native";

const SearchExercises = ({ setAddExercises }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checked, setChecked] = React.useState([]);
  const [loadingExercises, latestExercises, errorExercises] =
    useApiCallOnMount(getAllExercises);
  const exercises = useWorkouts((state) => state.exercises);
  const [filteredExercises, setFilteredExercises] = React.useState(null);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const addStartWorkoutExercise = useWorkouts(
    (state) => state.addStartWorkoutExercise
  );

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setFilteredExercises(
      exercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(query.toLowerCase());
      })
    );
  };

  return (
    <View style={{ height: "100%", width: "100%" }}>
      <Button
        mode="contained"
        style={{ margin: 10 }}
        buttonColor="#fc6b03"
        onPress={() => {
          //clear checked array
          setChecked([]);
          //hide search dialog
          setAddExercises((prev) => !prev);
        }}
      >
        Close Exercise Search
      </Button>
      {checked.length > 0 ? (
        <Button
          mode="contained"
          style={{ margin: 10 }}
          buttonColor="#fc6b03"
          onPress={() => {
            exercises.forEach((exercise) => {
              if (checked.includes(exercise._id)) {
                console.log("exercise", exercise);
                addStartWorkoutExercise({
                  ...exercise,
                  numOfSets: [
                    { weight: 0, reps: 0 },
                    { weight: 0, reps: 0 },
                    { weight: 0, reps: 0 },
                  ],
                });
              }
            });
            //clear checked array after adding exercises
            setChecked([]);
          }}
        >
          {checked.length > 1 ? "Add Exercises" : "Add Exercise"}{" "}
        </Button>
      ) : null}
      <Searchbar
        placeholder="Search Exercises to add"
        onChangeText={(query) => onChangeSearch(query)}
        value={searchQuery}
      />

      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => (
          <List.Item
            titleNumberOfLines={2}
            descriptionNumberOfLines={2}
            key={item._id}
            title={item.name}
            description={item.description}
            left={(props) => (
              <Checkbox
                status={checked?.includes(item._id) ? "checked" : "unchecked"}
                onPress={() =>
                  setChecked((prev) => {
                    if (prev.includes(item._id)) {
                      return prev.filter((id) => id !== item._id);
                    } else {
                      return [...prev, item._id];
                    }
                  })
                }
              />
            )}
          />
        )}
        keyExtractor={(item) => item._id}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default SearchExercises;
