import React, { useRef } from "react";
import { Menu, Button, Divider, IconButton } from "react-native-paper";
import { useWorkouts } from "../../Store/Store";
import AddNote from "./Dialogs/AddNote";
import CreateSuperSet from "./Dialogs/CreateSuperSet";

const ExerciseMenu = ({
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
  const [visibleSuperSetDialog, setVisibleSuperSetDialog] =
    React.useState(false);
  const hideSupersetDialog = () => setVisibleSuperSetDialog(false);
  const showSupersetDialog = () => {
    setVisibleSuperSetDialog(true);
    closeMenu();
  };

  const showNotesDialog = () => setNotesVisible(true);
  const hideNotesDialog = () => setNotesVisible(false);
  const handleAddNote = () => {
    showNotesDialog();
    closeMenu();
  };
  const [menuAnchor, setMenuAnchor] = React.useState({ x: 0, y: 0 });
  const handleDeleteExercise = () => {
    deleteStartWorkoutExercise(exercise, superSetIndex);
    closeMenu();
  };

  const menuTopPosition = inSuperSet ? -15 : -60;
  const menuRightPosition = inSuperSet ? -20 : -10;
  const notesIconTopPosition = inSuperSet ? -15 : -60;
  const notesIconRightPosition = inSuperSet ? 25 : 30;

  return (
    <>
      <AddNote
        hideNotesDialog={hideNotesDialog}
        showNotesDialog={showNotesDialog}
        notesVisible={notesVisible}
        exercise={exercise}
        inSuperSet={inSuperSet}
        superSetIndex={superSetIndex}
        exerciseIndex={exerciseIndex}
        key={exercise._id + "notes dialog"}
      />
      <CreateSuperSet
        visibleSuperSetDialog={visibleSuperSetDialog}
        hideSupersetDialog={hideSupersetDialog}
        inSuperSet={inSuperSet}
        superSetIndex={superSetIndex}
        key={exercise._id + "superset dialog"}
      />
      <IconButton
        icon="menu"
        onPress={openMenu}
        style={{
          position: "absolute",
          top: menuTopPosition,
          right: menuRightPosition,
        }}
        key={exercise._id + "menuIcon"}
      />
      {exercise?.notes && (
        <IconButton
          icon="note-text"
          onPress={showNotesDialog}
          style={{
            position: "absolute",
            top: notesIconTopPosition,
            right: notesIconRightPosition,
          }}
        />
      )}
      <Menu visible={visible} onDismiss={closeMenu} anchor={menuAnchor}>
        <Menu.Item
          onPress={handleAddNote}
          title={exercise?.notes ? "Edit Notes" : "Create Notes"}
        />
        <Menu.Item onPress={showSupersetDialog} title="Super Set" />
        <Divider />
        <Menu.Item onPress={handleDeleteExercise} title="Delete Exercise" />
      </Menu>
    </>
  );
};

export default ExerciseMenu;
