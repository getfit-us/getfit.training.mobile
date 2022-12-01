import React, { memo, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import { Button, IconButton, ProgressBar } from "react-native-paper";
import SearchExercises from "../Exercises/SearchExercises";
import { saveCompletedWorkout } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SaveWorkout from "./Dialogs/SaveWorkout";
import FabGroup from "../utils/FabGroup";
import { colors } from "../../Store/colors";
import { useIsFocused } from "@react-navigation/native";
import shallow from "zustand/shallow";

const RenderWorkout = memo(({  }) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  const clientId = useProfile((state) => state.profile.clientId);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [addExercises, setAddExercises] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showSaveWorkout, setShowSaveWorkout] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");

  const [checkedExercises, setCheckedExercises] = React.useState({
    exercises: [],
    checked: [],
  });
  const addStartWorkoutExercise = useWorkouts(
    (state) => state.addStartWorkoutExercise
  );
  const screenFocused = useIsFocused();
  const [status, setStatus] = React.useState({
    loading: false,
    error: false,
    message: "",
  });
  const [fabOpen, setFabOpen] = React.useState(false);

  const handleShowSaveWorkout = () => {
    setShowSaveWorkout((prev) => !prev);
  };

  const handleFabOpen = () => {
    setFabOpen((prev) => !prev);
  };

  //icons for floating action button group

  const fabActions = [
    {
      icon: addExercises && checkedExercises.checked?.length === 0 ? "close":  "plus",
      label:
        addExercises && checkedExercises.checked?.length > 0
          ? "Add Selected"
          : addExercises && checkedExercises.checked?.length === 0
          ? "Close Exercise Search"
          : "Add Exercise",
      style: addExercises && checkedExercises.checked?.length > 0 ? {backgroundColor: colors.secondary} :addExercises && checkedExercises.checked?.length === 0 ? {backgroundColor: colors.error} : {backgroundColor: colors.secondary},
      onPress: () => {
        if (addExercises && checkedExercises?.checked?.length > 0) {
          const currentExerciseIds = startWorkout.exercises.map((exercise) => {
            return exercise._id;
          });
          checkedExercises?.exercises.forEach((exercise) => {
            if (
              checkedExercises?.checked?.includes(exercise._id) &&
              !currentExerciseIds.includes(exercise._id)
            ) {
              // console.log("exercise", exercise);
              addStartWorkoutExercise({
                ...exercise,
                numOfSets: [
                  { weight: 0, reps: 0 },
                  { weight: 0, reps: 0 },
                  { weight: 0, reps: 0 },
                ],
              });
            }
          });
          //clear checked array after adding exercises
          setCheckedExercises({ exercises: [], checked: [] });
        }

        setAddExercises((prev) => !prev);
      },
    },

    {
      icon: "content-save",
      label: "Save Workout",
      style: { backgroundColor: colors.success },
      onPress: () => {
        handleShowSaveWorkout();
      },
    },
  ];

  const handleSaveWorkout = () => {
    //need to set   loading..  true
    setStatus({ ...status, loading: true });
    const completedWorkout = {
      ...startWorkout,
      id: clientId,
      rating: rating,
      feedback: feedback,
    };

    saveCompletedWorkout(axiosPrivate, completedWorkout).then((res) => {
      if (!res.error && !res.loading) {
        setStatus({ ...status, loading: false });
        console.log(res.data);
        addCompletedWorkout(res.data); // add to local state
        setStartWorkout({
          name: "",
          exercises: [],
        }); // clear workout
        navigation.goBack();
      }
    });
  };

  useEffect(() => {
    if (screenFocused) {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
      });
    }

    return () => {
      navigation.setOptions({
        
        tabBarActiveTintColor: "rgb(8, 97, 164)",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 2,
          borderTopColor: "rgb(8, 97, 164)",
          elevation: 3,
          shadowOpacity: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      });
      navigation.navigate("Start Workout");
    };
  }, [navigation, screenFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <SaveWorkout
        visible={showSaveWorkout}
        hideDialog={handleShowSaveWorkout}
        handleSaveWorkout={handleSaveWorkout}
        setRating={setRating}
        rating={rating}
        feedback={feedback}
        setFeedback={setFeedback}
      />
      <ScrollView style={styles.ScrollView}>
        <Text style={styles.title}>{startWorkout?.name.toUpperCase()}</Text>
        <RenderExercises />
        <FabGroup
          visible={screenFocused ? true : false}
          handleOpen={handleFabOpen}
          open={fabOpen}
          actions={fabActions}
        />
      </ScrollView>
      {addExercises ? (
        <SearchExercises
          setAddExercises={setAddExercises}
          setCheckedExercises={setCheckedExercises}
          checkedExercises={checkedExercises}
        />
      ) : null}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d5db",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ScrollView: {
    width: "100%",
  },
  fabOpen: {
    backgroundColor: colors.primaryLight,
  },
  fabClose: {
    backgroundColor: colors.error,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    borderBottomColor: "black",
    borderTopWidth: 4,
    width: "100%",
    justifyContent: "space-evenly",
  },
});

export default RenderWorkout;
