import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useProfile } from "../Store/Store";
import { Avatar } from "react-native-paper";
import { BASE_URL } from "../assets/BASE_URL";

const CustomDrawer = (props) => {
  const profile = useProfile((state) => state.profile);
  const roles = useProfile((state) => state.profile.roles);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          source={require("../assets/drawer.png")}
          style={styles.drawerImage}
        >
          <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
          {profile?.avatar ? (
            <Avatar.Image
              size={75}
              source={{ uri: `${BASE_URL}/avatar/${profile?.avatar}` }}
              style={styles.avatar}
              
              
            />
          ) : (
            <Avatar.Icon size={75} icon="account" style={styles.avatar} />
          )}
          </TouchableOpacity>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.account}>Account Type: {roles.includes(2) ? 'Client' : roles.includes(10) ? 'Admin' : 'Trainer'}</Text>

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

  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  account: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
