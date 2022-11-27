import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Card, Button, Snackbar, TextInput, Banner } from "react-native-paper";
import RenderSets from "./RenderSets";
import ExerciseMenu from "./ExerciseMenu";
import { useWorkouts } from "../../Store/Store";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
const RenderSuperSet = ({ superSet, superSetIndex, handleChangeOrder }) => {
  const updateStartWorkoutSuperSet = useWorkouts(
    (state) => state.updateStartWorkoutSuperSet
  );
  const startWorkout = useWorkouts((state) => state.startWorkout);

  const inSuperSet = true;
  // this is different because we are one level deeper inside superset
  const handleAddSet = (exerciseIndex) => {
    const _exercise = { ...superSet[exerciseIndex] };
    _exercise.numOfSets.push({ weight: 0, reps: 0 });
    updateStartWorkoutSuperSet(_exercise, superSetIndex, exerciseIndex);
  };
  const [notification, setNotification] = React.useState("");
  const [bannerVisible, setBannerVisible] = React.useState(false);
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
       <Banner
       elevation={3}
      visible={bannerVisible}
      actions={[
      
        {
          label: 'Dismiss',
          onPress: () => setBannerVisible(false),
        },
      ]}
      style={{marginBottom: 5,}}
    >
     Perform exercises back to back. Without rest between the exercises. Rest after completing a set of each exercise.
    </Banner>
     
      <TouchableOpacity
        onPress={() => {

          //this is not working great needs to be fixed
         
          setBannerVisible(prev => !prev);
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
      <TextInput
            label="Set Exercise Order"
            defaultValue={(superSetIndex + 1).toString()}
            onChangeText={(text) => {
              if (
                text !== "" &&
                startWorkout.exercises
                  .map((exercise, index) => index + 1)
                  .includes(parseInt(text))
              ) {
                handleChangeOrder(superSetIndex, parseInt(text) - 1);
              }
            }}
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 10, maxWidth: "60%" }}
          />
        {superSet.map((exercise, index) => {
          return (
            <View 
            key={exercise._id + "superset View"}
            style={{ position: "relative", marginTop: 30 }}>
              
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
                  buttonColor="#3483eb"
                  mode="contained"
                  icon="plus"

                  onPress={() => handleAddSet(index)}
                >
                  ADD SET
                </Button>
                <Button
                  key={exercise._id + "history button"}
                  style={styles.history}
                  mode="contained"
                  icon="history"
                  onPress={() => console.log("Pressed")}
                >
                  EXERCISE HISTORY
                </Button>
              </View>
            </View>
          );
        })}
      </Card.Content>
      
    </Card>
   
        </>
  );
};

const styles = StyleSheet.create({
  superSet: {},
  add: {
    marginLeft: 1,
    marginRight: 3,
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
  },
  history: {
  
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
