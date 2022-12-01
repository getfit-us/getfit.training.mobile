import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Paragraph, Text } from "react-native-paper";
import { Rating } from "react-native-ratings";

import { useProfile, useWorkouts } from "../../Store/Store";

const ViewActivity = ({ route, navigation }) => {
  const viewWorkout = useWorkouts((state) => state.viewWorkout);
  const viewMeasurement = useProfile((state) => state.viewMeasurement);
  let newDate;

  const displayWorkout = (
    <View style={styles.container}>
   
      <Text variant="titleLarge" style={styles.title}>
        {" "}
        Workout Name: {viewWorkout?.name}
      </Text>
      {viewWorkout?.dateCompleted && (
        <Text variant="titleMedium" style={styles.date}>
          {" "}
          Date Completed: {viewWorkout?.dateCompleted}
        </Text>
      )}
      {viewWorkout?.dateCompleted && viewWorkout?.feedback && (
        <>
          <Text style={styles.title}>Workout Feedback Notes</Text>
          <Paragraph style={{marginTop: 40, marginBottom: 30}}>{viewWorkout?.feedback}</Paragraph>
        </>
      )}
      {viewWorkout?.rating && (
        <>
        <Text style={styles.title}>Workout Rating</Text>
        <Rating readonly startingValue={viewWorkout?.rating} 
        style={{marginTop: 5, marginBottom: 30}}/>
        </>
      )}
      {viewWorkout && viewWorkout?.exercises?.map((exercise, ei) => {
        //check if its a superset

        return Array.isArray(exercise) ? (
          <View style={styles.superSet} key={ei + 'SuperSet View'}>
            <Text
              variant="titleLarge"
              style={{
                marginBottom: 3,
                marginTop: 3,
                textAlign: "center",
                color: "blue",
                textDecorationLine: "underline",
              }}
              key={exercise._id + 'superset Exercise Title'}
            >
              Super Set
            </Text>
            {exercise?.map((superSet, superSetIndex) => {
              return (
                //superset exercise
                <View key={superSet._id + 'view superset title' +  superSetIndex}
                
                >
                  <Text variant="titleMedium" style={styles.exercise}>
                    {superSet.name}
                  </Text>
                  {superSet?.notes && <Text style={styles.notes}>{superSet.notes}</Text>}

                  {superSet?.numOfSets?.map((set, setIndex) => {
                    return (
                      <View
                        key={setIndex + 'superSet View'+ superSet._id}
                        style={{
                          flexDirection: "row",
                          marginBottom: 3,
                        
                        }}
                      >
                        <Text
                          key={'set info'+ exercise._id + 'superset Exercise'}
                        style={styles.setLabel}>
                          Set#{" "}
                          <Text style={styles.setInfo}>{setIndex + 1}</Text>
                        </Text>

                        <Text style={styles.setLabel}>
                          {" "}
                          Weight:{" "}
                          <Text style={styles.setInfo}>{set.weight} </Text>{" "}
                          (lbs){" "}
                        </Text>
                        <Text style={styles.setLabel}>
                          Reps: <Text style={styles.setInfo}>{set.reps}</Text>
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : exercise?.type === "cardio" ? ( //cardio exercise
          <View key={exercise._id + 'cardio View'}>
            <Text variant="titleMedium" style={styles.exercise}
            key={exercise._id + 'cardio Exercise Title'}>
              {exercise.name}
            </Text>
            {exercise?.notes && <Text style={styles.notes}>{exercise?.notes}</Text>}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 3,
              }}
              key={exercise._id + 'cardio second View'}
            >
              <Text style={styles.setLabel}>
                {" "}
                Level:{" "}
                <Text style={styles.setInfo}>
                  {exercise.numOfSets[0].level}
                </Text>
              </Text>
              <Text style={styles.setLabel}>
                {" "}
                Duration:{" "}
                <Text style={styles.setInfo}>
                  {exercise.numOfSets[0].minutes} (mins)
                </Text>{" "}
              </Text>
              <Text style={styles.setLabel}>
                {" "}
                Heart Rate:{" "}
                <Text style={styles.setInfo}>
                  {exercise.numOfSets[0].heartRate} (bpm)
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          //regular exercise
          <View key={exercise._id + 'view title'}  style={{marginBottom: ei === viewWorkout?.exercises?.length -1 ? 20 : 0}}>
            <Text variant="titleMedium" style={styles.exercise}>
              {exercise.name}
            </Text>
            {exercise?.notes && <Text style={styles.notes}>{exercise.notes}</Text>}
            {exercise?.numOfSets?.map((set, i) => (
              <View
                key={i + 'view set' + exercise._id}
                style={{
                  flexDirection: "row",
                  marginBottom: 3,
                  justifyContent: "center",
                }}
              >
                <Text style={styles.setLabel}>
                  Set# <Text style={styles.setInfo}>{i + 1} </Text>
                </Text>

                <Text style={styles.setLabel}>
                  {" "}
                  Weight: <Text style={styles.setInfo}>{set.weight} (lbs)</Text>
                </Text>
                <Text style={styles.setLabel}>
                  {" "}
                  Reps: <Text style={styles.setInfo}>{set.reps}</Text>{" "}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  const displayMeasurement = (
    <View style={styles.container}>
      <Text variant="titleLarge">Measurement</Text>

      <Text variant="titleMedium" style={styles.title}>
        {viewMeasurement?.message}
      </Text>
      <Text style={styles.setLabel}>
        Date: <Text style={styles.setInfo}>{viewMeasurement?.date}</Text>
      </Text>
      {viewMeasurement?.weight && (
        <Text style={styles.setLabel}>
          Weight:{" "}
          <Text style={styles.setInfo}>{viewMeasurement?.weight} (lbs)</Text>
        </Text>
      )}
      {viewMeasurement?.bodyfat && (
        <Text>Bodyfat: {viewMeasurement?.bodyfat}</Text>
      )}
    </View>
  );

  return (
    <>
      <ScrollView>
        {viewWorkout?.name ? displayWorkout : displayMeasurement}
      </ScrollView>
    </>
  );
};

export default ViewActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    height: "100%",
   

  },
  superSet: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 5,
    borderColor: "#2780B8",
    padding: 10,
    borderRadius: 15,
    margin: 10,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  setLabel: {
    fontWeight: "bold",
  },
  setInfo: {
    color: "#B92F27",
    fontWeight: "bold",
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  exercise: {
    marginBottom: 4,
    marginTop: 3,
    textAlign: "center",
    color: "243A37",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  date: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#243A37",
  },
  notes: {
    fontStyle: "italic",
    marginBottom: 10,
    alignSelf: "center",
    fontSize: 15,
    marginRight: 10,
    marginLeft: 10,
  },
});
