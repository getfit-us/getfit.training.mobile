import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";

const ProfileImageDialog = ({ visible, hideDialog }) => {
 

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Paragraph>This is simple dialog</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ProfileImageDialog;

const styles = StyleSheet.create({});
