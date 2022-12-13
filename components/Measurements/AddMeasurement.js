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
import { useProfile } from "../../Store/Store";
import { addMeasurementApi } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { colors } from "../../Store/colors";
import { measure } from "react-native-reanimated";

const AddMeasurement = ({ navigation }) => {
  const [files, setFiles] = React.useState({});
  const [cameraPermission, setCameraPermission] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const initialMeasurementState = {
    weight: null,
    date: null,
    image: [
      {
        uri: null,
        view: "front",
      },
      {
        uri: null,
        view: "side",
      },
      {
        uri: null,
        view: "back",
      },
    ],
  };
  const [measurement, setMeasurement] = React.useState(initialMeasurementState);
  const clientId = useProfile((state) => state.profile.clientId);

  const setStatus = useProfile((state) => state.setStatus);

  const axiosPrivate = useAxiosPrivate();

  const status = useProfile((state) => state.status);

  const validateMeasurement = () => {
    if (!measurement || !measurement.weight) {
      alert("Please fill in your current weight");
      return false;
    }
    if (!measurement.date) {
      alert("Please Select a date");
      return false;
    }
    if (measurement?.image?.length > 1) {
      //check if view points are filled

      //check if all view points are filled with different views
      const viewPoints = measurement.image.map((img) => img.view);
      const uniqueViewPoints = [...new Set(viewPoints)];
      if (uniqueViewPoints.length !== viewPoints.length) {
        alert("Please select a different view point for each image");
        return false;
      }
    }
    return true;
  };

  const handleSaveWorkout = () => {
    //verify if all fields are filled

    if (validateMeasurement()) {
      const formData = new FormData();
      if (Array.isArray(measurement.image)) {
        //need to loop over images and append based on view point

        measurement.image.forEach((img, i) => {
          formData.append(
            "image",

            {
              uri:
                Platform.OS === "android"
                  ? img.uri
                  : img.uri.replace("file://", ""),
              type: "image/jpeg",
              name: "measurement.jpg",
            }
          );
        });
      } else {
        formData.append("image", {
          uri:
            Platform.OS === "android"
              ? measurement.image.uri
              : measurement.image.uri.replace("file://", ""),
          type: "image/jpeg",
          name: "measurement.jpg",
        });
      }
      formData.append("front", "front.jpg");
      formData.append("side", "side.jpg");
      formData.append("back", "back.jpg");

      formData.append("weight", measurement.weight);
      formData.append("date", new Date(measurement.date).toISOString());
      formData.append("id", clientId);

      console.log("formData", formData);

      addMeasurementApi(axiosPrivate, formData).then((status) => {
        if (!status.loading && !status.error) {
          setStatus({ loading: false, error: null, success: true });
          setTimeout(() => {
            setStatus({ loading: false, error: null, success: false });
            setFiles(null);
            setMeasurement(initialMeasurementState);
            navigation.navigate("Activity Feed");
          }, 3000);
        } else {
          setStatus({
            loading: false,
            error: true,
            success: false,
            message:
              status.data.response.status === 409
                ? "Measurement already exists"
                : "Something went wrong",
          });
        }
      });
    }
  };

  const handleImageViewChange = (value, index) => {
    setMeasurement((prev) => ({
      ...prev,
      files: [...files, (files[index].view = value)],
    }));
  };

  const handleFile = async () => {
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
        //add view point to each image need to fix this! -----------------
        result.selected.forEach((img, index, arr) => {
          arr[index].view =
            index === 0 ? "front" : index === 1 ? "side" : "back";
        });
        console.log("multiple files", result);
        setFiles(result.selected);
        setMeasurement((prev) => ({ ...prev, image: result.selected }));
      } else if (result?.selected?.length > 3) {
        alert(
          "You can only upload up to 3 images (Front view, Side view ,Back view)"
        );
        console.log("You can only upload 3 images");
      } else {
        console.log("single file", result);
        setFiles(result);
        setMeasurement((prev) => ({ ...prev, image: result }));
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
        setMeasurement((prev) => ({ ...prev, image: result }));
      } catch (err) {}
    } else {
      requestPermission();
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setMeasurement((prev) => ({ ...prev, date: currentDate }));
  };

  const showDatepicker = () => {
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
          {show ? (
            <DateTimePicker
              testID="dateTimePicker"
              value={date ? date : new Date()}
              mode="date"
              is24Hour={true}
              onChange={handleDateChange}
            />
          ) : (
            <Text style={{ alignSelf: "center", margin: 10 }}>
              Measurement Date: {date ? date.toDateString() : "Select Date"}
            </Text>
          )}
          <Button
            icon={"calendar"}
            mode="elevated"
            onPress={showDatepicker}
            style={styles.button}
          >
            Select Date
          </Button>

          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              right={<TextInput.Affix text="lbs" />}
              label={"Weight"}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                setMeasurement((prev) => ({ ...prev, weight: text }))
              }
            />
            <TextInput
              keyboardType="numeric"
              right={<TextInput.Affix text="Percentage" />}
              label={"Body Fat"}
              mode="outlined"
              style={styles.input}
              onChangeText={(text) =>
                setMeasurement((prev) => ({ ...prev, bodyFat: text }))
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="elevated"
              onPress={handleFile}
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
          </View>

          {status.success ? (
            <Text style={{ color: "green", alignSelf: "center" }}>
              Measurement Added Successfully
            </Text>
          ) : status.error ? (
            <Text style={{ color: "red", alignSelf: "center" }}>
              {status.message}
            </Text>
          ) : null}

          {files?.length > 0 ? (
            <View style={styles.imageContainer}>
              {files?.map((file, fileIndex) => (
                <View style={styles.singleImage} key={file.uri + "View"}>
                  <Image
                    key={file.uri}
                    source={{ uri: file.uri }}
                    style={styles.image}
                    resizeMethod="resize"
                    resizeMode="contain"
                  />
                  <Text style={{ alignSelf: "center" }}>
                    {measurement?.image[fileIndex].view === "front"
                      ? "Orientation: Front"
                      : measurement?.image[fileIndex].view === "side"
                      ? "Orientation: Side"
                      : "Orientation: Back"}
                  </Text>
                  <RadioButton.Group
                    onValueChange={(value) =>
                      handleImageViewChange(value, fileIndex)
                    }
                    value={measurement?.image[fileIndex]?.view}
                    key={file.uri + "Radio"}
                  >
                    <View style={styles.radioGroup}>
                      <Text>Front</Text>
                      <RadioButton value="front" />
                      <Text>Side</Text>
                      <RadioButton value="side" />
                      <Text>Back</Text>
                      <RadioButton value="back" />
                    </View>
                  </RadioButton.Group>
                </View>
              ))}
            </View>
          ) : files?.uri ? (
            <Image
              resizeMode="contain"
              source={{ uri: files.uri }}
              style={styles.image}
            />
          ) : null}
          {measurement?.date && measurement?.weight && (
            <Button
              mode="elevated"
              onPress={handleSaveWorkout}
              icon="content-save"
              textColor="white"
              buttonColor={colors.success}
              style={styles.button}
            >
              Save{" "}
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
  input: {
    width: "50%",
    margin: 2,
    marginRight: 1,
    marginLeft: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
export default AddMeasurement;
