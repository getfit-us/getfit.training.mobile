import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useWorkouts } from "../../Store/Store";

const RenderSets = memo(({ sets, exercise, exerciseIndex, inSuperSet, superSetIndex }) => {
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );
  const handleDeleteSet = (setIndex) => {
    if (inSuperSet) {
      const _exercise = { ...exercise };
      _exercise.numOfSets.splice(setIndex, 1);
      updateStartWorkoutExercise(_exercise, superSetIndex, exerciseIndex);



    } else {
      const _exercise = { ...exercise };
      _exercise.numOfSets.splice(setIndex, 1);
      updateStartWorkoutExercise(_exercise);
    }
  };

  return sets?.map((set, setIndex) => {
    return (
      <View style={styles.sets} key={" Set View" + setIndex}>
        <TextInput
          key={exercise._id + "setInput"}
          label="Set"
          value={(setIndex + 1).toString()}
          editable={false}
          mode="outlined"
          style={styles.set}
        />
        <TextInput
          key={exercise._id + "weight"}
          label="Weight"
          defaultValue={set.weight}
          mode="outlined"
          style={styles.weight}
          keyboardType="number-pad"
        />
        <TextInput
          key={exercise._id + "reps"}
          label="Reps"
          defaultValue={set.reps}
          mode="outlined"
          style={styles.rep}
          keyboardType="numeric"
        />
        {setIndex > 0 && (
          <IconButton
            key={exercise._id + "delete"}
            icon="delete"
            onPress={() => handleDeleteSet(setIndex)}
            size={20}
          />
        )}
      </View>
    );
  });
});

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
