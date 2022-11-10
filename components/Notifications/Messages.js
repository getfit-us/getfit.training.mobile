import React from "react";
import { useProfile } from "../../Store/Store";
import { View, Text } from "react-native";

const Messages = () => {
  const messages = useProfile((state) => state.messages);
  return (
    <>
      <View>
        <Text>Messages</Text>
      </View>
      <View>
        {messages.map((message) => {
          return <Text>{message.message}</Text>;
        })}
      </View>
    </>
  );
};

export default Messages;
