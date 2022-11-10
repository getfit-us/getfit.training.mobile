import { View } from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
} from "react-native-paper";

const ViewMeasurementModal = ({ viewWorkout, open, handleModal, status }) => {
  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={open} onDismiss={handleModal}>
            <Dialog.Title>
              {" "}
              {!viewWorkout[0]?.dateCompleted && "New Workout Created"}
              Name: {viewWorkout[0]?.name}
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>This is simple dialog</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleModal}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default ViewMeasurementModal;
