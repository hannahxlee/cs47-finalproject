import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../images/love_alarm_violet.png")}
        style={styles.heart}
      />
      <Text style={styles.title}>love alarm</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>LOG IN</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.buttonText}>SIGN UP</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    width: 200,
    height: 200,
    margin: 30,
  },
  title: {
    fontSize: 50,
    fontFamily: "Europa-Bold",
    color: Themes.colors.violet,
    marginBottom: "10%",
  },
  button: {
    width: "75%",
    height: "5%",
    borderRadius: "10%",
    backgroundColor: Themes.colors.violet,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },

  buttonText: {
    size: 14,
    color: Themes.colors.white,
    fontFamily: "Europa-Bold",
  },
});
