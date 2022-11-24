import React, { memo, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import RenderExercises from "./RenderExercises";
import { useWorkouts } from "../../Store/Store";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

const RenderWorkout = memo(() => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const navigation = useNavigation();
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  

  useEffect(() => {
    navigation.setOptions({
      title: `Workout: ${startWorkout?.name}`,
      titleStyle: {
        textAlign: "center",
        justifyContent: "flex-start",
        alignContent: "center",
      },
      headerRight: () => (
        <IconButton icon="close" onPress={() => {
          setStartWorkout({});
          navigation.navigate('Completed Workouts')}} />
      ),
      tabBarStyle: {display: 'none'}
      
    });

    return () => {
      navigation.setOptions({
        title: "Completed Workouts",
        headerRight: () => null,
        tabBarStyle: {display: 'flex'}      });
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
});

export default RenderWorkout;
