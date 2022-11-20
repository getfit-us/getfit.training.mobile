import React from "react";
import { Card } from "react-native-paper";
import { View } from "react-native";
import RenderSets from "./RenderSets";

const RenderExercises = ({ startWorkout }) => {
  return startWorkout?.exercises?.map((exercise) => (
    <Card key={exercise._id}
    style={{ margin: 10, padding: 10, borderRadius: 10 }}
    >
      <Card.Title title={exercise.name} />
      <Card.Content>
       <RenderSets sets={exercise.numOfSets} />


      </Card.Content>
    </Card>
  ));
};

export default RenderExercises;
