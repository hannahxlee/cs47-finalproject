import React from "react";
import { SafeAreaView, Text, View, Pressable, StyleSheet } from "react-native";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";

export const Message = ({ route, navigation }) => {
  //   const name = route.params.name;
  //   const body = route.params.body;
  //   console.log("Name from message", name);
  //   console.log("Body from message", body);

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
      <View style={styles.cardContainer}>
        <View style={styles.cardBackground}>
          <View style={styles.cardMain}>
            <Text style={styles.title}>Message from Hannah</Text>
            <Text style={styles.message}>
              Hey there my name is Hannah and I'm here to let you know that my
              name is Hannah because I'm Hannah and this is my name.
            </Text>
            <Ionicons name="heart" style={styles.heart} />
          </View>
          <View style={styles.triangleLeft}></View>
          <View style={styles.triangleRight}></View>
          <View style={styles.triangleCenter}></View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Map")}
          >
            <Text style={styles.buttonText}>RING SOMEONE'S ALARM</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.white,
    alignItems: "center",
    justifyContent: "space-between",
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
  heart: {
    fontSize: 100,
    color: Themes.colors.violet,
    alignSelf: "center",
  },
  title: {
    fontFamily: "Europa-Bold",
    fontSize: 24,
    alignSelf: "center",
    color: Themes.colors.violet,
    marginTop: 30,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBackground: {
    backgroundColor: Themes.colors.violet,
    width: "90%",
    height: "50%",
    borderRadius: "20%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMain: {
    position: "absolute",
    backgroundColor: Themes.colors.white,
    width: "88%",
    height: "90%",
    borderRadius: "10%",
  },
  triangleCenter: {
    width: 0,
    height: 0,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: "160%",
    borderBottomWidth: "60%",
    borderLeftWidth: "160%",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Themes.colors.lavender,
    borderLeftColor: "transparent",
  },
  triangleRight: {
    width: 0,
    height: 0,
    position: "absolute",
    bottom: 0,
    right: "6%",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: "70%",
    borderLeftWidth: "300%",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Themes.colors.violet,
    borderLeftColor: "transparent",
  },
  triangleLeft: {
    width: 0,
    height: 0,
    position: "absolute",
    bottom: 0,
    left: "6%",
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: "300%",
    borderBottomWidth: "70%",
    borderLeftWidth: 0,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Themes.colors.violet,
    borderLeftColor: "transparent",
  },
  message: {
    color: Themes.colors.violet,
    fontFamily: "Europa-Regular",
    fontSize: 18,
    textAlign: "justify",
    margin: 22,
  },
  buttonContainer: {
    flex: 1,
    width: "90%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    bottom: "18%",
  },
  button: {
    backgroundColor: Themes.colors.violet,
    width: "100%",
    height: "5%",
    borderRadius: "15%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  buttonText: {
    color: Themes.colors.white,
    fontFamily: "Europa-Bold",
    fontSize: 20,
  },
});
