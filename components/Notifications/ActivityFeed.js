import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useProfile, useWorkouts } from "../../Store/Store";
import { ActivityIndicator, IconButton, List } from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ProgressBar, MD2Colors } from "react-native-paper";
import NoNotifications from "./NoNotifications";

const ActivityFeed = ({ navigation }) => {
  const notifications = useProfile((store) => store.notifications);
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
  const delNotificationState = useProfile((store) => store.deleteNotification);
  const profile = useProfile((store) => store.profile);
  const statusProfile = useProfile(state => state.status) 
  let [page, setPage] = useState(1);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });

  let userActivity = notifications.filter((notification) => {
    if (notification.type === "activity") {
      return true;
    }
  });

  userActivity = userActivity.sort(function (a, b) {
    if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
  });

  const delNotification = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/notifications/${id}`, {
        signal: controller.signal,
      });
      delNotificationState({ _id: id });
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };
  //apu call to get users completed workouts
  const getCompletedWorkout = async (id) => {
    setStatus({ loading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/completed-workouts/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout(response.data);
      setStatus({ loading: false, error: false, success: true });
      navigation.navigate("View Activity", { status });
      // console.log(workouts)
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };
  const getCustomWorkout = async (id) => {
    setStatus({ loading: true, error: false, success: false });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout(response.data);
      navigation.navigate("View Activity", { status });

      setStatus({ loading: false, error: false, success: true });

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };
  const updateNotification = async (message, liked) => {
    message.is_read = true;
    //if liked set to true
    message.liked = liked;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });
      updateNotificationState(response.data);
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  const getMeasurement = async (id, item) => {
    setStatus({ loading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/${id}`, {
        signal: controller.signal,
      });
      const split = response?.data?.date.split("-");
      const year = split.splice(0, 1);
      let newDate = [...split, ...year].join("-");
      setViewMeasurement({
        ...response.data,
        message: item.message,
        date: newDate,
      });
      navigation.navigate("View Activity", { status });
      setStatus({ loading: false, error: false, success: true });
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    setViewMeasurement(null);
    setViewWorkout(null);
  }, []);

  const listItem = ({ item }) => (
    <View style={styles.list} key={item._id}>
      <List.Item
        key={item._id}
        titleNumberOfLines={2}
        title={item.message}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
            onPress={() => delNotification(item._id)}
          />
        )}
        description={item.createdAt}
        centered
        titleStyle={{ flex: 1, flexWrap: "wrap", flexShrink: 1 }}
        onPress={() => {
          if (item.message.includes("measurement")) {
            getMeasurement(item.activityID, item);

            if (!item.is_read) updateNotification(item);
          } // checks for created custom workouts
          if (
            item.message.includes("created") ||
            item.message.includes("assigned")
          ) {
            getCustomWorkout(item.activityID);

            if (!item.is_read) updateNotification(item);
          }

          if (
            !item.message.includes("goal") &&
            !item.message.includes("task") &&
            item.message.includes("completed")
          ) {
            getCompletedWorkout(item.activityID);

            if (!item.is_read) updateNotification(item);
          }
        }}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <View>
        {(status.loading || statusProfile.loading) ? (
          <ProgressBar
          indeterminate
          color={MD2Colors.blue500}
          visible={status.loading ? true : false}
        />
        ) : (
        <FlatList
          data={userActivity}
          keyExtractor={(userActivity) => userActivity._id}
          renderItem={listItem}
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={NoNotifications}

        />)}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

export default ActivityFeed;
