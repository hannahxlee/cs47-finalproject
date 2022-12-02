import React, { useState } from "react";
import {
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Themes } from "../assets/Themes";
import { supabase } from "../supabase";

import Ionicons from "@expo/vector-icons/Ionicons";

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const loginUser = async () => {
    console.log("LOGGING IN");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setLoginError(true);
        return;
      }
      if (data) {
        console.log("data", data);
        const { data: userData, error } = await supabase
          .from("users")
          .select()
          .eq("id", data.user.user_metadata);
        navigation.navigate("Splash", {
          user: data.user.user_metadata,
        });
      }
      if (error) throw error;
    } catch (e) {
      console.log(e.message);
    }
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
        <Image
          source={require("../images/love_alarm.png")}
          style={styles.heart}
        />
      </View>
      <View style={styles.popup}>
        <Text style={styles.inputText}>Email address</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          minLength={3}
          maxLength={30}
          value={email}
          placeholder="Enter your email address"
          onChangeText={setEmail}
        />
        <Text style={styles.inputText}>Password</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          maxLength={16}
          value={password}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Text style={styles.text}>Sign in with</Text>
        <View style={styles.icons}>
          <Pressable>
            <Ionicons name="logo-google" style={styles.icon} />
          </Pressable>
          <Pressable>
            <Ionicons name="logo-facebook" style={styles.icon} />
          </Pressable>
          <Pressable>
            <Ionicons name="logo-apple" style={styles.icon} />
          </Pressable>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("STARTING...");
            loginUser();
          }}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </Pressable>
        {loginError && (
          <Text style={styles.errorMessage}>Invalid login credentials</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.violet,
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
    color: Themes.colors.bg,
    marginLeft: "1%",
  },
  heart: {
    width: 130,
    height: 130,
    alignSelf: "center",
    marginTop: "20%",
  },
  popup: {
    width: "100%",
    height: "70%",
    position: "absolute",
    bottom: 0,
    backgroundColor: Themes.colors.bg,
    borderTopLeftRadius: "30%",
    borderTopRightRadius: "30%",
    paddingTop: "12%",
    paddingLeft: "7%",
    paddingRight: "7%",
  },
  inputText: {
    fontFamily: "Europa-Regular",
    fontSize: 16,
    color: Themes.colors.violet,
    marginBottom: 10,
  },
  textInput: {
    height: 35,
    padding: 6,
    marginBottom: 20,
    borderRadius: "10%",
    borderWidth: 1,
    backgroundColor: Themes.colors.bg,
    borderColor: Themes.colors.violet,
    color: Themes.colors.violet,
    fontFamily: "Europa-Regular",
  },
  icons: {
    margin: 15,
    flexDirection: "row",
    alignSelf: "center",
  },
  icon: {
    fontSize: 22,
    color: Themes.colors.violet,
    marginRight: 10,
    marginLeft: 10,
  },
  button: {
    width: "100%",
    height: "8%",
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
    color: Themes.colors.bg,
    fontFamily: "Europa-Bold",
  },
  text: {
    marginTop: 10,
    alignSelf: "center",
    size: 12,
    color: Themes.colors.violet,
    fontFamily: "Europa-Regular",
  },
  errorMessage: {
    marginTop: 10,
    alignSelf: "center",
    size: 10,
    color: "red",
    fontFamily: "Europa-LightItalic",
  },
});
