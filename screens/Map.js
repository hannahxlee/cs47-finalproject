import React, { useState, Component } from "react";
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
  Pressable,
  Modal,
  Image,
  Button,
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "axios";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { getUser } from "../hooks/GetUser";

import Profile from "./Profile";
import Notifs from "../hooks/Notifications";

import { supabase } from "../supabase";
// import { useQuery } from "react-query";
// import { useRoute } from "@react-navigation/native";

const Scaledrone = require("scaledrone-react-native");
const SCALEDRONE_CHANNEL_ID = "DElnMaQQKKdu1iza";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const TASK_GET_LOCATION = "background-location-task";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      error: "",
      members: [],
      location: null,
      errorMsg: null,
      token: "",
    };
  }

  _getLocationAsync = async (callback) => {
    console.log("Getting location async");
    const location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
        timeInterval: 2000,
      },
      (newLocation) => {
        callback(newLocation);
      },
      (error) => console.log(error)
    );
  };

  generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  async componentDidMount(name) {
    console.log(this.props.route);
    var drone = new Scaledrone(SCALEDRONE_CHANNEL_ID, {
      data: {
        name: this.props.route.params.user.username,
        token: this.props.route.params.user.token,
        color: this.generateColor(),
      },
    });

    drone.on("error", (error) => console.error(error));
    drone.on("close", (reason) => console.error(reason));
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      console.log("Drone on function running");

      Alert.prompt("How are you doing today?", null, (name) =>
        doAuthRequest(drone.clientId, name).then((jwt) => {
          drone.authenticate(jwt);
        })
      );
    });

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      this.setState({ errorMsg: "Permission to access location was denied" });
      return;
    }

    const room = drone.subscribe("observable-love-alarm");
    room.on("open", (error) => {
      console.log("opening room");
      if (error) {
        return console.error(error);
      } else {
        console.log("Connected to my room");
        this._getLocationAsync((position) => {
          const { latitude, longitude } = position.coords;
          // publish device's new location
          drone.publish({
            room: "observable-love-alarm",
            message: { latitude, longitude },
          });
        });
      }
    });

    room.on("members", (members) => this.setState({ members }));
    room.on("data", (data, member) => this.updateLocation(data, member.id));
  }

  updateLocation(data, memberId) {
    const { members } = this.state;
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      return;
    }
    if (member.location) {
      member.location
        .timing({
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .start();
    } else {
      member.location = new AnimatedRegion({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.forceUpdate();
    }
  }

  findToken(name) {
    const { members } = this.state;
    console.log("members", members);
    const membersWithLocations = members.find(
      (m) => m.clientData.name === name
    );
    console.log("name is ", name);
    console.log("memberswloc", membersWithLocations);
    console.log("client data", membersWithLocations.clientData);
    const token = membersWithLocations.clientData.token;
    console.log("token", token);
    this.props.navigation.navigate("Notifs", { token: token });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          initialRegion={this.state.region}
          showsUserLocation={true}
          followsUserLocation={true}
          rotateEnabled={true}
          // isZoomEnabled={false}
          // onMarkerPress={
          //   () => this.findToken()

          //   // this.props.navigation.navigate("Notifs", { token: token })
          // }
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}
        >
          {this.createMarkers()}
        </MapView>
        <Pressable
          style={styles.icon}
          onPress={() => this.props.navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle" style={styles.person} />
        </Pressable>
        <View pointerEvents="none" style={styles.members}>
          {this.createMembers()}
        </View>
      </SafeAreaView>
    );
  }
  createMarkers() {
    const { members } = this.state;
    const membersWithLocations = members.filter((m) => !!m.location);
    return membersWithLocations.map((member) => {
      const { id, location } = member;
      const { name, color } = member.clientData;
      return (
        <Marker.Animated
          key={id}
          identifier={id}
          coordinate={location}
          pinColor={color}
          title={name}
          // onPress={() => console.log(name)}
          onPress={() => this.findToken(name)}
        >
          <Image
            source={require("../images/location_heart.png")}
            style={styles.marker}
          />
        </Marker.Animated>
      );
    });
  }
  createMembers() {
    const { members } = this.state;
    const membersWithLocations = members.filter((m) => !!m.location);
    return membersWithLocations.map((member) => {
      const { id, location } = member;
      const { name, color } = member.clientData;
      return (
        <View key={id} style={styles.member}>
          <View style={[styles.avatar, { backgroundColor: color }]}></View>
          <Text style={styles.memberName}>{name}</Text>
        </View>
      );
    });
  }
}

TaskManager.defineTask(TASK_GET_LOCATION, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    // userId = (await AsyncStorage.getItem("userId")) || "none";

    // Storing Received Lat & Long to DB by logged In User Id
    axios({
      method: "POST",
      url: "http://000.000.0.000/phpServer/ajax.php",
      data: {
        action: "saveLocation",
        // userId: userId,
        lat,
        long,
      },
    });
    // console.log("Received new locations for user = ", userId, locations);
  }
});

function doAuthRequest(clientId, name) {
  let status;
  return fetch("http://localhost:3000/auth", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId, name }),
  })
    .then((res) => {
      status = res.status;
      return res.text();
    })
    .then((text) => {
      if (status === 200) {
        return text;
      } else {
        alert(text);
      }
    })
    .catch((error) => console.error(error));
}

async function registerForPushNotificationsAsync() {
  let token;
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
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  members: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  member: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Themes.colors.bg,
    borderRadius: 10,
    height: 25,
    marginTop: 10,
  },
  memberName: {
    marginHorizontal: 10,
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 15,
  },
  icon: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    margin: "2%",
  },
  person: {
    fontSize: 35,
    color: Themes.colors.violet,
  },
  marker: {
    flex: 1,
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
});
