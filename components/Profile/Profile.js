import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useProfile } from "../../Store/Store";
import { Avatar, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "../../assets/BASE_URL";
const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);
  const measurements = useProfile((state) => state.measurements);
  const [currentWeight, setCurrentWeight] = React.useState(0);

  React.useEffect(() => {
    if (measurements?.length !== 0) {
      setCurrentWeight(measurements[0].weight);
    } else {
      setCurrentWeight("No weight recorded");
    }
  }, [measurements]);


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.header}
      />
      <Card style={styles.card}>
        <View style={styles.avatarContainer}>
          {profile?.avatar ? (
            <Avatar.Image
              size={80}
              source={{ uri: `${BASE_URL}/avatar/${profile?.avatar}` }}
            />
          ) : (
            <Avatar.Icon size={100} icon="account" />
          )}
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={styles.label}>
              Age
              <Text style={styles.info}> {profile.firstName}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.label}>
          Age
          <Text style={styles.info}> {profile.firstName}</Text>
        </Text>
        <Text style={styles.label}>
          Last Name: <Text style={styles.info}>{profile.lastName}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.info}>{profile.email}</Text>
        </Text>
        <Text style={styles.label}>
          Phone: <Text style={styles.info}>{profile.phone}</Text>
        </Text>
        <Text style={styles.label}>
          Age: <Text style={styles.info}>{profile.age}</Text>
        </Text>
        <Text style={styles.label}>
          Current Weight: <Text style={styles.info}> {currentWeight}</Text>
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
  },
  card: {
    margin: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#a9a9a9 ",
  },
  info: {
    fontSize: 15,
    fontWeight: "normal",
    color: "firebrick",
    alignSelf: "end",
    marginLeft: 10,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default Profile;
