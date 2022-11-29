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

const RenderWorkout = memo(({ screenOptions }) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  const clientId = useProfile((state) => state.profile.clientId);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [addExercises, setAddExercises] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const exercises = useWorkouts((state) => state.exercises);
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [showSaveWorkout, setShowSaveWorkout] = React.useState(false);
  const [checked, setChecked] = React.useState([]);

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

  const fabActions = [
    {
      icon: "plus",
      label: addExercises ? "Close Add Exercise" : "Add Exercises",
      style: addExercises ? styles.fabClose : styles.fabOpen,
      onPress: () => {
        setAddExercises((prev) => !prev);
      },
    },
     {
      icon: "plus-circle",
      label: "Add Selected Exercises",

      onPress: () => {
        exercises.forEach((exercise) => {
          if (checked.includes(exercise._id)) {
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
        setChecked([]);
      },
    },
    {
      icon: "content-save",
      label: "Save Workout",
      color: "green",
      onPress: () => {
        handleShowSaveWorkout();
      },
    },
  ];

  const handleSaveWorkout = (Feedback) => {
    //need to set   loading..  true
    setStatus({ ...status, loading: true });
    const completedWorkout = { ...startWorkout, id: clientId };
    saveCompletedWorkout(axiosPrivate, completedWorkout).then((res) => {
      if (!res.error && !res.loading) {
        setStatus({ ...status, loading: false });
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
    navigation.setOptions({
      title: `Workout: ${startWorkout?.name}`,

      titleStyle: {
        textAlign: "center",
        justifyContent: "flex-start",
        alignContent: "center",
      },
      headerRight: () => (
        <IconButton
          icon="close"
          iconColor="red"
          onPress={() => {
            setStartWorkout({
              name: "",
              exercises: [],
            });
          }}
        />
      ),
      tabBarStyle: { display: "none" },
    });
    setHasUnsavedChanges(true);

    return () => {
      navigation.setOptions({
        ...screenOptions,
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
  }, [startWorkout, navigation]);

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure to discard them and leave the screen?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  return (
    <SafeAreaView style={styles.container}>
      <SaveWorkout
        visible={showSaveWorkout}
        hideDialog={handleShowSaveWorkout}
        handleSaveWorkout={handleSaveWorkout}
      />
      <ScrollView style={styles.ScrollView}>
        <RenderExercises />
        <FabGroup
          visible={screenFocused ? true : false}
          handleOpen={handleFabOpen}
          open={fabOpen}
          actions={fabActions}
        />
      </ScrollView>
      {addExercises ? (
        <SearchExercises setAddExercises={setAddExercises} checked={checked} />
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
