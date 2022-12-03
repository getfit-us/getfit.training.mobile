import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useProfile, useWorkouts } from "../../Store/Store";
import {
  ActivityIndicator,
  Avatar,
  Banner,
  Card,
  IconButton,
  List,
} from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ProgressBar, MD2Colors } from "react-native-paper";
import NoNotifications from "./NoNotifications";
import {
  getNotifications,
  getSingleMeasurement,
  getSingleCompletedWorkout,
  deleteSingleNotification,
  getSingleCustomWorkout,
  updateSingleNotification,
} from "../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import AnimatedFAB from "../UserFeedback/AnimatedFAB";
import { colors } from "../../Store/colors";

const ActivityFeed = ({ navigation }) => {
  const notifications = useProfile((state) => state.notifications);
  const clientId = useProfile((state) => state.profile?.clientId);
  const setNotifications = useProfile((state) => state.setNotifications);
  const [viewWorkout, setViewWorkout] = useWorkouts((state) => [
    state.viewWorkout,
    state.setViewWorkout,
  ]);
  const [viewMeasurement, setViewMeasurement] = useProfile((state) => [
    state.viewMeasurement,
    state.setViewMeasurement,
  ]);
  const axiosPrivate = useAxiosPrivate();
  const updateNotificationState = useProfile(
    (store) => store.updateNotification
  );
  const [loadingNotifications, notificationData, error] =
    useApiCallOnMount(getNotifications);
  const [userActivity, setUserActivity] = useState([]);

  const delNotificationState = useProfile((store) => store.deleteNotification);
  let [page, setPage] = useState(1);
  const [showBanner, setShowBanner] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    error: false,
    success: false,
  });

  useEffect(() => {
    setViewMeasurement(null);
    setViewWorkout(null);
  }, []);

  useEffect(() => {
    if (!loadingNotifications) {
      setStatus({ loading: false, error: false, success: true });
      setUserActivity(() => {
        return notifications
          .filter((notification) => {
            if (notification.type === "activity") {
              return true;
            }
          })
          .sort((a, b) => {
            if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
          });
      });
      //instead of wait for the api call to finish, we may have notifications in the store already so load those.
    } else if (loadingNotifications && notifications?.length > 0) {
      setStatus({ loading: false, error: false, success: true });
      setUserActivity(() => {
        return notifications
          .filter((notification) => {
            if (notification.type === "activity") {
              return true;
            }
          })
          .sort((a, b) => {
            if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
          });
      });
    }

    const pingNotifications = setInterval(() => {
      getNotifications(axiosPrivate, {
        setNotifications: setNotifications,
        profile: { clientId: clientId },
      }).catch((err) => {
        console.log("inside catch of interval for notifications", err);
        clearInterval(pingNotifications); //stop the interval probably still running with the old access token
        pingNotifications(); // restart the interval with the new access token
        setStatus({ loading: false, error: true, success: false });
      });
    }, 5000);

    return () => {
      clearInterval(pingNotifications);
    };
  }, [loadingNotifications, notificationData, notifications]);

 //actions for fab Group

  const bannerActions = [
    {
      label: "Hide",
      onPress: () => setShowBanner(false),
    },
    {
      label: "Clear All",
      labelStyle: { color: "red" },
      onPress: () => {
        setStatus({ loading: true });
        userActivity.forEach((notification) => {
          deleteSingleNotification(axiosPrivate, notification._id).then(
            (res) => {
              if (!res.loading && !res.error) {
                delNotificationState(notification);
                setStatus({ loading: false, success: true });
              } else {
                setStatus({ loading: false, error: true });
              }
            }
          );
        });
        setStatus({ loading: false });
        setShowBanner(false);
      },
    },
  ];

  const handleGetMeasurement = (item) => {
    setStatus({ loading: true });
    getSingleMeasurement(
      axiosPrivate,
      item?.activityID ? item.activityID : item?.activityId
    ).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        const split = status?.data?.date.split("-");
        const year = split.splice(0, 1);
        let newDate = [...split, ...year].join("-");
        setViewMeasurement({
          ...status.data,
          message: item.message,
          date: newDate,
        });
        navigation.navigate("View Activity", { status });
      }
    });
  };

  const handleGetWorkout = (item) => {
    setStatus({ loading: true });
    getSingleCompletedWorkout(
      axiosPrivate,
      item?.activityID ? item.activityID : item?.activityId
    ).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        setViewWorkout(status.data);
        navigation.navigate("View Activity", { status });
      }
    });
  };

  const handleGetCustomWorkout = (item) => {
    setStatus({ loading: true, itemId: item._id });
    getSingleCustomWorkout(
      axiosPrivate,
      item?.activityID ? item.activityID : item?.activityId
    ).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        setViewWorkout(status.data);
        navigation.navigate("View Activity", { status });
      }
    });
  };

  const handleUpdateNotification = (item) => {
    item.is_read = true;
    setStatus({ loading: true });
    updateSingleNotification(axiosPrivate, item).then((status) => {
      setStatus({ loading: status.loading });
      if (!status.loading) {
        updateNotificationState(status.data);
      }
    });
  };

  const listItem = ({ item }) => (
    <View style={styles.list} key={item._id}>
      <Card style={styles.card} elevation={3}>
        <List.Item
          key={item._id}
          style={styles.listItem}
          titleNumberOfLines={3}
          title={
            status.loading && status?.itemId === item._id
              ? "Loading.."
              : item.message
          }
          left={(props) => (
            <>
              <Avatar.Icon
                {...props}
                color={MD2Colors.white}
                icon={item.message.includes("workout") ? "dumbbell" : "account"}
                style={{
                  backgroundColor: "rgb(8, 97, 164)",
                  alignSelf: "center",
                  marginLeft: 10,
                }}
                size={40}
              />
            </>
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              iconColor={colors.error}
              onPress={() => {
                setStatus({ loading: true });
                deleteSingleNotification(axiosPrivate, item._id).then(
                  (status) => {
                    setStatus({ loading: status.loading });
                    if (!status.loading && !status.error)
                      delNotificationState({ _id: item._id });
                  }
                );
              }}
            />
          )}
          description={item.createdAt}
          centered
          titleStyle={{
            flex: 1,
            flexWrap: "wrap",
            flexShrink: 1,
            fontSize: 16,
            fontWeight: "bold",
            color: "rgb(0, 73, 171)",
          }}
          descriptionStyle={{
            fontSize: 12,
            fontWeight: "bold",
            color: "black",
          }}
          onPress={() => {
            if (item.message.includes("measurement")) {
              handleGetMeasurement(item);
              if (!item.is_read) handleUpdateNotification(item);
            } // checks for created custom workouts
            if (
              item.message.includes("created") ||
              item.message.includes("assigned")
            ) {
              handleGetCustomWorkout(item);

              if (!item.is_read) handleUpdateNotification(item);
            }

            if (
              !item.message.includes("goal") &&
              !item.message.includes("task") &&
              item.message.includes("completed")
            ) {
              handleGetWorkout(item);

              if (!item.is_read) handleUpdateNotification(item);
            }
          }}
        />
      </Card>
    </View>
  );



  return status.loading && notifications?.length === 0 ? (
    <ActivityIndicator animating={status.loading} />
  ) : (
    <SafeAreaView>
      <View style={styles.container}>
        <ProgressBar
          indeterminate
          color={colors.primaryLight}
          visible={status.loading || loadingNotifications ? true : false}
          style={{ height: 10 }}
        />
        <Banner visible={showBanner} actions={bannerActions}>
          Clear all notifications?
        </Banner>

        <FlatList
          data={userActivity}
          keyExtractor={(userActivity) => userActivity._id}
          renderItem={listItem}
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={NoNotifications}
        />
        <AnimatedFAB
          visible={true}
          setShowBanner={setShowBanner}
          extended={showBanner}
          label="Options"
          icon="menu"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  container: {
    height: "100%",
  },
  listItem: {
    borderWidth: 1,
    borderColor: "rgb(0, 73, 171)",
    borderRadius: 10,
  },
  listItemUnread: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
  },
});

export default ActivityFeed;
