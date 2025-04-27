import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Audio } from "expo-av"; // Import Audio from expo
import { useUser } from "../../Model2/userContext";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import robotAnimation from "../SetupScreens/robot.json";
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/health.mp3";
import Toast from "react-native-toast-message";

const Health3 = ({ navigation, handleGlobalClick }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNavigate = (route, direction) => {
    stopAudio(); // Add this line to stop audio when navigating

    if (direction === "forward") {
      animatableRef.current
        .animate("fadeOutLeft", 500)
        .then(() => navigation.navigate(route));
    } else if (direction === "back") {
      animatableRef.current
        .animate("fadeOutRight", 500)
        .then(() => navigation.navigate(route));
    }
  };

  const handelBuy = () => {
    stopAudio(); // Add this line to stop audio when starting conversation
        Toast.show({
          type: "info",
          text1: "הזמנת תרופות",
          text2: "התרופות הוזמנו",
          visibilityTime: 4000,
          position: "bottom",
          textStyle: { fontSize: 18 },
        });    
        handleGlobalClick();    Alert.alert("התרופות הוזמנו");
    handleGlobalClick();
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

  // Cleanup Audio on Unmount
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
        <Toast />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ברוך הבא לשירותי קופת חולים</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>
            כדי לנווט בין השירותים השונים לחץ על הכפתור המתאים לשירות שברצונך
            להשתמש בו
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#52bfbf", marginTop: "120" },
            ]}
            onPress={() => handleNavigate("Results3", "forward")}
          >
            <Text style={styles.forwardButtonText}>תוצאות בדיקות</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#2D4B73", marginTop: "120" },
            ]}
            onPress={handelBuy}
          >
            <Text style={styles.forwardButtonText}>הזמנת סל תרופות</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "orange" },
            ]}
            onPress={() => handleNavigate("Schedule3", "forward")}
          >
            <Text style={styles.forwardButtonText}>קביעת תור</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "green" },
            ]}
            onPress={() => handleNavigate("Home13", "back")}
          >
            <Text style={styles.forwardButtonText}>מסך בית</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleLottiePress} // Plays the audio when pressed
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
    marginTop: 30,
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
    marginTop: 20,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 30,
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
    marginBottom: 100,
  },
  lottieButton: {
    position: "absolute",
    top: 20,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Health3;
