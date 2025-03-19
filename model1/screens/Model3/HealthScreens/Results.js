import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import robotAnimation from "../SetupScreens/robot.json";

// Audio URL
const AUDIO_URL = "https://raw.githubusercontent.com/ShayLavi190/finalProject/main/model1/assets/Recordings/testResults.mp3";

// ✅ Import images for Web compatibility
import image1 from "../../HealthFund/assets/image1.jpg";
import image2 from "../../HealthFund/assets/image2.jpg";
import image3 from "../../HealthFund/assets/image3.jpg";
import image4 from "../../HealthFund/assets/image4.jpg";

// ✅ Handle images based on platform (Web vs. Mobile)
const testResults = [
  {
    title: "בדיקה כללית",
    images: Platform.OS === "web"
      ? [image2, image3, image4]
      : [require("../../HealthFund/assets/image2.jpg"), require("../../HealthFund/assets/image3.jpg"), require("../../HealthFund/assets/image4.jpg")],
  },
  {
    title: "בדיקת דם",
    images: Platform.OS === "web"
      ? [image1]
      : [require("../../HealthFund/assets/image1.jpg")],
  },
];

const Results3 = ({ handleGlobalClick, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatableMainRef = useRef(null);
  const animatableModalRef = useRef(null);
  
  // Audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  // ✅ Open modal with selected images
  const openModal = (images, title) => {
    stopAudio(); // Stop audio when opening modal
    setSelectedImages(images);
    setModalVisible(true);
    setCurrentIndex(0);
    handleGlobalClick(`פתיחת מודאל עבור: ${title}`);
  };

  // ✅ Close modal with animation
  const closeModal = () => {
    stopAudio(); // Stop audio when closing modal
    animatableModalRef.current?.animate("fadeOutDown", 500).then(() => {
      setModalVisible(false);
      setSelectedImages([]);
      handleGlobalClick("סגירת מודאל");
    });
  };

  // ✅ Navigation with animations
  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating
    
    if (!animatableMainRef.current) return;
    const animationType = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";

    animatableMainRef.current
      ?.animate(animationType, 500)
      .then(() => navigation.navigate(route))
      .catch((error) => {
        console.error("Animation error:", error);
        navigation.navigate(route);
      });
  };

  // Handle Lottie animation press
  const handleLottiePress = async () => {
    handleGlobalClick("לחיצה על האנימציה");
    
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
          type: "error",
          position: "bottom",
          text1: "שגיאה בהפעלת ההקלטה",
          text2: "לא ניתן להפעיל את ההקלטה כרגע",
          visibilityTime: 4000,
        });
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
      ref={animatableMainRef}
      style={styles.container}
      animation="fadeInDown"
      duration={2000}
    >
      <Text style={styles.title}>תשובות בדיקות</Text>
      <Text style={styles.subtitle}>
        ברוך הבא למסך תשובות לבדיקות שביצעת. נא לבחור את סוג הבדיקה שביצעת
        ויוצג לך מסמכי התשובות
      </Text>

      {testResults.map((test, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: index % 2 === 0 ? "#52BFBF" : "#af665f" }]}
          onPress={() => openModal(test.images, test.title)}
        >
          <Text style={styles.cardTitle}>{test.title}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "orange" }]}
          onPress={() => handleNavigate("Home13", "forward")}
        >
          <Text style={styles.buttonText}>מסך בית</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={() => handleNavigate("Health3", "back")}
        >
          <Text style={styles.buttonText}>שירותי בריאות</Text>
        </TouchableOpacity>
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
      {/* ✅ Modal for Image Viewing */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Animatable.View ref={animatableModalRef} style={styles.modalContainer} animation="fadeInUp" duration={500}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>סגור</Text>
          </TouchableOpacity>

          <View style={styles.imageNavigation}>
            <TouchableOpacity onPress={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))} style={styles.navButton}>
              <Text style={styles.navButtonText}>⬅️</Text>
            </TouchableOpacity>

            <Image
              source={Platform.OS === "web" ? { uri: selectedImages[currentIndex] } : selectedImages[currentIndex]}
              style={styles.image}
              resizeMode="contain"
            />

            <TouchableOpacity onPress={() => setCurrentIndex((prev) => Math.min(prev + 1, selectedImages.length - 1))} style={styles.navButton}>
              <Text style={styles.navButtonText}>➡️</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </Modal>
      <Toast />
      {/* Lottie Animation */}
    </Animatable.View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 24,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 150,
  },
  card: {
    width: "90%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 150,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: 150,
    marginHorizontal: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  imageNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 30,
    color: "white",
  },
  image: {
    width: width * 0.9,
    height: 600,
    marginHorizontal: 10,
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

export default Results3;