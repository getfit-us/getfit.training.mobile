import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card, Button } from "react-native-paper";
import RenderSets from "./RenderSets";
import ExerciseMenu from "./ExerciseMenu";
import { useWorkouts } from "../../Store/Store";
const RenderSuperSet = ({ superSet, superSetIndex }) => {

  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );
  const handleAddSet = (exerciseIndex) => {
    const _exercise = { ...startWorkout.exercises[superSetIndex][exerciseIndex] };
    _exercise.numOfSets.push({ weight: 0, reps: 0 });
    updateStartWorkoutExercise(_exercise, superSetIndex);
  };
  return (
    <Card
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 10,
        position: "relative",
        borderLeftColor: "#A30B37",
        borderLeftWidth: 5,
      }}
    >
      <Card.Title title={"SuperSet"} 
      titleStyle={{fontWeight: "bold",
    color: "green",}}
      />
      <Card.Content>
        {superSet.map((exercise, index) => {
          return (
            <>
              <ExerciseMenu
                exercise={exercise}
                key={exercise._id + " SuperSet menu"}
              />

              <Text style={styles.exerciseTitle}
              key={exercise._id + "exercise title"}
              >{exercise.name}</Text>
              <RenderSets
                sets={exercise.numOfSets}
                exercise={exercise}
                exerciseIndex={index}
                key={exercise._id + " SuperSet render sets"}
              />

              <View style={styles.buttons} 
              key={exercise._id + " SuperSet buttons"}
              >
                <Button
                  key={exercise._id + "add set button"}
                  style={styles.add}
                  mode="contained"
                  onPress={() => handleAddSet(index)}

                >
                  Add Set
                </Button>
                <Button
                  key={exercise._id + "history button"}
                  style={styles.history}
                  mode="contained"
                  onPress={() => console.log("Pressed")}
                >
                  History
                </Button>
              </View>
            </>
          );
        })}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  superSet: {},
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
    marginTop: 10,
  },
  exerciseTitle: {
    marginBottom: 10,
    fontWeight: "bold",
    color: "#A30B37",
  },
});

export default RenderSuperSet;
