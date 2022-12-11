import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getMeasurements } from "../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { useProfile } from "../../Store/Store";

const ViewMeasurements = () => {
    const [loadingMeasurements, measurements, errorMeasurements] =
    useApiCallOnMount(getMeasurements);
    const measurementState = useProfile((state) => state.measurements);

  return (
    <View>
      <Text>ViewMeasurements</Text>
    </View>
  );
};

export default ViewMeasurements;

const styles = StyleSheet.create({});
