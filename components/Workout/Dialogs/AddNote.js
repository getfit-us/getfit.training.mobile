import { useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useWorkouts } from "../../../Store/Store";
import { StyleSheet } from "react-native";
import { colors } from "../../../Store/colors";

const AddNote = ({
  notesVisible,
  hideNotesDialog,
  exercise,
  inSuperSet,
  superSetIndex,
  exerciseIndex,
}) => {
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );
  const updateStartWorkoutSuperSet = useWorkouts(
    (state) => state.updateStartWorkoutSuperSet
  );
  const [note, setNote] = useState(exercise.notes);

  const handleAddNote = () => {
    if (inSuperSet) {
      const _exercise = { ...exercise };
      _exercise.notes = note;
      updateStartWorkoutSuperSet(_exercise, superSetIndex, exerciseIndex);
    } else {
      const _exercise = { ...exercise };
      _exercise.notes = note;
      updateStartWorkoutExercise(_exercise);
    }
    hideNotesDialog();
  };

  return (
    <Portal>
      <Dialog visible={notesVisible} onDismiss={hideNotesDialog}>
        <Dialog.Title>Add Exercise Notes</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Notes"
            mode="outlined"
            multiline={true}
            numberOfLines={4}
            defaultValue={exercise?.notes ? exercise.notes : ""}
            autoFocus
            id={exercise._id}
            onChangeText={(text) => setNote(text)}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.buttons}>
          <Button 
          icon={'content-save'}
          labelStyle={styles.buttonText}
          buttonColor={colors.success}
          textColor={colors.white}
           
          mode="elevated" onPress={handleAddNote}>
            Save
          </Button>
          <Button mode="elevated" 
          buttonColor={colors.error}
          textColor={colors.white}
          onPress={hideNotesDialog}>
            Exit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonText: {
    width: 60,
  },
});

export default AddNote;
