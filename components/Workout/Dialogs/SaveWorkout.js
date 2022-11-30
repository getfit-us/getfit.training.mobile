import React from "react";
import { Dialog, Portal, Button, TextInput } from "react-native-paper";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../../../Store/colors";
import { Rating } from "react-native-ratings";

const SaveWorkout = ({
  visible,
  hideDialog,
  handleSaveWorkout,
  rating,
  setRating,
  feedback,
  setFeedback,
}) => {
  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Save Workout</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Workout Feedback"
            mode="outlined"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            multiline={true}
            numberOfLines={4}
            style={{ padding: 10 }}
          />

          <Rating
            defaultRating={0}
            onFinishRating={setRating}
            style={styles.rating}
            showRating
            tintColor="rgb(215, 230, 245)"
          />
        </Dialog.Content>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <Button
            icon={"content-save"}
            buttonColor="green"
            textColor="white"
            onPress={handleSaveWorkout}
          >
            Save
          </Button>
          <Button buttonColor="red" textColor="white" onPress={hideDialog}>
            Cancel
          </Button>
        </View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  rating: {
    paddingVertical: 20,
    padding: 10,
    borderRadius: 5,
  },
  dialog: {},
});

export default SaveWorkout;
