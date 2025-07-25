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

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/homeScreen1.mp3";

const Home13 = ({ navigation, handleGlobalClick }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const buttons = [
    { label: "Bank", route: "Bank3", backgroundColor: "#0f473a" },
    { label: "Health Services", route: "Health3", backgroundColor: "#4ebcff" },
    { label: "Supermarket", route: "Supermarket3", backgroundColor: "#eab676" },
    { label: "Emergency", route: "Emergency3", backgroundColor: "red" },
  ];

  const handleNavigate = (route) => {
    stopAudio();
    animatableRef.current.animate("fadeOutLeft", 500).then(() => navigation.navigate(route));
  };

  const handleLottiePress = async () => {
    handleGlobalClick();
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      await sound.playAsync();
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
      stopAudio();
    };
  }, []);

  return (
    <Animatable.View
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Text style={styles.subtitle}>
            Welcome to your home screen. Choose the service you wish to use...
          </Text>
        </View>
        <View style={styles.buttonRowContainer}>
          {buttons.map((button) => (
            <View key={button.label} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: button.backgroundColor },
                ]}
                onPress={() => handleNavigate(button.route)}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.forwardButton}
          onPress={() => handleNavigate("Home23")}
        >
          <Text style={styles.forwardButtonText}>Next</Text>
        </TouchableOpacity>
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
  },
  lottieButton: {
    position: "absolute",
    top: 50,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
    fontWeight: "bold",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 50,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  forwardButton: {
    marginTop: 30,
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
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
});

export default Home13;
