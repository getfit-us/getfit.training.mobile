import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Paragraph, Text } from "react-native-paper";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

import { useProfile, useWorkouts } from "../../Store/Store";

const ViewActivity = ({ route, navigation }) => {
  const viewWorkout = useWorkouts((state) => state.viewWorkout);
  const viewMeasurement = useProfile((state) => state.viewMeasurement);

  const displayWorkout = (
    <View style={styles.container}>
      <Text>Workout</Text>
      {!viewWorkout?.dateCompleted && <Text> 'New Workout Created' </Text>}
      <Text>Name: {viewWorkout?.name}</Text>
      {viewWorkout?.dateCompleted && (
        <>
          <Text>'Workout Feedback'</Text>
          <Paragraph>{viewWorkout?.feedback}</Paragraph>
        </>
      )}
      {viewWorkout?.exercises.map((exercise) => {
        //check if its a superset

        return Array.isArray(exercise) ? (
          <View style={styles.superSet}>
            <Text variant="titleMedium" style={{marginBottom: 3}}>Super Set</Text>
            {exercise.map((superSet, superSetIndex) => {
              return (
                <View key={superSet._id}>
                  <Text variant="titleSmall">{superSet.name}</Text>

                  {superSet?.numOfSets?.map((set, setIndex) => {
                    return (
                      <View key={setIndex}>
                        <Text>Reps: {set.reps}</Text>
                        <Text>Weight: {set.weight} (lbs)</Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : exercise.type === "cardio" ? (
          <View key={exercise._id}>
            <Text variant="titleSmall">{exercise.name}</Text>
            <Text> Level: {exercise.numOfSets[0].level}</Text>
            <Text> Duration: {exercise.numOfSets[0].minutes} (mins)</Text>
            <Text> Heart Rate: {exercise.numOfSets[0].heartRate} (bpm)</Text>
          </View>
        ) : (
          <View key={exercise._id}>
            <Text variant="titleSmall">{exercise.name}</Text>
            {exercise?.numOfSets?.map((set, i) => (
              <View key={i}>
                <Text>Set {i + 1}</Text>

                <Text>Weight: {set.weight} (lbs)</Text>
                <Text>Reps: {set.reps}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  //   const displayMeasurement = (
  //     <View>
  //       <Text>Measurement</Text>
  //       <Text>{viewMeasurement.name}</Text>
  //     </View>
  //   );

  return (
    <>
      <ScrollView>{viewWorkout?.name ? displayWorkout : null}</ScrollView>
    </>
  );
};

export default ViewActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
    superSet: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    }
    
});
