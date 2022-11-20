import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import RenderExercises from "./RenderExercises";

const RenderWorkout = ({ startWorkout }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        <Text style={styles.title}>{startWorkout.name}</Text>
        {/* <Text style={styles.title}>{JSON.stringify(startWorkout)}</Text> */}
        <RenderExercises startWorkout={startWorkout} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ScrollView: {
    width: "100%",
   
  },
  
});

export default RenderWorkout;
