import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, Card, IconButton } from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";
import { sendMessage } from "../Api/services";
import { useNavigation } from "@react-navigation/native";
import { updateSingleNotification } from "../Api/services";

const Chat = ({ route }) => {
  const clientId = useProfile((state) => state.profile.clientId);
  const messages = useProfile((state) => state.messages);
  const profile = useProfile((state) => state.profile);
  const addNotification = useProfile((state) => state.addNotification);
  const updateNotification = useProfile((state) => state.updateNotification);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const axiosPrivate = useAxiosPrivate();
  const navigation = useNavigation();
  const [status, setStatus] = useState({
    success: false,
    error: false,
    message: "",
    loading: false,
  });

  const { user, message } = route?.params
    ? route.params
    : { user: null, message: null }; // user is the person you are chatting with
  const [reply, setReply] = useState("");
  const [msgSent, setMsgSent] = useState({
    message: "",
    isError: false,
    success: false,
    loading: false,
  });
  const [chat, setChat] = useState([]);
  const flatList = useRef();

  useEffect(() => {
    if (route?.params === undefined) navigation.navigate("Inbox");
    let filtered;
    if (user) {
      //find all messages between the current user and the user you are chatting with (user clicked on the user's name )
      filtered = messages?.filter(
        (msg) =>
          (msg.sender.id === user._id && msg.receiver.id === clientId) ||
          (msg.sender.id === clientId && msg.receiver.id === user?._id)
      );
    }
    //this is for a new message being selected from the inbox
    if (message) {
      filtered = messages.filter(
        (msg) =>
          msg.sender.id === message?.sender?.id ||
          (msg.sender.id === clientId && msg.receiver.id === message?.sender.id)
      );
    }
    setChat(filtered);

    return () => {
      setChat([]);
    };
  }, [messages, user, message]);

  const handleUpdate = (notification) => {
    setStatus({ loading: true });
    notification.is_read = true;

    updateSingleNotification(axiosPrivate, notification).then((res) => {
      setStatus({ loading: res.loading });
      if (!res.error && !res.loading) {
        updateNotification(notification);
        setStatus({
          success: true,
          loading: false,
          message: "Updated Notification",
        });
      } else {
        setStatus({ error: true, loading: false, message: res.message });
      }
    });
  };

  const handleSend = () => {
    setMsgSent({ message: "", isError: false, success: false, loading: true });
    const newMessage = {
      sender: {
        id: clientId,
        name: profile.firstName + " " + profile.lastName,
      },
      receiver: { id: user ? user._id : message.sender.id }, // set to current chat user
      message: reply, // reply from input state
      type: "message", // set type to message
    };
    sendMessage(axiosPrivate, newMessage).then((res) => {
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
          loading: false,
        });
        addNotification(res.data);
        setReply("");
      }
    });
  };

  const handleContentSizeChange = () => {
    const unread = activeNotifications?.filter(
      (item) =>
        item.sender.id === (message?.sender?.id || user._id) &&
        item.is_read === false
    );
    if (unread?.length > 0) {
      console.log("unread", unread);
      unread?.forEach((message) => {
        handleUpdate(message);
      });
    }
    flatList.current.scrollToEnd({ animated: true });
  };

  const renderItem = useCallback(
    ({ item }) => {
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
    },
    [clientId]
  );

  //going to check if user is trainer, if so going to list clients to chat with, if not going to just show their trainer
  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={chat ? chat : []}
          ref={flatList}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          initialNumToRender={20}
          onContentSizeChange={handleContentSizeChange}
        />
        <View style={styles.input}>
          <TextInput
            placeholder="Type a message"
            onChangeText={(value) => setReply(value)}
            value={reply}
            style={{ width: "75%", height: 40 }}
            mode="flat"
          />

          <Button
            mode="outlined"
            disabled={reply?.length < 1}
            buttonColor="#03A9F4"
            icon={msgSent.loading ? "loading" : "send"}
            loading={msgSent.loading}
            style={styles.button}
            onPress={handleSend}
            labelStyle={{ color: "#ffff" }}
          >
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
    maxWidth: "25%",
    width: "30%",
    alignSelf: "flex-end",
    borderRadius: 0,
    color: "white",
    height: 40,
  },
  input: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    marginTop: 0,
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
