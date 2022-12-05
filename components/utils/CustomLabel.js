import { StyleSheet, Text, View } from "react-native";
import React from "react";

const CustomLabel = ({ title }) => {
  return <Text
  style={styles.label}
  >{title}</Text>;
};

export default CustomLabel;

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: "bold",
    },

});
