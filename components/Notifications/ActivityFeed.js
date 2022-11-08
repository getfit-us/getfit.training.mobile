import React, {useState} from 'react'
import { View, Text } from 'react-native'
import { useProfile } from '../../Store/Store';

const ActivityFeed = () => {
  const notifications = useProfile((store) => store.notifications);
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
  return (
    <View><Text>
        Activity Feed
        </Text></View>
  )
}

export default ActivityFeed