import React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";
import { useWorkouts } from "../../../Store/Store";
import { List } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";

const CreateSuperSet = ({
  visibleSuperSetDialog,
  hideSupersetDialog,
  inSuperSet,
  superSetIndex,
}) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [checked, setChecked] = React.useState([]);
  const handleAddSuperSet = () => {
    //if we are in a superset, we need to add the exercise to the superset if its not already there, if in superset and exercise is unchecked we need to remove it from the superset

    if (inSuperSet) {
    } else {
      // not in a superset so we need to create a new superset and add the exercises from checked into it
      const _exercises = [...startWorkout.exercises];
      const _superSet = [];
      const new_exercises = _exercises.filter((exercise, index) => {
        if (checked.includes(exercise._id)) {
          _superSet.push(exercise);
          // remove from checked array
          setChecked((prev) => prev.filter((id) => id !== exercise._id));
          return false;

        }
        return true;
      });
      new_exercises.push(_superSet);

      setStartWorkout({ ...startWorkout, exercises: new_exercises });
    }

    console.log(checked);
    hideSupersetDialog();
  };

  const handleCheck = (id) => {
    const _checked = [...checked];

    if (inSuperSet) {
      //add superset exercise ids to checked array
      const superSet = startWorkout.exercises[superSetIndex];
      superSet.forEach((exercise) => {
        if (!_checked.includes(exercise._id)) {
          _checked.push(exercise._id);
        }
      });
    } else {
      // not in superset
      if (_checked.includes(id)) {
        const index = _checked.indexOf(id);
        if (index > -1) {
          _checked.splice(index, 1);
        }
      } else {
        _checked.push(id);
      }
    }
    setChecked(_checked);
  };

  return (
    <Portal>
      <Dialog visible={visibleSuperSetDialog} onDismiss={hideSupersetDialog}>
        <Dialog.Title>
          {inSuperSet
            ? "Uncheck to remove current exercises or check to add additional"
            : "Create Super Set or Giant Set"}
        </Dialog.Title>
        <Dialog.Content>
          <View>
            {startWorkout.exercises.map((exercise, index) =>
              Array.isArray(exercise) ? (
                <View style={styles.superSet} key={index + "view"}>
                  <Text key={index + "text"}> Current SuperSet</Text>
                  {exercise.map((exercise, index) => (
                    <List.Item
                      key={exercise._id}
                      title={exercise.name}
                      left={(props) => (
                        <Checkbox
                          key={exercise._id + "checkbox"}
                          status={
                            checked.includes(exercise._id)
                              ? "checked"
                              : "unchecked"
                          }
                          {...props}
                          icon="checkbox-blank-circle-outline"
                          onPress={() => handleCheck(exercise._id)}
                        />
                      )}
                      titleStyle={{ fontWeight: "bold", color: "black" }}
                      titleNumberOfLines={2}
                    />
                  ))}
                </View>
              ) : (
                <List.Item
                  key={exercise._id}
                  title={exercise.name}
                  left={(props) => (
                    <Checkbox
                      key={exercise._id + "checkbox"}
                      status={
                        checked.includes(exercise._id) ? "checked" : "unchecked"
                      }
                      {...props}
                      icon="checkbox-blank-circle-outline"
                      onPress={() => handleCheck(exercise._id)}
                    />
                  )}
                  titleStyle={{ fontWeight: "bold", color: "black" }}
                  titleNumberOfLines={2}
                />
              )
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleAddSuperSet}>Save</Button>
          <Button onPress={hideSupersetDialog}>Exit</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  superSet: {
    backgroundColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});

export default CreateSuperSet;
