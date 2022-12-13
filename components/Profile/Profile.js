import React from "react";
import { View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { useProfile } from "../../Store/Store";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Text,
  TextInput,
} from "react-native-paper";
import { BASE_URL } from "../../assets/BASE_URL";
import { colors } from "../../Store/colors";
import * as ImagePicker from "expo-image-picker";
import { saveNewProfileImage } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { updateProfile as updateProfileApi } from "../Api/services";
const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const updateProfile = useProfile((state) => state.updateProfile);
  const measurements = useProfile((state) => state.measurements);
  const [loading, setLoading] = React.useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [accountEdit, setAccountEdit] = React.useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);

    updateProfileApi(axiosPrivate, {
      id: profile.clientId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      age: profile.age,
      phone: profile.phone,
    }).then((status) => {
      if (!status.loading && !status.error) {
        setLoading(false);
        setAccountEdit(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,

        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", {
          uri:
            Platform.OS === "android"
              ? result.uri
              : result.uri.replace("file://", ""),
          type: "image/jpeg",
          name: "profileImg.jpg",
        });
        formData.append("id", profile.clientId);

        saveNewProfileImage(axiosPrivate, formData).then((status) => {
          if (!status.loading && !status.error) {
            updateProfile({ avatar: status.data.message });
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../../assets/ProfileBackground.png")}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <View style={styles.buttonContainer}>
          <Button
            mode="text"
            icon="image"
            style={styles.button}
            textColor="white"
            onPress={handleFileUpload}
          >
            {profile?.avatar ? "Change Profile Image" : "Add Profile Image"}
          </Button>
         
        </View>
        <Text variant="titleSmall" style={styles.title}>
          Joined: {profile.startDate}
        </Text>

        {loading ? (
          <ActivityIndicator animating={loading} color={colors.white} />
        ) : profile?.avatar && !loading ? (
          <Avatar.Image
            size={80}
            source={{ uri: `${BASE_URL}/avatar/${profile?.avatar}` }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
        )}
      </ImageBackground>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>Account Details</Text>
        <TextInput
          mode="flat"
          label="First Name"
          onChangeText={(text) => {
            console.log(text);
            updateProfile({ firstName: text.toString() });
            setAccountEdit(true);
          }}
          defaultValue={profile?.firstName}
          placeholderTextColor={colors.white}
          style={styles.input}
        />
        <TextInput
          mode="flat"
          label="Last Name"
          defaultValue={profile?.lastName}
          onChangeText={(text) => {
            updateProfile({ lastName: text });
            setAccountEdit(true);
          }}
          style={styles.input}
        />
        <TextInput
          mode="flat"
          label="Email"
          defaultValue={profile?.email}
          onChangeText={(text) => {
            updateProfile({ email: text });
            setAccountEdit(true);
          }}
          style={styles.input}
        />
        <TextInput
          mode="flat"
          label="Phone Number"
          defaultValue={profile?.phone}
          onChangeText={(text) => {
            updateProfile({ phone: text });
            setAccountEdit(true);
          }}
          style={styles.input}
        />
        <TextInput
          mode="flat"
          label="Age"
          defaultValue={profile?.age.toString()}
          onChangeText={(text) => {
            updateProfile({ age: text });
            setAccountEdit(true);
          }}
          style={styles.input}
        />
      </View>

      {accountEdit && (
        <Button
          mode="elevated"
          style={{ alignSelf: "center", margin: 10 }}
          textColor={colors.white}
          buttonColor={colors.success}
          onPress={() => {
            handleUpdateProfile();
          }}
        >
          Save Changes
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "white",
    alignSelf: "center",
    backgroundColor: "black",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    margin: 5,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
    marginTop: 7,
  },
  backgroundImage: {
    backgroundColor: colors.black,
    height: 200,
  },
  infoContainer: {
    marginTop: 45,
  },
  input: {
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "transparent",
    color: "white",
  },
  button: {
    margin: 5,
    maxWidth: "45%",
  },
});

export default Profile;
