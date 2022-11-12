import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, Card } from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";

const Chat = ({ route }) => {
  const clientId = useProfile((state) => state.profile.clientId);
  const messages = useProfile((state) => state.messages);
  const profile = useProfile((state) => state.profile);
  const addNotification = useProfile((state) => state.addNotification);
  const trainer = useProfile((state) => state.trainer);
  const axiosPrivate = useAxiosPrivate();
  const { user } = route?.params ? route.params : { user: null };
  const [reply, setReply] = useState("");
  const [msgSent, setMsgSent] = useState({
    message: "",
    isError: false,
    success: false,
  });
  const [chat, setChat] = useState([]);
  const flatList = useRef();

  useEffect(() => {
    if (user) {
      const filteredMessages = messages.filter(
        (msg) =>
          msg.sender.id === user.sender.id ||
          (msg.sender.id === clientId && msg.receiver.id === user.sender.id)
      );
      setChat(filteredMessages);
    }
  }, [messages, user]);

  const sendMessage = async (reply) => {
    if (!reply) return;
    let message = {};
    //set type to message
    message.type = "message";
    message.message = reply;
    //set sender
    message.sender = {};
    message.receiver = {};
    message.sender.id = clientId;
    message.sender.name = profile.firstName + " " + profile.lastName;
    //set receiver
    if (trainer?.firstname) {
      message.receiver.id = trainerState.id;
    } else {
      message.receiver.id = user.sender.id;
    }
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", message, {
        signal: controller.signal,
      });

      addNotification(response.data);
      console.log(response.data);

      //   setMsgSent((prev) => ({ ...prev, success: true }));

      //   setTimeout(() => {
      //     setMsgSent((prev) => ({ ...prev, success: false }));
      //   }, 3000);
      setReply("");
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  const Footer = () => {
    return (
      <View style={styles.input}>
        <TextInput
          placeholder="Type a message"
          onChangeText={(value) => setReply(value)}
          value={reply}
          style={{ width: "80%" }}
        />

        <Button style={styles.button} onPress={() => sendMessage(reply)}>
          Send
        </Button>
      </View>
    );
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
                  clientId === item.sender.id
                    ? styles.messageSent
                    : styles.messageReceived
                }
              >
                <Text style={styles.sender}>
                  {clientId !== item.sender.id ? item.sender.name : null}
                </Text>
                <Text style={styles.date}>{item.createdAt}</Text>
                <Text style={styles.msg}>{item.message}</Text>
              </View>
            );
          }}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
        />
        <Footer />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
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
});

export default Chat;
