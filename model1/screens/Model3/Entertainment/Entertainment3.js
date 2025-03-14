import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "../../Model2/userContext";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

const Entertainment3 = ({ navigation, handleGlobalClick }) => {
  const { user } = useUser();
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNavigate = (route, direction) => {
    stopAudio(); // Ensure audio stops before navigating
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

  const handelConversation = () => {
    stopAudio(); // Add this line to stop audio when starting conversation
    Alert.alert("דוח שיח התחיל");
    handleGlobalClick();
  };

  // Play / Pause Audio
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
        require("../../../assets/Recordings/entertainment.mp3"), // Ensure the file exists
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>ברוך הבא לשירותי הבידור</Text>
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
              { backgroundColor: "#52bfbf", marginTop: "70" },
            ]}
            onPress={handelConversation}
          >
            <Text style={styles.forwardButtonText}>דו שיח</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#2D4B73", marginTop: "70" },
            ]}
            onPress={() => handleNavigate("NewsChannels3", "forward")}
          >
            <Text style={styles.forwardButtonText}>ערוצי חדשות</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "#F2AB27", marginTop: "70" },
            ]}
            onPress={() => handleNavigate("NewsPapers3", "forward")}
          >
            <Text style={styles.forwardButtonText}>עיתונים</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "red", marginTop: "70" },
            ]}
            onPress={() => handleNavigate("Games3", "forward")}
          >
            <Text style={styles.forwardButtonText}>משחקים</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "green", marginTop: "70" },
            ]}
            onPress={() => handleNavigate("Home13", "back")}
          >
            <Text style={styles.forwardButtonText}>מסך בית</Text>
          </TouchableOpacity>
        </View>
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Entertainment3;
