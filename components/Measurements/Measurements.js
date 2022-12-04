import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { getMeasurements } from "../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import MeasurementForm from "./MeasurementForm";
import { useProfile } from "../../Store/Store";
// component to add a new measurement

const Measurements = () => {
  const [loadingMeasurements, measurements, errorMeasurements] =
    useApiCallOnMount(getMeasurements);
  const stateMeasurements = useProfile((state) => state.measurements);
  return (
    <ScrollView>
      <Text style={styles.title}>Measurements</Text>
      <MeasurementForm />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    margin: 30,
  },
});

export default Measurements;
