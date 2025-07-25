import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import robotAnimation from "../SetupScreens/robot.json";
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/games.mp3";

const games = [
  {
    id: "1",
    name: "Memory Game",
    backgroundColor: "#ffd358",
    link: "https://www.memozor.com/memory-games",
  },
  {
    id: "2",
    name: "Sudoku",
    backgroundColor: "#809682",
    link: "https://www.websudoku.com/",
  },
  {
    id: "3",
    name: "Trivia",
    backgroundColor: "#193952",
    link: "https://www.funtrivia.com/",
  },
  {
    id: "4",
    name: "Chess",
    backgroundColor: "#fbe9d5",
    link: "https://www.chess.com/play",
  },
  {
    id: "5",
    name: "Geography Quiz",
    backgroundColor: "#b79d7f",
    link: "https://geoguessr.com/",
  },
];

const Games3 = ({ handleGlobalClick, navigation }) => {
  const animatableRef = useRef(null);

  // Audio State
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const openExternalLink = async (url, name) => {
    stopAudio(); // Stop audio when opening a game
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showToast("Open in browser", `Go to ${name}`);
        handleGlobalClick("Opened external link: " + url);
      } else {
        showToast("Error", "Cannot open link");
      }
    } catch (error) {
      showToast("Error", "An error occurred while opening the link");
      console.error("Error opening URL:", error);
    }
  };

  const showToast = (title, message) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      visibilityTime: 3000,
      position: "bottom",
      bottomOffset: 60,
      textStyle: { fontSize: 18, textAlign: "right" },
      style: { width: "90%", backgroundColor: "#4CAF50", borderRadius: 10, alignSelf: "center", zIndex: 9999 },
    });
  };

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
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error loading audio:", error);
      }
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Toast />
          <Text style={styles.title}>Games</Text>
          <Text style={styles.subtitle}>
            To play games click on the game you want to play
          </Text>
          <View style={styles.buttonRowContainer}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.card,
                  { backgroundColor: game.backgroundColor },
                ]}
                onPress={() => openExternalLink(game.link, game.name)}
              >
                <Text style={styles.cardTitle}>{game.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.forwardButton,
                { backgroundColor: "green" },
              ]}
              onPress={() => handleNavigate("Home13", "back")}
            >
              <Text style={styles.forwardButtonText}>Home screen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.forwardButton,
                { backgroundColor: "orange" },
              ]}
              onPress={() => handleNavigate("Entertainment3", "back")}
            >
              <Text style={styles.forwardButtonText}>Entertainment Services</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    marginTop: 10,
  },
  buttonRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    width: "48%",
    padding: 30,
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 28,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 50,
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 60,
  },
  forwardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: 230,
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
    bottom: -50,
    right: 1010,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Games3;