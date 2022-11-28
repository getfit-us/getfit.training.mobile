import React from "react";
import {
  Dialog,
  Portal,
  Button,
  TextInput,
  ToggleButton,
} from "react-native-paper";
import { View } from "react-native";

const SaveWorkout = ({ visible, hideDialog, handleSaveWorkout }) => {
  return (
    <Portal>
      <Dialog style={{}} visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Save Workout</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Workout Feedback"
            mode="outlined"
            multiline={true}
            numberOfLines={4}
            style={{ backgroundColor: "white", padding: 10 }}
          />
          <ToggleButton.Row
            onValueChange={(value) => console.log(value)}
            value={null}
            style={{ marginTop: 10, marginBottom: 10 , justifyContent: 'center'}}

          >
            <ToggleButton
             
              size={40}
              icon="emoticon-sad"
              value="sad"
              style={{ margin: 5, color: 'green' }}
            />
            <ToggleButton size={40} icon="emoticon-neutral" value="neutral" />
            <ToggleButton size={40} icon="emoticon-happy" value="happy" />
          </ToggleButton.Row>
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

export default SaveWorkout;
