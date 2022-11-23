import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Card, Button, TextInput } from 'react-native-paper'
import ExerciseMenu from './ExerciseMenu'

const RenderCardio = ({exercise}) => {
  return (
    <Card
      key={exercise._id}
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 10,
        position: "relative",
      }}
    >
      <Card.Title title={exercise.name}
      titleStyle={{fontWeight: "bold",
    color: "#A30B37",}}
      />
      <Card.Content>
        <ExerciseMenu exercise={exercise} key={exercise._id + "menu"} />
        <View style={styles.sets} key={" Set View" + exercise._id}>
      <TextInput
        key={exercise._id + "setInput"}
        label="Level"
       defaultValue={exercise.numOfSets[0].level}
        mode="outlined"
        style={styles.level}
        
      />
      <TextInput
        key={exercise._id + "time"}
        label="Time"
        defaultValue={exercise.numOfSets[0].minutes}
        mode="outlined"
        style={styles.minutes}
        keyboardType="number-pad"
      />
      <TextInput
        key={exercise._id + "reps"}
        label="Heart Rate"
        defaultValue={exercise.numOfSets[0].heartRate}
        mode="outlined"
        style={styles.heartRate}
        keyboardType="numeric"
      />
      </View>
        </Card.Content>
    </Card>
    );

  
}

const styles = StyleSheet.create({
    exerciseTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#A30B37",
        marginBottom: 10,
        },
    sets: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,

        },
    level: {
        width: "30%",
    },
    minutes: {
        width: '30%',
        marginLeft: 3,
        marginRight: 3,
    },
    heartRate: {
        width: '40%',
    },
})


export default RenderCardio