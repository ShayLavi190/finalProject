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
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/newsChannels.mp3";

const channels = [
  {
    id: "1",
    name: "ערוץ 12 - חדשות",
    backgroundColor: "#ffe59b",
    link: "https://www.mako.co.il/mako-vod-live-tv/VOD-6540b8dcb64fd31006.htm",
  },
  {
    id: "2",
    name: "ערוץ 13 - רשת",
    backgroundColor: "#c9272e",
    link: "https://13tv.co.il/live/",
  },
  {
    id: "3",
    name: "ערוץ 11 - כאן",
    backgroundColor: "#d0c0a9",
    link: "https://www.kan.org.il/live/tv.aspx?stationId=2",
  },
  {
    id: "4",
    name: "ערוץ 14 - עכשיו 14",
    backgroundColor: "#27496d",
    link: "https://now14.co.il/live/",
  },
];

const NewsChannels3 = ({ handleGlobalClick, navigation }) => {
  const animatableRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const openExternalLink = async (url, name) => {
    stopAudio(); // Stop audio when opening a news channel
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        showToast("נפתח בדפדפן", `מעבר ל${name}`);
        handleGlobalClick("Opened external link: " + url);
      } else {
        showToast("שגיאה", "לא ניתן לפתוח את הקישור");
      }
    } catch (error) {
      showToast("שגיאה", "אירעה שגיאה בפתיחת הקישור");
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
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Toast />
          <Text style={styles.title}>ערוצי חדשות</Text>
          <Text style={styles.subtitle}>
            על מנת לצפות בערוצי החדשות לחץ על ערוץ שברצונך לצפות
          </Text>
          <View style={styles.buttonRowContainer}>
            {channels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={[
                  styles.card,
                  { backgroundColor: channel.backgroundColor },
                ]}
                onPress={() => openExternalLink(channel.link, channel.name)}
              >
                <Text style={styles.cardTitle}>{channel.name}</Text>
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
              <Text style={styles.forwardButtonText}>מסך בית</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.forwardButton,
                { backgroundColor: "orange" },
              ]}
              onPress={() => handleNavigate("Entertainment3", "back")}
            >
              <Text style={styles.forwardButtonText}>שירותי בידור</Text>
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
    marginTop: 150,
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

export default NewsChannels3;