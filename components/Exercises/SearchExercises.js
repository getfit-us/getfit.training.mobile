import React from "react";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getAllExercises } from "../Api/services";
import { List, Searchbar, Button, Checkbox } from "react-native-paper";
import { FlatList, View, StyleSheet } from "react-native";

const SearchExercises = ({ setAddExercises }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [checked, setChecked] = React.useState([]);
  const [loadingExercises, latestExercises, errorExercises] =
    useApiCallOnMount(getAllExercises);
  const exercises = useWorkouts((state) => state.exercises);
  const [filteredExercises, setFilteredExercises] = React.useState(null);
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
    <View style={{ height: "100%", width: "100%" , backgroundColor: 'white' }}>

     <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center', marginLeft: 5, marginRight: 5 }}>
     <Button
        mode="contained"
        style={{ margin: 10, width: "50%", alignSelf: "center" }}
        buttonColor="red"
        onPress={() => {
          //clear checked array
          setChecked([]);
          //hide search dialog
          setAddExercises((prev) => !prev);
        }}
      >
        Close Search
      </Button>
         
      {checked.length > 0 ? (
        <Button
          mode="contained"
          style={{ margin: 10, width: "50%", alignSelf: "center"  }}
          buttonColor="green"
          
          onPress={() => {
            exercises.forEach((exercise) => {
              if (checked.includes(exercise._id)) {
                // console.log("exercise", exercise);
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
          {checked.length > 1 ? "ADD EXERCISES" : "ADD EXERCISE"}{" "}
        </Button>
      ) : null}
     </View>
      

      <Searchbar
        placeholder="Search Exercises to add"
        onChangeText={(query) => onChangeSearch(query)}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => (
          <List.Item
            titleNumberOfLines={2}
            style={styles.listItem}
            titleStyle={styles.listItemTitle}
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
        style={{ width: "100%", height: "100%",
      backgroundColor: 'white' }}
      />
    </View>
  );
};

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    borderWidth: 1,
    borderColor: 'black',
  },
  searchBar: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  listItemTitle: {
    fontSize: 16,
    
  }
})

export default SearchExercises;
