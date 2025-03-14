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

const Home23 = ({ navigation }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track if audio is playing

  const buttons = [
    { label: "בידור", route: "Entertainment3", backgroundColor: "#a39193" },
    {
      label: "עידכון פרטים אישיים",
      route: "Setup3",
      backgroundColor: "#8db1fa",
    },
    {
      label: "הרשאות פרטיות",
      route: "Premissions13",
      backgroundColor: "#35223c",
    },
    { label: "ביצועים", route: "Performance3", backgroundColor: "#9dbda4" },
  ];

  const handleNavigate = (route) => {
    stopAudio(); // Stop audio when navigating
    animatableRef.current
      .animate("fadeOutRight", 500)
      .then(() => navigation.navigate(route));
  };

  const handleLottiePress = async () => {
    handleGlobalClick();
    if (sound && isPlaying) {
      // If playing, pause the audio
      await sound.pauseAsync();
      setIsPlaying(false);
    } else if (sound) {
      // If paused, resume playing
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../../assets/Recordings/homeScreen2.mp3"), // Ensure the file exists
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

  return (
    <Animatable.View
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>
            ברוך הבא לדף הבית. בחר את השירות שברצונך להשתמש...
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
          onPress={() => handleNavigate("Home13")}
        >
          <Text style={styles.forwardButtonText}>חזור</Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleLottiePress}
          >
            <LottieView
              source={require("../SetupScreens/robot.json")}
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
    marginTop: 50,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 50,
  },
  lottieButton: {
    position: "absolute",
    top: 50,
    right: 110,
    width: 300,
    height: 300,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
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
    marginTop: 20,
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
  forwardButton: {
    marginTop: 30,
    backgroundColor: "orange",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 300,
    marginTop: 50,
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
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default Home23;
