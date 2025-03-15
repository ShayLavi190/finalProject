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

const Premissions33 = ({ navigation, handleGlobalClick }) => {
  const { user, updateUser } = useUser();
  const [socialInteraction, setSocialInteraction] = useState(false);
  const [financialActions, setFinancialActions] = useState(false);
  const [automatedTasks, setAutomatedTasks] = useState(false);
  const [smartHomeControl, setSmartHomeControl] = useState(false);
  const [familyUpdates, setFamilyUpdates] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  useEffect(() => {
    setSocialInteraction(user.permissions.socialInteraction);
    setFinancialActions(user.permissions.financialActions);
    setAutomatedTasks(user.permissions.automatedTasks);
    setSmartHomeControl(user.permissions.smartHomeControl);
    setFamilyUpdates(user.permissions.familyUpdates);
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
      socialInteraction: "ללא הרשאה זו לא תוכל/י לנהל דו שיח עם הרובוט המטפל",
      financialActions: "ללא הרשאה זו לא תוכל/י להשתמש בשירותים פיננסים",
      automatedTasks:
        "ללא הרשאה זו הרובוט לא תוכל/י לבצע משימות באופן אוטומטי כמו הזמנת תרופות והזמנת סל קניות קבוע",
      smartHomeControl: "ללא הרשאה זו לא נוכל לתקשר עם התקני הבית שלך",
      familyUpdates:
        "ללא הרשאה זו לא נוכל לעדכן את איש הקשר שלך בעידכונים מצילי חיים",
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
          socialInteraction: socialInteraction,
          financialActions: financialActions,
          automatedTasks: automatedTasks,
          smartHomeControl: smartHomeControl,
          familyUpdates: familyUpdates,
        },
      });
      navigation.navigate("Home13");
    });
  };

  const handleGoBack = () => {
    stopAudio(); // Stop audio when navigating back

    animatableRef.current.animate("fadeOutRight", 500).then(() => {
      updateUser({
        ...user,
        permissions: {
          ...user.permissions,
          socialInteraction: socialInteraction,
          financialActions: financialActions,
          automatedTasks: automatedTasks,
          smartHomeControl: smartHomeControl,
          familyUpdates: familyUpdates,
        },
      });
      navigation.navigate("Premissions23");
    });
  };

  const closeModal = () => {
    stopAudio(); // Stop audio when closing modal

    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
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
          require("../../../assets/Recordings/permissions3.mp3"), // Make sure this file exists
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
            <TouchableOpacity
              onPress={() => handleIconPress("socialInteraction")}
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
              thumbColor={socialInteraction ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                handleGlobalClick();
                setSocialInteraction((prevState) => !prevState);
              }}
              value={socialInteraction}
            />
            <Text style={styles.input}>הרשאה לניהול דו שיח</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("financialActions")}
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
              thumbColor={financialActions ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                handleGlobalClick();
                setFinancialActions((prevState) => !prevState);
              }}
              value={financialActions}
            />
            <Text style={styles.input}>הרשאה לביצוע פעולות פיננסיות</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("automatedTasks")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={automatedTasks ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                handleGlobalClick();
                setAutomatedTasks((prevState) => !prevState);
              }}
              value={automatedTasks}
            />
            <Text style={styles.input}>הרשאה לביצוע משימות באופן אוטומטי</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => handleIconPress("smartHomeControl")}
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
              thumbColor={smartHomeControl ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                handleGlobalClick();
                setSmartHomeControl((prevState) => !prevState);
              }}
              value={smartHomeControl}
            />
            <Text style={styles.input}>הרשאה לשליטה על מערכות בית חכם</Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("familyUpdates")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={familyUpdates ? "#f5dd4b" : "#f4f3f4"}
              width="200"
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                handleGlobalClick();
                setFamilyUpdates((prevState) => !prevState);
              }}
              value={familyUpdates}
            />
            <Text style={styles.input}>
              הרשאה לעידכונים חשובים לאיש קשר שהוזן
            </Text>
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
              source={require("../SetupScreens/robot.json")}
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
    marginBottom: 90,
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
    width: 640,
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

export default Premissions33;
