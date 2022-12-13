import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { BarChart } from "react-native-chart-kit";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "../../Store/colors"

const MeasurementChart = ({ measurements, loading }) => {
  return loading ? (
    <ActivityIndicator 
    size="large"
    color={colors.primary}
    
    />
  ) : (
    <BarChart
      data={measurements}
      width={Dimensions.get("window").width - 10}
      height={220}
      yAxisSuffix="lbs"
      showValuesOnTopOfBars={true}
      
     
      chartConfig={{
        backgroundColor: colors.primary,
        backgroundGradientFrom: colors.primary,
        backgroundGradientTo: colors.primaryLight,
       
        
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "1",
          
        },
        barPercentage: 0.5,
      }}
      style={{
        marginVertical: 8,
        borderRadius: 16,
        alignSelf: "center",
        marginBottom:5,
        marginTop: 0,
        
      }}
    />
  );
};

export default MeasurementChart;

const styles = StyleSheet.create({});
