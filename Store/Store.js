// goinng to be zustand store

import create from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialProfileState = {
  profile: {},
  measurements: [],
  notifications: [],
  activeNotifications: [],
  messages: [],
  activeChat: [],
  clients: [],
  trainer: {},
  calendar: [],

  persist: false,
};

const initialWorkoutState = {
  completedWorkouts: [],
  customWorkouts: [],
  assignedCustomWorkouts: [],
  currentWorkout: {},
  newWorkout: {},
  manageWorkout: [],
  exercises: [],
  startWorkout: {},
};

export const useProfile = create((set, get) => ({
  profile: {}, // going to contain the profile data and auth data (token , roles, etc)
  measurements: [],
  notifications: [],
  clients: [],
  themeType: async () => {
    const theme = await AsyncStorage.getItem("theme");
    if (!theme) {
      await AsyncStorage.setItem("theme", false);
      return false;
    }
  },
  activeNotifications: [],
  viewMeasurement: {},
  messages: [],
  trainer: {},
  activeChat: [],
  persist: async () =>
    (await AsyncStorage.getItem("persist")) === "true" ? true : false,
  setPersist: async (persist) => {
    persist
      ? await AsyncStorage.setItem("persist", "true")
      : await AsyncStorage.removeItem("persist");
    set({ persist });
  },
  setThemeType: (themeType) => set({ themeType }),

  calendar: [], // going to contain the calendar data events tasks goals

  setProfile: (profile) => set({ profile: profile }),
  setMeasurements: (measurements) => set({ measurements }),
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [...state.measurements, measurement] })),
  updateMeasurement: (measurement) =>
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m._id === measurement._id ? measurement : m
      ),
    })),
  setViewMeasurement: (measurement) => set({ viewMeasurement: measurement }),

  setNotifications: (notifications) => {
    set({
      activeNotifications: notifications.filter(
        (notification) =>
          notification.receiver.id === get().profile.clientId &&
          notification.is_read === false &&
          notification.type !== "activity"
      ), // set active notifications
      messages: notifications
        .filter((n) => n.type === "message")
        .sort((m1, m2) => {
          return new Date(m1.createdAt) - new Date(m2.createdAt);
        }), // set messages sorted by date
      notifications: notifications.filter((notification) => {
        //add if it is not a activity notification
        if (
          notification.receiver.id === get().profile.clientId &&
          notification.is_read === false &&
          notification.type !== "activity" &&
          notification.type !== "message"
        )
          return false;
        else return true;
      }), // set notifications
    });
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications:
        notification.receiver.id === get().profile.clientId &&
        notification.is_read === false &&
        notification.type !== "activity" &&
        notification.type !== "message"
          ? state.notifications
          : [...state.notifications, notification],
      activeNotifications:
        notification.receiver.id === get().profile.clientId &&
        notification.is_read === false &&
        notification.type !== "activity"
          ? [...state.activeNotifications, notification]
          : state.activeNotifications,
      messages:
        notification.type === "message"
          ? [...state.messages, notification]
          : state.messages,
    }));
  },
  updateNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notification._id ? notification : n
      ),
      activeNotifications: state.activeNotifications.map((n) =>
        n._id === notification._id ? notification : n
      ),
      messages: state.messages.map((n) =>
        n._id === notification._id ? notification : n
      ),
    })),
  deleteNotification: (notification) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n._id !== notification._id
      ),
      activeNotifications: state.activeNotifications.filter(
        (n) => n._id !== notification._id
      ),
      messages: state.messages.filter((n) => n._id !== notification._id),
    }));
  },
  //sort clients by first name
  setClients: (clients) =>
    set({
      clients: clients.sort((c1, c2) =>
        c1.firstname.localeCompare(c2.firstname)
      ),
    }),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    })),
  setTrainer: (trainer) => set({ trainer }),
  setCalendar: (calendar) => set({ calendar }),
  addCalendarEvent: (event) =>
    set((state) => ({ calendar: [...state.calendar, event] })),
  deleteCalendarEvent: (event) =>
    set((state) => ({
      calendar: state.calendar.filter((e) => e._id !== event._id),
    })),
  setStatus: (status) => set({ status }),
  updateProfile: (profileUpdate) =>
    set((state) => ({
      profile: {
        ...state.profile,
        email: profileUpdate.email ? profileUpdate.email : state.profile.email,
        firstName: profileUpdate.firstname
          ? profileUpdate.firstname
          : state.profile.firstName,
        lastName: profileUpdate.lastname
          ? profileUpdate.lastname
          : state.profile.lastName,
        goals: profileUpdate.goals ? profileUpdate.goals : state.profile.goals,
        phone: profileUpdate.phone ? profileUpdate.phone : state.profile.phone,
        age: profileUpdate.age ? profileUpdate.age : state.profile.age,
        avatar: profileUpdate.avatar
          ? profileUpdate.avatar
          : state.profile.avatar,
        accountDetails: profileUpdate.accountDetails
          ? profileUpdate.accountDetails
          : state.profile.accountDetails,
        startDate: profileUpdate.startDate
          ? profileUpdate.startDate
          : state.profile.startDate,
      },
    })),

  updateClients: (clientToUpdate) => {
    set({
      clients: get().clients.map((client) =>
        client._id === clientToUpdate._id ? clientToUpdate : client
      ),
    });
  },
  resetProfileState: () => {
    set(initialProfileState);
  },
}));

