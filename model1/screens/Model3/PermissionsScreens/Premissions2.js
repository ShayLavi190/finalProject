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
  Alert, // Added Alert import
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av"; // Added Audio import
import robotAnimation from "../SetupScreens/robot.json";

const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/permissions2.mp3";
const Premissions23 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [maintenance, setMaintenance] = useState(false);
  const [customization, setCustomization] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState(false);
  const [robotTracking, setRobotTracking] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  useEffect(() => {
    setMaintenance(user.permissions.maintenance);
    setCustomization(user.permissions.customization);
    setRobotTracking(user.permissions.robotTracking);
    setVoiceRecognition(user.permissions.voiceRecognition);
    setCameraAccess(user.permissions.cameraAccess);
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
      cameraAccess:
        "ללא הרשאה זו לא נוכל לבצע המון פעולות כגון מעקב אחרי הלקוח, זיהוי מקרי חירום או תזוז של הרובוט. מומלץ להפעיל",
      voiceRecognition: "ללא הרשאה זו לא נוכל לנהל איתך דו שיח",
      robotTracking: "ללא הרשאה זו הרובוט לא יוכל לעקוב פיזית אחריך",
      customization: "שדה זה הוא חובה לטובת הניסוי",
      maintenance: "ללא הרשאה זו תצטרכ/י לעשות את עידכוני התוכנה בצורה ידנית",
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
          cameraAccess: cameraAccess,
          robotTracking: robotTracking,
          voiceRecognition: voiceRecognition,
          customization: customization,
          maintenance: maintenance,
        },
      });
      navigation.navigate("Premissions33");
    });
  };

  const handleGoBack = () => {
    stopAudio(); // Stop audio when navigating back

    animatableRef.current.animate("fadeOutRight", 500).then(() => {
      updateUser({
        ...user,
        permissions: {
          ...user.permissions,
          cameraAccess: cameraAccess,
          robotTracking: robotTracking,
          voiceRecognition: voiceRecognition,
          customization: customization,
          maintenance: maintenance,
        },
      });
      navigation.navigate("Premissions13");
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
          <Text style={styles.title}>הגדרת הרשאות למערכת הרובוט המטפל</Text>
          <Text style={styles.subtitle}>
            כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את אישורך
            לפעולות מסויימות . כלל המידע נשמר בצורה מאובטחת ואינו משותף עם שום
            גורם חיצוני ללא ביצוע שירות ייעודי.
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("cameraAccess")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={cameraAccess ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setCameraAccess((prevState) => !prevState);
              }}
              value={cameraAccess}
            />
            <Text style={styles.input}>גישה למצלמה</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("robotTracking")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={robotTracking ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setRobotTracking((prevState) => !prevState);
              }}
              value={robotTracking}
            />
            <Text style={styles.input}>מעקב פיזי של הרובוט אחריך</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("voiceRecognition")}
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
              thumbColor={voiceRecognition ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setVoiceRecognition((prevState) => !prevState);
              }}
              value={voiceRecognition}
            />
            <Text style={styles.input}>גישה למיקרופון וזיהוי קולי</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("customization")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={customization ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setCustomization((prevState) => !prevState);
              }}
              value={customization}
            />
            <Text style={styles.input}>
              גישה לשימוש במידע על שימושך באפליקציה
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("maintenance")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={maintenance ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setMaintenance((prevState) => !prevState);
              }}
              value={maintenance}
            />
            <Text style={styles.input}>הרשאה לעידכוני מערכת אוטומטיים</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={handleMoveForward}
            >
              <Text style={styles.buttonText}>המשך</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={handleGoBack}
            >
              <Text style={styles.buttonText}>חזור</Text>
            </TouchableOpacity>
          </View>
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
    width: "48%",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  forwardBtn: {
    backgroundColor: "green",
  },
  backBtn: {
    backgroundColor: "orange",
  },
  closeBtn: {
    backgroundColor: "red",
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
});

export default Premissions23;
