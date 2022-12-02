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
  Button,
} from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "axios";
import { Themes } from "../assets/Themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Profile from "./Profile";

import { supabase } from "../supabase";
// import { useQuery } from "react-query";
// import { useRoute } from "@react-navigation/native";
// import useUser from "../hooks/GetUser";
import generateColor from "../hooks/GenerateColor";

const Scaledrone = require("scaledrone-react-native");
const SCALEDRONE_CHANNEL_ID = "DElnMaQQKKdu1iza";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.008;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const TASK_GET_LOCATION = "background-location-task";

export const Map = () => {
  const [region, setRegion] = useState(null);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const _getLocationAsync = async () => {
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

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  const componentDidMount = async (name) => {
    var drone = new Scaledrone(SCALEDRONE_CHANNEL_ID, {
      data: {
        name: "Placeholder",
        color: generateColor(),
      },
    });

    drone.on("error", (error) => console.error(error));
    drone.on("close", (reason) => console.error(reason));
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      console.log("Drone on function running");

      Alert.prompt("Please enter a display name. Be creative!", null, (name) =>
        doAuthRequest(drone.clientId, name).then((jwt) => {
          console.log("jwt", jwt);
          drone.authenticate(jwt);
        })
      );
    });
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const room = drone.subscribe("observable-love-alarm");
    room.on("open", (error) => {
      console.log("opening room");
      if (error) {
        return console.error(error);
      } else {
        console.log("Connected to my room");
        _getLocationAsync((position) => {
          const { latitude, longitude } = position.coords;
          // publish device's new location
          drone.publish({
            room: "observable-love-alarm",
            message: { latitude, longitude },
          });
        });
      }
    });

    room.on("members", (members) => setMembers(members));
    room.on("data", (data, member) => updateLocation(data, member.id));
  }
  const updateLocation = (data, memberId) => {
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
      forceUpdate();
    }
  }
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={true}
          rotateEnabled={true}
          minZoomLevel={15}
          //   onMarkerPress={Send Notification}
          ref={(map) => {
            map = map;
          }}
          style={styles.map}
          //   initialRegion={{
          //     latitude: 37.785834,
          //     longitude: -122.406417,
          //     latitudeDelta: LATITUDE_DELTA,
          //     longitudeDelta: LONGITUDE_DELTA,
          //   }}
        >
          {/* createMarkers() */}
        </MapView>
        <Pressable
          style={styles.icon}
          //   onPress={this.props.navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle" style={styles.person} />
        </Pressable>
        {/* <View pointerEvents="none" style={styles.members}>
          {this.createMembers()}
        </View> */}
      </SafeAreaView>
    );
}

export default Map;

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
        />
      );
    });
  }
  createMembers() {
    const { members } = this.state;
    return members.map((member) => {
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
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    height: 30,
    marginTop: 10,
  },
  memberName: {
    marginHorizontal: 10,
  },
  avatar: {
    height: 30,
    width: 30,
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
});
