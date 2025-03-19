import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Animatable from "react-native-animatable";

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

const Results = ({ handleGlobalClick, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatableMainRef = useRef(null);
  const animatableModalRef = useRef(null);

  // ✅ Open modal with selected images
  const openModal = (images, title) => {
    setSelectedImages(images);
    setModalVisible(true);
    setCurrentIndex(0);
    handleGlobalClick(`פתיחת מודאל עבור: ${title}`);
  };

  // ✅ Close modal with animation
  const closeModal = () => {
    animatableModalRef.current?.animate("fadeOutDown", 500).then(() => {
      setModalVisible(false);
      setSelectedImages([]);
      handleGlobalClick("סגירת מודאל");
    });
  };

  // ✅ Navigation with animations
  const handleNavigate = (route, direction) => {
    if (!animatableMainRef.current) return;
    const animationType = direction === "forward" ? "fadeOutLeft" : "fadeOutRight";

    animatableMainRef.current
      ?.animate(animationType, 500)
      .then(() => navigation.navigate(route))
      .catch(() => navigation.navigate(route));
  };

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
          onPress={() => handleNavigate("Home1", "forward")}
        >
          <Text style={styles.buttonText}>מסך בית</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "green" }]}
          onPress={() => handleNavigate("Schedule", "back")}
        >
          <Text style={styles.buttonText}>קביעת תור</Text>
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
    marginTop: 60,
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
});

export default Results;
