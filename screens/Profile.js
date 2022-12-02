import React, { useState, Component } from "react";
import { SafeAreaView, Pressable, StyleSheet, Text, View } from "react-native";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import ConfettiCannon from "react-native-confetti-cannon";
import Notifs from "../hooks/Notifications";

export const Profile = ({ navigation }) => {
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
      <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} />
      {/* <ConfettiCannon
        autoStart={false}
        count={100}
        origin={{ x: 0, y: 0 }}
        fallSpeed={3000}
        colors={[Themes.colors.violet]}
      /> */}
      <Text style={styles.username}>MY PROFILE</Text>
      <Ionicons name="heart-outline" style={styles.heart} />
      <Text style={styles.likeCount}>96</Text>
      <Text style={styles.text}>
        You are currently the 5th most liked person
      </Text>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  username: {
    fontFamily: "Europa-Bold",
    fontSize: 30,
    textAlign: "center",
    color: Themes.colors.violet,
  },
  heart: {
    fontSize: 100,
    marginTop: "5%",
    color: Themes.colors.violet,
  },
  likeCount: {
    fontFamily: "Europa-Bold",
    fontSize: 50,
    textAlign: "center",
    color: Themes.colors.violet,
    margin: "5%",
  },
  text: {
    width: "60%",
    fontFamily: "Europa-Bold",
    fontSize: 18,
    textAlign: "center",
    color: Themes.colors.violet,
  },
});
