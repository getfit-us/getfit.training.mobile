export const delNotification = async (id) => {
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
  export const getCompletedWorkout = async (id) => {
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
  export const getCustomWorkout = async (id) => {
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
  export const updateNotification = async (message, liked) => {
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

  export const getMeasurement = async (id, item) => {
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