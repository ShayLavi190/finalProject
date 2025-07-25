import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useUser } from "../../Model2/userContext";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import robotAnimation from "../SetupScreens/robot.json";
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/bank.mp3";
import Toast from "react-native-toast-message";

const Bank3 = ({ navigation, handleGlobalClick }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing

  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating
    const animation = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";
    animatableRef.current
      .animate(animation, 500)
      .then(() => navigation.navigate(route));
  };

  const handleLottiePress = async () => {
    handleGlobalClick();
    if (sound && isPlaying) {
      await sound.pauseAsync(); // Pause if already playing
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync(); // Resume if paused
      setIsPlaying(true);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: AUDIO_URL },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio(); // Stop audio when leaving the screen
    };
  }, []);

  const handleBank = () => {
    stopAudio(); // Stop audio before performing action
    Toast.show({
      type: "info",
      text1: "Account Status",
      text2: "Your account status is displayed",
      visibilityTime: 4000,
      position: "bottom",
      textStyle: { fontSize: 18 },
    });
    handleGlobalClick();
  };

  return (
    <Animatable.View
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to the bank's services</Text>
        </View>
        <View>
        <Text style={styles.subtitle}>
          To navigate between the different services, click on the button corresponding to the service you want
          to use
        </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#52bfbf", marginTop: 70 },
            ]}
            onPress={handleBank}
          >
            <Text style={styles.forwardButtonText}>Account Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#2D4B73", marginTop: 70 },
            ]}
            onPress={() => handleNavigate("ContactBanker3", "forward")}
          >
            <Text style={styles.forwardButtonText}>Write to the banker</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#F2AB27", marginTop: 70 },
            ]}
            onPress={() => handleNavigate("Transaction3", "forward")}
          >
            <Text style={styles.forwardButtonText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "green", marginTop: 70 },
            ]}
            onPress={() => handleNavigate("Home13", "back")}
          >
            <Text style={styles.forwardButtonText}>Home Screen</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleLottiePress}
          >
            <LottieView
              source={robotAnimation}
              autoPlay
              loop
              style={styles.lottie}
            />
          </TouchableOpacity>
        </View>
        <Toast />
      </ScrollView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
    marginTop: 10,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 100,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 50,
    marginTop: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  forwardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 230,
    height: 70,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  forwardButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 38,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  lottieButton: {
    position: "absolute",
    bottom: -300,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Bank3;
