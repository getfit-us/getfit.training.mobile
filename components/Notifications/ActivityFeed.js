import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useProfile, useWorkouts } from "../../Store/Store";
import {
  Avatar,
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
  const [loadingNotifications, notificationData, error] =
    useApiCallOnMount(getNotifications);

  const delNotificationState = useProfile((store) => store.deleteNotification);
  const profile = useProfile((store) => store.profile);
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

  const handleGetMeasurement = (item) => {
    setStatus({ loading: true });
    getSingleMeasurement(
      axiosPrivate,
      item?.activityID ? item.activityID : item?.activityId
    ).then((status) => {
      console.log(status);
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
    setStatus({ loading: true });
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






  useEffect(() => {
    setViewMeasurement(null);
    setViewWorkout(null);
  }, []);

  const listItem = ({ item }) => (
    <View style={styles.list} key={item._id}>
      <Card style={styles.card} elevation={3}>
        <List.Item
          key={item._id}
          titleNumberOfLines={3}
          title={item.message}
          left={(props) => (
            <Avatar.Icon
              {...props}
              color={MD2Colors.white}
              icon={item.message.includes("workout") ? "dumbbell" : "account"}
              style={{ backgroundColor:'rgb(8, 97, 164)', alignSelf: 'center',marginLeft: 10,  }}            
              size={40}
            />
          )}
         
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
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

          console.log(profile)

  return (
    <SafeAreaView>
      <View>
        
          <ProgressBar
            indeterminate
            color={MD2Colors.blue500}
            visible={status.loading  || loadingNotifications ? true : false}
          />
       
          <FlatList
            data={userActivity}
            keyExtractor={(userActivity) => userActivity._id}
            renderItem={listItem}
            contentContainerStyle={{ flexGrow: 1 }}
            onEndReached={() => setPage(page + 1)}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={NoNotifications}
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
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
  },

});

export default ActivityFeed;
