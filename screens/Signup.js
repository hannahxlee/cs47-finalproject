import * as React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import { Themes } from "../assets/Themes";
import { supabase } from "../supabase";

import Ionicons from "@expo/vector-icons/Ionicons";

export const Signup = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signUpUser = async () => {
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      });
      if (error) throw error;
      console.log("success");
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
            signUpUser;
            navigation.navigate("Map");
          }}
        >
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.bg,
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
    backgroundColor: Themes.colors.bg,
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
    color: Themes.colors.bg,
    fontFamily: "Europa-Bold",
  },
});
