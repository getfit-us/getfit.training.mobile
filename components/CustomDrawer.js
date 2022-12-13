import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useProfile } from "../Store/Store";
import { Avatar,  Paragraph, Title } from "react-native-paper";
import { BASE_URL } from "../assets/BASE_URL";

const CustomDrawer = (props) => {
  const profile = useProfile((state) => state.profile) || {
    firstName: "Loading...",
    lastName: "Loading...",
    
  }
  const roles = useProfile((state) => state.profile.roles);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../assets/drawer.png")}
          style={styles.drawerImage}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile")}
          >
            <View style={styles.drawerHeader}>
              {profile?.avatar ? (
                <Avatar.Image
                  size={75}
                  source={{ uri: `${BASE_URL}/avatar/${profile?.avatar}` }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Icon size={75} icon="account" style={styles.avatar} />
              )}
              <Title style={styles.name}>
                {" "}
                {profile?.firstName[0].toUpperCase() +
                  profile?.firstName.slice(1)}{" "}
                {profile?.lastName[0].toUpperCase() +
                  profile?.lastName.slice(1)}
              </Title>
              <Paragraph style={styles.account}>
                {" "}
                {roles?.includes(2)
                  ? "Client"
                  : roles?.includes(10)
                  ? "Admin"
                  : "Trainer"}
              </Paragraph>
            </View>
          </TouchableOpacity>

          <DrawerItemList {...props} />
        </ImageBackground>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  avatar: {
    margin: 10,
    overflow: "hidden",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
  },
  card: {
    backgroundColor: "transparent",
    elevation: 5,
    margin: 10,
  },
  drawerHeader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  account: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
