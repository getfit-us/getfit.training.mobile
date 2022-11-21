import React, { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import RenderExercises from "./RenderExercises";
import { useWorkouts } from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";

const RenderWorkout = () => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  

  useEffect(() => {
    navigation.setOptions({
      title: startWorkout?.name,
    });

    return () => {
      navigation.setOptions({
        title: "Completed Workouts",
      });
    }
  }, [startWorkout, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        
        {/* <Text style={styles.title}>{JSON.stringify(startWorkout)}</Text> */}
        <RenderExercises
         
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
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
});

export default RenderWorkout;
