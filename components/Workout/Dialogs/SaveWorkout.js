import React from 'react'
import { Dialog, Portal, Button } from 'react-native-paper'
import { View } from 'react-native'

const SaveWorkout = ({visible, hideDialog, handleSaveWorkout}) => {
  return (
    <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Save Workout</Dialog.Title>
            <Dialog.Content>
                

            </Dialog.Content>
            <Dialog.Actions>
                <View style={{flex: 1 ,alignContents: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button 
              icon={'content-save'}
              buttonColor='green'
              textColor='white'
              onPress={handleSaveWorkout}>Save</Button>
              <Button 
              buttonColor='red'
                textColor='white'
              onPress={hideDialog}>Cancel</Button>
                </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>
  )
}

export default SaveWorkout