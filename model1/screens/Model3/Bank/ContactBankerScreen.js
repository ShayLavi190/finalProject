import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";

const ContactBanker3 = ({ navigation, handleGlobalClick }) => {
  const [selectedAction, setSelectedAction] = useState("");
  const [info, setInfo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [iconAnimation, setIconAnimation] = useState("");
  const [open, setOpen] = useState(false);
  const animatableRef = useRef(null);
  const modalRef = useRef(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const items = [
    { label: "בקשה למידע נוסף", value: "בקשה למידע נוסף" },
    { label: "תלונה", value: "תלונה" },
    { label: "שירות לקוחות", value: "שירות לקוחות" },
    { label: "פעולה", value: "פעולה" },
    { label: "הגדלת מסגרת", value: "הגדלת מסגרת" },
    { label: "הלוואה", value: "הלוואה" },
    { label: "אחר", value: "אחר" },
  ];

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
        require("../../../assets/Recordings/contactBanker.mp3"), // Ensure the file exists
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

  const handleIconPress = (field) => {
    stopAudio(); // Add this line
    const fieldExplanations = {
      action: "אנא בחר פעולה שברצונך לבצע מהרשימה.",
      info: "אנא הזן את תיאור הבקשה לבנקאי שלך.",
    };
    setExplanation(fieldExplanations[field]);
    setIconAnimation("pulse");
    setModalVisible(true);
    handleGlobalClick();
  };

  const handleNavigate = (route, direction) => {
    stopAudio();
    const animation = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";
    animatableRef.current
      .animate(animation, 500)
      .then(() => navigation.navigate(route));
  };

  const handleSend = () => {
    stopAudio(); // Add this line
    handleGlobalClick();
    if (info !== "" && selectedAction !== "") {
      alert("הבקשה הועברה לבנקאי בהצלחה");
      setInfo("");
      setSelectedAction("");
    } else {
      alert("לא כל השדות מולאו. מלא/י את כלל השדות");
    }
  };

  const closeModal = () => {
    stopAudio(); // Add this line
    modalRef.current
      .animate("fadeOutDown", 500)
      .then(() => setModalVisible(false));
    setIconAnimation("");
    handleGlobalClick();
  };

  return (
    <Animatable.View
      ref={animatableRef}
      animation="fadeInDown"
      duration={2000}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>כתוב לבנקאי</Text>
          <Text style={styles.subtitle}>
            המידע נשמר בצורה מאובטחת. מלא את כלל הפרטים כדי לבצע העברה.
          </Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("action")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <DropDownPicker
              open={open}
              value={selectedAction}
              items={items}
              setOpen={setOpen}
              setValue={setSelectedAction}
              textStyle={styles.input}
              placeholder="בחר פעולה..."
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleIconPress("info")}>
              <Animatable.View
                animation={iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { height: 200 }]}
              placeholder="תיאור"
              value={info}
              onChangeText={setInfo}
            />
          </View>

          <View
            style={{ alignItems: "center", marginBottom: 20, marginTop: 10 }}
          >
            <TouchableOpacity
              style={[styles.button, styles.sendBtn]}
              onPress={handleSend}
            >
              <Text style={styles.buttonText}>שליחת בקשה</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.forwardBtn]}
              onPress={() => handleNavigate("Bank3", "forward")}
            >
              <Text style={styles.buttonText}>פעולות בנקאיות</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.backBtn]}
              onPress={() => handleNavigate("Home13", "back")}
            >
              <Text style={styles.buttonText}>מסך בית</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    shadowColor: "yellow",
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
  },
  dropdown: {
    width: 595,
    borderColor: "gray",
    borderRadius: 5,
  },

  dropdownContainer: {
    width: 595,
    borderColor: "gray",
  },
  sendBtn: {
    backgroundColor: "#52bfbf",
  },
  lottieButton: {
    position: "absolute",
    bottom: -200,
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

export default ContactBanker3;
