import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View , Image} from "react-native";
import { Button, Banner, TextInput } from "react-native-paper";
import SearchExercises from "../Exercises/SearchExercises";
import { useWorkouts, useProfile } from "../../Store/Store";
import RenderExercises from "./RenderExercises";
import { saveNewCustomWorkout } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CreateWorkout = ({ navigation }) => {
  const [showAddExercises, setShowAddExercises] = React.useState(false);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const axiosPrivate = useAxiosPrivate();
  const clientId = useProfile((state) => state.profile.clientId);
  const addCustomWorkout = useWorkouts((state) => state.addCustomWorkout);
  const [bannerVisible, setBannerVisible] = React.useState(false);
  const [status, setStatus] = React.useState({
    loading: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    setStartWorkout({ name: "New Workout", exercises: [] });

   
  }, []);

console.log(startWorkout)

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
          setStartWorkout({});
          addCustomWorkout(res.data);
          navigation.navigate("Activity Feed");
        }
      }
    );
  };

  return (
    <><Banner
    visible={bannerVisible}
    actions={[
      {
        label: 'ok',
        onPress: () => setBannerVisible(false),
      },
    
    ]}
    // icon={({size}) => (
    //   <Image
    //     source={{
    //       uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
    //     }}
    //     style={{
    //       width: size,
    //       height: size,
    //     }}
    //   />
    // )}
    >
    {status.message}
  </Banner>
      <ScrollView style={styles.container}>
        <TextInput
          name="workoutName"
          label="Workout Name"
          value={startWorkout?.name}
          onChangeText={(text) =>
            setStartWorkout({ ...startWorkout, name: text })
          }
          mode="outlined"
          style={{ margin: 15 }}
          placeholder="Workout Name"
        />
        <RenderExercises />
      </ScrollView>
      <View>
        {showAddExercises ? (
          <SearchExercises setAddExercises={setShowAddExercises} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => setShowAddExercises((prev) => !prev)}
              mode="contained"
              style={{ margin: 15 }}
            >
              Add Exercises
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveWorkout}
              style={{ margin: 15 }}
            >
              Save Workout
            </Button>
          </View>
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
});

export default CreateWorkout;
