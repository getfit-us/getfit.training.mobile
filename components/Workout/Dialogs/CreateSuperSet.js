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
}) => {
  const startWorkout = useWorkouts((state) => state.startWorkout);
  const [checked, setChecked] = React.useState([]);
  const handleAddSuperSet = () => {
    console.log(checked);
    hideSupersetDialog();
  };

  const handleCheck = (id) => {
    const _checked = [...checked];

    if (inSuperSet) {
      //do something different
    } else {
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
                <View style={styles.superSet}>
                  <Text> Current SuperSet</Text>
                  {exercise.map((exercise, index) => (
                    <List.Item
                      key={exercise._id}
                      title={exercise.name}
                      left={(props) => (
                        <Checkbox
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
