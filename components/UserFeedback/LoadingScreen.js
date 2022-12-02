import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { colors } from "../../Store/colors";

import { useProfile } from "../../Store/Store";

export default function LoadingScreen({ title, icon }) {
  const status = useProfile((state) => state.status);
  const setStatus = useProfile((state) => state.setStatus);

  // going to do a simple api call to verify the token is still valid
  // if it is, then we will set the status to true
  // if it is not, then we will delete the token and set the status to false

  useEffect(() => {
    setStatus({loading: false})
      }, []);

  return (
    <View>
      <IconButton
        icon={icon}
        color={colors.primary}
        size={100}
        style={{ margin: 30, alignSelf: "center" }}
      />

      <Text style={styles.title}>{title}</Text>
      <ActivityIndicator
        animating={true}
        color={colors.primaryLight}
        size="large"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    margin: 30,
  },
});
