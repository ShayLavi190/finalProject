import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import DropDownPicker from "react-native-dropdown-picker";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import robotAnimation from "../SetupScreens/robot.json";
import Toast from "react-native-toast-message";
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/contactBanker.mp3";

const ContactBanker3 = ({ navigation, handleGlobalClick }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [info, setInfo] = useState("");
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animatableRef = useRef(null);
  
  const items = [
    { label: "בקשה למידע נוסף", value: "בקשה למידע נוסף" },
    { label: "תלונה", value: "תלונה" },
    { label: "שירות לקוחות", value: "שירות לקוחות" },
    { label: "פעולה", value: "פעולה" },
    { label: "הגדלת מסגרת", value: "הגדלת מסגרת" },
    { label: "הלוואה", value: "הלוואה" },
    { label: "אחר", value: "אחר" },
  ];

  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating
    const animation = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";
    animatableRef.current
      .animate(animation, 500)
      .then(() => navigation.navigate(route))
      .catch((error) => {
        console.error("Animation error:", error);
        navigation.navigate(route);
      });
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
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'שגיאה בהפעלת ההקלטה',
          text2: 'לא ניתן להפעיל את ההקלטה כרגע',
          visibilityTime: 4000,
        });
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

  const handleSend = () => {
    stopAudio(); // Stop audio when submitting
    handleGlobalClick();
    
    if (info.trim() !== "" && selectedAction !== null) {
      // Hide any currently showing Toast
      Toast.hide();
      
      // Show success toast
      setTimeout(() => {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'הצלחה',
          text2: 'הבקשה הועברה לבנקאי בהצלחה',
          visibilityTime: 4000,
          autoHide: true,
        });
      }, 100);
      
      setInfo("");
      setSelectedAction(null);
    } else {
      // Hide any currently showing Toast
      Toast.hide();
      
      // Show error toast
      setTimeout(() => {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'שגיאה',
          text2: 'לא כל השדות מולאו. מלא/י את כלל השדות',
          visibilityTime: 4000,
          autoHide: true,
        });
      }, 100);
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
      ref={animatableRef}
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>כתוב לבנקאי</Text>
          </View>
          
          <View>
            <Text style={styles.subtitle}>
              המידע נשמר בצורה מאובטחת. מלא את כלל הפרטים כדי ליצור קשר עם הבנקאי שלך.
            </Text>
          </View>
          
          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Action Dropdown */}
            <DropDownPicker
              open={open}
              value={selectedAction}
              items={items}
              setOpen={setOpen}
              setValue={setSelectedAction}
              placeholder="בחר פעולה..."
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
            
            {/* Description Input */}
            <TextInput
              style={styles.textArea}
              placeholder="הזן את תיאור הבקשה שלך כאן..."
              value={info}
              onChangeText={setInfo}
              multiline
              textAlignVertical="top"
            />
            
            {/* Send Button */}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Text style={styles.buttonText}>שליחת בקשה</Text>
            </TouchableOpacity>
          </View>
          
          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "orange" }]}
              onPress={() => handleNavigate("Bank3", "forward")}
            >
              <Text style={styles.buttonText}>פעולות בנקאיות</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={() => handleNavigate("Home13", "back")}
            >
              <Text style={styles.buttonText}>מסך בית</Text>
            </TouchableOpacity>
          </View>
          
          {/* Lottie Animation */}
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
          
          <Toast />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
    marginTop: 10,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
    fontWeight: "bold",
    maxWidth: 800,
  },
  formContainer: {
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
    marginBottom: 30,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
    color: "#333",
  },
  dropdown: {
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    zIndex: 3000,
  },
  dropdownText: {
    fontSize: 16,
    textAlign: "center",
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  textArea: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#52bfbf",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 800,
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  lottieButton: {
    position: "absolute",
    top: 600,
    right: 900,
    width: 300,
    height: 300,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default ContactBanker3;