import React, { memo, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import { Button, IconButton } from "react-native-paper";
import SearchExercises from "../Exercises/SearchExercises";
import { saveCompletedWorkout } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const RenderWorkout = memo(() => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  const clientId = useProfile((state) => state.profile.clientId);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [addExercises, setAddExercises] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);

  const handleSaveWorkout = () => {
    //need to set loading..  true

    const completedWorkout = { ...startWorkout, id: clientId };

    saveCompletedWorkout(axiosPrivate, completedWorkout).then((res) => {
      if (!res.error && !res.loading) {
        setStartWorkout(null);
        navigation.goBack();
        addCompletedWorkout(res.data);
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
          onPress={() => {
            setStartWorkout({});
            navigation.navigate("Completed Workouts");
          }}
        />
      ),
      tabBarStyle: { display: "none" },
    });

    return () => {
      navigation.setOptions({
        title: "Completed Workouts",
        headerRight: () => null,
        tabBarStyle: { display: "flex" },
      });
    };
  }, [startWorkout, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        <RenderExercises />
      </ScrollView>
      {addExercises ? (
        <SearchExercises setAddExercises={setAddExercises} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => setAddExercises((prev) => !prev)}
            mode="contained"
            style={{ margin: 5 }}
            buttonColor="#ebab34"
          >
            Add Exercises
          </Button>
          <Button
            mode="contained"
            style={{ margin: 5 }}
            buttonColor="#ebab34"
            onPress={handleSaveWorkout}
          >
            Finish Workout
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
    backgroundColor: "#d9d5db",
  },
});

export default RenderWorkout;
