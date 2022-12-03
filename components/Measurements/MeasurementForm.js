import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";

const MeasurementForm = () => {
  const [files, setFiles] = React.useState({});
  const [cameraPermission, setCameraPermission] = React.useState(null);

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3,

        aspect: [4, 3],
        quality: 1,
      });
      setFiles(result);
    } catch (err) {
      console.log(err);
    }
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setCameraPermission(false);
    } else {
      setCameraPermission(true);
    }
  };

  const handleTakePhoto = async () => {
    if (cameraPermission) {
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        setFiles(result);
      } catch (err) {}
    } else {
      requestPermission();
    }
  };

  useEffect(() => {
    //going to request permission for camera access
    requestPermission();
  }, []);

  console.log(files.selected);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Add a Measurement</Text>
        <TextInput
          keyboardType="numeric"
          right={<TextInput.Affix text="lbs" />}
          label={"Weight"}
          mode="outlined"
        />
        <TextInput
          keyboardType="numeric"
          right={<TextInput.Affix text="Percent" />}
          label={"Body Fat"}
          mode="outlined"
        />

        <Button
          mode="elevated"
          onPress={handleFileUpload}
          style={styles.button}
          icon="image"
        >
          Add Image
        </Button>
        <Button
          mode="elevated"
          onPress={handleTakePhoto}
          style={styles.button}
          icon="camera"
        >
          Take Photo
        </Button>


    <Image source={}></Image>
        {files?.selected?.length > 0 && (
          <View style={styles.imageContainer}>
            {files?.selected?.map((file) => (
              <Image
                key={file.uri}
                source={{ uri: file.uri }}
                style={styles.image}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    margin: 10,
  },
});
export default MeasurementForm;
