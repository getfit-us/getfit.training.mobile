import React from "react";
import { useWorkouts } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getAllExercises } from "../Api/services";
import { List, Searchbar, Button, Checkbox } from "react-native-paper";
import { FlatList, View, StyleSheet } from "react-native";

const SearchExercises = ({ setAddExercises, checked, setChecked }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
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
