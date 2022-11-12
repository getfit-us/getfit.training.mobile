import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

//Client Signup Form

const SignUp = ({navigation}) => {
  const [status, setStatus] = useState({
    success: false,
    captcha: false,
    error: false,
    message: "",
    email: false,
    password: false,
    password2: false,
    firstName: false,
    lastName: false,
    phoneNum: false,
  });
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    trainerId: "",
    phoneNum: "",
  });

  const validateForm = () => {
    let valid = true;
    let emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    let phoneRegex = /^\d{10}$/;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    let firstNameRegex = /^[a-zA-Z]+$/;
    let lastNameRegex = /^[a-zA-Z]+$/;
    let email = formValues.email;
    let password = formValues.password;
    let password2 = formValues.password2;
    let firstName = formValues.firstName;
    let lastName = formValues.lastName;
    let phoneNum = formValues.phoneNum;
    let trainerId = formValues.trainerId;
    if (!firstNameRegex.test(firstName)) {
      valid = false;
      setStatus({
        firstName: true,
        message: "First name must only contain letters",
      });
    }
    if (!lastNameRegex.test(lastName)) {
      valid = false;

      setStatus({
        lastName: true,
        message: "Last name must only contain letters",
      });
    } 
    if (!emailRegex.test(email)) {
      valid = false;
      setStatus({

        email: true,
        message: "Please enter a valid email address",
      });
    } 
    if (!passwordRegex.test(password)) {
      valid = false;
      setStatus({

        password: true,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
    } 
    if (password !== password2) {
      valid = false;
      setStatus({

        password2: true,
        message: "Passwords do not match",
      });
    }
  
    if (!phoneRegex.test(phoneNum)) {
      valid = false;
      setStatus({

        phoneNum: true,
        message: "Phone number must be 10 digits",
      });
    }
    if (trainerId === "") {
      valid = false;
      setStatus({

        trainerId: true,
        message: "Please enter a valid trainer ID",
      });
    }

    return valid;
  };

  const axiosPrivate = useAxiosPrivate();
  const onSubmit = async () => {
    const test = validateForm();
    console.log(test)

    if (!test) return;

    formValues.roles = {};
    formValues.roles.Client = 2;


    try {
      const response = await axiosPrivate.post("/register", formValues, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setStatus((prev) => ({  success: true, message: response.data.message }));
      setTimeout(() => navigation.navigate('Home'), 3000);
    } catch (err) {
      console.log(err);
      setStatus((prev) => {
        const _prev = { ...prev };
        _prev.error = true;
        _prev.message = err?.response?.message;
        return _prev;
      });

      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        console.log("Missing Email or Password");
        setStatus((prev) => {
          const _prev = { ...prev };
          _prev.error = true;
          _prev.message = err.response.message;
          return _prev;
        });
      } else if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else if (err.response?.status === 409) {
        setStatus((prev) => {
          const _prev = { ...prev };
          _prev.error = true;
          _prev.message = "This Email Address already exists.";
          return _prev;
        });
      } else if (err.response?.status === 404) {
        setStatus((prev) => {
          const _prev = { ...prev };
          _prev.error = true;
          _prev.message = "Trainer Does not exist.";
          return _prev;
        });
      }
      setTimeout(
        () =>
          setStatus({
            success: false,
            captcha: true,
            error: false,
            message: "",
          }),
        3000
      );
    }
  };

  return (
    <ScrollView>
      <Text style={styles.title}>GetFit Personal Training App</Text>
      <Text
        variant="headlineSmall"
        style={{
          textAlign: "center",
          marginBottom: 10,
          padding: 5,
          backgroundColor: "#2780B8",
          borderRadius: 20,
          marginLeft: 5,
          marginRight: 5,
          color: "white",
        }}
      >
        Sign Up Form
      </Text>

      <View style={styles.form}>
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, firstName: text }))
          }
          placeholder="First Name"
          style={styles.input}
          error={status.firstName}
          label="First Name"
         
        />
        {status.firstName && (
          <Text style={styles.error}>{status.message}</Text>
        )}
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, lastName: text }))
          }
          placeholder="Last Name"
          style={styles.input}
          error={status.lastName}
          label="Last Name"
         

        />
        {status.lastName && (
          <Text style={styles.error}>{status.message}</Text>
        )}
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, phoneNum: text }))
          }
          placeholder="Phone Number"
          style={styles.input}
          error={status.phoneNum}
          label="Phone Number"
        />
        {status.phoneNum && (
          <Text style={styles.error}>{status.message}</Text>
        )}

        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, email: text }))
          }
          placeholder="Email"
          style={styles.input}
          error={status.email}
          label="Email Address"
        />
        {status.email && (
          <Text style={styles.errorText}>{status.message}</Text>
        )}
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry
          placeholder="Password"
          error={status.password}
          style={styles.input}
          label="Password"
        />
        {status.password && (
          <Text style={{ color: "red" }}>{status.message}</Text>
        )}
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, password2: text }))
          }
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          error={status.password2}
          label="Confirm Password"
        />
        {status.password2 && (
          <Text style={{ color: "red" }}>{status.message}</Text>
        )}
        <TextInput
          onChangeText={(text) =>
            setFormValues((prev) => ({ ...prev, trainerId: text }))
          }
          placeholder="Trainer ID"
          error={status.trainerId}
          label="Trainer ID"
        />
      </View>
      {status.trainerId && (
        <Text style={{ color: "red", textAlign: "center" }}>
          {status.message}
        </Text>
      )}
      <Button style={styles.button} mode="contained" 
      buttonColor={status.error ? "red" : status.success ? 'green' : '#2780B8'}
      onPress={onSubmit}>
       {status.error ? status.message : status.success ? 'SignUp SuccessFul' : 'GetFit!'}
      </Button>
     {status.success && <Text style={{ color: 'green', textAlign: 'center' }}>{status.message}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },
  form: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
});

export default SignUp;
