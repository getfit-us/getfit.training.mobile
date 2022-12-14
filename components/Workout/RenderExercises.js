import React, { memo, useCallback } from "react";
import { Card, Button, IconButton, TextInput } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import RenderSets from "./RenderSets";
import { useWorkouts } from "../../Store/Store";
import ExerciseMenu from "./ExerciseMenu";
import RenderSuperSet from "./RenderSuperSet";
import RenderCardio from "./RenderCardio";
import { colors } from "../../Store/colors";
import { isNumber } from "lodash";

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


    console.log('change order', currentIndex, newIndex)
  // need to add check for characters.. this should be numbers only
    if (currentIndex === newIndex || newIndex < 1 || newIndex > startWorkoutExercises.length || !isNumber(newIndex)) return
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
      <RenderCardio exercise={exercise} key={"Render cardio" + index} />
    ) : (
      <Card
        key={exercise._id}
        style={{
          margin: 10,
          padding: 10,
          borderRadius: 10,
          position: "relative",
          marginBottom: index === startWorkoutExercises.length - 1 ? 100 : 10,
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
            defaultValue={(index + 1).toString()}
            onChangeText={(text) => {
              handleChangeOrder(index, parseInt(text) - 1);
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
              buttonColor={colors.primary}
              mode="elevated"
              textColor="white"
              icon="plus"
              onPress={() => handleAddSet(index)}
            >
              ADD SET
            </Button>
            <Button
              key={index + "history"}
              style={styles.history}
              buttonColor={colors.primary}
              textColor="white"
              icon="history"
              mode="elevated"
              onPress={() => console.log("Pressed")}
            >
              EXERCISE HISTORY
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
    width: 50,
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
});
export default RenderExercises;