export const useWorkouts = create((set, get) => ({
  completedWorkouts: [],
  customWorkouts: [],
  currentWorkout: {},
  viewWorkout: {},
  assignedCustomWorkouts: [],
  newWorkout: {},
  manageWorkout: [],
  exercises: [],
  startWorkout: {},
  setStartWorkout: (startWorkout) => set({ startWorkout }),
  updateStartWorkoutExercise: (exercise, exerciseIndex) =>
    set((state) => ({
      startWorkout: {
        ...state.startWorkout,
        exercises: state.startWorkout.exercises.map((e) =>
          e._id === exercise._id ? exercise : e
        ),
      },
    })),
  setStartWorkoutExercises: (exercises) =>
    set((state) => ({
      startWorkout: {
        ...state.startWorkout,
        exercises: exercises,
      },
    })),
  updateStartWorkoutSuperSet: (exercise, superSetIndex, exerciseIndex) =>
    //need to spread the exercise array and then only update the superset array

    set((state) => {
      const newExerciseArray = [...state.startWorkout.exercises];
      newExerciseArray[superSetIndex][exerciseIndex] = exercise;
      return {
        startWorkout: {
          ...state.startWorkout,
          exercises: newExerciseArray,
        },
      };
    }),
  deleteStartWorkoutExercise: (exercise, superSetIndex) =>
    set((state) => {
      if (superSetIndex !== undefined) {
        //delete exercise from superset array if length is greater than 1 else move the single exercise to the main array

        if (state.startWorkout.exercises[superSetIndex].length > 2) {
          const newExerciseArray = [...state.startWorkout.exercises];
          newExerciseArray[superSetIndex].filter((e) => e._id !== exercise._id);
          return {
            startWorkout: {
              ...state.startWorkout,
              exercises: newExerciseArray,
            },
          };
        } else {
          const newExerciseArray = [...state.startWorkout.exercises];
          newExerciseArray[superSetIndex].filter((e) => e._id !== exercise._id);
          newExerciseArray.push(newExerciseArray[superSetIndex][0]);
          newExerciseArray.splice(superSetIndex, 1);
          return {
            startWorkout: {
              ...state.startWorkout,
              exercises: newExerciseArray,
            },
          };
        }
      } else {
        //standard non superset exercise just filter from exercise array
        return {
          startWorkout: {
            ...state.startWorkout,
            exercises: state.startWorkout.exercises.filter(
              (e) => e._id !== exercise._id
            ),
          },
        };
      }
    }),
  addStartWorkoutExercise: (exercise, superSetIndex) =>
    set((state) => {
      if (superSetIndex !== undefined) {
        const newExerciseArray = [...state.startWorkout.exercises];
        newExerciseArray[superSetIndex].push(exercise);
        return {
          startWorkout: {
            ...state.startWorkout,
            exercises: newExerciseArray,
          },
        };
      } else {
        return {
          startWorkout: {
            ...state.startWorkout,
            exercises: [...state.startWorkout.exercises, exercise],
          },
        };
      }
    }),

  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setCompletedWorkouts: (completedWorkouts) => set({ completedWorkouts }),
  addCompletedWorkout: (completedWorkout) =>
    set((state) => ({
      completedWorkouts: [...state.completedWorkouts, completedWorkout],
    })),
  setCustomWorkouts: (customWorkouts) => set({ customWorkouts }),
  addCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: [...state.customWorkouts, customWorkout],
    })),
  updateCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: state.customWorkouts.map((w) =>
        w._id === customWorkout._id ? customWorkout : w
      ),
    })),
  delCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: state.customWorkouts.filter(
        (w) => w._id !== customWorkout._id
      ),
    })),

  setAssignedCustomWorkouts: (assignedCustomWorkouts) =>
    set({ assignedCustomWorkouts }),
  addAssignedCustomWorkout: (assignedCustomWorkout) =>
    set((state) => ({
      assignedCustomWorkouts: [
        ...state.assignedCustomWorkouts,
        assignedCustomWorkout,
      ],
    })),
  setViewWorkout: (workout) => set({ viewWorkout: workout }),
  setNewWorkout: (newWorkout) => set({ newWorkout }),
  setManageWorkout: (manageWorkout) => set({ manageWorkout }),
  setExercises: (exercises) => set({ exercises }),
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
  updateExercise: (exercise) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e._id === exercise._id ? exercise : e
      ),
    })),
  delExercise: (exercise) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e._id !== exercise._id),
    })),
  resetWorkoutState: () => {
    set(initialWorkoutState);
  },
}));
