import { FlatList, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { getMeasurements } from "../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { useProfile } from "../../Store/Store";
import MeasurementChart from "./MeasurementChart";
import { FAB, List } from "react-native-paper";
import { getSingleMeasurement } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ViewMeasurements = ({ navigation }) => {
  const [loadingMeasurements, measurements, errorMeasurements] =
    useApiCallOnMount(getMeasurements);
  const measurementState = useProfile((state) => state.measurements);
  const setViewMeasurement = useProfile((state) => state.setViewMeasurement);
  const setStatus = useProfile((state) => state.setStatus);
  const axiosPrivate = useAxiosPrivate();
  const formatMeasurements = {
    labels: [],
    datasets: [
      {
        data: [],
      },
      { data: [] },
    ],
  };

  const handleGetMeasurement = (item) => {
    setStatus({ loading: true });
    getSingleMeasurement(
      axiosPrivate,
      item._id
    ).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        const split = status?.data?.date.split("-");
        const year = split.splice(0, 1);
        let newDate = [...split, ...year].join("-");
        setViewMeasurement({
          ...status.data,
          message: item.message,
          date: newDate,
        });
        navigation.navigate("View Activity", { status });
      }
    });
  };

  //format measurements to be used in chart
  measurementState.forEach((measurement, index) => {
    // only add the last 10 measurements to the chart
    if (index > 7) {
      return;
    }
    formatMeasurements.labels.push(
      new Date(measurement.date).toLocaleDateString().slice(0, 5)
    );
    formatMeasurements.datasets[0].data.push(measurement.weight);
    formatMeasurements.datasets[1].data.push(measurement.bodyfat);
  });

  const renderMeasurement = ({ item }) => {
    return (
      <List.Item
        style={styles.listItem}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        title={`Measurement Date: ${new Date(item.date).toLocaleDateString()}`}
        descriptionNumberOfLines={2}
        description={`Weight: ${item.weight} lbs`}
        left={(props) => <FAB {...props} icon="ruler" />}
        onPress={() => handleGetMeasurement(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={measurementState}
        renderItem={renderMeasurement}
        keyExtractor={(item) => item._id}
        style={{ marginBottom: 5, marginTop: 0 }}
      />

      <MeasurementChart
        measurements={formatMeasurements}
        loading={loadingMeasurements}
      />
    </View>
  );
};

export default ViewMeasurements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    backgroundColor: "white",
    elevation: 7,
    margin: 5,
    borderRadius: 10,
  },
  recent: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
