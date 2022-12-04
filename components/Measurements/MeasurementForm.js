import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Button, RadioButton, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const MeasurementForm = () => {
  const [files, setFiles] = React.useState({});
  const [cameraPermission, setCameraPermission] = React.useState(null);
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [imageViewPoint, setImageViewPoint] = React.useState({});

  const handleImageViewChange = (value, index) => {
    console.log(imageViewPoint);

    setImageViewPoint((prev) => ({ ...prev, [index]: value }));
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 3,

        aspect: [4, 3],
        quality: 1,
      });

      if (
        !result.cancelled &&
        result?.selected &&
        result?.selected.length <= 3
      ) {
        setFiles(result.selected);
      } else if (result?.selected?.length > 3) {
        alert(
          "You can only upload up to 3 images (Front view, Side view ,Back view)"
        );
        console.log("You can only upload 3 images");
      } else {
        console.log("single file", result);
        setFiles(result);
      }
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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    console.log("show date picker");
    setShow((prev) => !prev);
  };

  useEffect(() => {
    //going to request permission for camera access
    requestPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <Button icon={"calendar"} mode="contained" onPress={showDatepicker}>
            Select Date
          </Button>
          {show ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              onChange={handleDateChange}
            />
          ) : (
            <Text style={{ alignSelf: "center", margin: 10 }}>
              {date.toDateString()}
            </Text>
          )}
          <TextInput
            keyboardType="numeric"
            right={<TextInput.Affix text="lbs" />}
            label={"Weight"}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            keyboardType="numeric"
            right={<TextInput.Affix text="Percent" />}
            label={"Body Fat"}
            mode="outlined"
            style={styles.input}
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

          {files?.length > 0 ? (
            <View style={styles.imageContainer}>
              {files?.map((file, index) => (
                <View style={styles.singleImage}>
                  <Image
                    key={file.uri}
                    source={{ uri: file.uri }}
                    style={styles.image}
                    resizeMethod="resize"
                    resizeMode="contain"
                  />
                  <RadioButton.Group
                    onValueChange={(value) => handleImageViewChange(value, index)}
                    value={imageViewPoint[index]}

                  >
                    <View style={styles.radioGroup}>
                      <Text>Front</Text>
                      <RadioButton value="front" 
                      
                      />
                      <Text>Side</Text>
                      <RadioButton value="side" />
                      <Text>Back</Text>
                      <RadioButton value="Back" />
                    </View>
                 
                  </RadioButton.Group>
                </View>
              ))}
            </View>
          ) : files?.uri ? (
            <Image source={{ uri: files.uri }} style={styles.image} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  form: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 10,
  },
  input: {
    width: "50%",
    margin: 2,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    margin: 5,
  },
  singleImage: {
    borderWidth: 1,
    borderColor: "black",
    margin: 5,
    padding: 5,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  
});
export default MeasurementForm;
