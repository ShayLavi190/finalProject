import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useUser } from "../../Model2/userContext";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import robotAnimation from "./robot.json"; 

// Constants
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/setup1.mp3";
const MAX_NAME_LENGTH = 50;
const MAX_PHONE_LENGTH = 10;
const MAX_ID_LENGTH = 9;

const Setup3 = ({ navigation, handleGlobalClick }) => {
  // State management
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: user.name || "",
    idr: user.idr|| "",
    id: user.id || "",
    phone: user.phone || "",
  });
  const [modalState, setModalState] = useState({
    visible: false,
    explanation: "",
    iconAnimation: "",
  });
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentTime: 0,
    sound: null,
  });

  // Refs
  const audioRef = useRef(null);
  const modalRef = useRef(null);
  const animatableRef = useRef(null);

  // Audio management functions
  const stopAudio = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (audioRef.current) {
        setAudioState(prev => ({
          ...prev,
          currentTime: audioRef.current.currentTime,
          isPlaying: false
        }));
        audioRef.current.pause();
      }
      return;
    }
    
    if (audioState.sound) {
      try {
        const status = await audioState.sound.getStatusAsync();
        setAudioState(prev => ({
          ...prev,
          currentTime: status.positionMillis / 1000,
          isPlaying: false
        }));
        await audioState.sound.pauseAsync();
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
    }
  }, [audioState.sound]);

  // Input validation
  const validateInput = useCallback((field, value) => {
    switch (field) {
      case 'name':
        return value.trim().length > 0 && value.length <= MAX_NAME_LENGTH;
      case 'idr':
        return /^\d+$/.test(value) && value.length === MAX_ID_LENGTH;
      case 'id':
          return value.trim().length > 0;
      case 'phone':
        return /^\d+$/.test(value) && value.length === MAX_PHONE_LENGTH;
      default:
        return false;
    }
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Validate all inputs
  const validateAllInputs = useCallback(() => {
    const errors = [];
    
    if (!validateInput('name', formData.name)) {
      errors.push("שם מלא נדרש ואינו יכול להיות ריק.");
    }
    if (!validateInput('id', formData.id)) {
      errors.push("מספר זיהוי משתתף נדרש.");
    }
    if (!validateInput('idr', formData.idr)) {
      errors.push("תעודת זהות חייבת להיות 9 ספרות.");
    }
    
    if (!validateInput('phone', formData.phone)) {
      errors.push("מספר טלפון חייב להיות באורך 10 ספרות.");
    }

    return errors;
  }, [formData, validateInput]);

  // Show errors
  const showErrors = useCallback((errors) => {
    if (Platform.OS === 'web') {
      errors.forEach((error, index) => {
        setTimeout(() => {
          Toast.show({
            type: "error",
            position: "bottom",
            text1: "שגיאה",
            text2: error,
            visibilityTime: 4000,
            autoHide: true,
          });
        }, index * 800);
      });
    } else {
      Alert.alert("שגיאה", errors.join("\n"));
    }
  }, []);

  // Move to next screen
  const handleMoveForward = useCallback(() => {
    // Stop audio if playing
    if (audioState.isPlaying) {
      stopAudio();
    }

    // Validate inputs
    const errors = validateAllInputs();
    
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Animate and navigate
    animatableRef.current.animate("fadeOutLeft", 500).then(() => {
      updateUser({
        ...user,
        name: formData.name,
        phone: formData.phone,
        id: formData.id,
        idr: formData.idr
      });
      navigation.navigate("SetUp23");
    });
  }, [
    audioState.isPlaying, 
    stopAudio, 
    validateAllInputs, 
    showErrors, 
    updateUser, 
    user, 
    navigation, 
    formData
  ]);

  // Audio playback handler
  const handleAudioPlayback = useCallback(async () => {
    handleGlobalClick();

    // Web platform handling
    if (Platform.OS === 'web') {
      if (!audioRef.current) {
        Toast.show({
          type: "error",
          text1: "שגיאה",
          text2: "לא ניתן להפעיל את ההקלטה",
        });
        return;
      }

      if (audioState.isPlaying) {
        // Pause
        audioRef.current.pause();
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: audioRef.current.currentTime
        }));
      } else {
        try {
          // Set source and play
          audioRef.current.src = AUDIO_URL;
          audioRef.current.currentTime = audioState.currentTime;
          await audioRef.current.play();
          
          setAudioState(prev => ({
            ...prev,
            isPlaying: true,
            sound: true // Mark as loaded
          }));
        } catch (error) {
          console.error("Web audio error:", error);
          Toast.show({
            type: "error",
            text1: "שגיאה",
            text2: "לא ניתן להפעיל את ההקלטה",
          });
        }
      }
      return;
    }

    // Native platform handling
    try {
      if (audioState.sound && audioState.isPlaying) {
        // Pause if playing
        await stopAudio();
      } else if (audioState.sound) {
        // Resume from paused position
        await audioState.sound.playFromPositionAsync(audioState.currentTime * 1000);
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } else {
        // First time playing
        const { sound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { 
            shouldPlay: true,
            positionMillis: 0
          }
        );

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setAudioState(prev => ({
              ...prev,
              isPlaying: false,
              currentTime: 0
            }));
          }
        });

        setAudioState({
          sound,
          isPlaying: true,
          currentTime: 0
        });
      }
    } catch (error) {
      console.error("Native audio error:", error);
      Alert.alert("שגיאה", "לא ניתן להפעיל את ההקלטה");
    }
  }, [
    handleGlobalClick, 
    audioState.isPlaying, 
    audioState.sound, 
    audioState.currentTime,
    stopAudio
  ]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web' && audioState.sound) {
        audioState.sound.unloadAsync();
      }
    };
  }, [audioState.sound]);

  // Web audio time tracking
  useEffect(() => {
    if (Platform.OS === 'web' && audioRef.current) {
      const trackTime = () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audioRef.current.currentTime
        }));
      };

      const audioElement = audioRef.current;
      audioElement.addEventListener('timeupdate', trackTime);

      return () => {
        audioElement.removeEventListener('timeupdate', trackTime);
      };
    }
  }, []);

  // Modal explanation handler
  const handleExplanationModal = useCallback((field) => {
    if (audioState.isPlaying) {
      stopAudio();
    }

    const explanations = {
      name: "אנא הזן את שמך המלא כפי שמופיע בתעודת זהות. זהו שדה חובה",
      id: "אנא הזן את מספר זיהוי משתתף. זהו שדה חובה",
      idr: "אנא הזן את מספר תעודת הזהות שלך (9 ספרות). זהו שדה חובה",
      phone: "אנא הזן את מספר הטלפון שלך (10 ספרות). זהו שדה חובה",
    };

    setModalState({
      visible: true,
      explanation: explanations[field],
      iconAnimation: "pulse"
    });
    handleGlobalClick();
  }, [audioState.isPlaying, stopAudio, handleGlobalClick]);

  // Close modal
  const closeModal = useCallback(() => {
    modalRef.current.animate("fadeOutDown", 500)
      .then(() => setModalState(prev => ({
        ...prev,
        visible: false,
        iconAnimation: ""
      })));
    handleGlobalClick();
  }, [handleGlobalClick]);

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
        <Toast />
        
        {/* Web audio element */}
        {Platform.OS === 'web' && (
          <audio
            ref={audioRef}
            style={{ display: 'none' }}
            onEnded={() => {
              setAudioState(prev => ({
                ...prev,
                isPlaying: false,
                currentTime: 0
              }));
            }}
          />
        )}
        
        <View style={styles.card}>
          <Text style={styles.title}>הגדרת פרטים אישיים</Text>
          <Text style={styles.subtitle}>
            כדי שהרובוט המטפל יוכל להפעיל את שירותיו לטובך נצטרך את פרטיך
            האישיים. כלל המידע נשמר בצורה מאובטחת ואינו משותף עם שום גורם חיצוני
            ללא ביצוע שירות ייעודי.
          </Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("id")}>
              <Animatable.View
                animation={modalState.iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר זיהוי משתתף"
              value={formData.id}
              onChangeText={(text) =>
                /^\d*$/.test(text) && handleInputChange('id', text)
              }
              keyboardType="numeric"
            />
          </View>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("name")}>
              <Animatable.View
                animation={modalState.iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="שם מלא"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              maxLength={MAX_NAME_LENGTH}
            />
          </View>

          {/* ID Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("idr")}>
              <Animatable.View
                animation={modalState.iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="תעודת זהות"
              value={formData.idr}
              onChangeText={(text) => 
                /^\d*$/.test(text) && 
                text.length <= MAX_ID_LENGTH && 
                handleInputChange('idr', text)
              }
              keyboardType="numeric"
              maxLength={MAX_ID_LENGTH}
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => handleExplanationModal("phone")}>
              <Animatable.View
                animation={modalState.iconAnimation}
                style={styles.iconContainer}
              >
                <Entypo name="light-bulb" size={40} color="yellow" />
              </Animatable.View>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מספר טלפון"
              value={formData.phone}
              onChangeText={(text) => 
                /^\d*$/.test(text) && 
                text.length <= MAX_PHONE_LENGTH && 
                handleInputChange('phone', text)
              }
              keyboardType="numeric"
              maxLength={MAX_PHONE_LENGTH}
            />
          </View>

          {/* Navigation Buttons */}
          <TouchableOpacity
            style={[{ backgroundColor: "green" }, styles.button]}
            onPress={handleMoveForward}
          >
            <Text style={styles.buttonText}>המשך</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => {
              if (audioState.isPlaying) {
                stopAudio();
              }
              navigation.navigate("Premissions13");
            }}
          >
            <Text style={styles.buttonText}>מעבר</Text>
          </TouchableOpacity>
        </View>

        {/* Explanation Modal */}
        <Modal 
          visible={modalState.visible} 
          transparent 
          animationType="none"
        >
          <View style={styles.modalContainer}>
            <Animatable.View
              ref={modalRef}
              animation="fadeInUp"
              duration={500}
              style={styles.modalContent}
            >
              <Text style={styles.fontex}>{modalState.explanation}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>סגור</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
        
        {/* Lottie Audio Button */}
        <View>
          <TouchableOpacity
            style={styles.lottieButton}
            onPress={handleAudioPlayback}
            accessibilityLabel="לחץ לשמיעת הדרכה קולית"
          >
            <LottieView
              source={robotAnimation}
              autoPlay
              loop
              style={styles.lottie}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animatable.View>
  );
};

// Styles
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
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "whitesmoke",
    borderColor: "black",
    borderWidth: 1,
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
    top: Platform.OS === 'web' ? 20 : 80,
    right: Platform.OS === 'web' ? 50 : 110,
    width: 300,
    height: 300,
    zIndex: 100,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

export default Setup3;