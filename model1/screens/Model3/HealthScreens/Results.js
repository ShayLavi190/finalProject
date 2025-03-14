import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av"; // Added Audio import

const Results3 = ({ navigation, handleGlobalClick }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const backgroundColor = ["#52BFBF", "#af665f"];
  const animatableMainRef = useRef(null);
  const animatableModalRef = useRef(null);
  // Added audio state variables
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const testResults = [
    {
      title: "בדיקה כללית",
      images: [
        require("../../HealthFund/assets/image2.jpg"),
        require("../../HealthFund/assets/image3.jpg"),
        require("../../HealthFund/assets/image4.jpg"),
      ],
    },
    {
      title: "בדיקת דם",
      images: [require("../../HealthFund/assets/image1.jpg")],
    },
  ];

  // Function to stop audio playback
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleNavigate = (route, direction) => {
    stopAudio(); // Stop audio when navigating

    if (!animatableMainRef.current) return;
    const animationType =
      direction === "forward" ? "fadeOutLeft" : "fadeOutRight";

    animatableMainRef.current
      .animate(animationType, 500)
      .then(() => {
        navigation.navigate(route);
      })
      .catch((err) => {
        console.error("Animation error:", err);
        navigation.navigate(route);
      });
  };

  const openModal = (images, title) => {
    stopAudio(); // Stop audio when opening modal
    setSelectedImages(images);
    setModalVisible(true);
    handleGlobalClick(`פתיחת מודאל עבור: ${title}`);
  };

  // Updated to handle audio
  const handleLottiePress = async () => {
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
          require("../../../assets/Recordings/testResults.mp3"), // Make sure this file exists
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

    animatableModalRef.current.animate("fadeOutDown", 500).then(() => {
      setModalVisible(false);
      setSelectedImages([]);
      handleGlobalClick("סגירת מודאל");
    });
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
      style={{ flex: 1 }}
      animation="fadeInDown"
      duration={2000}
    >
      <View style={styles.container}>
        <Text style={styles.title}>תשובות בדיקות</Text>
        <Text style={styles.subtitle}>
          ברוך הבא למסך תשובות לבדיקות שביצעת. נא לבחור את סוג הבדיקה שביצעת
          ויוצג לך מסמכי התשובות
        </Text>
        {testResults.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: backgroundColor[index] }]}
            onPress={() => openModal(test.images, test.title)}
          >
            <Text style={styles.cardTitle}>{test.title}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "orange" },
            ]}
            onPress={() => handleNavigate("Home13", "forward")}
          >
            <Text style={styles.forwardButtonText}>מסך בית</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.forwardButton,
              { backgroundColor: "green" },
            ]}
            onPress={() => handleNavigate("Health3", "back")}
          >
            <Text style={styles.forwardButtonText}>שירותי בריאות</Text>
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
        <Modal visible={modalVisible} transparent animationType="none">
          <Animatable.View
            ref={animatableModalRef}
            style={styles.modalContainer}
            animation="fadeInUp"
            duration={500}
          >
            <View style={styles.btn}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>סגור</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={image}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          </Animatable.View>
        </Modal>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 70,
  },
  card: {
    width: "90%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
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
    backgroundColor: "#fff",
    borderRadius: 5,
    zIndex: 10,
    backgroundColor: "red",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  imageWrapper: {
    width: 800,
    height: 1000,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: 800,
    height: 900,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  subtitle: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 180,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 170,
  },
  button: {
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 30,
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
    top: 0,
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

export default Results3;
