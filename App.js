import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
} from "react-native";
import MapView, { Marker, AnimatedRegion, LocalTile } from "react-native-maps";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { Themes } from "./assets/Themes";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./screens/HomeScreen";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Map from "./screens/Map";
import Profile from "./screens/Profile";
import Notifs from "./hooks/Notifications";
import Splash from "./screens/SplashScreen";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Europa-Bold": require("./assets/Fonts/Europa-Bold.otf"),
    "Europa-BoldItalic": require("./assets/Fonts/Europa-BoldItalic.otf"),
    "Europa-Light": require("./assets/Fonts/Europa-Light.otf"),
    "Europa-LightItalic": require("./assets/Fonts/Europa-LightItalic.otf"),
    "Europa-Regular": require("./assets/Fonts/Europa-Regular.otf"),
    "Europa-RegularItalic": require("./assets/Fonts/Europa-RegularItalic.otf"),
  });
  if (!fontsLoaded) return null;
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifs"
          component={Notifs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
