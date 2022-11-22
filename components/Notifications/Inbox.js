import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useProfile } from "../../Store/Store";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  
} from "react-native-paper";
import { BASE_URL } from "../../assets/BASE_URL";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getNotifications, updateSingleNotification } from "../Api/services";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const Inbox = ({ navigation }) => {
  const messages = useProfile((state) => state.messages);
  const clients = useProfile((state) => state.clients);
  const trainer = useProfile((state) => state.trainer);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const clientId = useProfile((state) => state.profile.clientId);
  const roles = useProfile((state) => state.profile.roles);
  const [inbox, setInbox] = React.useState([]);
  const [loadingMessages, messageData, error] =
    useApiCallOnMount(getNotifications);
  const axiosPrivate = useAxiosPrivate();
  const updateNotification = useProfile((state) => state.updateNotification);
  const [status, setStatus] = React.useState({
    success: false,
    error: false,
    message: "",
    loading: false,
  });

  useEffect(() => {
    if (!loadingMessages) {
      const sorted = activeNotifications?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      const unique = sorted?.filter((item, index) => {
        if (
          sorted.findIndex((i) => i.sender.id === item.sender.id) === index &&
          item.sender.id !== clientId &&
          item.is_read === false &&
          item.type === "message"
        ) {
          return item;
        }
      });
      setInbox(unique);
    }
  }, [messages, loadingMessages]);

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
  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.title}> Inbox</Text>
        {inbox?.length > 0 ? (
        
          inbox?.map((message) => {
            return (
              <Card
                style={styles.card}
                elevation={3}
                key={message._id}
                onPress={() => {
                  handleUpdate(message);
                  navigation.navigate("Chat", { message: message });
                }}
              >
                <Card.Title
                  title={message.sender.name}
                  titleStyle={styles.title}
                  subtitle={'New Message'}
                  left={(props) => {
                    let client = clients.filter(
                      (client) => client._id === message.sender.id
                    );

                    if (client[0]?.avatar) {
                      return (
                        <Avatar.Image
                          size={50}
                          source={{
                            uri: `${BASE_URL}/avatar/${client[0]?.avatar}`,
                          }}
                          onError={(e) => {
                            console.log(e);
                          }}
                        />
                      );
                    } else {
                      return <Avatar.Icon size={50} icon="account" />;
                    }
                  }}
                  // right={(props) => (
                  //   <Icon  name='message' size={30} color='#000' />
                  // )}
                />
                <Card.Content>
                  <Paragraph style={styles.date}>
                    {" "}
                    Date: {message.createdAt}
                  </Paragraph>
                </Card.Content>
              </Card>
            );
          })
        ) : (
          <>
            <View style={styles.container}>
              <Text style={styles.noMessages}>No New Messages</Text>
            </View>
          </>
        )}
        <View style={styles.userList}>
          <Text style={styles.title}>Chat</Text>
          {roles.includes(10) ? (
            clients?.map((client) => {
              return (
                <Card
                  style={styles.card}
                  elevation={3}
                  key={client._id + "card"}
                >
                  <List.Item
                    key={client._id}
                    title={client.firstname + " " + client.lastname}
                    titleNumberOfLines={3}
                    left={(props) =>
                      client?.avatar ? (
                        <Avatar.Image
                          size={40}
                          source={{
                            uri: `${BASE_URL}/avatar/${client?.avatar}`,
                          }}
                          style={styles.avatar}
                        />
                      ) : (
                        <Avatar.Text
                          size={40}
                          label={client?.firstname[0] + client?.lastname[0]}
                          style={styles.avatar}
                        />
                      )
                    }
                    onPress={() =>
                      navigation.navigate("Chat", { user: client })
                    }
                  />
                </Card>
              );
            })
          ) : (
            <List.Item
              title={trainer?.firstname + " " + trainer?.lastname}
              titleNumberOfLines={3}
              left={(props) =>
                trainer?.avatar ? (
                  <Avatar.Image
                    size={50}
                    source={{
                      uri: `${BASE_URL}/avatar/${trainer?.avatar}`,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={50}
                    label={trainer?.firstName[0] + trainer?.lastName[0]}
                    style={styles.avatar}
                  />
                )
              }
              onPress={() => navigation.navigate("Message", { trainer })}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  card: {
    margin: 10,

    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  date: {
    fontSize: 15,
    textAlign: "center",
  },
  noMessages: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
    backgroundColor: "orange",
    fontWeight: "bold",
  },
  userList: {},
  avatar: {
    marginLeft: 10,
  },
});
