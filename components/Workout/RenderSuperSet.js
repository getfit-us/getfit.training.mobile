import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card, Button, Snackbar } from "react-native-paper";
import RenderSets from "./RenderSets";
import ExerciseMenu from "./ExerciseMenu";
import { useWorkouts } from "../../Store/Store";
import SnackBarComponent from "./Dialogs/SnackBar";
const RenderSuperSet = ({ superSet, superSetIndex }) => {
  const updateStartWorkoutSuperSet = useWorkouts(
    (state) => state.updateStartWorkoutSuperSet
  );

  const inSuperSet = true;
  // this is different because we are one level deeper inside superset
  const handleAddSet = (exerciseIndex) => {
    const _exercise = { ...superSet[exerciseIndex] };
    _exercise.numOfSets.push({ weight: 0, reps: 0 });
    updateStartWorkoutSuperSet(_exercise, superSetIndex, exerciseIndex);
  };
  const [notification, setNotification] = React.useState("");
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  return (
    <>
    <Card
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 10,

        borderLeftColor: "#3483eb",
        borderLeftWidth: 9,
      }}
    >
     
      <TouchableOpacity
        onPress={() => {
          setNotification(
            "Do all exercises in this superset without rest in between each exercise"
          );
          setShowSnackBar(true);
        }}
      >
        <Card.Title
          title={"  Super Set "}
          titleStyle={{
            fontWeight: "bold",
            backgroundColor: "#3483eb",
            padding: 5,
            borderRadius: 15,
            width: "40%",
            marginRight: "auto",
            marginLeft: "auto",
            color: "white",
            textAlign: "center",
            alignSelf: "center",
          }}
        />
     
      </TouchableOpacity>
      <Card.Content>
        {superSet.map((exercise, index) => {
          return (
            <View style={{ position: "relative", marginTop: 30 }}>
              
              <ExerciseMenu
                exercise={exercise}
                inSuperSet={inSuperSet}
                superSetIndex={superSetIndex}
                exerciseIndex={index}
                key={exercise._id + " SuperSet menu"}
              />

              <Text
                style={styles.exerciseTitle}
                key={exercise._id + "exercise title"}
              >
                {exercise.name}
              </Text>
              <RenderSets
                sets={exercise.numOfSets}
                exercise={exercise}
                exerciseIndex={index}
                inSuperSet={inSuperSet}
                superSetIndex={superSetIndex}
              />

              <View
                style={styles.buttons}
                key={exercise._id + " SuperSet View buttons"}
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
            </View>
          );
        })}
      </Card.Content>
      
    </Card>
        <SnackBarComponent message={notification}
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
        />
        </>
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
    color: "#3483eb",
  },
});

export default RenderSuperSet;
