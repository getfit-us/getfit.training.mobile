import React, { useRef } from "react";
import { Menu, Button, Divider, IconButton } from "react-native-paper";
import { useWorkouts } from "../../Store/Store";
import AddNote from "./Dialogs/AddNote";

const ExerciseMenu = ({ exercise }) => {
  const updateStartWorkoutExercise = useWorkouts(
    (state) => state.updateStartWorkoutExercise
  );
  const deleteStartWorkoutExercise = useWorkouts(
    (state) => state.deleteStartWorkoutExercise
  );
  const [notesVisible, setNotesVisible] = React.useState(false);
  const openMenu = (event) => {
    const { nativeEvent } = event;
    const anchor = {
      x: nativeEvent.pageX,
      y: nativeEvent.pageY,
    };

    setMenuAnchor(anchor);

    setVisible(true);
  };
  const closeMenu = () => setVisible(false);

  const [visible, setVisible] = React.useState(false);

  const showNotesDialog = () => setNotesVisible(true);

  const hideNotesDialog = () => setNotesVisible(false);

  const handleAddNote = () => {
    console.log(exercise.name);
    showNotesDialog();
    closeMenu();
  };
  const [menuAnchor, setMenuAnchor] = React.useState({ x: 0, y: 0 });

  const handleDeleteExercise = () => {
    deleteStartWorkoutExercise(exercise);
    closeMenu();
  };

  return (
    <>
      <AddNote
        hideNotesDialog={hideNotesDialog}
        showNotesDialog={showNotesDialog}
        notesVisible={notesVisible}
        exercise={exercise}
      />
      <IconButton
        icon="menu"
        onPress={openMenu}
        style={{ position: "absolute", top: -60, right: -10 }}
        key={exercise._id + "menuIcon"}
      />
      {exercise?.notes && (
        <IconButton
          icon="note-text"
          onPress={showNotesDialog}
          style={{ position: "absolute", top: -60, right: 30 }}
        />
      )}
      <Menu visible={visible} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={handleAddNote}
          title={exercise?.notes ? "Edit Notes" : "Create Notes"}
        />
        <Menu.Item onPress={() => {}} title="Super Set" />
        <Divider />
        <Menu.Item onPress={handleDeleteExercise} title="Delete Exercise" />
      </Menu>
    </>
  );
};

export default ExerciseMenu;
