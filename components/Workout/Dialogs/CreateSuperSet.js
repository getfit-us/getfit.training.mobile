import React, { useEffect } from "react";
import { Button, Checkbox, Dialog, Portal } from "react-native-paper";
import { useWorkouts } from "../../../Store/Store";
import { List } from "react-native-paper";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const CreateSuperSet = ({
  visibleSuperSetDialog,
  hideSupersetDialog,
  inSuperSet,
  superSetIndex,
}) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const setStartWorkout = useWorkouts((state) => state.setStartWorkout);
  const [checked, setChecked] = React.useState([]);

  useEffect(() => {
    //on load set superset Exercises to checked
    const _checked = [...checked];

    if (inSuperSet) {
      //add superset exercise ids to checked array
      const superSet = startWorkout.exercises[superSetIndex];
      superSet.forEach((exercise) => {
        if (!_checked.includes(exercise._id)) {
          _checked.push(exercise._id);
        }
      });
      setChecked(_checked);
    }
  }, [inSuperSet, startWorkout.exercises[superSetIndex]?.length]); 

  const handleAddSuperSet = () => {
    //if we are in a superset, we need to add the exercise to the superset if its not already there, if in superset and exercise is unchecked we need to remove it from the superset

    if (inSuperSet) {
      let _superSet = [...startWorkout.exercises[superSetIndex]];
      const _checked = [...checked];
      let _startWorkout = { ...startWorkout };
      // remove unchecked exercises from superset
      _superSet = _superSet.filter((exercise) => {
        if (!_checked.includes(exercise._id)) {
          // if not checked add to regular exercises array
          _startWorkout.exercises.push(exercise);

          return false;
        }
        return true;
      });
      // add checked exercises to superset
      _startWorkout.exercises = _startWorkout.exercises.filter((exercise) => {
        if (_checked.includes(exercise._id)) {
          _superSet.push(exercise);
          return false;
        }
        return true;
      });
      // remove unchecked exercises from superset

      //remove superset if empty or only 1 exercise
      if (_superSet?.length <= 1) {
        console.log("removing superset no exercises left");
        _superSet.forEach((exercise) => {
          _startWorkout.exercises.push(exercise);
        });
        _startWorkout.exercises.splice(superSetIndex, 1);
      } else {
        console.log(_superSet);
        _startWorkout.exercises[superSetIndex] = _superSet;
      }
    

      setStartWorkout(_startWorkout);
    } else {
      // not in a superset so we need to create a new superset and add the exercises from checked into it
      const _exercises = [...startWorkout.exercises];
      const _superSet = [];
      const new_exercises = _exercises.filter((exercise, index) => {
        if (checked.includes(exercise._id) && checked?.length > 1) {
          _superSet.push(exercise);
          // remove from checked array
          setChecked((prev) => prev.filter((id) => id !== exercise._id));
          return false;
        }
        return true;
      });
      if (_superSet?.length > 1) {
        new_exercises.push(_superSet);
      }

      setStartWorkout({ ...startWorkout, exercises: new_exercises });
    }

    hideSupersetDialog();
  };

  const handleCheck = (id) => {
    const _checked = [...checked];

    if (_checked.includes(id)) {
      const index = _checked.indexOf(id);
      if (index > -1) {
        _checked.splice(index, 1);
      }
    } else {
      _checked.push(id);
    }

    setChecked(_checked);
  };

  return (
    <Portal>
      <Dialog visible={visibleSuperSetDialog} onDismiss={hideSupersetDialog}>
        <Dialog.Title>
          {inSuperSet
            ? "Uncheck to remove  or check to add to current superset"
            : "Create Super Set or Giant Set"}
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            {startWorkout.exercises.map((exercise, index) =>
              Array.isArray(exercise) ? (
                <View style={styles.superSet} key={index + "view"}>
                  <Text key={index + "text"}>
                    {index === superSetIndex ? "Current SuperSet" : "SuperSet"}
                  </Text>
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
                  key={exercise._id + "listitem"}
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

            <Button onPress={handleAddSuperSet}>Save</Button>
            <Button onPress={hideSupersetDialog}>Exit</Button>
          </ScrollView>
        </Dialog.ScrollArea>
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
