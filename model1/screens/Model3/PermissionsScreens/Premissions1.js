import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av"; // Added Audio import
import robotAnimation from "../SetupScreens/robot.json";

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/permissions1.mp3";
const Premissions13 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [publicServices, setPublicServices] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState(false);
  const [shareHealthInfo, setShareHealthInfo] = useState(false);
  const [healthMonitoring, setHealthMonitoring] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  useEffect(() => {
    setPublicServices(user.permissions.publicServices);
    setEmergencyContacts(user.permissions.emergencyContacts);
    setShareHealthInfo(user.permissions.shareHealthInfo);
    setHealthMonitoring(user.permissions.healthMonitoring);
  }, [user]);

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleIconPress = (field) => {
    stopAudio(); // Stop audio when opening explanation modal

    const fieldExplanations = {
      publicServices:
        "ללא הרשאה זו לא נוכל להשתמש במידע שהזנת לשירותים ציבוריים כגון בנק, קופת חולים וסופרמרקט",
      emergencyContacts:
        "ללא הרשאה זו לא נוכל להתקשר לאיש הקשר שלך במקרה חירום",
      shareHealthInfo:
        "ללא הרשאה זו לא נוכל להשתמש במידע הרפואי שלך לשירותים של קופת חולים ולא תוכל להשתמש בשירות זה באופן כללי",
      healthMonitoring:
        "ללא הרשאה זו לא נוכל לנתר את מצבך הרפואי מהתקנים שיש לך בהם שימוש כגון שעון חכם",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleMoveForward = () => {
    stopAudio(); // Stop audio when navigating forward

    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        permissions: {
          ...user.permissions,
          publicServices: publicServices,
          emergencyContacts: emergencyContacts,
          shareHealthInfo: shareHealthInfo,
          healthMonitoring: healthMonitoring,
        },
      });
      navigation.navigate("HomePermissions");
    });
  };

  // Updated to handle audio playback
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
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert("שגיאה בהפעלת ההקלטה", "לא ניתן להפעיל את ההקלטה כרגע.");
      }
    }
  };

  const closeModal = () => {
    stopAudio(); // Stop audio when closing modal

    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <Animatable.View
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
      ref={animatableRef}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            הגדרת הרשאות לשירותי הבריאות ושירותים ציבוריים
          </Text>
          <Text style={styles.subtitle}>
            כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את אישורך
            לפעולות מסויימות . כלל המידע נשמר בצורה מאובטחת ואינו משותף עם שום
            גורם חיצוני ללא ביצוע שירות ייעודי.
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("publicServices")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={publicServices ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setPublicServices((prevState) => !prevState);
              }}
              value={publicServices}
            />
            <Text style={styles.input}>שימוש בשירותים ציבוריים</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("healthMonitoring")}
            >
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={healthMonitoring ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setHealthMonitoring((prevState) => !prevState);
              }}
              value={healthMonitoring}
            />
            <Text style={styles.input}>מעקב אחר מצב בריאותי</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("emergencyContacts")}
            >
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={emergencyContacts ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setEmergencyContacts((prevState) => !prevState);
              }}
              value={emergencyContacts}
            />
            <Text style={styles.input}>גישה לפרטי איש קשר למקרה חירום</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("shareHealthInfo")}
            >
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={shareHealthInfo ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setShareHealthInfo((prevState) => !prevState);
              }}
              value={shareHealthInfo}
            />
            <Text style={styles.input}>שיתוף מידע עם גורמים בריאותיים</Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={[{ backgroundColor: "green" }, styles.button]}
            onPress={handleMoveForward}
          >
            <Text style={styles.buttonText}>שמור</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalContainer}>
            <Animatable.View
              ref={modalRef}
              animation="fadeInUp"
              duration={500}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{explanation}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>סגור</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
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
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 200,
  },
  card: {
    width: "90%",
    maxWidth: 800,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: 600,
  },
  input: {
    flex: 1,
    textAlign: "right",
    marginRight: 20,
    padding: 10,
    fontSize: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 60,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
    marginLeft: 70,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transperent",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderEndColor: "black",
    borderBottomEndRadius: "2",
  },
  fontex: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  lottieButton: {
    position: "absolute",
    top: 80,
    right: 110,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Premissions13;
