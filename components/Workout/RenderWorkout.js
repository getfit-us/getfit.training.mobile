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

const RenderWorkout = memo(({ screenOptions }) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  const clientId = useProfile((state) => state.profile.clientId);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [addExercises, setAddExercises] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);
  const [showSaveWorkout, setShowSaveWorkout] = React.useState(false);
  const [status, setStatus] = React.useState({
    loading: false,
    error: false,
    message: "",
  });
  const handleShowSaveWorkout = () => {
    setShowSaveWorkout((prev) => !prev);
  };

  const handleSaveWorkout = () => {
    //need to set   loading..  true
    setStatus({ ...status, loading: true });

    const completedWorkout = { ...startWorkout, id: clientId };

    saveCompletedWorkout(axiosPrivate, completedWorkout).then((res) => {
      if (!res.error && !res.loading) {
        setStatus({ ...status, loading: false });
        addCompletedWorkout(res.data); // add to local state
        setStartWorkout(null); // clear workout
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
            setStartWorkout({});
          }}
        />
      ),
      tabBarStyle: { display: "none" },
    });

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
    };
  }, [startWorkout, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <SaveWorkout visible={showSaveWorkout} hideDialog={handleShowSaveWorkout} handleSaveWorkout={handleSaveWorkout} />
      <ScrollView style={styles.ScrollView}>
        <RenderExercises />
      </ScrollView>
      {addExercises ? (
        <SearchExercises setAddExercises={setAddExercises} />
      ) : (
        <View style={styles.buttonContainer}>
          <ProgressBar indeterminate visible={status.loading} />
          <Button
            onPress={() => setAddExercises((prev) => !prev)}
            mode="contained"
            style={{ margin: 5 }}
            buttonColor="#326fa8"
          >
            Add Exercises
          </Button>
          <Button
            mode="contained"
            style={{ margin: 5 }}
            buttonColor="green"
            onPress={handleShowSaveWorkout}
          >
            Complete Workout
          </Button>
        </View>
      )}
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
