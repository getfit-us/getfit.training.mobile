import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View , Image} from "react-native";
import { Button, Banner, TextInput } from "react-native-paper";
import SearchExercises from "../Exercises/SearchExercises";
import { useWorkouts, useProfile } from "../../Store/Store";
import RenderExercises from "./RenderExercises";
import { saveNewCustomWorkout } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import FabGroup from "../utils/FabGroup";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../../Store/colors";


const CreateWorkout = ({ navigation }) => {
  const [showAddExercises, setShowAddExercises] = React.useState(false);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const setStartWorkoutName = useWorkouts((state) => state.setStartWorkoutName);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const addStartWorkoutExercise = useWorkouts((state) => state.addStartWorkoutExercise);
  const axiosPrivate = useAxiosPrivate();
  const clientId = useProfile((state) => state.profile.clientId);
  const addCustomWorkout = useWorkouts((state) => state.addCustomWorkout);
  const [bannerVisible, setBannerVisible] = React.useState(false);
  const screenFocused = useIsFocused();
  const [fabOpen, setFabOpen] = React.useState(false);
  const [checkedExercises, setCheckedExercises] = React.useState({
    exercises: [],
    checked: [],
  });
  const [status, setStatus] = React.useState({
    loading: false,
    error: false,
    message: "",
  });

   const handleFabOpen = () => {
    setFabOpen((prev) => !prev);
  };




  const handleSaveWorkout = () => {
    if (startWorkout.name === "" || startWorkout?.exercises?.length === 0) {
      setStatus({ ...status, message: "Please add a Workout Name , the workout must contain at least one exercise." });
      setBannerVisible(true);
      return;
    }

    setStatus({ ...status, loading: true });
    saveNewCustomWorkout(axiosPrivate, { ...startWorkout, id: clientId }).then(
      (res) => {
        if (!res.error && !res.loading) {
          setStatus({ ...status, loading: false });
          setStartWorkout({
            name: "",
            exercises: [],
          });
          console.log(res.data)
          addCustomWorkout(res.data);
          navigation.navigate("Activity Feed");
        }
        if (res.error) {
          setStatus({ ...status, loading: false, error: true, message: res.message });
          console.log("error", res.message);
          setBannerVisible(true);
        }
      }
    );
  };


  const fabActions = [
    {
      icon: "plus",
      label:
        showAddExercises && checkedExercises.checked?.length > 0
          ? "Add Selected"
          : showAddExercises && checkedExercises.checked?.length === 0
          ? "Close Exercise Search"
          : "Add Exercise",
      style: showAddExercises ? styles.fabClose : styles.fabOpen,
      onPress: () => {
        if (showAddExercises && checkedExercises?.checked?.length > 0) {
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

        setShowAddExercises((prev) => !prev);
      },
    },

    {
      icon: "content-save",
      label: "Save Workout",
      style: { backgroundColor: colors.success },
      onPress: () => {
        handleSaveWorkout();
      },
    },
  ];

  return (
    <><Banner
    visible={bannerVisible}
    actions={[
      {
        label: 'ok',
        onPress: () => setBannerVisible(false),
      },
    
    ]}

    >
    {status.message}
  </Banner>
      <ScrollView style={styles.container}>
        <TextInput
          name="workoutName"
          label="Workout Name"
          value={startWorkout?.name}
          onChangeText={(text) => {
            setStartWorkoutName(text);
          }
           
          }
          mode="outlined"
          style={{ margin: 15 }}
          placeholder="Workout Name"
        />
        <RenderExercises />
        <FabGroup
          visible={screenFocused ? true : false}
          handleOpen={handleFabOpen}
          open={fabOpen}
          actions={fabActions}
        />
      </ScrollView>
      <View>
        {showAddExercises ? (
          <SearchExercises 
          setCheckedExercises={setCheckedExercises}
          checkedExercises={checkedExercises}
          setAddExercises={setShowAddExercises} />
        ) : (
        null
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d5db",

    width: "100%",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d9d5db",
    flexDirection: "row",
  },
  fabOpen: {
    backgroundColor: colors.primaryLight,
  },
  fabClose: {
    backgroundColor: colors.error,
  },
});

export default CreateWorkout;
