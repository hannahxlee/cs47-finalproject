import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Themes } from "../assets/Themes";
import { supabase } from "../supabase";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Ionicons from "@expo/vector-icons/Ionicons";

export const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [signUpError, setSignUpError] = useState(false);

  const signUpUser = async (token) => {
    console.log("From signUpUser", token);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            token: token,
          },
        },
      });
      if (error) {
        setSignUpError(true);
        console.log("WE GOT AN ERROR", signUpError);
        return;
      }
      if (!error) {
        navigation.navigate("Login");
      }
      if (error) throw error;
    } catch (e) {
      console.log(e.message);
    }
  };

  const getToken = () => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
        console.log("From getToken:", token);
        console.log("From getToken (expoPushToken):", expoPushToken);
        signUpUser(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Pressable
          style={styles.top}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Ionicons name="chevron-back-outline" style={styles.back} />
        </Pressable>
      </View>
      <Text style={styles.text}>Let's start with the basics</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          minLength={3}
          maxLength={16}
          value={username}
          placeholder="Username"
          placeholderTextColor={Themes.colors.violet}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={email}
          placeholder="Email address"
          placeholderTextColor={Themes.colors.violet}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          minLength={8}
          maxLength={30}
          value={password}
          placeholder="Password"
          placeholderTextColor={Themes.colors.violet}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Pressable
          style={styles.button}
          onPress={() => {
            getToken();
            // signUpUser();
          }}
        >
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </Pressable>
        {signUpError && (
          <Text style={styles.errorMessage}>
            This account has already been registered
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

async function registerForPushNotificationsAsync() {
  // console.log("In registerforPushNotifications");
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    // console.log("Device is device");

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // console.log("DID I GET PERMISSION?", finalStatus);
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("From registerForPushNotificationsAsync", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  top: {
    width: "100%",
    height: "30%",
    position: "absolute",
    top: 0,
    alignSelf: "center",
    justifyContent: "center",
    margin: "3%",
  },
  back: {
    fontSize: 30,
    color: Themes.colors.violet,
    marginLeft: "1%",
  },
  text: {
    alignSelf: "center",
    color: Themes.colors.violet,
    fontSize: 20,
    fontFamily: "Europa-Bold",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    padding: "7%",
  },
  inputText: {
    fontFamily: "Europa-Regular",
    fontSize: 16,
    color: Themes.colors.violet,
    marginBottom: 10,
  },
  textInput: {
    height: 35,
    paddingTop: 6,
    paddingRight: 6,
    paddingBottom: 6,
    marginBottom: 20,
    borderBottomWidth: 1,
    backgroundColor: Themes.colors.white,
    borderColor: Themes.colors.violet,
    color: Themes.colors.violet,
    fontFamily: "Europa-Regular",
  },
  button: {
    width: "100%",
    height: "15%",
    borderRadius: "10%",
    backgroundColor: Themes.colors.violet,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 5,
  },
  buttonText: {
    fontSize: 18,
    color: Themes.colors.white,
    fontFamily: "Europa-Bold",
  },
  errorMessage: {
    marginTop: 10,
    alignSelf: "center",
    size: 10,
    color: "red",
    fontFamily: "Europa-LightItalic",
  },
});
