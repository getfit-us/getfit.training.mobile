import React, { memo, useCallback } from "react";
import { Card, Button, IconButton, TextInput } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import RenderSets from "./RenderSets";
import { useWorkouts } from "../../Store/Store";
import ExerciseMenu from "./ExerciseMenu";
import RenderSuperSet from "./RenderSuperSet";
import RenderCardio from "./RenderCardio";

const RenderExercises = memo(() => {
  const startWorkoutExercises = useWorkouts(
    (state) => state.startWorkout?.exercises
  );
  const setStartWorkoutExercises = useWorkouts(
    (state) => state.setStartWorkoutExercises
  );
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );

  const handleAddSet = (exerciseIndex) => {
    const _exercise = { ...startWorkoutExercises[exerciseIndex] };
    _exercise.numOfSets.push({ weight: 0, reps: 0 });
    updateStartWorkoutExercise(_exercise);
  };
  const handleChangeOrder = (currentIndex, newIndex) => {
    const _startWorkoutExercises = [...startWorkoutExercises];
    // remove the exercise from the array and save it in a variable
    const exercise = _startWorkoutExercises.splice(currentIndex, 1);
    // add to selected index
    _startWorkoutExercises.splice(newIndex, 0, exercise[0]);
    // console.log(_startWorkout.exercises);
    setStartWorkoutExercises(_startWorkoutExercises);
  };

  return startWorkoutExercises?.map((exercise, index) => {
    return Array.isArray(exercise) ? (
      <RenderSuperSet
        superSet={exercise}
        superSetIndex={index}
        key={index + "superset array"}
        handleChangeOrder={handleChangeOrder}
      />
    ) : exercise?.type === "cardio" ? (
      <RenderCardio exercise={exercise} />
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
        <Card.Title
          title={exercise.name}
          titleStyle={{ fontWeight: "bold", color: "black" }}
          titleNumberOfLines={2}
        />
        <Card.Content>
          <ExerciseMenu exercise={exercise} key={exercise._id + "menu"} />
          <TextInput
            label="Set Exercise Order"
            value={(index + 1).toString()}
            onChangeText={(text) => {
              if (
                text !== "" &&
                startWorkoutExercises
                  .map((exercise, index) => index + 1)
                  .includes(parseInt(text))
              ) {
                handleChangeOrder(index, parseInt(text) - 1);
              }
            }}
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 10, maxWidth: "60%" }}
          />

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
    );
  });
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
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
});
export default RenderExercises;
