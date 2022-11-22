import{ useRef, useState } from 'react';
import { View } from 'react-native';
import { Button,  Dialog, Portal,  TextInput } from 'react-native-paper';
import { useWorkouts } from '../../../Store/Store';

const AddNote = ({notesVisible, hideNotesDialog, exercise}) => {
 
    const updateStartWorkoutExercise = useWorkouts((state) => state.updateStartWorkoutExercise);
    const [note, setNote] = useState(exercise.notes);

    const handleAddNote = () => {
        const _exercise = {...exercise};
       _exercise.notes = note;
        updateStartWorkoutExercise(_exercise);
        hideNotesDialog();
  
    }


   
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
                defaultValue={exercise?.notes ? exercise.notes : ''}
                autoFocus
                id={exercise._id}
                onChangeText={(text) => setNote(text)}
                
                />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleAddNote}>Save</Button>
              <Button
               onPress={hideNotesDialog}>Exit</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
  
  );
};

export default AddNote;