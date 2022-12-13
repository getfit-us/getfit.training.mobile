import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { BASE_URL } from "../../assets/BASE_URL";
import { useProfile } from "../../Store/Store";
const maxWidth = Dimensions.get("window").width;

const ViewProgressPhotos = () => {
  const stateMeasurements = useProfile((state) => state.measurements);

  //find measurements with photos
  const measurementPhotos = stateMeasurements.filter((measurement) => {
    if (measurement.images.length > 0) {
      return measurement;
    }
  });

  //only going to render the most current measurement and the oldest measurement

  const currentMeasurement = measurementPhotos[0];
  const oldestMeasurement = measurementPhotos[measurementPhotos.length - 1];

  const renderPics = ({ item }) => {
    return (
      <>
        <View style={styles.singleMeasurement}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
          >
            Date: {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.progressPhotos}>
          {item.images.map((image, index) => {
            return (
              <Image
                key={image}
                source={{ uri: `${BASE_URL}/progress/${image}` }}
                style={{ width: "33%", height: 250 }}
                resizeMode="contain"
                lazyLoad={true}
              />
            );
          })}
        </View>
      </>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* <FlatList
        data={measurementPhotos}
        renderItem={renderPics}
        keyExtractor={(item) => item._id}
      /> */}
      <View style={styles.singleMeasurement}>
        <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}>
          Most Current Measurement Date:
          {new Date(currentMeasurement.date).toLocaleDateString()}
        </Text>
        {currentMeasurement.images.length > 0 && (
          <View style={styles.progressPhotos}>
            {currentMeasurement.images.map((image, index) => {
              return (
                <Image
                  key={image}
                  source={{ uri: `${BASE_URL}/progress/${image}` }}
                  style={{ width: currentMeasurement.images?.length === 1 ? "100%" :"33%", height: 250 }}
                  resizeMode="contain"
                  lazyLoad={true}
                />
              );
            })}
          </View>
        )}
      </View>
      <View style={styles.singleMeasurement}>
        <Text style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}>
          Oldest Measurement Date:
          {new Date(oldestMeasurement.date).toLocaleDateString()}
        </Text>
        {oldestMeasurement.images.length > 0 && (
          <View style={styles.progressPhotos}>
            {oldestMeasurement.images.map((image, index) => {
              return (
                <Image
                  key={image}
                  style={[styles.Image,
                  {width: oldestMeasurement.images?.length === 1 ? "100%" :"33%", height: 250}
                  ]}
                  source={{ uri: `${BASE_URL}/progress/${image}` }}
                  resizeMode="center"
                  lazyLoad={true}
                />
              );
            })}
          </View>
        )}
      </View>



    </ScrollView>
  );
};

export default ViewProgressPhotos;

const styles = StyleSheet.create({
  progressPhotos: {

    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    
    width: maxWidth,
  },
  singleMeasurement: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
   
  },
  Image: {
    shadowColor: "black",
    shadowOffset: {
      width: -10,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation:5
  },
});
