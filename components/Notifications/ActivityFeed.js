import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useProfile } from "../../Store/Store";
import { IconButton, List } from "react-native-paper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ActivityFeed = () => {
  const notifications = useProfile((store) => store.notifications);
  const axiosPrivate = useAxiosPrivate();
  const updateNotificationState = useProfile(
    (store) => store.updateNotification
  );
  const delNotificationState = useProfile((store) => store.deleteNotification);
  const profile = useProfile((store) => store.profile);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
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



  const listItem = ({ item }) => (
    <View style={styles.list}>
      <List.Item
        key={item._id}
        titleNumberOfLines={2}
        title={item.message}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={(props) => (
          <IconButton {...props} icon="delete" onPress={() => delNotification(item._id)} />
          
          
        )}
        description={item.createdAt}
        centered
        titleStyle={{ flex: 1, flexWrap: "wrap", flexShrink: 1 }}
        // onPress={() => {
        //   if (item.type === "workout") {
        //     setViewWorkout(item);
      />
    </View>
  );

  return (
    <>
      <View>
        <FlatList
          data={userActivity}
          keyExtractor={(userActivity) => userActivity._id}
          renderItem={listItem}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

export default ActivityFeed;
