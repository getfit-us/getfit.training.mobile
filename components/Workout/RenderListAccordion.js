import * as React from "react";
import { List } from "react-native-paper";
import { useWorkouts } from "../../Store/Store";

const RenderListAccordion = ({
  exerciseIndex,
  handleChangeOrder,
  superSet,
  inSuperSet,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handlePress = () => setExpanded(!expanded);
  const startWorkout = useWorkouts((state) => state.startWorkout);

  return (
    <List.Accordion
      title="Exercise Order"
      left={(props) => <List.Icon {...props} icon="order-bool-descending" />}
      expanded={expanded}
      onPress={handlePress}
    >
      {startWorkout.exercises.map((exercise, index) => {
        return (
          <List.Item
            key={index}
            title={index + 1 }
            titleStyle={{ color: "black" }}
            style={index === exerciseIndex ? { backgroundColor: "grey" , borderRadius: 10, maxWidth: '40%'}: {}}
            onPress={() => {
              handleChangeOrder(exerciseIndex, index);
              handlePress();
            }}
          />
        );
      })}
    </List.Accordion>
  );
};

export default RenderListAccordion;
