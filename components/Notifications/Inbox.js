import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useProfile } from "../../Store/Store";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { BASE_URL } from "../../assets/BASE_URL";
const Inbox = ({ navigation }) => {
  const messages = useProfile((state) => state.messages);
  const clients = useProfile((state) => state.clients);
  const trainer = useProfile((state) => state.trainer);
  const clientId = useProfile((state) => state.profile.clientId);
  const [inbox, setInbox] = React.useState([]);
  const LeftContent = (props) => <Avatar.Image {...props} size={24} />;
  

  useEffect(() => {
    const sorted = messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      const unique = sorted.filter((item, index) => {
        if (
          sorted.findIndex((i) => i.sender.id === item.sender.id) === index &&
          item.sender.id !== clientId
        ) {
          return item;
        }
      });
        setInbox(unique);
    }, [messages]);



  return (
    <ScrollView>
      <View style={styles.container}>
        {inbox.map((message) => {
          return (
            <Card
              style={styles.card}
              elevation={3}
              key={message._id}
              onPress={() => navigation.navigate("Chat", { user: message })}
            >
              <Card.Title
                title={message.sender.name}
                left={(props) => {
                  let avatar = clients.filter(
                    (client) => client._id === message.sender.id
                  )[0]?.avatar;

                  return (
                    <Avatar.Image
                      size={24}
                      source={
                        avatar
                          ? `${BASE_URL}/avatar/${avatar}`
                          : message.sender.name[0]
                      }
                      onError={(e) => {
                        console.log(e);
                      }}
                    />
                  );
                }}
              />
              <Card.Content>
                <Paragraph>{message.createdAt}</Paragraph>
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  card: {
    margin: 10,
    width: "90%",
  },
});
