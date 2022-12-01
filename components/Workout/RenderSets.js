import React, { memo, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useWorkouts } from "../../Store/Store";
import { colors } from "../../Store/colors";

const RenderSets = memo(
  ({ sets, exercise, exerciseIndex, inSuperSet, superSetIndex }) => {
    const updateStartWorkoutExercise = useWorkouts(
      (state) => state.updateStartWorkoutExercise
    );
    const updateStartWorkoutSuperSet = useWorkouts(
      (state) => state.updateStartWorkoutSuperSet
    );
    const startWorkoutExercise = inSuperSet
      ? useWorkouts(
          (state) => state.startWorkout.exercises[superSetIndex][exerciseIndex]
        )
      : useWorkouts((state) => state.startWorkout.exercises[exerciseIndex]);

    const handleDeleteSet = (setIndex) => {
      if (inSuperSet) {
        const _exercise = { ...exercise };
        _exercise.numOfSets.splice(setIndex, 1);

        updateStartWorkoutSuperSet(_exercise, superSetIndex, exerciseIndex);
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
            value={startWorkoutExercise.numOfSets[setIndex].weight}
            mode="outlined"
            selectTextOnFocus={true}
            style={styles.weight}
            keyboardType="number-pad"
            onChangeText={(e) => {
              const _exercise = { ...exercise };
              _exercise.numOfSets[setIndex].weight = e;

              if (inSuperSet) {
                updateStartWorkoutSuperSet(
                  _exercise,
                  superSetIndex,
                  exerciseIndex
                );
              } else {
                updateStartWorkoutExercise(_exercise);
              }
            }}
          />

          <TextInput
            key={exercise._id + "reps"}
            label="Reps"
            value={startWorkoutExercise.numOfSets[setIndex].reps}
            mode="outlined"
            selectTextOnFocus={true}

            style={styles.rep}
            keyboardType="numeric"
            onChangeText={(e) => {
              const _exercise = { ...exercise };
              _exercise.numOfSets[setIndex].reps = e;

              if (inSuperSet) {
                updateStartWorkoutSuperSet(
                  _exercise,
                  superSetIndex,
                  exerciseIndex
                );
              } else {
                updateStartWorkoutExercise(_exercise);
              }
            }}
          />
          {setIndex > 0 && (
            <IconButton
              key={exercise._id + "delete"}
              icon="delete"
              onPress={() => handleDeleteSet(setIndex)}
              size={20}
              iconColor={colors.error}
            />
          )}
        </View>
      );
    });
  }
);

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
