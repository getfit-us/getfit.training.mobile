import React, { memo, useCallback } from "react";
import { Card, Button, IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import RenderSets from "./RenderSets";
import { useWorkouts } from "../../Store/Store";
import ExerciseMenu from "./ExerciseMenu";
import RenderSuperSet from "./RenderSuperSet";


const RenderExercises = memo(() => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );

  const handleAddSet = (exerciseIndex) => {
    const _exercise = { ...startWorkout.exercises[exerciseIndex] };
    _exercise.numOfSets.push({ weight: 0, reps: 0 });
    updateStartWorkoutExercise(_exercise);
  };

  return startWorkout?.exercises?.map((exercise, index) => {
    return Array.isArray(exercise) ? (
      <RenderSuperSet superSet={exercise} key={index + "superset"} />
    ) : (
    <Card
      key={exercise._id}
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 10,
        position: "relative",
      }}
    >
      <Card.Title title={exercise.name} />
      <Card.Content>
        <ExerciseMenu exercise={exercise} key={exercise._id + "menu"} />

        <RenderSets
          sets={exercise.numOfSets}
          exercise={exercise}
          exerciseIndex={index}
        />

        <View style={styles.buttons}>
          <Button
            key={index + "add"}
            style={styles.add}
            mode="contained"
            onPress={() => handleAddSet(index)}
          >
            Add Set
          </Button>
          <Button
            key={index + "history"}
            style={styles.history}
            mode="contained"
            onPress={() => console.log("Pressed")}
          >
            History
          </Button>
        </View>
      </Card.Content>
    </Card>
  )});

});

const styles = StyleSheet.create({
  add: {
    marginLeft: 3,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
});
export default RenderExercises;
