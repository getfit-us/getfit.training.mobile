import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

const MeasurementForm = () => {

    const [files, setFiles] = React.useState([]);
    const [status, requestPermission] = ImagePicker.useCameraPermissions();

    const handleFileUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            setFiles(result);
        } catch (err) {
            console.log(err);
            
          
        }
    };

 


  return (
    <ScrollView >
      <View style={styles.container}>
        <Text>Add a Measurement</Text>
        <TextInput label={"Weight"} mode='outlined' />
      <TextInput label={"Body Fat"} mode='outlined'/>

      <Button onPress={handleFileUpload}>Add Image</Button>



      </View>

     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,

    },

})
export default MeasurementForm;
