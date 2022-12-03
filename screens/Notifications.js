import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
// import * as TaskManager from "expo-task-manager";
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notifs({ route, navigation }) {
  const [notification, setNotification] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    // registerForPushNotificationsAsync()
    //   .then((token) => {
    //     setExpoPushToken(token);
    //   })
    //   .catch((err) => console.log(err));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Response upon click:", response);
        navigation.navigate("Message", { name: title, body: body });
        navigation.navigate("Message");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification() {
    const token = route.params.token;
    const username = route.params.username;

    // await Notifications.scheduleNotificationAsync({
    //   // to: ExponentPushToken[flJJEVNlwtdd8_2DsFuoVt],
    //   to: "ExponentPushToken[zJLfCzNTY2OtxZONUxQhOJ]",
    //   content: {
    //     title: title,
    //     body: body,
    //   },
    //   trigger: { seconds: 2 },
    // });

    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      trigger: { seconds: 3 },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Pressable
          style={styles.top}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons name="chevron-back-outline" style={styles.back} />
        </Pressable>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>
          Ring {route.params.username}'s love alarm
        </Text>

        <Text style={styles.inputText}>Enter your name</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          minLength={3}
          maxLength={30}
          value={title}
          placeholder="Enter your name"
          onChangeText={setTitle}
        />
        <Text style={styles.inputText}>Send a message</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          minLength={1}
          maxLength={100}
          value={body}
          placeholder="Enter the subject of your message"
          onChangeText={setBody}
        />

        {/* <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text> */}

        <Button
          title="SEND"
          style={styles.sendNotif}
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
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
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "center",
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
  title: {
    fontFamily: "Europa-Bold",
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 40,
  },
  textInput: {
    height: 35,
    padding: 6,
    marginBottom: 20,
    borderRadius: "10%",
    borderWidth: 1,
    backgroundColor: Themes.colors.white,
    borderColor: Themes.colors.violet,
    color: Themes.colors.violet,
    fontFamily: "Europa-Regular",
  },
  inputText: {
    fontFamily: "Europa-Regular",
    fontSize: 16,
    color: Themes.colors.violet,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    paddingLeft: "7%",
    paddingRight: "7%",
    justifyContent: "center",
  },
  sendNotif: {
    fontSize: 50,
    color: Themes.colors.violet,
  },
});

// TaskManager.defineTask(MY_TASK_NAME, ({ data, error }) => {});
// In a React component somewhere, put: Notifications.registerTaskAsync(MY_TASK_NAME)
