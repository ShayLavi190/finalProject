import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import robotAnimation from "../SetupScreens/robot.json";
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/emergency.mp3";

const Emergency3 = ({ navigation, handleGlobalClick }) => {
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const buttons = [
    {
      label: "Calling the police",
      backgroundColor: "#1f5eff",
      action: () => {
      stopAudio(); // Add this line
      showToast("Emergency", "Calling the police");
      handleGlobalClick();
      },
    },
    {
      label: "Calling Fire Department",
      backgroundColor: "#ffd900",
      action: () => {
      stopAudio(); // Add this line
      showToast("Emergency", "Calling Fire Department");
      handleGlobalClick();
      },
    },
    {
      label: "Calling Magen David Adom",
      backgroundColor: "#f44336",
      action: () => {
      stopAudio(); // Add this line
      showToast("Emergency", "Calling Magen David Adom");
      handleGlobalClick();
      },
    },
    {
      label: "Calling a contact",
      backgroundColor: "#6aa84f",
      action: () => {
      stopAudio(); // Add this line
      showToast("Emergency", "Calling a contact");
      handleGlobalClick();
      },
    },
  ];

  const showToast = (title, message) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      visibilityTime: 4000,
      position: "bottom",
      bottomOffset: 60,
      textStyle: { fontSize: 18, textAlign: "right" },
      style: { width: "90%", backgroundColor: "#4CAF50", borderRadius: 10, alignSelf: "center", zIndex: 9999 },
    });
  };

  const handleNavigate = (route) => {
    stopAudio(); // Ensure audio stops before navigating
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
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
      stopAudio(); // Cleanup audio when unmounting
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
        <Toast />
        <View style={styles.titleContainer}>
        <Text style={styles.title}>Emergency</Text>
        <Text style={styles.subtitle}>
          This page allows you to call security and rescue services as well as an emergency contact
          that you have entered in the system. To call, click on the appropriate button
        </Text>
        </View>

        <View style={styles.buttonRowContainer}>
          {buttons.map(({ label, backgroundColor, action }) => (
            <View key={label} style={styles.buttonWrapper}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor }]}
                onPress={action}
              >
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.forwardButton}
          onPress={() => handleNavigate("Home13")}
        >
          <Text style={styles.forwardButtonText}>Home screen</Text>
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
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 130,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
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
    marginBottom: 30,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
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
  lottieButton: {
    position: "absolute",
    top: 90,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Emergency3;