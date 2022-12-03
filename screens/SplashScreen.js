import React from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { requireNativeModule } from "expo-modules-core";

export const Splash = ({ navigation, route }) => {
  const { user } = route.params;
  // console.log("Data passed into splashscreen", user);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../images/gradient.png")}
        style={styles.background}
      >
        <Text style={styles.text}>
          14 people in your radius are using Love Alarm
        </Text>
        <Image
          source={require("../images/love_alarm.png")}
          style={styles.image}
        />
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Map", { user: user })}
        >
          <Text style={styles.text}>Ring their alarm</Text>
          <Ionicons name="chevron-forward-outline" style={styles.icon} />
        </Pressable>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: undefined,
  },
  image: {
    width: 230,
    height: 230,
    margin: 40,
  },
  text: {
    fontSize: 25,
    fontFamily: "Europa-Bold",
    color: Themes.colors.white,
    textAlign: "center",
    margin: 20,
    lineHeight: 30,
  },
  icon: {
    fontSize: 27,
    color: Themes.colors.white,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
});
