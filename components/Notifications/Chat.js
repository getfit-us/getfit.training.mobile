import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, Card } from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";
import { sendMessage } from "../Api/services";

const Chat = ({ route }) => {
  const clientId = useProfile((state) => state.profile.clientId);
  const messages = useProfile((state) => state.messages);
  const profile = useProfile((state) => state.profile);
  const addNotification = useProfile((state) => state.addNotification);
  const trainer = useProfile((state) => state.trainer);
  const axiosPrivate = useAxiosPrivate();

  const { user, message } = route?.params ? route.params : { user: null }; // user is the person you are chatting with
  const [reply, setReply] = useState("");
  const [msgSent, setMsgSent] = useState({
    message: "",
    isError: false,
    success: false,
  });
  const [chat, setChat] = useState([]);
  const flatList = useRef();

  useEffect(() => {
    let filtered;
    if (user) {
      //find all messages between the current user and the user you are chatting with
      filtered = messages?.filter(
        (message) =>
          (message.sender.id === user._id &&
            message.receiver.id === clientId) ||
          (message.sender.id === clientId && message.receiver.id === user._id)
      );
    }

    if (message) {
      filtered = messages.filter(
        (msg) =>
          msg.sender.id === message.sender.id ||
          (msg.sender.id === clientId && msg.receiver.id === message.sender.id)
      );
    }
    setChat(filtered);
  }, [messages, user]);

  const handleSend = () => {
    const message = {
      sender: {
        id: clientId,
        name: profile.firstName + " " + profile.lastName,
      },
      receiver: { id: user._id }, // set to current chat user
      message: reply, // reply from input state
      type: "message", // set type to message
    };
    sendMessage(axiosPrivate, message).then((res) => {
      if (res.error) {
        setMsgSent({
          message: res.message,
          isError: true,
          success: false,
        });
      } else {
        setMsgSent({
          message: res.message,
          isError: false,
          success: true,
        });
        addNotification(res.data);
        setReply("");
      }
    });
  };



  //going to check if user is trainer, if so going to list clients to chat with, if not going to just show their trainer
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={chat}
          ref={flatList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View
                style={
                  clientId === item?.sender.id
                    ? styles.messageSent
                    : styles.messageReceived
                }
              >
                <Text style={styles.sender}>
                  {clientId !== item?.sender.id ? item?.sender.name : null}
                </Text>
                <Text style={styles.date}>{item?.createdAt}</Text>
                <Text style={styles.msg}>{item?.message}</Text>
              </View>
            );
          }}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
        />
        <View style={styles.input}>
          <TextInput
            placeholder="Type a message"
            onChangeText={(value) => setReply(value)}
            value={reply}
            style={{ width: "80%" }}
            mode="outlined"
          />

          <Button style={styles.button} onPress={handleSend}>
            Send
          </Button>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messageSent: {
    backgroundColor: "rgb(8, 97, 164)",

    padding: 10,
    margin: 10,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  messageReceived: {
    backgroundColor: "white",
    color: "black",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  button: {
    maxWidth: "20%",
    width: "20%",
    alignSelf: "flex-end",
  },
  input: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    fontSize: 12,
  },
  msg: {
    fontSize: 18,
    textAlign: "left",
  },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Chat;
