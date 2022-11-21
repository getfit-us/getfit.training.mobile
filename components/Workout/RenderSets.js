import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import RenderSuperSet from "./RenderSuperSet";
import { useWorkouts } from "../../Store/Store";

const RenderSets = ({ sets, exercise, exerciseIndex }) => {
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );
  const handleDeleteSet = (setIndex) => {
    const _exercise = { ...exercise };
    _exercise.numOfSets.splice(setIndex, 1);
    updateStartWorkoutExercise(_exercise);
  };

  return sets?.map((set, setIndex) => {
    return Array.isArray(set) ? (
      <RenderSuperSet sets={set} key={setIndex  + 'superset'} />
    ) : (
      <View style={styles.sets} key={" Set View" + setIndex}>
        <TextInput
          key={setIndex + "set"}
          label="Set"
        //   value={index + 1}
         defaultValue={setIndex + 1}
          editable={false}
          mode="outlined"
          style={styles.set}
        />
        <TextInput
          key={setIndex + "weight"}
          label="Weight"
          value={set.weight}
          mode="outlined"
          style={styles.weight}
        />
        <TextInput
          key={setIndex + "reps"}
          label="Reps"
          value={set.reps}
          mode="outlined"
          style={styles.rep}
        />
        {setIndex > 0 && (
          <IconButton
            key={setIndex + "delete"}
            icon="delete"
            onPress={() => handleDeleteSet(setIndex)}
            size={20}
          />
        )}
      </View>
    );
  });
};

const styles = StyleSheet.create({
  sets: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    flex: 1,
  },
  weight: {
    width: "40%",
    marginLeft: 3,
    marginRight: 3,
  },
  set: {
    width: "20%",
  },
  rep: {
    width: "30%",
  },
});

export default RenderSets;
